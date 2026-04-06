-- MySQL dump 10.13  Distrib 9.3.0, for macos15 (arm64)
--
-- Host: localhost    Database: MovieMunchers
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `AltMovies`
--

DROP TABLE IF EXISTS `AltMovies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AltMovies` (
  `title_id` varchar(20) DEFAULT NULL,
  `ordering` int DEFAULT NULL,
  `alt_title` varchar(500) DEFAULT NULL,
  `region` varchar(10) DEFAULT NULL,
  `language` varchar(10) DEFAULT NULL,
  `types` varchar(200) DEFAULT NULL,
  `attributes` varchar(200) DEFAULT NULL,
  `is_original_title` tinyint(1) DEFAULT NULL,
  KEY `idx_alt_title` (`title_id`),
  CONSTRAINT `altmovies_ibfk_1` FOREIGN KEY (`title_id`) REFERENCES `Movies` (`title_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Genres`
--

DROP TABLE IF EXISTS `Genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Genres` (
  `genre_id` int NOT NULL AUTO_INCREMENT,
  `genre_name` varchar(50) NOT NULL,
  PRIMARY KEY (`genre_id`),
  UNIQUE KEY `genre_name` (`genre_name`),
  KEY `idx_genre_name` (`genre_name`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `MovieActors`
--

DROP TABLE IF EXISTS `MovieActors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MovieActors` (
  `title_id` varchar(20) DEFAULT NULL,
  `name_id` varchar(20) DEFAULT NULL,
  KEY `idx_ma_title` (`title_id`),
  KEY `idx_ma_name` (`name_id`),
  KEY `idx_ma_name_title` (`name_id`,`title_id`),
  KEY `idx_ma_title_name` (`title_id`,`name_id`),
  CONSTRAINT `movieactors_ibfk_1` FOREIGN KEY (`title_id`) REFERENCES `Movies` (`title_id`),
  CONSTRAINT `movieactors_ibfk_2` FOREIGN KEY (`name_id`) REFERENCES `Names` (`name_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `MovieDirectors`
--

DROP TABLE IF EXISTS `MovieDirectors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MovieDirectors` (
  `title_id` varchar(20) DEFAULT NULL,
  `name_id` varchar(20) DEFAULT NULL,
  KEY `idx_md_title` (`title_id`),
  KEY `idx_md_name` (`name_id`),
  CONSTRAINT `moviedirectors_ibfk_1` FOREIGN KEY (`title_id`) REFERENCES `Movies` (`title_id`),
  CONSTRAINT `moviedirectors_ibfk_2` FOREIGN KEY (`name_id`) REFERENCES `Names` (`name_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `MovieGenres`
--

DROP TABLE IF EXISTS `MovieGenres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MovieGenres` (
  `title_id` varchar(20) DEFAULT NULL,
  `genre_id` int DEFAULT NULL,
  KEY `idx_mg_title` (`title_id`),
  KEY `idx_mg_genre` (`genre_id`),
  KEY `idx_mg_genre_title` (`genre_id`,`title_id`),
  CONSTRAINT `moviegenres_ibfk_1` FOREIGN KEY (`title_id`) REFERENCES `Movies` (`title_id`),
  CONSTRAINT `moviegenres_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `Genres` (`genre_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Movies`
--

DROP TABLE IF EXISTS `Movies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Movies` (
  `title_id` varchar(20) NOT NULL,
  `title` varchar(500) DEFAULT NULL,
  `title_type` varchar(50) DEFAULT NULL,
  `release_year` int DEFAULT NULL,
  `runtime_minutes` int DEFAULT NULL,
  `genres` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`title_id`),
  KEY `idx_movies_title_id` (`title_id`),
  FULLTEXT KEY `ft_title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Names`
--

DROP TABLE IF EXISTS `Names`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Names` (
  `name_id` varchar(20) NOT NULL,
  `primary_name` varchar(255) DEFAULT NULL,
  `birth_year` int DEFAULT NULL,
  `death_year` int DEFAULT NULL,
  PRIMARY KEY (`name_id`),
  KEY `idx_names_name_id` (`name_id`),
  FULLTEXT KEY `ft_primary_name` (`primary_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Ratings`
--

DROP TABLE IF EXISTS `Ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Ratings` (
  `title_id` varchar(20) NOT NULL,
  `avg_rating` decimal(3,1) DEFAULT NULL,
  `num_votes` int DEFAULT NULL,
  PRIMARY KEY (`title_id`),
  KEY `idx_ratings_title_id` (`title_id`),
  KEY `idx_ratings_title_votes` (`title_id`,`num_votes`),
  KEY `idx_ratings_votes_rating` (`num_votes`,`avg_rating`),
  KEY `idx_ratings_votes_title` (`num_votes`,`title_id`),
  CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`title_id`) REFERENCES `Movies` (`title_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `UserFavorites`
--

DROP TABLE IF EXISTS `UserFavorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserFavorites` (
  `user_id` int DEFAULT NULL,
  `title_id` varchar(20) DEFAULT NULL,
  KEY `user_id` (`user_id`),
  KEY `title_id` (`title_id`),
  CONSTRAINT `userfavorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `userfavorites_ibfk_2` FOREIGN KEY (`title_id`) REFERENCES `Movies` (`title_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-29 18:42:59
