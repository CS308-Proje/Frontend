import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import UserIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import LogoImage from "../Assets/logo-white.png";
import Sidebar from "../Sidebar/Sidebar";
import "./MySongs.css";
import StarRating from '../Star/StarRating'; // Adjust the path as necessary if it's in a different directory
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';


const MySongs = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");

  // Navigate to profile page
  const navigateToProfile = () => {
    navigate("/login");
  };

  // Navigate to dashboard
  const navigateToDashboard = () => {
    navigate("/dashboard");
  };

  // Handle search input
  const handleSearch = (event) => {
    console.log("Searching for:", event.target.value);
    setSearch(event.target.value);
  };

  

  // Fetch songs data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/songs?name=${search}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const s = await response.json();

        const data = Array.isArray(s.songs) ? s.songs : [];

        setSongs(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSongs([]);
      }
    };

    fetchData();
  }, [search]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
  };

  // Delete a song
  const deleteSong = async (songId) => {
    try {
      const response = await fetch(`http://localhost:5000/songs/${songId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setSongs(songs.filter(song => song._id !== songId));
      } else {
        console.error("Error deleting song");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateRating = async (songId, newRating) => {
    // Create the payload to send to the server
    const payload = {
      ratingValue: newRating,
    };
  
    try {
      // Send the PUT request to update the rating
      const response = await fetch(`http://localhost:5000/songs/${songId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      // If the request was successful
      if (response.ok) {
        // Update the state with the new rating
        setSongs(songs.map(song => {
          if (song._id === songId) {
            return { ...song, ratingValue: newRating };
          }
          return song;
        }));
      } else {
        console.error('Failed to update the rating.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
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

        <button className="profile-btn" onClick={navigateToProfile}>
          <UserIcon className="profile-icon" style={{ fontSize: 45 }} />
        </button>
      </nav>

      <Sidebar isOpen={sidebarOpen} />

      <main className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
        <div className="song-list">
          {songs.length === 0 ? (
            <div className="no-songs-message">
              <h2>There are no songs</h2>
              <button className="add-song-btn" onClick={() => navigate("/submitmusic")}>
          +
        </button>
            </div>
        ) : (
          songs.map((song) => (
            <div key={song._id} className="song-box">
              <button className="delete-song-btn" onClick={() => deleteSong(song._id)}>
  <RemoveCircleIcon style={{ fontSize: '40px', color: '#fff' }} />
  <span className="tooltip-text">Remove Song</span>
</button>

              <img src={song.albumImg} className="artist-img" alt={`Artist ${song.id}`} />
              <div>
                <h1 className="text-box"><b>{song.songName}</b></h1>
                <h2 className="text-box"><b>Artist:</b> {song.mainArtistName}</h2>
                <h3 className="text-box"><b>Album: </b>{song.albumName}</h3>
                <StarRating
      initialRating={song.ratingValue}
      onRating={(newRating) => updateRating(song._id, newRating)}
    />
                <h5 className="text-box">Release Date: {formatDate(song.release_date)}</h5>
              </div>
            </div>
          )))}
        </div>
      </main>
    </div>
  );
};

export default MySongs;