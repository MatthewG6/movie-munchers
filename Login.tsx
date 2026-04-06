import React from "react";
import API_URL from "../config.ts";
import { useNavigate } from "react-router-dom";
import "../Css/auth.css";
import logo from "../assets/movie-munchers-final.svg";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const checkLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch(API_URL.concat("/Login.php"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("username", data.username);
      navigate("/dashboard");
    } else {
      alert("Incorrect Username or Password");
    }
  };

  return (
    <div className="auth-page">
      <img src={logo} alt="Movie Munchers" className="auth-logo" />

      <form className="auth-card" onSubmit={checkLogin}>
        <h2 className="auth-title">Log In</h2>

        <div className="auth-field">
          <label>Username</label>
          <input
            type="text"
            className="auth-input"
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label>Password</label>
          <input
            type="password"
            className="auth-input"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="auth-btn">
          Log In
        </button>

        <div className="auth-switch">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")}>
            Create one
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
