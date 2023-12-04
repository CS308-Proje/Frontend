import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import UserIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import LogoImage from "../Assets/logo-white.png";
import Sidebar from "../Sidebar/Sidebar";
import './ExportSongs.css';

const ExportSongs = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [exportCriteria, setExportCriteria] = useState({});
  const navigate = useNavigate();

  const handleExportTypeChange = (event, type) => {
    if (event.target.checked) {
      setExportCriteria({ ...exportCriteria, [type]: '' });
    } else {
      const newCriteria = { ...exportCriteria };
      delete newCriteria[type];
      setExportCriteria(newCriteria);
    }
  };

  const handleCriteriaValueChange = (type, value) => {
    setExportCriteria({ ...exportCriteria, [type]: value });
  };

  const handleExport = (format) => {
    console.log(`Exporting songs as ${format} with criteria:`, exportCriteria);
    // Implement the export logic here
  };

  const navigateToProfile = () => {
    navigate('/login');
  };

  const navigateToDashboard = () => {
    navigate('/dashboard');
  };

  const handleSearch = (event) => {
    console.log('Searching for:', event.target.value);
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

      <main className={`main-content ${sidebarOpen ? 'shifted' : ''}`}>
        <div className="export-container">
          <h1>Export Songs</h1>
          <div className="underline"></div>
          <div className="export-type-selector">
            <div>
              <input
                type="checkbox"
                id="artist"
                onChange={e => handleExportTypeChange(e, 'artist')}
              />
              <label htmlFor="artist">By Artist</label>
              {exportCriteria.artist !== undefined && (
                <input
                  type="text"
                  placeholder="Enter an artist name"
                  value={exportCriteria.artist}
                  onChange={e => handleCriteriaValueChange('artist', e.target.value)}
                />
              )}
            </div>
          </div>
          <div className="export-type-selector">
            <div>
              <input
                type="checkbox"
                id="rating"
                onChange={e => handleExportTypeChange(e, 'rating')}
              />
              <label htmlFor="rating">By Rating</label>
              {exportCriteria.rating !== undefined && (
                <input
                  type="text"
                  placeholder="Enter a rating 1-5"
                  value={exportCriteria.rating}
                  onChange={e => handleCriteriaValueChange('rating', e.target.value)}
                />
              )}
            </div>
          </div>
          <div className="export-options">
            <button onClick={() => handleExport('json')}>Export Songs as .json</button>
            <button onClick={() => handleExport('csv')}>Export Songs as .csv</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExportSongs;
