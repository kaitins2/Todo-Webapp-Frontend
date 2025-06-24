// RegisterPage.jsx
import React from 'react';
import './Register.css';

const RegisterPage = () => {
  return (
    <div className="login-container">
      <form className="login-form">
        <h2>Register</h2>
        <input type="text" placeholder="Username" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <input type="password" placeholder="Confirm Password" required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;