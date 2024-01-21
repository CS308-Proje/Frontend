import "./AdminSongPage.css"; // Import your CSS file
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Navbar2 from "../Navbar2/Navbar2";
import ReactSelect from "react-select";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Modal from "react-modal";

const AdminSongPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [data, setData] = useState({ songs: [], albums: [], artists: [] });
  const [activeTab, setActiveTab] = useState("songs");
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [chartModalIsOpen, setChartModalIsOpen] = useState(false);
  const [chartData, setChartData] = useState({});
  const [showSongChart, setShowSongChart] = useState(false);
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      background: "rgba(0, 0, 0, 0.8)",
      color: "white",
    },
    overlay: {
      background: "rgba(0, 0, 0, 0.75)",
    },
  };
  const navigate = useNavigate();
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };

  const openChartModal = async () => {
    try {
      setChartModalIsOpen(true);
      const response = await fetch("http://localhost:5001/admin-chart-songs", {
        method: "GET",
        credentials: "include", // Include credentials if needed for cookies, etc.
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        const countsArray = data.countsArray;
        const chartData = {
          labels: countsArray.map((item) => item.date),
          datasets: [
            {
              label: "Added Songs per Day",
              data: countsArray.map((item) => item.count),
              fill: false,
              backgroundColor: "#8bbe52",
              borderColor: "#8bbe52",
            },
          ],
        };

        setChartData(chartData);
        setShowSongChart(true);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
      // Handle errors, such as by setting an error state or message
    }
  };

  useEffect(() => {
    // Call fetchData when the component mounts and when activeTab or search changes
    fetchData();
  }, [activeTab, search]);

  const fetchData = async () => {
    let endpoint = "";
    switch (activeTab) {
      case "songs":
        endpoint = `users/songs?name=${search}`;
        break;
      case "albums":
        endpoint = `users/albums?name=${search}`;
        break;
      case "artists":
        endpoint = `users/artists?name=${search}`;
        break;
      default:
        return;
    }

    try {
      const response = await fetch(`http://localhost:5001/${endpoint}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      setData((prevData) => ({
        ...prevData,
        [activeTab]: jsonData[activeTab],
      }));
      switch (activeTab) {
        case "songs":
          const data1 = Array.isArray(jsonData.songs) ? jsonData.songs : [];
          setSongs(data1);
          break;
        case "albums":
          const data2 = Array.isArray(jsonData.albums) ? jsonData.albums : [];
          setAlbums(data2);
          break;
        case "artists":
          const data3 = Array.isArray(jsonData.artists) ? jsonData.artists : [];
          setArtists(data3);
          break;
        default:
          return;
      }
    } catch (error) {
      console.error("Fetching data failed", error);
    }
  };

  const deleteSong = async (songId) => {
    try {
      const response = await fetch(
        `http://localhost:5001/users/delete-song/${songId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setSongs(songs.filter((song) => song._id !== songId));
      } else {
        console.error("Error deleting song");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteAlbum = async (albumId) => {
    try {
      const response = await fetch(
        `http://localhost:5001/users/delete-album/${albumId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setAlbums(albums.filter((album) => album._id !== albumId));
      } else {
        console.error("Error deleting album");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteArtist = async (artistId) => {
    try {
      const response = await fetch(
        `http://localhost:5001/artists/${artistId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setArtists(artists.filter((artist) => artist._id !== artistId));
      } else {
        console.error("Error deleting artist");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // We will not call fetchData here since useEffect will take care of it when activeTab changes
  };

  return (
    <div className="AdminPage">
      <Navbar2
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setSearch={setSearch}
      />
      <Sidebar isOpen={sidebarOpen} />

      <main className={`main-content5 ${sidebarOpen ? "shifted" : ""}`}>
        <div className="button-group">
          <button
            onClick={() => handleTabClick("songs")}
            className="grouped-button"
          >
            Songs
          </button>
          <button
            onClick={() => handleTabClick("albums")}
            className="grouped-button"
          >
            Albums
          </button>
          <button
            onClick={() => handleTabClick("artists")}
            className="grouped-button"
          >
            Artists
          </button>
        </div>
        <button className="chart-button" onClick={openChartModal}>
          Song Chart
        </button>
        <div className="data-display">
          {activeTab === "songs" &&
            songs.map((song, index) => (
              <div key={song._id} className="song-box5">
                <button
                  className="delete-song-btn"
                  onClick={() => deleteSong(song._id)}
                >
                  <RemoveCircleIcon
                    style={{ fontSize: "40px", color: "#fff" }}
                  />
                  <span className="tooltip-text">Remove Song</span>
                </button>
                <img
                  src={song.albumImg}
                  className="artist-img"
                  alt={`Artist ${song.id}`}
                />
                <div>
                  <h1 className="text-box">
                    <b>{song.songName}</b>
                  </h1>
                  <h2 className="text-box">
                    <b>Artist:</b> {song.mainArtistName}
                  </h2>
                  <h3 className="text-box">
                    <b>Album: </b>
                    {song.albumName}
                  </h3>

                  <h5 className="text-box">
                    Release Date: {formatDate(song.release_date)}
                  </h5>
                </div>
              </div>
            ))}
          {activeTab === "albums" &&
            albums.map((album, index) => (
              <div key={album._id} className="song-box5">
                <button
                  className="delete-song-btn"
                  onClick={() => deleteAlbum(album._id)}
                >
                  <RemoveCircleIcon
                    style={{ fontSize: "40px", color: "#fff" }}
                  />
                  <span className="tooltip-text">Remove Album</span>
                </button>
                <img
                  src={album.albumImg}
                  className="artist-img"
                  alt={`Artist ${album.id}`}
                />
                <div>
                  <h1 className="text-box">
                    <b>{album.name}</b>
                  </h1>
                  <h2 className="text-box">
                    <b>Artist:</b> {album.artistId?.artistName}
                  </h2>
                  <h3 className="text-box">
                    <b>Release Date:</b> {formatDate(album.release_date)}
                  </h3>
                </div>
              </div>
            ))}
          {activeTab === "artists" &&
            artists.map((artist, index) => (
              <div key={artist._id} className="song-box5">
                <button
                  className="delete-song-btn"
                  onClick={() => deleteArtist(artist._id)}
                >
                  <RemoveCircleIcon
                    style={{ fontSize: "40px", color: "#fff" }}
                  />
                  <span className="tooltip-text">Remove Artist</span>
                </button>
                <img
                  src={artist.artistImg}
                  className="artist-img"
                  alt={`Artist ${artist.id}`}
                />
                <div>
                  <h1 className="text-box">
                    <b>{artist.artistName}</b>
                  </h1>
                </div>
              </div>
            ))}
        </div>
      </main>
      <div
        className={`modal-backdrop ${showSongChart ? "show-backdrop" : ""}`}
      ></div>
      {showSongChart && (
        <div className="registration-chart-modal">
          <Line data={chartData} options={{ responsive: true }} />
          <button onClick={() => setShowSongChart(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default AdminSongPage;
