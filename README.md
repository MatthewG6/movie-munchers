# Movie Munchers

MovieMunchers is a database-driven movie application built around IMDb-style data. The project focuses on importing large datasets, organizing them into a relational schema, and running meaningful queries to explore movies, actors, directors, ratings, and related information.

## Overview

The goal of MovieMunchers is to take raw movie data and turn it into a structured relational database that can be queried efficiently. This project demonstrates database design, data cleaning, bulk data loading, foreign key relationships, and SQL query development.

The application uses large IMDb-based datasets and transforms them into tables that support movie lookups, actor and director relationships, and rating-based analysis.

## Features

- Imports large raw movie datasets into MySQL
- Organizes data into normalized relational tables
- Stores movie information such as titles, genres, ratings, actors, and directors
- Supports SQL queries for searching and analyzing movie data
- Demonstrates handling of large-scale inserts and foreign key relationships
- Uses staging/raw tables when needed before moving data into final structured tables

## Technologies Used

- **MySQL**
- **SQL**
- **MySQL Workbench**
- IMDb-style TSV datasets
- Command line / local database tools

## Dataset

This project uses IMDb-style tab-separated data files, such as:

- `title.basics.tsv`
- `title.akas.tsv`
- `title.ratings.tsv`
- `title.principals.tsv`
- `name.basics.tsv`

These files are loaded into MySQL and used to populate the MovieMunchers schema.

## Database Structure

The project is built around relational tables that represent important movie data.

Example entities include:

- **Movies**
- **Actors**
- **Directors**
- **Ratings**
- **Genres**
- **MovieActors**
- **MovieDirectors**

Some raw or staging tables may also be used during the import process before inserting cleaned data into the final tables.

## How It Works

1. Raw IMDb-style TSV files are imported into MySQL.
2. Staging tables are used to hold raw data when necessary.
3. Cleaned and filtered data is inserted into the main relational tables.
4. Foreign keys are used to connect movies, actors, directors, and ratings.
5. SQL queries are run against the finished schema to answer movie-related questions.

## Project status
This was a school project and is considered complete. I have no intention of adding additional features or changes.
