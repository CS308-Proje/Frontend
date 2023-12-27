import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../Sidebar/Sidebar';
import Navbar2 from '../Navbar2/Navbar2';

const AdminPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]); // State to store the users
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users when the component mounts
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5001/users',
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.success) {
          setUsers(data.users); // Set the users in state
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const [search, setSearch] = useState("");

  return (
    <div className='AdminPage'>
        <Navbar2 sidebarOpen = {sidebarOpen} setSidebarOpen={setSidebarOpen} setSearch={setSearch}/>

        <Sidebar isOpen={sidebarOpen} />
        <main className={`main-content ${sidebarOpen ? 'shifted' : ''}`}>
            
              {users.map(user => (
                <div key={users._id} className='song-box'>
                  <h1 className="text-box">Name:<b>{user.name}</b></h1>
                  <h2 className="text-box">Username:<b> {user.username}</b></h2>
                  <h3 className="text-box">Email:<b> {user.email}</b></h3>
                  <h4 className="text-box">Role:<b> {user.role}</b></h4>
                  {/* Display other user details as needed */}
                </div>
              ))}
            
        </main>
    </div>
  )
}

export default AdminPage;
