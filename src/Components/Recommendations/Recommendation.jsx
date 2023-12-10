import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import "./Recommendation.css";
import Navbar2 from "../Navbar2/Navbar2";
import ReactSelect from "react-select";
import AddIcon from '@mui/icons-material/Add';

import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import CircularProgress from '@mui/material/CircularProgress';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
const Recommendation = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [songs, setSongs] = useState([]);
    const [albums, setAlbums] = useState([])
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [recommendationType, setRecommendationType] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [artists, setArtists] = useState([]);
    const [spotify, setSpotify] = useState([]);
    const [temporal, setTemporal] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [songStatus, setSongStatus] = useState({});
    const [noDataMessage, setNoDataMessage] = useState("");
    const [friends, setFriend]= useState([]);

    const submissionContainerStyle = {
      top: isDropdownOpen ? '100px' : '5px', // Adjust the top position when the dropdown is open
      transition: 'top 0.3s ease', // Ensure the transition is smooth
    };

    const handleDropdownOpen = () => {
        setIsDropdownOpen(true);
      };
    
    const handleDropdownClose = () => {
    setIsDropdownOpen(false);
    };

    const handleAddSong = async (song) => {

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

   

useEffect(() => {
  const fetchData = async () => {
      let url = "";
      switch (recommendationType) {
          
          case 'song-ratings':
              setIsLoading(true); // Start loading
              url = `http://localhost:5001/based-on-song-ratings`;
              break;
          case 'album-ratings':
              setIsLoading(true); // Start loading
              url = `http://localhost:5001/based-on-album-ratings`;
              break;
          // Add more cases as needed
          case 'temporal-values':
              setIsLoading(true); // Start loading
              url = 'http://localhost:5001/based-on-temporal';
              break;
          case 'artist-ratings':
              setIsLoading(true); // Start loading
              url = 'http://localhost:5001/based-on-artist-ratings';
              break;
          case 'spotify-recommendations':
              setIsLoading(true); // Start loading
              url = 'http://localhost:5001/based-on-spotify';
              break;
          case 'friend-activity':
              setIsLoading(true);
              url = 'http://localhost:5001/based-on-friends'
              console.log("buraya geldi");
              break;
          default:
              return;
      }

      try {
          const response = await fetch(url, {
              method: "GET",
              credentials: "include",
              headers: {
                  "Content-Type": "application/json",
              },
          });
          const data = await response.json();
          console.log("test");
          if (recommendationType === 'song-ratings') {
              setSongs(data.songs || []);
          } else if (recommendationType === 'album-ratings') {
              setAlbums(data.songs || []);
          } else if (recommendationType === "temporal-values") {
              setTemporal(data.songs || []);
          } else if (recommendationType === "artist-ratings") {
              setArtists(data.songs || []);
          } else if (recommendationType === 'spotify-recommendations') {
              setSpotify(data.songs || []);
          } else if (recommendationType === 'friend-activity') {
              setFriend(data.songs || []);
              console.log(friends);
          }
          // Handle other recommendation types similarly
      } catch (error) {
          console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Stop loading whether there is an error or not
      }
  };

  fetchData();
}, [recommendationType]);


    const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
    };
    
    const recommendationContainerStyle = {
        top: isDropdownOpen ? '100px' : '5px', // Adjust the top position when the dropdown is open
        transition: 'top 0.3s ease', // Ensure the transition is smooth
      };
    
    const recommendationOptions = [
        { value: 'song-ratings', label: 'Based on Song Ratings' },
        { value: 'artist-ratings', label: 'Based on Artist Ratings' },
        { value: 'album-ratings', label: 'Based on Album Ratings' },
        { value: 'spotify-recommendations', label: 'Based on Spotify Recommendations' },
        { value: 'temporal-values', label: 'Based on Temporal Values' },
        { value: 'friend-activity', label: 'Based on Friend Activity' },
    ]; 
    
    const customStyles = {
        control: (provided) => ({
            ...provided,
            borderRadius: '10px',
            backgroundColor: 'black',
            borderColor: 'white',
            color: 'white',
            boxShadow: 'none',
            padding: '0.2rem', // Increase padding
            '&:hover': {
              borderColor: 'white',
            }
        }),
        menu: (provided) => ({
          ...provided,
          borderRadius: '1px',
          backgroundColor: 'black',
          borderColor: 'white',
          color: 'white',
          overflow: 'hidden', // Ensures the rounded corners are respected
          
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isFocused ? 'grey' : 'white', // Background color when option is focused/hovered
          color: state.isFocused ? 'black' : 'black', // Text color when option is focused/hovered
          borderRadius: '1px', // Border radius for each option
          '&:active': {
            backgroundColor: '#8bbe52', // Background color when option is selected
          }
        }),
        singleValue: (provided) => ({
          ...provided,
          color: 'white',
        }),
    };

    const renderRecommendationContainer = () => {
        // Define a JSX container for each recommendation type
       
        switch (recommendationType) {
          case "song-ratings":
            if(songs.length === 0 && !isLoading){
              return(<div className="recommendation-container" style={recommendationContainerStyle}>
                        <SentimentVeryDissatisfiedIcon style={{ fontSize: '100px', margin: '15 auto', display: 'block' }} />
                        <div className="text1">Unfortunately, We Can't Help You</div>
                        <div className="underline1"></div>
                        <p className="recommendation-message1">
                          No song is rated high enough to get recommendation. You need to rate at least one song using a rating value greater or equal to 4.
                        </p>
                     </div>
                    );
            }
            else{
            return (

              
              songs.map((song) => (
                <div key={song._id} className="song-box1">
                  <img src={song.albumImg} className="artist-img" alt={`Artist ${song.id}`} />
                  <div>
                    <h1 className="text-box"><b>{song.songName}</b></h1>
                    <h2 className="text-box"><b>Artist:</b> {song.mainArtistName}</h2>
                    <h3 className="text-box"><b>Album: </b>{song.albumName}</h3>
                    
                    <h5 className="text-box">Release Date: {formatDate(song.release_date)}</h5>
                  </div>
                  <AddIcon className="add-song-icon" style={{ fontSize: '40px' }} onClick={() => handleAddSong(song)} />
                </div>
              ))
            );
              }
          case "artist-ratings":
            if(artists.length === 0 && !isLoading){
              return(<div className="recommendation-container" style={recommendationContainerStyle}>
                        <SentimentVeryDissatisfiedIcon style={{ fontSize: '100px', margin: '15 auto', display: 'block' }} />
                        <div className="text1">Unfortunately, We Can't Help You</div>
                        <div className="underline1"></div>
                        <p className="recommendation-message1">
                          No artist is rated high enough to get recommendation. You need to rate at least one artist using a rating value greater or equal to 4.
                        </p>
                     </div>
                    );
            }
            else{
            return (
              artists.map((song) => (
                <div key={song._id} className="song-box1">
                  
                  
    
                  <img src={song.albumImg} className="artist-img" alt={`Artist ${song.id}`} />
                  <div>
                    <h1 className="text-box"><b>{song.songName}</b></h1>
                    <h2 className="text-box"><b>Artist:</b> {song.mainArtistName}</h2>
                    <h3 className="text-box"><b>Album: </b>{song.albumName}</h3>
                    
                    <h5 className="text-box">Release Date: {formatDate(song.release_date)}</h5>
                  </div>
                  <AddIcon className="add-song-icon" style={{ fontSize: '40px' }} onClick={() => handleAddSong(song)} />
                </div>
              ))
              
            );
          }
            case "album-ratings":
              if(albums.length === 0 && !isLoading){
                return(<div className="recommendation-container" style={recommendationContainerStyle}>
                          <SentimentVeryDissatisfiedIcon style={{ fontSize: '100px', margin: '15 auto', display: 'block' }} />
                          <div className="text1">Unfortunately, We Can't Help You</div>
                          <div className="underline1"></div>
                          <p className="recommendation-message1">
                            No album is rated high enough to get recommendation. You need to rate at least one album using a rating value greater or equal to 4.
                          </p>
                       </div>
                      );
              }
              else{
                return(
                    albums.map((song) => (
                        <div key={song._id} className="song-box1">
                          
                          
            
                          <img src={song.albumImg} className="artist-img" alt={`Artist ${song.id}`} />
                          <div>
                            <h1 className="text-box"><b>{song.songName}</b></h1>
                            <h2 className="text-box"><b>Artist:</b> {song.mainArtistName}</h2>
                            <h3 className="text-box"><b>Album: </b>{song.albumName}</h3>
                            
                            <h5 className="text-box">Release Date: {formatDate(song.release_date)}</h5>
                          </div>
                          <AddIcon className="add-song-icon" style={{ fontSize: '40px' }} onClick={() => handleAddSong(song)} />
                        </div>
                      ))
                );
                    }

            case "spotify-recommendations":
              if(songs.length === 0 && !isLoading){
                return(<div className="recommendation-container" style={recommendationContainerStyle}>
                          <SentimentVeryDissatisfiedIcon style={{ fontSize: '100px', margin: '15 auto', display: 'block' }} />
                          <div className="text1">Unfortunately, We Can't Help You</div>
                          <div className="underline1"></div>
                          <p className="recommendation-message1">
                            No song is rated high enough to get you a recommendation Spotify. You need to rate at least one song using a rating value greater or equal to 4.
                          </p>
                       </div>
                      );
              }
              else{
                return(
                  spotify.map((song) => (
                    <div key={song._id} className="song-box1">
                      
                      
        
                      <img src={song.albumImg} className="artist-img" alt={`Artist ${song.id}`} />
                      <div>
                        <h1 className="text-box"><b>{song.songName}</b></h1>
                        <h2 className="text-box"><b>Artist:</b> {song.mainArtistName}</h2>
                        <h3 className="text-box"><b>Album: </b>{song.albumName}</h3>
                        
                        <h5 className="text-box">Release Date: {formatDate(song.release_date)}</h5>
                      </div>
                      <AddIcon className="add-song-icon" style={{ fontSize: '40px' }} onClick={() => handleAddSong(song)} />
                    </div>
                  ))
                );
                  }

              case "temporal-values":
                
                  if(temporal.length === 0 && !isLoading){
                    return(
                           <div className="recommendation-container" style={recommendationContainerStyle}>
                              <SentimentVeryDissatisfiedIcon style={{ fontSize: '100px', margin: '15 auto', display: 'block' }} />
                              <div className="text1">Unfortunately, We Can't Help You</div>
                              <div className="underline1"></div>
                              <p className="recommendation-message1">
                                You don't have any temporal values yet!
                              </p>
                           </div>
                          );
                  }
                  else{
                    return(
                      <div key={temporal.songName} className="song-box1">
                          <img src={temporal.albumImg} className="artist-img" alt={`Artist ${temporal.mainArtistName}`} />
                          <div>
                              <h1 className="text-box"><b>{temporal.songName}</b></h1>
                              <h2 className="text-box"><b>Artist:</b> {temporal.mainArtistName}</h2>
                              <h3 className="text-box"><b>Album: </b>{temporal.albumName}</h3>
                              <h5 className="text-box">Release Date: {formatDate(temporal.release_date)}</h5>
                          </div>
                          <AddIcon className="add-song-icon" style={{ fontSize: '40px' }} onClick={() => handleAddSong(temporal)} />
                      </div>
                    );
                  }
                case "friend-activity":
                  if(friends.length === 0 && !isLoading){
                    return(<div className="recommendation-container" style={recommendationContainerStyle}>
                              <SentimentVeryDissatisfiedIcon style={{ fontSize: '100px', margin: '15 auto', display: 'block' }} />
                              <div className="text1">Unfortunately, We Can't Help You</div>
                              <div className="underline1"></div>
                              <p className="recommendation-message1">
                                You don't have any friend activity recently!
                              </p>
                           </div>
                          );
                  }
                  else{
                  return (

                    friends.map(({ recommendedBy, recommendedSong }) => (
                      <div key={recommendedSong._id} className="song-box1">
                        <img src={recommendedSong.albumImg} className="artist-img" alt={`Album cover for ${recommendedSong.albumName}`} />
                        <div>
                          <h1 className="text-box"><b>{recommendedSong.songName}</b></h1>
                          <h2 className="text-box"><b>Artist:</b> {recommendedSong.mainArtistName}</h2>
                          <h3 className="text-box"><b>Album: </b>{recommendedSong.albumName}</h3>
                          <h5 className="text-box">Release Date: {formatDate(recommendedSong.release_date)}</h5>
                          <h5 className="text-box">Recommended by: {recommendedBy}</h5>
                        </div>
                        <AddIcon className="add-song-icon" style={{ fontSize: '40px' }} onClick={() => handleAddSong(recommendedSong)} />
                      </div>
                    ))
                  );
                
                
                 }
                

          // Add more cases for other recommendation types
          default:
            return (
              <div className="recommendation-container" style={submissionContainerStyle}>
                <div className="text1">Welcome to Our Song Recommendation Service</div>
                <div className="underline1"></div>

                <p className="recommendation-message1">
                  Welcome to our Song Recommendation Service! We're here to help you discover new music!
                  
                </p>
                <div className="underline1"></div>
                <p className="instruction-text">Select your way of adding songs with button above:</p>
              </div>
            );;
        }
    };

    return (
        <div className="recommendation">
            <Navbar2 sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setSearch={setSearch} />
            <Sidebar isOpen={sidebarOpen} />

            <div className="dropdown-container1">
                <ReactSelect
                    styles={customStyles}
                    options={recommendationOptions}
                    value={recommendationOptions.find(option => option.value === recommendationType)}
                    onChange={(selectedOption) => setRecommendationType(selectedOption.value)}
                    onMenuOpen={handleDropdownOpen}
                    onMenuClose={handleDropdownClose}
                    placeholder="Select Recommendation Type"
                    theme={(theme) => ({
                    ...theme,
                    borderRadius: 10,
                    colors: {
                        ...theme.colors,
                        primary25: 'grey', // color when option is focused
                        primary: 'black', // border color when focused
                    },
                    })}
                />
                
            </div>
            {isLoading && <CircularProgress className="recommendation-loading" style={{ color: 'white' }} />}
            {/* Render the selected recommendation container */}
            {renderRecommendationContainer()}
        </div>
    )
}

export default Recommendation;
