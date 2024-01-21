import React, { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import UserIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import LogoImage from "../Assets/logo-white.png";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../Authentication/Auth.jsx";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import "./Navbar2.css";
import Badge from "@mui/material/Badge";

const Navbar2 = ({ sidebarOpen, setSidebarOpen, setSearch }) => {
  const { logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);
  const [existNotification, setExistNotification] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);

  const [notifications, setNotifications] = useState({
    invitations: "",
    friendActivities: "",
  });

  const handleInvitationClick = () => {
    if (notifications.invitations) {
      navigate("/friends");
    }
  };

  const fetchNotifications = async () => {
    setIsLoadingNotifications(true);
    try {
      const response = await fetch("http://localhost:5001/getAllNotification", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (response.status === 200) {
        setExistNotification(true);
        setNotifications(data);
      } else {
        setExistNotification(false);
        setNotifications({
          invitations: "You have no new invitations.",
          friendActivities: "No new friend activity.",
        });
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
    setIsLoadingNotifications(false);
  };

  useEffect(() => {
    fetchNotifications(); // Fetch notifications on component mount
  }, []); // Empty dependency array to run the effect only once on mount

  const handleSearch = event => {
    console.log("Searching for:", event.target.value);
    setSearch(event.target.value);
  };

  const navigate = useNavigate();

  const navigateToDashboard = () => {
    navigate("/dashboard");
  };

  const navigateToProfile = () => {
    navigate("/friends");
  };

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  const toggleDropdown = async () => {
    await fetchNotifications();
    setDropdownOpen(!dropdownOpen);
  };

  const renderDropdownItems = () => {
    return (
      <div>
        <div className="dropdown-item" onClick={handleInvitationClick}>
          Invitations: {notifications.invitations}
        </div>
        <div className="dropdown-item">
          Friend Activities: {notifications.friendActivities}
        </div>
      </div>
    );
  };

  return (
    <nav className="navbar">
      <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <MenuIcon />
      </button>

      <button className="logo-btn" onClick={navigateToDashboard}>
        <img src={LogoImage} alt="Logo" className="logo" />
      </button>

      <div className="search-bar">
        <input type="text" placeholder="Search..." onChange={handleSearch} />
        <SearchIcon />
      </div>

      <button className="bell-btn" onClick={toggleDropdown}>
        <Badge
          color="secondary"
          variant="dot"
          invisible={isLoadingNotifications || existNotification === false}
        >
          <NotificationsActiveIcon
            className="bell-icon"
            style={{ fontSize: 35 }}
          />
        </Badge>
      </button>

      <div
        className={`dropdown-menu ${
          dropdownOpen ? "dropdown-menu-visible" : ""
        }`}
      >
        {renderDropdownItems()}
      </div>

      <button className="profile-btn" onClick={navigateToProfile}>
        <UserIcon className="profile-icon" style={{ fontSize: 45 }} />
      </button>

      <button className="logout-btn" onClick={handleSignOut}>
        <LogoutIcon className="logout-icon" style={{ fontSize: 38 }} />
      </button>
    </nav>
  );
};

export default Navbar2;
