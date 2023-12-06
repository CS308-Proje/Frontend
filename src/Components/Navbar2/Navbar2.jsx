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
const Navbar2 = ({ sidebarOpen, setSidebarOpen, setSearch }) => {
    const { logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [inventoryData, setInventoryData] = useState([]);

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
    // Hardcoded test data
    const testData = [
      { name: "Item 1", quantity: 10 },
      { name: "Item 2", quantity: 15 },
      { name: "Item 3", quantity: 5 }
    ];
  
    return testData.map((item, index) => (
      <div key={index} className="dropdown-item">
        {item.name} - {item.quantity}
      </div>
    ));
  };
    return (
    
        <nav className="navbar">
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
                <NotificationsActiveIcon className="bell-icon" style={{ fontSize: 35 }} />
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
        </nav>

            
       
      
    )
}

export default Navbar2;