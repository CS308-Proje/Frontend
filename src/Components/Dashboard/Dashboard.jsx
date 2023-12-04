import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import UserIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import LogoImage from '../Assets/logo-white.png';
import Sidebar from '../Sidebar/Sidebar';
import './Dashboard.css';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);

  // Navigate to profile
  const navigateToProfile = () => {
    navigate('/login');
  };

  // Navigate to dashboard
  const navigateToDashboard = () => {
    navigate('/dashboard');
  };

  // Handle search
  const handleSearch = (event) => {
    console.log('Searching for:', event.target.value);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Fetch songs data
  useEffect(() => {
    const fetchSongsData = async () => {
      try {
        const response = await fetch('http://localhost:5001/songs', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        const songsWithLikeStatus = data.songs.map(song => ({ ...song, liked: false }));
        setSongs(songsWithLikeStatus);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchSongsData();

    
  }, []);

  // Toggle like status
  const toggleLike = (songId) => {
    setSongs(songs.map(song => 
      song._id === songId ? { ...song, liked: !song.liked } : song
    ));
  };

  // Render song boxes
  const renderSongBoxes = () => {
    return songs.map((song) => (
      <div key={song._id} className="song-box">
        <img src={song.albumImg} className="artist-img" alt={`Artist ${song.id}`} />
        <div>
          <h1 className="text-box">{song.songName}</h1>
          <h2 className="text-box">Artist: {song.mainArtistName}</h2>
          <h3 className="text-box">Album: {song.albumName}</h3>
          <h4 className="text-box">Rating: {song.ratingValue}</h4>
          <h5 className="text-box">Release Date: {formatDate(song.release_date)}</h5>
          <button className="like-btn" aria-label={`Like ${song.songName}`} onClick={() => toggleLike(song._id)}>
            {song.liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </button>
        </div>
      </div>
    ));
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
    <div className="Dashboard">
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
      </nav>

      <Sidebar isOpen={sidebarOpen} />

      <main className={`main-content ${sidebarOpen ? 'shifted' : ''}`}>
        {renderSongBoxes()}
      </main>
    </div>
  );
};

export default Dashboard;
