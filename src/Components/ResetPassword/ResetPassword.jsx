import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './ResetPassword.css';
import Navbar from "../Navbar/Navbar.jsx";

const ResetPassword = () => {
  const [input, setInput] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const { password, confirmPassword } = input;
  const { token } = useParams(); // Extract the token from the URL

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/auth/resetpassword/${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({password }) 
      });

      const data = await response.json();
      if (response.ok) {
        // Handle successful password reset here
        console.log('Password successfully reset', data);
      } else {
        // Handle errors here
        setError(data.message || 'An error occurred while resetting the password');
      }
    } catch (err) {
      // Handle network errors here
      setError('Network error');
    }
  };

  return (
    
    <div className="center-wrapper">
        <Navbar/>
    <div className="reset-password-container">
     <div className="reset-instructions">Please enter your new password</div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
        <input id="reset-input"
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            placeholder="Enter new password"
            required
          />
        </div>
        <div className="form-group">
          <input id="reset-input"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button id="resetbtn" type="submit">Reset Password</button>
      </form>
    </div>
    </div>
  );
};

export default ResetPassword;
