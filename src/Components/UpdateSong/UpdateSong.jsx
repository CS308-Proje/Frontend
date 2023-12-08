import React, { useState } from 'react';
import StarRating from '../Star/StarRating';
import CloseIcon from '@mui/icons-material/Close';

const UpdateSong = ({ song, onClose, onUpdate }) => {
  const [songData, setSongData] = useState(song);
  const [editImage, setEditImage] = useState(false); // New state to control image editing

  const handleInputChange = (event) => {
    setSongData({ ...songData, [event.target.name]: event.target.value });
  };

  const handleRatingChange = (newRating) => {
    setSongData({ ...songData, ratingValue: newRating });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onUpdate(songData);
  };

  const handleImageClick = () => {
    setEditImage(true); // Show input field when image is clicked
  };

  const handleCloseEdit = () => {
    setEditImage(false);
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="update-song-modal">
      <form onSubmit={handleSubmit}>
      {editImage ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '10px' }}>Edit Album Image:</span>
            <input
              type="text"
              name="albumImg"
              value={songData.albumImg}
              onChange={handleInputChange}
              style={{ flex: 1 }}
            />

              <CloseIcon
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
               type="button"
              onClick={() => setEditImage(false)}  fontSize="small" style={{ 
                fontSize: '24px',
                margin: '0 10px', // Add margin
                alignSelf: 'center',
                transform: isHovered ? 'scale(1.5)' : 'scale(1)',
                transition: 'transform 0.2s', // Align vertically in flex container
                cursor:'pointer'
              }}/> {/* Use "inherit" to control size via CSS */}


          </div>
        ) : (
          <img
            src={songData.albumImg}
            alt="Album"
            className="album-img"
            onClick={handleImageClick}
            style={{ 
              cursor: 'pointer',
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              borderRadius: '60px',
              marginRight: '15px',
            }}
          />
        )}

      <label>
      Song Name:
      <input type="text" name="songName" value={songData.songName} onChange={handleInputChange} />
    </label>

    <label>
      Artist Name:
      <input type="text" name="mainArtistName" value={songData.mainArtistName} onChange={handleInputChange} />
    </label>

    <label>
      Album Name:
      <input type="text" name="albumName" value={songData.albumName} onChange={handleInputChange} />
    </label>


    <label>
      Release Date:
      <input type="date" name="release_date" value={songData.release_date} onChange={handleInputChange} />
    </label>

    <label>
          <StarRating
            initialRating={songData.ratingValue}
            onRating={handleRatingChange}
          />
        </label>

    <button type="submit">Update Song</button>
  </form>
  <button onClick={onClose}>Close</button>
    </div>
  );
};

export default UpdateSong;