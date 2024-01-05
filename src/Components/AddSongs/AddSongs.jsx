import React, { useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import Sidebar from "../Sidebar/Sidebar";
import jsonicon from "../Assets/jsonicon.png";
import ReactSelect from "react-select";
import "./AddSongs.css";
import Navbar2 from "../Navbar2/Navbar2";
import AddIcon from '@mui/icons-material/Add';
import HeaderIcon from "../HeaderIcon/HeaderIcon";

const Submission = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [submissionType, setSubmissionType] = useState(null);
  const [search, setSearch] = useState("");
  const [songs1, setSongs] = useState([]);
  const [songName, setSongName] = useState("");
  const [mainArtistName, setMainArtistName] = useState("");
  const [featuringArtistNames, setFeaturingArtistNames] = useState("");
  const [albumName, setAlbumName] = useState("");
  const [release_date, setRelease_date] = useState("");
  const [databaseURI, setDatabaseURI] = useState("");
  const [databaseName, setDatabaseName] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Function to toggle dropdown state
  const handleDropdownOpen = () => {
    setIsDropdownOpen(true);
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
  };

  // Adjust the styles of the submission container based on the dropdown state
  const submissionContainerStyle = {
    top: isDropdownOpen ? "100px" : "5px", // Adjust the top position when the dropdown is open
    transition: "top 0.3s ease", // Ensure the transition is smooth
  };

  const selectOptions = [
    {
      value: "Single Track Not In Spotify",
      label: "Single Track Not In Spotify",
    },
    { value: "Single Track In Spotify", label: "Single Track In Spotify" },
    { value: "Multiple Tracks", label: "Multiple Tracks" },
    { value: "Database URI", label: "Database URI" },
  ];

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "10px",
      backgroundColor: "black",
      borderColor: "white",
      color: "white",
      boxShadow: "none", // Removes the default box-shadow
      "&:hover": {
        borderColor: "white", // Border color when hovering
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "1px",
      backgroundColor: "black",
      borderColor: "white",
      color: "white",
      overflow: "hidden", // Ensures the rounded corners are respected
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "grey" : "white", // Background color when option is focused/hovered
      color: state.isFocused ? "black" : "black", // Text color when option is focused/hovered
      borderRadius: "1px", // Border radius for each option
      "&:active": {
        backgroundColor: "#8bbe52", // Background color when option is selected
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
  };

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
    setUploading(true);
    setUploadSuccess(false);
    setUploadError(false);
    setUploadProgress(0);
    const trackData = {
      songName: songName,
      mainArtistName: mainArtistName,
      featuringArtistNames: featuringArtistNames
        ? featuringArtistNames.split(",").map((name) => name.trim())
        : [],
      albumName: albumName,
      release_date: release_date,
    };

    try {
      console.log(trackData);
      // Use your backend endpoint, adjust as necessary
      const response = await fetch(
        "http://localhost:5001/add-song-not-from-spotify",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            // If you're using an authorization token, include it here
            // 'Authorization': 'Bearer YOUR_AUTH_TOKEN'
          },
          body: JSON.stringify(trackData),
        }
      );

      if (response.ok) {
        // Handle success, possibly clear the form or redirect the user
        console.log("Track submitted successfully");
        setUploadSuccess(true);
        setUploadProgress(100);
        setTimeout(() => {
          setUploading(false); // Hide the progress bar after a delay
          setUploadSuccess(false);
        }, 1000);
      } else {
        // If the server responds with an error, handle it here
        throw new Error("Upload failed");
      }
    } catch (error) {
      // Handle network errors here
      console.log(error);
      setUploadError(true);
      setTimeout(() => {
        setUploading(false); // Hide the progress bar after a delay
        setUploadError(false);
      }, 1000);
    }
  };
  const handleAddSpotifySong = async (song) => {

    const trackData = song;

    try {
      console.log(trackData);
      
      const response = await fetch("http://localhost:5001/songs", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          // If you're using an authorization token, include it here
          // 'Authorization': 'Bearer YOUR_AUTH_TOKEN'
        },
        body: JSON.stringify(trackData),
      });

      if (response.ok) {
        // Handle success, possibly clear the form or redirect the user
        console.log("Track submitted successfully");
        
      } else {
        // If the server responds with an error, handle it here
        throw new Error("Upload failed");
      }
      
    } catch (error) {
      // Handle network errors here
      console.log(error);
      
    }
  };
  //* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ *//
  const handleFileSubmit = async () => {
    // Prepare the data in the format your backend expects
    setUploading(true);
    setUploadSuccess(false);
    setUploadError(false);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      // Use your backend endpoint, adjust as necessary
      const response = await fetch("http://localhost:5001/upload-song-file", {
        method: "POST",
        credentials: "include",

        body: formData,
      });

      if (response.ok) {
        // Handle success, possibly clear the form or redirect the user
        console.log("Track submitted successfully");
        setUploadSuccess(true);
        setUploadProgress(100);
        setTimeout(() => {
          setUploading(false); // Hide the progress bar after a delay
          setUploadSuccess(false);
          handleDeleteFile();
        }, 1000);
      } else {
        // If the server responds with an error, handle it here
        throw new Error("Upload failed");
      }
    } catch (error) {
      // Handle network errors here
      console.log(error);
      setUploadError(true);
      setTimeout(() => {
        setUploading(false); // Hide the progress bar after a delay
        setUploadError(false);
        handleDeleteFile();
      }, 1000);
    }
  };
  //* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ *//
  const handleTransferDatabase = async () => {
    // Prepare the data in the format your backend expects
    setUploading(true);
    setUploadSuccess(false);
    setUploadError(false);
    setUploadProgress(0);
    const databaseData = {
      databaseURI: databaseURI,
      databaseName: databaseName,
      collectionName: collectionName,
    };

    try {
      console.log(databaseData);
      // Use your backend endpoint, adjust as necessary
      const response = await fetch("http://localhost:5001/transfer-songs", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          // If you're using an authorization token, include it here
          // 'Authorization': 'Bearer YOUR_AUTH_TOKEN'
        },
        body: JSON.stringify(databaseData),
      });

      if (response.ok) {
        // Handle success, possibly clear the form or redirect the user
        console.log("Track submitted successfully");
        setUploadSuccess(true);
        setUploadProgress(100);
        setTimeout(() => {
          setUploading(false); // Hide the progress bar after a delay
          setUploadSuccess(false);
        }, 1000);
      } else {
        // If the server responds with an error, handle it here
        throw new Error("Upload failed");
      }
    } catch (error) {
      // Handle network errors here
      console.log(error);
      setUploadError(true);
      setTimeout(() => {
        setUploading(false); // Hide the progress bar after a delay
        setUploadError(false);
      }, 1000);
    }
  };
  /* document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btn1");

    if (btn) {
      btn.addEventListener("click", handleSignup);
    }
  }); */

  const handleDeleteFile = () => {
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.value = "";
    }
    setSelectedFile(null);
  };


  const handleSpotifySearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/directly-from-spotify?songName=${search}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const s = await response.json();
      const data = Array.isArray(s.songsArray) ? s.songsArray : [];
      setSongs(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setSongs([]);
    }
  };
  



  return (
    <div className="Dashboard1">
      <Navbar2
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setSearch={setSearch}
      />

      <Sidebar isOpen={sidebarOpen} />

      <div className="center-container">
        <div className="dropdown-container">
          <ReactSelect
            styles={customStyles}
            options={selectOptions}
            value={selectOptions.find(
              (option) => option.value === submissionType
            )}
            onChange={(selectedOption) =>
              setSubmissionType(selectedOption.value)
            }
            onMenuOpen={handleDropdownOpen}
            onMenuClose={handleDropdownClose}
            placeholder="Select Track Type"
            theme={(theme) => ({
              ...theme,
              borderRadius: 10,
              colors: {
                ...theme.colors,
                primary25: "grey", // color when option is focused
                primary: "black", // border color when focused
              },
            })}
          />
        </div>

        {submissionType === null && (
          <div
            className="submission-container"
            style={submissionContainerStyle}
          >
            <div className="text">
              Welcome to Our Song Recommendation Service
            </div>
            <div className="underline"></div>

            <p className="recommendation-message">
              Welcome to our Song Recommendation Service! We're here to help you
              discover new music, but we need your help to make our
              recommendations even better. Add your favorite songs to our
              database, and we'll use that information to suggest the perfect
              tracks for your taste. Choose an option from the dropdown above to
              get started!
            </p>
            <div className="underline"></div>
            <p className="instruction-text">
              Select your way of adding songs with button above:
            </p>
          </div>
        )}

        {submissionType === "Single Track Not In Spotify" && (
          <div
            className="submission-container"
            style={submissionContainerStyle}
          >
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
              <input
                type="text"
                placeholder="Release Date"
                className="track-input"
                value={release_date}
                onChange={(e) => setRelease_date(e.target.value)}
              />
            </div>

            {!uploading && (
              <div className="submission-actions">
                <button onClick={handleSingleTrackSubmit}>Upload Track</button>
              </div>
            )}

            {uploading && !uploadSuccess && <div className="loader"></div>}

            {uploadSuccess && (
              <div>
                <DoneIcon className="material-icons success-icon">
                  check_circle
                </DoneIcon>
                <div className="success-message">Uploaded Successfully</div>
              </div>
            )}

            {uploadError && (
              <div>
                <span style={{ color: "red" }}>
                  Cannot make an upload. Please try again.
                </span>
              </div>
            )}
          </div>
        )}

        {submissionType === "Single Track In Spotify" && (
          <div className={`submission-container2 ${songs1.length > 0 ? "with-songs" : ""}`} style={submissionContainerStyle}>
            <div className="text">Search Spotify Tracks</div>
            <div className="underline"></div>

            <div className="search-bar1">
              <input
                type="text"
                placeholder="Enter Song Name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="track-input" // Using the same style class as other inputs
              />
              <button className="btn" onClick={handleSpotifySearch}>Search</button> {/* Assuming 'btn' is a styled button class */}
            </div>

            {/* Conditional rendering of search results */}
            {songs1.length > 0 && (
              <div className="song-list1">
                {songs1.map((song) => (
                  <div key={song._id} className="song-item1">
                    {/* Render song details here */}
                    <div className="song-details">
                      <img src={song.albumImg} className="artist-img" alt={`Artist ${song.id}`} />
                      <div>
                        <h1 className="text-box"><b>{song.songName}</b></h1>
                        <h2 className="text-box"><b>Artist:</b> {song.mainArtistName}</h2>
                        <h3 className="text-box"><b>Album: </b>{song.albumName}</h3>
                        
                      </div>
                    </div>
                    <div className="add-icon-container">
                        <HeaderIcon 
                          inactiveIcon={<AddIcon />} 
                          activeIcon={<DoneIcon />} 
                          className= "add-icon"
                          style={{ cursor: 'pointer', fontSize: '40px' }} 
                          onClick={() => handleAddSpotifySong(song)}
                        />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}


        {submissionType === "Multiple Tracks" && (
          <div
            className="submission-container"
            style={submissionContainerStyle}
          >
            <div className="text">Upload Multiple Tracks</div>
            <div className="underline"></div>

            <div className="file-submission">
              <div className="file-controls">
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={handleFileSelect}
                  accept=".json"
                />
                <label htmlFor="fileInput" className="btn file-btn">
                  Add Folder
                </label>
                <button className="btn file-btn" onClick={handleDeleteFile}>
                  Delete
                </button>
              </div>
              <div
                className="file-drag-area"
                onDragOver={handleDragOver}
                onDrop={handleFileDrop}
              >
                {selectedFile ? (
                  <p>
                    <img src={jsonicon} alt="Logo" className="jsnicon" />
                    <div>{selectedFile.name}</div>
                  </p>
                ) : (
                  "Drag & Drop JSON File Here"
                )}
                <span>Include multiple tracks in a single JSON file.</span>
              </div>
              <div className="file-info">
                <span>Accepted file type: JSON .json</span>
                <span>Maximum file size: 100 MB</span>
              </div>
            </div>
            {!uploading && (
              <div className="submission-actions">
                <button onClick={handleFileSubmit}>File Upload</button>
              </div>
            )}

            {uploading && !uploadSuccess && <div className="loader"></div>}

            {uploadSuccess && (
              <div>
                <DoneIcon className="material-icons success-icon">
                  check_circle
                </DoneIcon>
                <div className="success-message">Uploaded Successfully</div>
              </div>
            )}

            {uploadError && (
              <div>
                <span style={{ color: "red" }}>
                  Cannot make an upload. Please try again.
                </span>
              </div>
            )}
          </div>
        )}

        {submissionType === "Database URI" && (
          <div
            className="submission-container"
            style={submissionContainerStyle}
          >
            <div className="text">Database URI</div>
            <div className="underline"></div>

            <div className="track-details-form">
              <input
                type="text"
                placeholder="Database URI"
                className="track-input"
                value={databaseURI}
                onChange={(e) => setDatabaseURI(e.target.value)}
              />
              <input
                type="text"
                placeholder="Database Name"
                className="track-input"
                value={databaseName}
                onChange={(e) => setDatabaseName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Collection Name"
                className="track-input"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
              />
            </div>
            {!uploading && (
              <div className="submission-actions">
                <button onClick={handleTransferDatabase}>
                  Transfer Database
                </button>
              </div>
            )}

            {uploading && !uploadSuccess && <div className="loader"></div>}

            {uploadSuccess && (
              <div>
                <DoneIcon className="material-icons success-icon">
                  check_circle
                </DoneIcon>
                <div className="success-message">Uploaded Successfully</div>
              </div>
            )}

            {uploadError && (
              <div>
                <span style={{ color: "red" }}>
                  Cannot make an upload. Please try again.
                </span>
              </div>
            )}
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