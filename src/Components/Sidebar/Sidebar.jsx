import React from 'react';
import './Sidebar.css'; // Assuming you have a CSS file for Sidebar

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>My Sidebar</h2>
      </div>
      <ul className="sidebar-menu">
        <li>
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#">About</a>
        </li>
        <li>
          <a href="#">Services</a>
        </li>
        <li>
          <a href="#">Contact</a>
        </li>
      </ul>
      <div className="sidebar-footer">
        <p>&copy; 2023 My Website</p>
      </div>
    </div>
  );
}

export default Sidebar;
