import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import UserIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import LogoImage from "../Assets/logo-white.png";
import Sidebar from "../Sidebar/Sidebar";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import './ExportSongs.css';
import Navbar2 from '../Navbar2/Navbar2';

const ExportSongs = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [exportCriteria, setExportCriteria] = useState({});
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");

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

    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(exportCriteria)) {
      if (value) {
        queryParams.append(key, value);
      }
    }

    queryParams.append('format', format);

    // Corrected the URL string
    const url = `http://localhost:5001/export?${queryParams}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.statusText}`);
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = contentDisposition
        ? contentDisposition.split('filename=')[1].split(';')[0].replace(/"/g, '')
        : `exportedData.${format}`;

      downloadFile(blob, filename);
    } catch (error) {
      console.error('Error during export:', error);
    }
  };

  const downloadFile = (blob, fileName) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const navigateToProfile = () => {
    navigate('/profile');
  };

  const navigateToDashboard = () => {
    navigate('/dashboard');
  };

  const handleSearch = (event) => {
    console.log('Searching for:', event.target.value);
  };

  return (
    <div className="Dashboard">
    <Navbar2 sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setSearch={setSearch} />
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
          <button id="btn10" onClick={() => handleExport('json')}>Export Songs as .json</button>
          <button id="btn20" onClick={() => handleExport('csv')}>Export Songs as .csv</button>
        </div>
      </div>
    </main>
  </div>
);
};

export default ExportSongs;