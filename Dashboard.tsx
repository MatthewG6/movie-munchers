import React, { useEffect, useState } from "react";
import "../Css/dashboard.css";
import API_URL from "../config";
import noPoster from "../assets/no-poster.svg";
import { useNavigate } from "react-router-dom";

type Movie = {
  title_id: string;
  title: string;
  release_year: number | null;
  title_type: string | null;
  poster: string | null;
  backdrop: string | null;
  avg_rating: number | null;
  num_votes: number;
};

type Genre = {
  genre_id: number;
  genre_name: string;
};

function joinUrl(base: string, file: string) {
  return base.replace(/\/$/, "") + "/" + file.replace(/^\//, "");
}

async function fetchJsonSafe(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    return { ok: res.ok, status: res.status, json, text };
  } catch {
    return { ok: res.ok, status: res.status, json: null as any, text };
  }
}

const Dashboard: React.FC = () => {
  const [query, setQuery] = useState("");
  const [genreId, setGenreId] = useState<number>(0);
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [role, setRole] = useState<"actor" | "director">("actor");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [results, setResults] = useState<Movie[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loadingGenres, setLoadingGenres] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [searchMode, setSearchMode] = useState<"title" | "person">("title");
  const [sortMode, setSortMode] = useState<string>("none");
  const navigate = useNavigate();

  // Load genres
  useEffect(() => {
    const loadGenres = async () => {
      setLoadingGenres(true);
      try {
        const res = await fetchJsonSafe(joinUrl(API_URL, "GetGenres.php"), { method: "GET" });
        if (res.json?.success) setGenres(res.json.genres ?? []);
      } catch {}
      setLoadingGenres(false);
    };
    loadGenres();
  }, []);

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem("dashboardState");
    if (saved) {
      const state = JSON.parse(saved);
      setQuery(state.query ?? "");
      setGenreId(state.genreId ?? 0);
      setTypeFilter(state.typeFilter ?? "");
      setSearchMode(state.searchMode ?? "title");
      setSortMode(state.sortMode ?? "none");
      setRole(state.role ?? "actor");
      setResults(state.results ?? []);
    }
  }, []);

  // Apply sort
  useEffect(() => {
    if (sortMode === "none") return;

    setResults(prev => {
      const sorted = [...prev];

      if (sortMode === "nameAsc")
        sorted.sort((a, b) => a.title.localeCompare(b.title));
      else if (sortMode === "nameDesc")
        sorted.sort((a, b) => b.title.localeCompare(a.title));
      else if (sortMode === "ratingDesc")
        sorted.sort((a, b) => (b.avg_rating ?? 0) - (a.avg_rating ?? 0));
      else if (sortMode === "popularityDesc")
        sorted.sort((a, b) => (b.num_votes ?? 0) - (a.num_votes ?? 0));

      return sorted;
    });
  }, [sortMode, results.length]);

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoadingResults(true);

    const url =
      searchMode === "person"
        ? joinUrl(API_URL, "SearchPerson.php")
        : joinUrl(API_URL, "SearchMovie.php");

    const payload =
      searchMode === "person"
        ? { query, type: typeFilter, role } // actor/director
        : { query, genre_id: genreId, type: typeFilter };

    try {
      const out = await fetchJsonSafe(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (out.json?.success) {
        const newResults = (out.json.results ?? []).map((r: any) => ({
          ...r,
          avg_rating: Number(r.avg_rating),
          num_votes: Number(r.num_votes),
        }));

        setResults(newResults);
        localStorage.setItem(
          "dashboardState",
          JSON.stringify({ query, genreId, typeFilter, searchMode, sortMode, role, results: newResults })
        );
      } else {
        setResults([]);
        setErrorMsg(out.json?.error ?? "Search failed");
      }
    } catch {
      setResults([]);
      setErrorMsg("Search failed (network error).");
    }

    setLoadingResults(false);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dash-heading">Search Titles</h1>
      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-row">
          <input
            type="text"
            className="search-input"
            placeholder={
              searchMode === "person"
                ? role === "director"
                  ? "Search a director..."
                  : "Search an actor..."
                : "Search movies or TV shows..."
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="search-input sort-input"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value)}
          >
            <option value="none">Sort</option>
            <option value="nameAsc">Title (A → Z)</option>
            <option value="nameDesc">Title (Z → A)</option>
            <option value="ratingDesc">Rating (High → Low)</option>
            <option value="popularityDesc">Popularity (Most votes)</option>
          </select>
        </div>

        <div className="filter-row">
          <select
            className="search-input"
            value={searchMode}
            onChange={(e) => setSearchMode(e.target.value as "title" | "person")}
          >
            <option value="title">Search Titles</option>
            <option value="person">Search Actor/Director</option>
          </select>

          {searchMode === "person" && (
            <select
              className="search-input"
              value={role}
              onChange={(e) => setRole(e.target.value as "actor" | "director")}
            >
              <option value="actor">Actor</option>
              <option value="director">Director</option>
            </select>
          )}

          {searchMode === "title" && (
            <select
              className="search-input"
              value={genreId}
              disabled={loadingGenres}
              onChange={(e) => setGenreId(Number(e.target.value))}
            >
              <option value={0}>{loadingGenres ? "Loading genres..." : "All Genres"}</option>
              {genres.map((g) => (
                <option key={g.genre_id} value={g.genre_id}>
                  {g.genre_name}
                </option>
              ))}
            </select>
          )}

          <select
            className="search-input"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="movie">Movies</option>
            <option value="tvSeries">TV Shows</option>
          </select>

          <button className="search-btn" type="submit" disabled={loadingResults}>
            {loadingResults ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {errorMsg && (
        <p className="results-placeholder" style={{ color: "#ff6b6b" }}>
          {errorMsg}
        </p>
      )}
      {loadingResults && (
        <div className="mm-loading-row">
          <div className="mm-spinner" />
          <span className="mm-loading-text">Fetching results...</span>
        </div>
      )}

      <div className="results-list">
        {results.length === 0 && !errorMsg && !loadingResults && (
          <p className="results-placeholder">Search to load titles...</p>
        )}
        {results.map((movie) => (
          <div
            key={movie.title_id}
            onClick={() => navigate("/MovieDetails", { state: { movie } })}
            className="result-row"
          >
            <img
              src={movie.poster || noPoster}
              className={movie.poster ? "result-poster" : "result-poster-null"}
              alt={movie.title}
            />
            <div className="result-info">
              <span className="result-title">{movie.title}</span>
              <span className="result-year">{movie.release_year ?? "Unknown year"}</span>
              {movie.avg_rating != null && (
                <span className="result-rating">
                  ⭐ {movie.avg_rating.toFixed(1)} ({movie.num_votes})
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
