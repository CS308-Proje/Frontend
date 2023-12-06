import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import UserIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import LogoImage from "../Assets/logo-white.png";
import Sidebar from "../Sidebar/Sidebar";
import './Friends.css'; // Assuming you have similar styles defined as in MyAlbums.css
import LogoutIcon from '@mui/icons-material/Logout'; // Import Logout icon
import { useAuth } from '../Authentication/Auth';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import Tooltip from '@mui/material/Tooltip';
import Navbar2 from "../Navbar2/Navbar2"

const Friends = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [search, setSearch] = useState("");

  const [friends, setFriends] = useState([]); // Changed from setUsername to setFriends
  const [username, setUsername] = useState(''); // Changed from setFriendName to setUsername

  const [invitations, setInvitations] = useState([]);


  useEffect(() => {
    fetch("http://localhost:5001/invitation/getallinv")
      .then(response => response.json())
      .then(data => {
        console.log('Fetched invitations:', data.invitations); // Check the fetched data
        setInvitations(data.invitations || []); // Set state with fetched data or empty array
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
        setInvitations([]); // Fallback to an empty array on error
        console.log('Invitations state:', invitations); 
      });
  }, []);
  

  const acceptInvitation = (_id) => {
    const invitation = invitations.find(inv => inv._id === _id);
    if (invitation) {
      // Adjust the logic here based on how you want to handle accepted invitations
      setFriends([...friends, { id: invitation._id, name: 'Invited User', isActive: false }]);
      setInvitations(invitations.filter(inv => inv._id !== _id));
    }
  };
  
  const rejectInvitation = (_id) => {
    setInvitations(invitations.filter(inv => inv._id !== _id));
  };
  

  const toggleFriendActive = (id) => {
    setFriends(friends.map(friend => {
      if (friend.id === id) {
        return { ...friend, isActive: !friend.isActive };
      }
      return friend;
    }));
  };


  const handleInputChange = (event) => {
    setUsername(event.target.value); 
  };

  const removeFriend = (id) => {
    setFriends(friends.filter(friend => friend.id !== id));
  };
  

  const handleSubmit = () => {
    // Check if the username is not empty and not already in the friends list
    if (username && !friends.some(friend => friend.name === username)) {
      // Create a new friend object
      const newFriend = {
        id: friends.length + 1, // Just a simple incrementing ID, you might want to use something like UUID in a real app
        name: username,
        isActive: false
      };

      // Add the new friend to the friends array
      setFriends([...friends, newFriend]);

      // Clear the input field after adding
      setUsername('');
    }
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
      <Navbar2 sidebarOpen = {sidebarOpen} setSidebarOpen={setSidebarOpen} setSearch={setSearch}/>
      <Sidebar isOpen={sidebarOpen} />

      <main className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
      <div className="content-container">
        
        <div className="friends-container">
        <h2 className="friends-heading">Add a New Friend</h2>
          <input
            type="text"
            value={username}
            onChange={handleInputChange}
            placeholder="Enter your friend's username"
            className="add-friend-input"
          />
          <button onClick={handleSubmit} className="add-friend-button">
            Add Friend
          </button>


                  <div className="friends-list">
            {friends.length === 0 ? (
              <div className="no-friends-message">
                <h2>No friends added yet!</h2>
                <p>Add a new friend using the input above.</p>
              </div>
            ) : (
              friends.map((friend) => (
                <div key={friend.id} className="friend-box">
                  <h1 className="text-box">{friend.name}</h1>
                  <div className="friend-actions">
                    <Tooltip title={friend.isActive ? "Deactivate Recommendation" : "Activate Recommendation"}>
                      {friend.isActive ? (
                        <ToggleOnIcon
                          style={{ fontSize: '4rem' }} // Adjust the size as needed
                          className="toggle-friend-btn active"
                          onClick={() => toggleFriendActive(friend.id)}
                        />
                      ) : (
                        <ToggleOffIcon
                          style={{ fontSize: '4rem' }} // Adjust the size as needed
                          className="toggle-friend-btn"
                          onClick={() => toggleFriendActive(friend.id)}
                        />
                      )}
                    </Tooltip>
                    <Tooltip title="Remove Friend">
                      <button
                        onClick={() => removeFriend(friend.id)}
                        className="remove-friend-btn"
                        aria-label="Remove friend"
                      >
                        <PersonRemoveIcon />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              ))
            )}
          </div>
          
        </div>

        <div className="invitations-container">
        <h2 className="invitations-heading">Incoming Friend Invitations</h2>
        {invitations && invitations.length === 0 ? (
          <p className="no-invitations-message">No incoming invitations.</p>
        ) : (
          <div className="invitations-list">
  {invitations.map((invitation) => (
    <div key={invitation._id} className="invitation-box">
      <span className="invitation-text">Invitation from User ID: {invitation.user_id}</span>
      <div className="invitation-actions">
        <button onClick={() => acceptInvitation(invitation._id)} className="invitation-accept-btn">
          Accept
        </button>
        <button onClick={() => rejectInvitation(invitation._id)} className="invitation-reject-btn">
          Reject
        </button>
      </div>
    </div>
  ))}
</div>

            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Friends;
