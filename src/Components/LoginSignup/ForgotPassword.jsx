import React, { useState } from "react";
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      // Implement the logic to handle the password reset with emailOrUsername
      console.log("Password reset request for:", emailOrUsername);
      setMessage("Check your email for a reset link.");
    } catch (error) {
      setMessage("Error sending reset link.");
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-header">
        <div className="text">Password Reset</div>
      </div>
      <div className="forgot-instructions">
        Enter your username, or the email address that you used to register. We'll send you an email with your username and a link to reset your password.
      </div>
      <div className="forgot-inputs">
        <div className="forgot-input">
          <input 
            id="email" 
            type="text" 
            placeholder="Email address or username" 
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
          />
        </div>
      </div>
      <div className="forgot-submit-container">
        <button className="forgot-submit" onClick={handleSubmit}>
          Send
        </button>
      </div>
      {message && <div className="forgot-message">{message}</div>}
    </div>
  );
};

export default ForgotPassword;
