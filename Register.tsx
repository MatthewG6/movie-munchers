import React from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";
import "../Css/auth.css";
import logo from "../assets/movie-munchers-final.svg";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const registerUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(API_URL.concat("/Register.php"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.error || "Registration failed");
      return;
    }

    // Auto login
    localStorage.setItem("user_id", data.user_id);
    localStorage.setItem("username", username);

    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <img src={logo} alt="Movie Munchers" className="auth-logo" />

      <form className="auth-card" onSubmit={registerUser}>
        <h2 className="auth-title">Create Account</h2>

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
          <label>Email</label>
          <input
            type="email"
            className="auth-input"
            required
            onChange={(e) => setEmail(e.target.value)}
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
          Create Account
        </button>

        <div className="auth-switch">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Log in</span>
        </div>
      </form>
    </div>
  );
};

export default Register;
