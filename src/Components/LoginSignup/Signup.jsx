import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";
import user_icon from "../Assets/person.png";
import email_icon from "../Assets/email.png";
import password_icon from "../Assets/password.png";

const Signup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const handleSignup = async () => {
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

      try {
        const response = await fetch("http://localhost:5000/auth/register", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });
  
        if (!response.ok) {
          throw new Error("Signup failed");
        }
  
        // Handle the response
        const data = await response.json();
        console.log(data);  // Handle or store the response data as needed
        navigate("/dashboard"); // Redirect to dashboard on success
      } catch (err) {
        setError(err.message);
      }
    });
    //axios.post("http://localhost:5000/auth/register")
    //navigate("/"); //* burdan user dashboardına gidecekler
    navigate("/dashboard"); // Update with your dashboard route
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Sign up to SRS</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <img src={user_icon} alt="" />
          <input id="name" type="text" placeholder="Name" />
        </div>
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
        <div className="submit" onClick={handleSignup}>Sign Up</div>

      </div>
    </div>
  );
};

export default Signup;
