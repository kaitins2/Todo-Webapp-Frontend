<<<<<<< Updated upstream
// LoginPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const LoginPage = () => {
=======
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const LoginPage = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
>>>>>>> Stashed changes

    const navigate = useNavigate();

<<<<<<< Updated upstream
    const goToRegister = () => {
        navigate('/register');
};
=======
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        username,
        password,
      });

      // Example: Save token if your backend returns one
      localStorage.setItem("token", response.data.token);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data || "Login failed. Please check your credentials."
      );
    }
  };
>>>>>>> Stashed changes

  return (
    <div className="login-container">
      <form className="login-form">
        <h2>Login</h2>
<<<<<<< Updated upstream
        <input type="text" placeholder="Username" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
        <button type="Register" onClick={goToRegister}>Register</button>
=======
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        <button type="button" onClick={() => navigate("/register")}>
          Register
        </button>
>>>>>>> Stashed changes
      </form>
    </div>
  );
};

export default LoginPage;