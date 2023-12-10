import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Sidebar from '../Sidebar/Sidebar';
import './Dashboard.css';
import Navbar2 from '../Navbar2/Navbar2';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");


  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Fetch songs data
  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
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
          {/* Like Button */}
          <button className="like-btn" aria-label={`Like ${song.songName}`} onClick={() => toggleLike(song._id)}>
            {song.liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="Dashboard">
      <Navbar2 sidebarOpen = {sidebarOpen} setSidebarOpen={setSidebarOpen} setSearch={setSearch}/>

      <Sidebar isOpen={sidebarOpen} />

      <main className={`main-content ${sidebarOpen ? 'shifted' : ''}`}>
        {renderSongBoxes()}
      </main>
    </div>
  );
};

export default Dashboard;
