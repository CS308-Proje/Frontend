import React from 'react';
import './Navbar.css';
import logo from "../Assets/logo-white.png";

const Navbar = () => {
  return (
    <nav>
      <img src={logo} alt="Logo" className="logo" />
      <ul>
        <li>
          <a href="#" className="button">Login</a>
        </li>
        <li>
          <a href="#" className="button gray">Sign Up</a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
