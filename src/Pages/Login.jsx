// LoginPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const LoginPage = () => {

    const navigate = useNavigate();

    const goToRegister = () => {
        navigate('/register');
};

  return (
    <div className="login-container">
      <form className="login-form">
        <h2>Login</h2>
        <input type="text" placeholder="Username" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
        <button type="Register" onClick={goToRegister}>Register</button>
      </form>
    </div>
  );
};

export default LoginPage;