import React, { useState } from "react";
import "./LoginSignup.css";
import user_icon from "../Assets/person.png";
import email_icon from "../Assets/email.png";
import password_icon from "../Assets/password.png";
import { useNavigate } from "react-router-dom";

const LoginSignup = ({ showLogin }) => {
  const [isLogin, setIsLogin] = useState(showLogin);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setIsLogin(true);

    const btn = document.getElementById("btn");
    btn.addEventListener("click", async () => {
      const emailInput = document.getElementById("email");
      const passwordInput = document.getElementById("password");

      const email = emailInput.value;
      const password = passwordInput.value;

      const userData = {
        email: email,
        password: password,
      };

      await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(userData),
      });
    });

    navigate("/"); //* burdan user dashboardına gidecekler
  };

  const handleSignupClick = async () => {
    setIsLogin(false);
    const btn = document.getElementById("btn");
    btn.addEventListener("click", async () => {
      const nameInput = document.getElementById("name");
      const usernameInput = document.getElementById("username");
      const emailInput = document.getElementById("email");
      const passwordInput = document.getElementById("password");

      const name = nameInput.value;
      const username = usernameInput.value;
      const email = emailInput.value;
      const password = passwordInput.value;

      const userData = {
        name: name,
        username: username,
        email: email,
        password: password,
      };

      await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(userData),
      });
    });
    //axios.post("http://localhost:5000/auth/register")
    //navigate("/"); //* burdan user dashboardına gidecekler
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">
          {isLogin ? "Log in to SRS" : "Sign up to SRS"}
        </div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        {isLogin ? null : (
          <>
            <div className="input">
              <img src={user_icon} alt="" />
              <input id="name" type="text" placeholder="Name" />
            </div>
            <div className="input">
              <img src={user_icon} alt="" />
              <input id="username" type="text" placeholder="Username" />
            </div>
          </>
        )}
        <div className="input">
          <img src={email_icon} alt="" />
          <input id="email" type="email" placeholder="Email" />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <input id="password" type="password" placeholder="Password" />
        </div>
      </div>
      <div className="submit-container">
        <div
          className={isLogin ? "submit gray" : "submit"}
          onClick={handleSignupClick}
          id="btn"
        >
          Sign Up
        </div>
        <div
          id="btn"
          className={!isLogin ? "submit gray" : "submit"}
          onClick={handleLoginClick}
        >
          Log In
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
