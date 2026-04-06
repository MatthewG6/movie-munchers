import React, { useEffect, useState } from "react";
import API_URL from "../config";
import "../Css/dashboard.css";
import noPoster from "../assets/no-poster.svg";
import { useNavigate } from "react-router-dom";

type Movie = {
  title_id: string;
  title: string;
  release_year: number;
  title_type: string;
  poster: string;
  backdrop: string;
};

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // TEMP (until login system is done)
  const user_id = Number(localStorage.getItem("user_id"));

  if (!user_id) {
    setLoading(false);
    return;
  }

  useEffect(() => {
    const fetchFavorites = async () => {
      const res = await fetch(API_URL.concat("/GetFavorites.php"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id }),
      });

      const data = await res.json();
      if (data.success) {
        setFavorites(data.favorites);
      }
      setLoading(false);
    };

    fetchFavorites();
  }, []);

  // -------------------------------
  // REMOVE FAVORITE (INSTANT UI UPDATE)
  // -------------------------------
  const removeFavorite = async (title_id: string) => {
    const res = await fetch(API_URL.concat("/RemoveFavorites.php"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, title_id }),
    });

    const data = await res.json();

    if (data.success) {
      // Remove from UI
      setFavorites((prev) =>
        prev.filter((movie) => movie.title_id !== title_id)
      );
    } else {
      alert("Failed to remove favorite.");
    }
  };

  const openMovie = (movie: Movie) => {
    navigate("/MovieDetails", { state: { movie } });
  };

  if (loading) return <p>Loading favorites...</p>;

  return (
    <div className="dashboard-container">
      <h1 className="dash-heading">My Favorites</h1>

      {favorites.length === 0 && (
        <p className="results-placeholder">
          You have no favorites yet.
        </p>
      )}

      <div className="results-list">
        {favorites.map((movie) => (
          <div key={movie.title_id} className="favorite-row">
            {/* CLICK IMAGE OR TITLE TO VIEW MOVIE PAGE */}
            <div
              className="favorite-info"
              onClick={() => openMovie(movie)}
            >
              <img
                src={movie.poster || noPoster}
                className={
                  movie.poster
                    ? "result-poster"
                    : "result-poster-null"
                }
                alt={movie.title}
              />

              <div className="result-info">
                <span className="result-title">{movie.title}</span>
                <span className="result-year">
                  {movie.release_year}
                </span>
              </div>
            </div>

            {/* REMOVE BUTTON */}
            <button
              onClick={() => removeFavorite(movie.title_id)}
              className="favorite-remove-btn"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
