import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Navbar2 from '../Navbar2/Navbar2';
import UpdateUser from '../UpdateUser/UpdateUser'; // Adjust the path as necessary
import './AdminPage.css';

const AdminPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [showUpdateScreen, setShowUpdateScreen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5001/users', {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.success) {
          setUsers(data.users);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleUpdateClick = (user) => {
    setSelectedUser(user);
    setShowUpdateScreen(true);
  };

  const handleUpdate = (updatedUser) => {
    setShowUpdateScreen(false);
  };

  const handleClose = () => {
    setShowUpdateScreen(false);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5001/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Remove the user from the state
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className='AdminPage'>
      <Navbar2 sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar isOpen={sidebarOpen} />

      <main className={`main-content ${sidebarOpen ? 'shifted' : ''}`}>
        {users.map(user => (
          <div key={user._id} className='user-box'>
            <button id="delete-user-btn" onClick={() => handleDeleteUser(user._id)}>X</button>
            <button id="update-user-btn" onClick={() => handleUpdateClick(user)}>Update</button>
            <h1>Name: <b>{user.name}</b></h1>
            <h2>Username: <b>{user.username}</b></h2>
            <h3>Email: <b>{user.email}</b></h3>
            <h4>Role: <b>{user.role}</b></h4>
          </div>
        ))}
      </main>
      <div className={`modal-backdrop ${showUpdateScreen ? 'show-backdrop' : ''}`}></div>
      {showUpdateScreen && (
        <UpdateUser
          user={selectedUser}
          onClose={handleClose}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default AdminPage;
