import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Navbar2 from '../Navbar2/Navbar2';
import UpdateUser from '../UpdateUser/UpdateUser'; 
import AddUser from '../AddUser/AddUser';
import './AdminPage.css';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const AdminPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [showUpdateScreen, setShowUpdateScreen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [showAddUserScreen, setShowAddUserScreen] = useState(false);
  const [showRegistrationChart, setShowRegistrationChart] = useState(false);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Registrations per Day',
        data: [],
        backgroundColor: '#8bbe52',
        borderColor: '#8bbe52',
        borderWidth: 1,
      },
    ],
  });

  const fetchRegistrationChartData = async () => {
    try {
      const response = await fetch('http://localhost:5001/admin-chart-user', {
        method: "GET",
        credentials: "include", // If your API requires cookies to be sent
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
  
      if (response.ok && data.success) { // Check if the response is OK and the success flag is true
        const chartLabels = data.countsArray.map(item => item.date);
        const chartCounts = data.countsArray.map(item => item.count);
  
        setChartData({
          labels: chartLabels,
          datasets: [{
            label: 'Registrations per Day',
            data: chartCounts,
            fill: false,
            borderColor: '#8bbe52',
            tension: 0.1
          }]
        });
  
        setShowRegistrationChart(true); // Only show the chart if the data fetch was successful
      } else {
        // Handle errors if the response is not OK or the success flag is false
        console.error('Failed to fetch data:', data);
      }
  
    } catch (error) {
      console.error('Error fetching registration chart data:', error);
    }
  };

  const handleRegistrationChartOpen = () => {
    fetchRegistrationChartData();
    setShowRegistrationChart(true);
  };

  const fetchUsers = async () => {
    try {
      const url = search
        ? `http://localhost:5001/users?username=${search}`
        : `http://localhost:5001/users`;
      const response = await fetch(url, {
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
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const url = search
          ? `http://localhost:5001/users?username=${search}`
          : `http://localhost:5001/users`;
        const response = await fetch(url, {
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
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      }
    };
    fetchUsers();
    if (search) {
      fetchUsers(); // Only fetch users if there is a search query
    } else {
      setUsers([]); // If the search query is empty, reset the users array
    }
  }, [search]); // The effect depends on the 'search' state
  



  const handleUpdateClick = (user) => {
    setSelectedUser(user);
    setShowUpdateScreen(true);
  };

  const handleUpdate = async (updatedUser) => {
    if (selectedUser && updatedUser) {
      await handleUpdateUser(selectedUser._id, updatedUser);
      await fetchUsers(); // Refetch users to update the list
      setShowUpdateScreen(false); // Close the update screen
    }
  };

  const handleClose = () => {
    setShowUpdateScreen(false);
  };

  const handleUpdateUser = async (userId, updatedUserData) => {
    try {
      const response = await fetch(`http://localhost:5001/users/${userId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUserData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.success) {
        // Replace the updated user in the users state
        setUsers(users.map(user => user._id === userId ? { ...user, ...updatedUserData } : user));
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
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

  const handleAddUser = async (newUserData) => {
    try {
      const response = await fetch('http://localhost:5001/users', {
        method: 'POST', // Assuming POST is used to add a new user
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      await fetchUsers(); // Refetch the users list to include the new user
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };
  
  return (
    <div className='AdminPage'>
      <Navbar2 sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setSearch={setSearch}/>
      <Sidebar isOpen={sidebarOpen} />

      <main className={`main-content ${sidebarOpen ? 'shifted' : ''}`}>
      <div className="add-user-container">
      <button id="registration-chart-btn" onClick={handleRegistrationChartOpen}>Registration Chart</button> 
      <button id="add-user-btn" onClick={() => setShowAddUserScreen(true)}>Add User</button>
      </div>
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
          onClose={() => setShowUpdateScreen(false)}
          onUpdate={handleUpdate}
        />
      )}
      <div className={`modal-backdrop ${showAddUserScreen ? 'show-backdrop' : ''}`}></div>
        {showAddUserScreen && (
        <AddUser
          onClose={() => setShowAddUserScreen(false)}
          onAdd={handleAddUser}
        />
      )}
      <div className={`modal-backdrop ${showRegistrationChart ? 'show-backdrop' : ''}`}></div>
        {showRegistrationChart && (
          <div className="registration-chart-modal">
            <Line data={chartData} />
            <button onClick={() => setShowRegistrationChart(false)}>Close</button>
          </div>
        )}
      
    </div>
    
  );
};

export default AdminPage;
