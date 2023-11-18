import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import UserIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search'; // Import for Search Icon
import LogoImage from "../Assets/logo-white.png";
import Sidebar from "../Sidebar/Sidebar";

import "./Submission.css";

const Submission = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [submissionType, setSubmissionType] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const [songName, setSongName] = useState('');
  const [mainArtistName, setMainArtistName] = useState('');
  const [featuringArtistNames, setFeaturingArtistNames] = useState('');
  const [albumName, setAlbumName] = useState('');

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/json") {
      setSelectedFile(file);
    } else {
      alert("Please select a JSON file.");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === "application/json") {
      setSelectedFile(file);
    } else {
      alert("Please drop a JSON file.");
    }
  };

  const handleSingleTrackSubmit = async () => {
    // Prepare the data in the format your backend expects
    const trackData = {
      songName: songName,
      mainArtistName: mainArtistName,
      featuringArtistNames: featuringArtistNames.split(',').map(name => name.trim()), // Split by comma and trim whitespace
      albumName: albumName,
    };
  
    try {
      // Use your backend endpoint, adjust as necessary
      const response = await fetch('http://localhost:5000/songs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // If you're using an authorization token, include it here
          // 'Authorization': 'Bearer YOUR_AUTH_TOKEN'
        },
        body: JSON.stringify(trackData),
      });
  
      if (response.ok) {
        // Handle success, possibly clear the form or redirect the user
        console.log('Track submitted successfully');
      } else {
        // If the server responds with an error, handle it here
        throw new Error("Upload failed");
      }
    } catch (error) {
      // Handle network errors here
  //    setError(error);
    }
  };

 /* document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btn1");

    if (btn) {
      btn.addEventListener("click", handleSignup);
    }
  }); */
  
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

  const toggleSubmissionType = (type) => {
    setSubmissionType(type);
  };

  const handleDeleteFile = () => {
    setSelectedFile(null);
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
      
      <div className="center-container">
        <button onClick={() => setIsOpen(!isOpen)} className="submission-toggle">
          {submissionType || 'Select Track Type'}
        </button>

        {isOpen && (
          <div className="dropdown-menu">
            <div onClick={() => { setSubmissionType('Single Track'); setIsOpen(false); }}>Single Track</div>
            <div onClick={() => { setSubmissionType('Multiple Tracks'); setIsOpen(false); }}>Multiple Tracks</div>
          </div>
        )}

        {submissionType === 'Single Track' && (
          <div className="submission-container">
            <div className="text">Upload Single Track</div>
            <div className="underline"></div>
            
            <div className="track-details-form">
              <input 
                type="text" 
                placeholder="Song Name" 
                className="track-input" 
                value={songName} 
                onChange={(e) => setSongName(e.target.value)} 
              />
              <input 
                type="text" 
                placeholder="Main Artist Name" 
                className="track-input" 
                value={mainArtistName} 
                onChange={(e) => setMainArtistName(e.target.value)} 
              />
              <input 
                type="text" 
                placeholder="Featuring Artist Names" 
                className="track-input" 
                value={featuringArtistNames} 
                onChange={(e) => setFeaturingArtistNames(e.target.value)} 
              />
              <input 
                type="text" 
                placeholder="Album Name" 
                className="track-input" 
                value={albumName} 
                onChange={(e) => setAlbumName(e.target.value)} 
              />

            </div>

            <div className="submission-actions">
                <button onClick={handleSingleTrackSubmit}>Upload Track</button>
                
            </div>
          </div>
        )}

        {submissionType === 'Multiple Tracks' && (
          <div className="submission-container">
            <div className="text">Upload Multiple Tracks</div>
            <div className="underline"></div>
            
            <div className="file-submission">
                <div className="file-controls">
                    <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileSelect} accept=".json"/>
                    <label htmlFor="fileInput" className="btn file-btn">Add Folder</label>
                    <button className="btn file-btn" onClick={handleDeleteFile}>Delete</button>
                </div>
                <div className="file-drag-area" onDragOver={handleDragOver} onDrop={handleFileDrop}>
                    {selectedFile ? <p>{selectedFile.name}</p> : "Drag & Drop JSON File Here"}
                    <span>Include multiple tracks in a single JSON file.</span>
                </div>
                <div className="file-info">
                    <span>Accepted file type: JSON .json</span>
                    <span>Maximum file size: 100 MB</span>
                </div>
            </div>

            <div className="submission-actions">
                <button>Upload Tracks</button>
            </div>
          </div>

        )}
      </div>

      
      

      <main className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
        {/* Your main app content here */}
      </main>
    </div>
  );
};

export default Submission;
