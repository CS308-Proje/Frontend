import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import UserIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search"; // Import for Search Icon
import LogoImage from "../Assets/logo-white.png";
import Sidebar from "../Sidebar/Sidebar";
import "./LikedSongs.css";

const LikedSongs = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);

  const navigateToProfile = () => {
    navigate("/login");
  };

  const navigateToDashboard = () => {
    navigate("/dashboard");
  };

  const handleSearch = (event) => {
    // Implement search logic here
    console.log("Searching for:", event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/songs", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const s = await response.json();

        const data = s.songs;

        setSongs(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="Dashboard">
      <main className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
        <div className="song-list">
          {songs.map((song) => (
            <div key={song._id} className="song-box">
              <button className="delete-song-btn" onClick={() => song.id}>
                X
              </button>
              <img
                src={song.albumImg}
                className="artist-img"
                alt={`Artist ${song.id}`}
              />
              <div>
                <h1 className="song-box">{song.songName}</h1>
              </div>
              <div>
                <h2 className="song-box">{song.artistName}</h2>
                <h3 className="song-box">{song.albumName}</h3>
              </div>
              <div>
                <h4 className="song-box">Rating: {song.ratingValue}</h4>
                <h5 className="song-box">Release Date: {song.releaseDate}</h5>
              </div>
            </div>
          ))}
        </div>
      </main>

      <nav className="navbar">
        <button
          className="menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
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
