import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import UserIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import LogoImage from "../Assets/logo-white.png";
import Sidebar from "../Sidebar/Sidebar";
import './Friends.css'; // Assuming you have similar styles defined as in MyAlbums.css
import LogoutIcon from '@mui/icons-material/Logout'; // Import Logout icon
import { useAuth } from '../Authentication/Auth';

const Friends = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [friends, setFriends] = useState([]);
  const [friendName, setFriendName] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [search, setSearch] = useState("");

  const handleInputChange = (event) => {
    setFriendName(event.target.value);
  };

    // Navigate to profile page
    const navigateToProfile = () => {
      navigate("/friends");
    };
  

  
    // Handle search input
    const handleSearch = (event) => {
      console.log("Searching for:", event.target.value);
      setSearch(event.target.value);
    };

  const handleSubmit = () => {
    // Logic to add a friend
    // For simplicity, we are using a local state to store friends
    const newFriend = { id: friends.length, name: friendName };
    setFriends([...friends, newFriend]);
    setFriendName(''); // Reset input field after submission
  };

  // Sign out function
  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  // Navigate to profile page
  const navigateToFriends = () => {
    navigate("/friends"); // Adjust the route as necessary
  };

  // Navigate to dashboard
  const navigateToDashboard = () => {
    navigate("/dashboard");
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

        <button className="logout-btn" onClick={handleSignOut}>
          <LogoutIcon className="logout-icon" style={{ fontSize: 38 }} />
        </button>

      </nav>
      <Sidebar isOpen={sidebarOpen} />

      <main className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
        <div className="friends-container">
          <input
            type="text"
            value={friendName}
            onChange={handleInputChange}
            placeholder="Add friend"
            className="add-friend-input"
          />
          <button onClick={handleSubmit} className="add-friend-button">
            Add Friend
          </button>

          {/* Here you will render the list of friends */}
          <div className="friends-list">
            {/* Display message if no friends added yet */}
            {friends.length === 0 ? (
              <div className="no-friends-message">
                <h2>No friends added yet!</h2>
                <p>Add a new friend using the input above.</p>
              </div>
            ) : (
              friends.map((friend) => (
                <div key={friend.id} className="friend-box">
                  <h1 className="text-box">{friend.name}</h1>
                  {/* Add other friend details here */}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Friends;
