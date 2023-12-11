import React, { useState } from 'react';

function HeaderIcon({ inactiveIcon, activeIcon, className, style, onClick }) {
  const [isActive, setIsActive] = useState(false);

  // Enhanced click handler to manage the active state and invoke parent's onClick
  const handleClick = () => {
    setIsActive(!isActive);
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className={className} style={style} onClick={handleClick}>
      {isActive ? activeIcon : inactiveIcon}
    </div>
  );
}

export default HeaderIcon;
