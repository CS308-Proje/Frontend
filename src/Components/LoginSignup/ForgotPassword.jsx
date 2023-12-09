import React, { useState } from "react";
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    // We assume emailOrUsername is already defined in your component's state.
    try {
      const response = await fetch('http://localhost:5001/auth/forgotpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrUsername: emailOrUsername }),
      });
  
      const data = await response.json();
  
      // Check if the backend response is successful.
      if (response.ok) {
        setMessage('Check your email for a reset link.');
      } else {
        setMessage(data.message || 'Error sending reset link. Try Again.');
      }
    } catch (error) {
      // Catch any network errors and log them.
      console.error('Network error:', error);
      setMessage('Network error when trying to send reset link.');
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
