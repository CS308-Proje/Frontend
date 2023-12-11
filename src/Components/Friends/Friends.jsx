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
  const [friendRemoved, setFriendRemoved] = useState(false);
  const [allowFriendRecommendations, setAllowFriendRecommendations] = useState([]);

  const [friends, setFriends] = useState([]); // Changed from setUsername to setFriends
  const [username, setUsername] = useState(''); // Changed from setFriendName to setUsername

  const [invitations, setInvitations] = useState([]);
  const [invitationChanged, setInvitationChanged] = useState(false);

  const [userId, setUserId] = useState('');

  

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const response = await fetch('http://localhost:5001/invitation/getallinv', {
          method: 'GET',
          credentials: 'include', 
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setInvitations(data.invitations || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setInvitations([]);
      }
    };
  
    const fetchFriends = async () => {
      try {
        const response = await fetch('http://localhost:5001/friends/all', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setFriends(data.friends || []);
      } catch (error) {
        console.error('Error fetching friends:', error);
        setFriends([]);
      }
    };
  
    const fetchAllowFriendRecommendations = async () => {
      try {
        const response = await fetch('http://localhost:5001/auth/me', {
          method: 'GET',
          credentials: 'include', 
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success && data.data.allowFriendRecommendations) {
          setAllowFriendRecommendations(data.data.allowFriendRecommendations);
          setUserId(data.data._id);
        }
      } catch (error) {
        console.error('Error fetching allowFriendRecommendations:', error);
      }
    };
  
    fetchInvitations();
    fetchFriends();
    fetchAllowFriendRecommendations();
  
    if (friendRemoved) {
      fetchFriends(); // Refetch friends if a friend has been removed
      setFriendRemoved(false); // Reset the state
    }
  
    if (invitationChanged) {
      fetchInvitations(); // Refetch invitations if there's a change
      setInvitationChanged(false);
    }
  
  }, [friendRemoved, invitationChanged]);
  
  
  
  
  const acceptInvitation = async (invitationId) => {
    try {
      const response = await fetch(`http://localhost:5001/invitation/update/${invitationId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId, status: "accepted" })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      setInvitations(prevInvitations => prevInvitations.filter(invitation => invitation._id !== invitationId));
      setInvitationChanged(true);
      const newFriendData = await response.json();
      if (newFriendData && newFriendData.newFriend) {
        setFriends(prevFriends => [...prevFriends, newFriendData.newFriend]);
      }
  
    } catch (error) {
      console.error('Error accepting invitation:', error);
    }
  };
  
  
  
  const rejectInvitation = async (invitationId) => {
    try {
      const response = await fetch(`http://localhost:5001/invitation/update/${invitationId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId, status: "rejected" })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Remove the rejected invitation from the invitations array
      setInvitations(prevInvitations => prevInvitations.filter(invitation => invitation._id !== invitationId));
      console.log(`Invitation with ID ${invitationId} rejected.`);
    } catch (error) {
      console.error('Error rejecting invitation:', error);
    }
  };

  
  const toggleFriendActive = async (id, isActive) => {

    if (isActive) {
      setAllowFriendRecommendations(current => current.filter(friendId => friendId !== id));
    } else {
      setAllowFriendRecommendations(current => [...current, id]);
    }
    
    // Update the local state first
    setFriends(friends.map(friend => {
      if (friend._id === id) {
        return { ...friend, isActive: !isActive };
      }
      return friend;
    }));
  
    const endpoint = isActive ? `disallowfriend/${id}` : `allowfriend/${id}`;
    
    // Make API call to update friend's status on the server
    try {
      const response = await fetch(`http://localhost:5001/friends/${endpoint}`, {
        method: 'POST', // Or the appropriate method for your endpoint
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Handle the response here
      const data = await response.json();
      console.log('Friend status updated:', data);
    } catch (error) {
      console.error('Error updating friend status:', error);
      
      // Revert the state change if the API call failed
      setFriends(friends.map(friend => {
        if (friend._id === id) {
          return { ...friend, isActive: isActive };
        }
        return friend;
      }));
    }
  };


  const handleInputChange = (event) => {
    setUsername(event.target.value); 
  };

  const removeFriend = async (friendId) => {

    try {
      const response = await fetch(`http://localhost:5001/friends/remove/${friendId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      setFriends(prevFriends => prevFriends.filter(friend => friend.id !== friendId));
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      if (data.success) {
        // Update state only if the API call was successful
        setFriends(prevFriends => prevFriends.filter(friend => friend.id !== friendId));
        console.log(`Friend with ID ${friendId} removed.`);
      } else {
        console.error('Error removing friend:', data.message);
      }
    } catch (error) {
      console.error('Error removing friend:', error);
    }
    setFriendRemoved(true);
  };
  
  

  const handleSubmit = async () => {

    // Check if the username is not empty and not already in the friends list
    if (username && !friends.some(friend => friend.name === username)) {
      try {
        // Send an invitation to the target user
        const targetUserId = username; // Assuming username is the target user ID
        const response = await fetch(`http://localhost:5001/invitation/createInvitation/${targetUserId}`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        // Invitation sent successfully
        console.log(`Invitation sent to user ${targetUserId}`);
  
        // You can update the UI to show that the invitation is sent here if needed
  
      } catch (error) {
        console.error('Error sending invitation:', error);
        return;
      }
  
      // Clear the input field after sending the invitation
      setUsername('');
    }
  };
  

  
    // Handle search input
    const handleSearch = (event) => {
      console.log("Searching for:", event.target.value);
      setSearch(event.target.value);
    };






  return (
    <div className="Dashboard">
      <Navbar2 sidebarOpen = {sidebarOpen} setSidebarOpen={setSidebarOpen} setSearch={setSearch}/>
      <Sidebar isOpen={sidebarOpen} />

      <main className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
      <div className="content-container">
        
        <div className="friends-container">
        <h2 className="friends-heading">Add a New Friend</h2>
        {userId && <p>Your ID: {userId}</p>}
          <input
            type="text"
            value={username}
            onChange={handleInputChange}
            placeholder="Enter your friend's ID"
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
                      {allowFriendRecommendations.includes(friend._id) ? (
                        <ToggleOnIcon
                          style={{ fontSize: '4rem' }} // Adjust the size as needed
                          className="toggle-friend-btn active"
                          onClick={() => toggleFriendActive(friend._id, true)}
                        />
                      ) : (
                        <ToggleOffIcon
                          style={{ fontSize: '4rem' }} // Adjust the size as needed
                          className="toggle-friend-btn"
                          onClick={() => toggleFriendActive(friend._id, false)}
                        />
                      )}
                    </Tooltip>
                    <Tooltip title="Remove Friend">
                      <button
                        onClick={() => removeFriend(friend._id)}
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
      <span className="invitation-text">Invitation from User ID: {invitation.user_id.username}</span>
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
