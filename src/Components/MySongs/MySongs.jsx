import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import "./MySongs.css";
import StarRating from '../Star/StarRating'; // Adjust the path as necessary if it's in a different directory
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddIcon from '@mui/icons-material/Add';
import UpdateIcon from '@mui/icons-material/Update';
import UpdateSong from '../UpdateSong/UpdateSong'
import InformationIcon from '@mui/icons-material/Info';
import Navbar2 from "../Navbar2/Navbar2";


const MySongs = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");

  const [showSongInfo, setShowSongInfo] = useState(false);
  const [showUpdateScreen, setShowUpdateScreen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  const handleSongInfoClick = (song) => {
    setSelectedSong(song);
    setShowSongInfo(true);
  };

  const handleUpdateClick = (song) => {
    setSelectedSong(song);
    setShowUpdateScreen(true);
  };

  const handleUpdate = (updatedSong) => {
    // Logic to update the song in the state and send request to backend
    setShowUpdateScreen(false);
  };

  const handleClose = () => {
    setShowUpdateScreen(false);
    setSelectedSong(null);
    setShowSongInfo(false);
  };
  

  // Fetch songs data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/songs?name=${search}`,
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
      const response = await fetch(`http://localhost:5001/songs/${songId}`, {
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
      const response = await fetch(`http://localhost:5001/rating/rateSong/${songId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      // If the request was successful
      if (response.ok) {
        // Update the state with the new rating
        
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
          {songs.length === 0 ? (
            <div className="no-songs-message">
              <h2>You don't have any songs yet!</h2>
              <p>To start building your library, just hit the add button below.</p>
              <button className="add-song-btn" onClick={() => navigate("/submitmusic")}>
                <AddIcon style={{ fontSize: "60px" }} />
              </button>
            </div>
        ) : (
          songs.map((song) => (
            <div key={song._id} className="song-box">
              <button className="update-song-btn" onClick={() => handleUpdateClick(song)}>
                <UpdateIcon style={{ fontSize: '45px', color: '#fff' } } />
                <span className="tooltip-text2">Update Song</span>
              </button>
              <button className="song-info-btn" onClick={() => handleSongInfoClick(song)}>
                <InformationIcon style={{ fontSize: '40px', color: '#fff' } } />
                <span className="tooltip-text2">Song Information</span>
              </button>
              <button className="delete-song-btn" onClick={() => deleteSong(song._id)}>
                <RemoveCircleIcon style={{ fontSize: '40px', color: '#fff' }} />
                <span className="tooltip-text2">Remove Song</span>
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
      <div className={`modal-backdrop ${showUpdateScreen ? 'show-backdrop' : ''}`}></div>
      {showUpdateScreen && (
        <UpdateSong
          song={selectedSong}
          onClose={handleClose}
          onUpdate={handleUpdate}
        />
      )}
      {showSongInfo && selectedSong && (
        <div className="song-info-modal">
          <div className="modal-content">
            <img src={selectedSong.albumImg} className="artist-img" alt={`Artist ${selectedSong.id}`} />
            <h1>{selectedSong.songName}</h1>
            <p><b className="info-text">Artist:</b> {selectedSong.mainArtistName}</p>
            {selectedSong.featuringArtistNames.length > 0 && (
              <p><b className="info-text">Featuring:</b> {selectedSong.featuringArtistNames.join(', ')}</p>
            )}
            <p><b className="info-text">Popularity:</b> {selectedSong.popularity}</p>
            <p><b className="info-text">Duration:</b> {selectedSong.duration_ms} ms</p>
            <p><b className="info-text">Release Date:</b> {new Date(selectedSong.release_date).toLocaleDateString()}</p>
            <p><b className="info-text">Created At:</b> {new Date(selectedSong.createdAt).toLocaleString()}</p>
            <p><b className="info-text">Rating:</b> {selectedSong.ratingValue}</p>
            <button className="close-btn1" onClick={handleClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};




export default MySongs;