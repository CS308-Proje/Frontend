import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import "./MyAlbums.css";
import StarRating from '../Star/StarRating'; // Adjust the path as necessary if it's in a different directory
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddIcon from '@mui/icons-material/Add';
import Navbar2 from "../Navbar2/Navbar2";

const MyAlbums = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch albums data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/albums?name=${search}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const s = await response.json();

        const data = Array.isArray(s.albums) ? s.albums : [];

        setAlbums(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setAlbums([]);
      }
    };

    fetchData();
  }, [search]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
  };

  // Delete a album
  const deleteAlbum = async (albumId) => {
    try {
      const response = await fetch(`http://localhost:5000/albums/${albumId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setAlbums(albums.filter(album => album._id !== albumId));
      } else {
        console.error("Error deleting album");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateRating = async (albumId, newRating) => {
    // Create the payload to send to the server
    const payload = {
      ratingValue: newRating,
    };
  
    try {
      // Send the PUT request to update the rating
      const response = await fetch(`http://localhost:5000/albums/${albumId}`, {
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
        setAlbums(albums.map(album => {
          if (album._id === albumId) {
            return { ...album, ratingValue: newRating };
          }
          return album;
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
      <Navbar2 sidebarOpen = {sidebarOpen} setSidebarOpen={setSidebarOpen} setSearch={setSearch}/>

      <Sidebar isOpen={sidebarOpen} />

      <main className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
        <div className="song-list">
          {albums.length === 0 ? (
            <div className="no-songs-message">
              <h2>You don't have any albums yet!</h2>
              <p>To add albums to your collection, tap the plus icon below.</p>
              <button className="add-song-btn" onClick={() => navigate("/submitmusic")}>
              <AddIcon style={{ fontSize: "60px" }} />
        </button>
            </div>
        ) : (
          albums.map((album) => (
            <div key={album._id} className="song-box">
              <button className="delete-song-btn" onClick={() => deleteAlbum(album._id)}>
  <RemoveCircleIcon style={{ fontSize: '40px', color: '#fff' }} />
  <span className="tooltip-text">Remove Album</span>
</button>

              <img src={album.albumImg} className="artist-img" alt={`Artist ${album.id}`} />
              <div>
                <h1 className="text-box"><b>{album.name}</b></h1>
                <h2 className="text-box"><b>Artist:</b> {album.artistId.artistName}</h2>
                
                <StarRating
      initialRating={album.ratingValue}
      onRating={(newRating) => updateRating(album._id, newRating)}
    />
                {/*<h5 className="text-box">Release Date: {formatDate(album.createdAt)}</h5>*/}
              </div>
            </div>
          )))}
        </div>
      </main>
    </div>
  );
};

export default MyAlbums;