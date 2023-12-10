import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import './ExportSongs.css';
import Navbar2 from "../Navbar2/Navbar2";

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
    const url = `http://localhost:5000/export?${queryParams}`;

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
  
  // Utility function to trigger file download
  const downloadFile = (blob, fileName) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };
  

  return (
    <div className="Dashboard10">
      <Navbar2 sidebarOpen = {sidebarOpen} setSidebarOpen={setSidebarOpen} setSearch={setSearch}/>

      <Sidebar isOpen={sidebarOpen} />

      <main className={`main-content10 ${sidebarOpen ? 'shifted' : ''}`}>
        <div className="export-container">
          <h1>Export Songs</h1>
          <div className="underline10"></div>
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
            <button id="btn2" onClick={() => handleExport('json')}>Export Songs as .json</button>
            <button id="btn3" onClick={() => handleExport('csv')}>Export Songs as .csv</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExportSongs;
