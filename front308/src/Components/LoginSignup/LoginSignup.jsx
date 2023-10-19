import React, { useState } from 'react';
import './LoginSignup.css';
import user_icon from "../Assets/person.png";
import email_icon from "../Assets/email.png";
import password_icon from "../Assets/password.png";
import { useNavigate } from 'react-router-dom';

const LoginSignup = ({ showLogin }) => {
  const [isLogin, setIsLogin] = useState(showLogin);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setIsLogin(true);
    navigate('/login');
  };

  const handleSignupClick = () => {
    setIsLogin(false);
    navigate('/signup');
  };

  return (
    <div className='container'>
      <div className="header">
        <div className="text">{isLogin ? "Log in to SRS" : "Sign up to SRS"}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        {isLogin ? null : (
          <div className="input">
            <img src={user_icon} alt="" />
            <input type="text" placeholder='Name' />
          </div>
        )}
        <div className="input">
          <img src={email_icon} alt="" />
          <input type="email" placeholder='Email Id' />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <input type="password" placeholder='Password' />
        </div>
      </div>
      <div className="submit-container">
        <div className={isLogin ? "submit gray" : "submit"} onClick={handleSignupClick}>Sign Up</div>
        <div className={!isLogin ? "submit gray" : "submit"} onClick={handleLoginClick}>Log In</div>
    </div>
    </div>
  );
}

export default LoginSignup;
