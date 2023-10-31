import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import UserIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search'; // Import for Search Icon
import LogoImage from "../Assets/logo-white.png";
import Sidebar from "../Sidebar/Sidebar";
import "./Submission.css";

const Dashboard = () => {
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
      <div class="parent-flex-wrapper">
            <div class="submission-container">
                <h1>Add submission</h1>
                
                <div className="file-submission">
                    <div className="file-controls">
                        <button>Add</button>
                        <button>Delete</button>
                        <button>Folder</button>
                    </div>
                    <div className="file-drag-area">
                        Files
                        <span>You can drag and drop files here to add them.</span>
                    </div>
                    <div className="file-info">
                        <span>Accepted file types: PDF document .pdf</span>
                        <span>Maximum file size: 100 MB, maximum number of files: 1</span>
                    </div>
                </div>

                <div className="submission-actions">
                    <button>Save changes</button>
                    <button>Cancel</button>
                </div>
            </div>
      </div>
      <div className="submission-container">
            <h1>Add submission</h1>
            
            <div className="file-submission">
                <div className="file-controls">
                    <button>Add</button>
                    <button>Delete</button>
                    <button>Folder</button>
                </div>
                <div className="file-drag-area">
                    Files
                    <span>You can drag and drop files here to add them.</span>
                </div>
                <div className="file-info">
                    <span>Accepted file types: PDF document .pdf</span>
                    <span>Maximum file size: 100 MB, maximum number of files: 1</span>
                </div>
            </div>

            <div className="submission-actions">
                <button>Save changes</button>
                <button>Cancel</button>
            </div>
        </div>

      <main className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
        {/* Your main app content here */}
      </main>
    </div>
  );
};

export default Dashboard;
