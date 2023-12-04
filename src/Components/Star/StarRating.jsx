import React, { useState } from 'react';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
// No need to import StarHalfIcon since it is not used in this logic

const StarRating = ({ initialRating, onRating }) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(undefined);

  // Modified handleClick function to reset to 0 if the same rating is clicked
  const handleClick = (value) => {
    const newRating = rating === value ? 0 : value;
    setRating(newRating);
    onRating(newRating);
  };

  const handleMouseOver = (value) => {
    setHover(value);
  };

  const handleMouseLeave = () => {
    setHover(undefined);
  };

  return (
    <div className="star-rating">
      <span><b>Rating: </b></span>
      {[1, 2, 3, 4, 5].map((index) => {
        const fill = hover !== undefined ? index <= hover : index <= rating;

        return fill ? (
          <StarIcon
            key={index}
            className={`star filled`}
            onMouseOver={() => handleMouseOver(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
          />
        ) : (
          <StarOutlineIcon
            key={index}
            className='star'
            onMouseOver={() => handleMouseOver(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
