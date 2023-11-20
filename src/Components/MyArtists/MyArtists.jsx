import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import UserIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import LogoImage from "../Assets/logo-white.png";
import Sidebar from "../Sidebar/Sidebar";
import "./MyArtists.css";
import StarRating from '../Star/StarRating'; // Adjust the path as necessary if it's in a different directory
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';


const MyArtists = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);
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

  

  // Fetch artists data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/artists?name=${search}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const s = await response.json();

        const data = Array.isArray(s.artists) ? s.artists : [];

        setArtists(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setArtists([]);
      }
    };

    fetchData();
  }, [search]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
  };

  // Delete a artist
  const deleteArtist = async (artistId) => {
    try {
      const response = await fetch(`http://localhost:5000/artists/${artistId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setArtists(artists.filter(artist => artist._id !== artistId));
      } else {
        console.error("Error deleting artist");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateRating = async (artistId, newRating) => {
    // Create the payload to send to the server
    const payload = {
      ratingValue: newRating,
    };
  
    try {
      // Send the PUT request to update the rating
      const response = await fetch(`http://localhost:5000/artists/${artistId}`, {
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
        setArtists(artists.map(artist => {
          if (artist._id === artistId) {
            return { ...artist, ratingValue: newRating };
          }
          return artist;
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
          {artists.length === 0 ? (
            <div className="no-songs-message">
              <h2>There are no artists</h2>
              <button className="add-song-btn" onClick={() => navigate("/submitmusic")}>
          +
        </button>
            </div>
        ) : (artists.map((artist) => (
            <div key={artist._id} className="song-box">
              <button className="delete-song-btn" onClick={() => deleteArtist(artist._id)}>
  <RemoveCircleIcon style={{ fontSize: '40px', color: '#fff' }} />
  <span className="tooltip-text">Remove Artist</span>
</button>

              <img src={artist.artistImg} className="artist-img" alt={`Artist ${artist.id}`} />
              <div>
                <h1 className="text-box"><b>{artist.artistName}</b></h1>
                
                <StarRating
      initialRating={artist.ratingValue}
      onRating={(newRating) => updateRating(artist._id, newRating)}
    />
                
              </div>
            </div>
          )))}
        </div>
      </main>
    </div>
  );
};

export default MyArtists;