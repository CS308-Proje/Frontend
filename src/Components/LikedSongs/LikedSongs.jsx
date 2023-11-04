import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import UserIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search'; // Import for Search Icon
import LogoImage from "../Assets/logo-white.png";
import Sidebar from "../Sidebar/Sidebar";
import "./LikedSongs.css";

const LikedSongs = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navigateToProfile = () => {
    navigate('/login');
  };

  const navigateToDashboard = () => {
    navigate('/dashboard');
  };

  const handleSearch = (event) => {
    // Implement search logic here
    console.log("Searching for:", event.target.value);
  };

  return (
    <div className="Dashboard">

        <main className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
            <div className="song-box">
            <button className="delete-song-btn" >X</button>
                <img src="path_to_artist_image" className="artist-img" />
                <div><h1 type="text" className="song-box"> Song Name</h1></div>
                <div>
                    <h2 type="text"  className="song-box">Artist Name</h2>
                    <h3 type="text"  className="song-box">Album Name</h3>
                </div>
                <div>
                    <h4 type="text" className="song-box">Rating:</h4> 
                    <h5 type="text" className="song-box">Release Date</h5>
                </div>
                
                </div> 
        </main>

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

        <button className="profile-btn" onClick={navigateToProfile}>
          <UserIcon className="profile-icon" style={{ fontSize: 45 }} />
        </button>
      </nav>

      <Sidebar isOpen={sidebarOpen} />

      <main className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
        {/* Your main app content here */}
      </main>
    </div>
  );
};

export default LikedSongs;