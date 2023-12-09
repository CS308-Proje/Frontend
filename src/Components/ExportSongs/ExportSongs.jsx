import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import UserIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import LogoImage from "../Assets/logo-white.png";
import Sidebar from "../Sidebar/Sidebar";
import Dashboard from "../Dashboard/Dashboard";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import './ExportSongs.css';

const ExportSongs = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [exportCriteria, setExportCriteria] = useState({});
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);

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

  
  // Dropdown menu toggle
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  

  const renderDropdownItems = () => {
    // Hardcoded test data
    const testData = [
      { name: "Item 1", quantity: 10 },
      { name: "Item 2", quantity: 15 },
      { name: "Item 3", quantity: 5 }
    ];
  
    return testData.map((item, index) => (
      <div key={index} className="dropdown-item">
        {item.name} - {item.quantity}
      </div>
    ));
  };

  const handleExport = async (format) => {
    console.log(`Exporting songs as ${format} with criteria:`, exportCriteria);
  
    // Construct the query parameters based on exportCriteria
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(exportCriteria)) {
      if (value) {
        queryParams.append(key, value);
      }
    }
  
    // Add the format to the query parameters
    queryParams.append('format', format);
  
    // Construct the URL with query parameters
    const url = `http://localhost:5001/export?${queryParams.toString()}`;
  
    try {
      // Make the HTTP request to the backend
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Handle the response (e.g., download the file)
      const blob = await response.blob();
      downloadFile(blob, `exported_songs.${format}`);
    } catch (error) {
      console.error('Error during export:', error);
    }
  };
  
  // Utility function to trigger file download
  const downloadFile = (blob, fileName) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
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

        <button className="bell-btn" onClick={toggleDropdown}>
         <NotificationsActiveIcon className="bell-icon" style={{ fontSize: 35 }} />
        </button>
        <div className={`dropdown-menu ${dropdownOpen ? 'dropdown-menu-visible' : ''}`}>
          {renderDropdownItems()}
        </div>

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
            <button id="btn1" onClick={() => handleExport('json')}>Export Songs as .json</button>
            <button id="btn2" onClick={() => handleExport('csv')}>Export Songs as .csv</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExportSongs;
