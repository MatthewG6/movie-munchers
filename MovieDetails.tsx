import React, { useEffect, useMemo, useState } from "react";
import "../Css/movieDetails.css";
import { useLocation } from "react-router-dom";
import API_URL from "../config";

type MoviePeopleResponse = {
  success: boolean;
  title_id?: string;
  directors?: string[];
  actors?: string[];
  alt_titles?: { title: string; region: string }[];
  error?: string;
};

type Movie = {
  title_id: string;
  title: string;
  release_year: number;
  poster: string;
  backdrop: string;
  title_type: string;
};

const MovieDetails: React.FC = () => {
  const location = useLocation();
  const { movie: passedMovie } = location.state || {};
  const [movie, setMovie] = useState<Movie | null>(passedMovie || null);
  const titleId = useMemo(() => movie?.title_id || null, [movie]);

  const [peopleLoading, setPeopleLoading] = useState(false);
  const [peopleError, setPeopleError] = useState<string | null>(null);
  const [directors, setDirectors] = useState<string[]>([]);
  const [actors, setActors] = useState<string[]>([]);
  const [altTitles, setAltTitles] = useState<{ title: string; region: string }[]>([]);
  const [showAllAlts, setShowAllAlts] = useState(false);

  const [rating, setRating] = useState<number | null>(null);
  const [votes, setVotes] = useState<number>(0);

  useEffect(() => {
    if (!titleId) return;
    let cancelled = false;

    const loadPeople = async () => {
      setPeopleLoading(true);
      setPeopleError(null);

      try {
        const res = await fetch(API_URL + "/GetMoviePeople.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title_id: titleId }),
        });
        const data: MoviePeopleResponse = await res.json();
        if (cancelled) return;

        if (!data.success) {
          setPeopleError(data.error || "Cast/crew unavailable");
          setDirectors([]);
          setActors([]);
          setAltTitles([]);
          return;
        }

        setDirectors(data.directors || []);
        setActors(data.actors || []);
        setAltTitles(data.alt_titles || []);
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        setPeopleError("Server error while loading cast/crew");
      } finally {
        if (cancelled) return;
        setPeopleLoading(false);
      }
    };

    loadPeople();
    return () => { cancelled = true; };
  }, [titleId]);

  useEffect(() => {
    if (!titleId) return;
    let cancelled = false;

    const loadAltTitles = async () => {
      setAltTitles([]); // reset
      try {
        const res = await fetch(API_URL + "/GetAltMovies.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title_id: titleId }),
        });
        const data = await res.json();
        if (cancelled) return;

        if (!data.success) {
          console.warn(data.error || "No alternative titles found");
          setAltTitles([]);
          return;
        }

        setAltTitles(Array.isArray(data.alt_titles) ? data.alt_titles : []);
      } catch (err) {
        if (cancelled) return;
        console.error("Error loading alternative titles:", err);
        setAltTitles([]);
      }
    };

    loadAltTitles();
    return () => { cancelled = true; };
  }, [titleId]);

  useEffect(() => {
    if (!titleId) return;
    const loadRating = async () => {
      try {
        const res = await fetch(API_URL + "/GetRating.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title_id: titleId }),
        });
        const data = await res.json();
        if (data.success) {
          setRating(Number.isFinite(data.avg_rating) ? Number(data.avg_rating) : null);
          setVotes(Number.isFinite(data.num_votes) ? Number(data.num_votes) : 0);
        } else {
          setRating(null);
          setVotes(0);
        }
      } catch (err) {
        console.error(err);
        setRating(null);
        setVotes(0);
      }
    };
    loadRating();
  }, [titleId]);

  if (!movie) return <div className="movie-details-page">Movie not found</div>;

  return (
    <>
      <div className="backdrop" style={{ backgroundImage: `url(${movie.backdrop})` }}></div>
      <div className="movie-details-page">
          <div className="movie-details-container">
            <div className="poster-container">
              <img src={movie.poster} alt={movie.title} className="movie-poster" />
            </div>
            <div className="movie-info">
              <h1 className="movie-title">
                {movie.title} <span className="movie-year">({movie.release_year})</span>
              </h1>
              <div className="movie-meta">
                <div className="movie-rating">
                  ⭐ {rating !== null ? rating.toFixed(1) : "N/A"} ({votes.toLocaleString()} votes)
                </div>
                <span className="meta-item">Type: {movie.title_type}</span>
                <span className="meta-item">IMDB ID: {movie.title_id}</span>
              </div>

              {peopleLoading && <div style={{ opacity: 0.8 }}>Loading cast and crew...</div>}
              {peopleError && <div style={{ opacity: 0.8 }}>Cast and crew unavailable.</div>}

              {!peopleLoading && !peopleError && (directors.length > 0 || actors.length > 0) && (
                <>
                  {directors.length > 0 && (
                    <div className="people-section">
                      <div className="people-title">Director{directors.length > 1 ? "s" : ""}</div>
                      <div className="people-list">{directors.join(", ")}</div>
                    </div>
                  )}
                  {actors.length > 0 && (
                    <div className="people-section">
                      <div className="people-title">Cast (Top {actors.length})</div>
                      <div className="people-list">{actors.join(", ")}</div>
                    </div>
                  )}
                </>
              )}

              <button
                className="fav-btn"
                onClick={async () => {
                  try {
                    const user_id = localStorage.getItem("user_id");
                    if (!user_id) {
                      alert("You must be logged in to favorite movies.");
                      return;
                    }
                    const res = await fetch(API_URL + "/AddFavorite.php", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ user_id: Number(user_id), title_id: movie.title_id }),
                    });
                    const data = await res.json();
                    alert(data.success ? "Added to favorites!" : "Could not add to favorites.");
                  } catch (err) {
                    console.error(err);
                    alert("Server error.");
                  }
                }}
              >
                ❤️ Add to Favorites
              </button>
          </div>
        </div>

        <div className="movie-right-card">
          <h2>Alternate Titles</h2>
          {altTitles.length === 0 && <div style={{ opacity: 0.7 }}>No alternative titles found.</div>}
          {altTitles.length > 0 && (
            <>
              <div className="alt-titles-container">
                {(showAllAlts ? altTitles : altTitles.slice(0, 10)).map((alt, idx) => (
                  <div key={idx} className="alt-title-pill">
                    {alt.title} ({alt.region})
                  </div>
                ))}
              </div>
              {altTitles.length > 10 && (
                <div className="show-more" onClick={() => setShowAllAlts(!showAllAlts)}>
                  {showAllAlts ? "Show less ▲" : "Show more ▼"}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MovieDetails;
