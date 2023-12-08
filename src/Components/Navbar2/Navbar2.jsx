import React, { useState, useEffect } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import UserIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import LogoImage from '../Assets/logo-white.png';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout'; // Import Logout icon
import { useAuth } from "../Authentication/Auth.jsx"; // Adjust this path based on your project structure
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import './Navbar2.css'
import Badge from '@mui/material/Badge';

const Navbar2 = ({ sidebarOpen, setSidebarOpen, setSearch }) => {
    const { logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [inventoryData, setInventoryData] = useState([]);
    const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);

    const [notifications, setNotifications] = useState({
        invitations: "",
        friendActivities: "",
        temporalRecommendations: ""
    });

    const [hasNewNotifications, setHasNewNotifications] = useState(false);

    const handleInvitationClick = () => {
        if (notifications.invitations) {
            navigate('/friends');
        }
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            setIsLoadingNotifications(true);
            try {
                const response = await fetch('http://localhost:5000/getAllNotification', {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                });
                const data = await response.json();
                setNotifications(data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
            setIsLoadingNotifications(false);
        };

        fetchNotifications();
    }, []);

    useEffect(() => {
        const newNotifications =
            notifications.invitations !== "No pending invitations at the time" ||
            notifications.friendActivities !== "No new friend activity." ||
            notifications.temporalRecommendations !== "You do not have temporal recommendations yet.";

        setHasNewNotifications(newNotifications);
    }, [notifications]);

    const handleSearch = (event) => {
        console.log('Searching for:', event.target.value);
        setSearch(event.target.value);
    };

    const navigate = useNavigate();

    const navigateToDashboard = () => {
        navigate('/dashboard');
    };

    const navigateToProfile = () => {
        navigate('/friends');
    };

    const handleSignOut = () => {
        logout();
        navigate('/');
    };

    // Dropdown menu toggle
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const renderDropdownItems = () => {
        return (
            <div>
                <div className="dropdown-item" onClick={handleInvitationClick}>
                    Invitations: {notifications.invitations || "You have no new invitations."}
                </div>
                <div className="dropdown-item">
                    Friend Activities: {notifications.friendActivities || "No new friend activity."}
                </div>
                <div className="dropdown-item">
                    Temporal Recommendations: {notifications.temporalRecommendations || "You do not have temporal recommendations yet."}
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
                <Badge color="secondary" variant="dot" invisible={!hasNewNotifications || isLoadingNotifications}>
                    <NotificationsActiveIcon className="bell-icon" style={{ fontSize: 35 }} />
                </Badge>
            </button>

            <div className={`dropdown-menu ${dropdownOpen ? 'dropdown-menu-visible' : ''}`}>
                {renderDropdownItems()}
            </div>

            <button className="profile-btn" onClick={navigateToProfile}>
                <UserIcon className="profile-icon" style={{ fontSize: 45 }} />
            </button>

            <button className="logout-btn" onClick={handleSignOut}>
                <LogoutIcon className="logout-icon" style={{ fontSize: 38 }} />
            </button>
        </nav>
    )
}

export default Navbar2;
