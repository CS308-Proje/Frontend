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
                <input type="text" placeholder="Song Name" className="track-input" />
                <input type="text" placeholder="Main Artist Name" className="track-input" />
                <input type="text" placeholder="Featuring Artist Names" className="track-input" />
                <input type="text" placeholder="Album Name" className="track-input" />
            </div>

            <div className="submission-actions">
                <button>Upload Track</button>
                <button>Cancel</button>
            </div>
          </div>
        )}

        {submissionType === 'Multiple Tracks' && (
          <div className="submission-container">
            <div className="text">Upload Multiple Tracks</div>
            <div className="underline"></div>
            
            <div className="file-submission">
                <div className="file-controls">
                    <button>Add</button>
                    <button>Delete</button>
                    <button>Folder</button>
                </div>
                <div className="file-drag-area">
                    Drag & Drop JSON File Here
                    <span>Include multiple tracks in a single JSON file.</span>
                </div>
                <div className="file-info">
                    <span>Accepted file type: JSON .json</span>
                    <span>Maximum file size: 100 MB</span>
                </div>
            </div>

            <div className="submission-actions">
                <button>Upload Tracks</button>
                <button>Cancel</button>
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
