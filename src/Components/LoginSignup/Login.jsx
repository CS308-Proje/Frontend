import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import "./LoginSignup.css";
import email_icon from "../Assets/email.png";
import password_icon from "../Assets/password.png";


const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  
  const handleLogin = async () => {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const email = emailInput.value;
    const password = passwordInput.value;

    const userData = {
      email: email,
      password: password,
    };

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
        throw new Error("Login failed");
      }

      // Assuming the response returns the expected data on successful login
      const data = await response.json();
      console.log(data); // Handle or store the response data as needed
      navigate("/dashboard"); // Redirect to dashboard on success
    } catch (err) {
      setError(err.message);
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btn");

    if (btn) {
      btn.addEventListener("click", handleLogin);
    }
  });

  //navigate("/"); //* burdan user dashboardına gidecekler

  return (
    <div className="container">
      <div className="header">
        <div className="text">Log in to SRS</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <img src={email_icon} alt="" />
          <input id="email" type="email" placeholder="Email" />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
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
