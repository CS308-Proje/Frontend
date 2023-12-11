import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/Auth.jsx"; // Adjust this path based on your project structure
import "./LoginSignup.css";
import email_icon from "../Assets/email.png";
import password_icon from "../Assets/password.png";
import Navbar from "../Navbar/Navbar.jsx";
import { Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Use the login function from AuthContext
  const [error, setError] = useState(""); // Use this state to show any login errors

  const handleLogin = async () => {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      const response = await fetch("http://localhost:5001/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Login failed");
      }

      const data = await response.json();
      console.log(data); // Log or handle the response data as needed

      login(); // Update the AuthContext to reflect the user is now logged in
      navigate("/dashboard"); // Redirect to dashboard on success
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <Navbar/>
      <div className="header">
        <div className="text">Log in to SRS</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <img src={email_icon} alt="Email Icon" />
          <input id="email" type="email" placeholder="Email" />
        </div>
        <div className="input">
          <img src={password_icon} alt="Password Icon" />
          <input id="password" type="password" placeholder="Password" />
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="submit-container">
        <div className="submit" id="btn" onClick={handleLogin}>
          Log In
        </div>
      </div>
      <div className="forgot-password-link">
        <Link to="/forgot" className="forgot-link">Forgot your password?</Link>
      </div>
    </div>
  );
};

export default Login;
