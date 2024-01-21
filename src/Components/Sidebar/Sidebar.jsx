import React, { useState, useEffect } from 'react';
import { Sidebardata } from "./Sidebardata";

function Sidebar({ isOpen }) {

  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5001/auth/me',{
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.success && data.data.role) {
          setUserRole(data.data.role);

        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const filteredSidebarData = userRole === 'admin' ? Sidebardata : Sidebardata.filter(item => !item.adminOnly);

  return (
    <div className={`Sidebar ${isOpen ? "open" : ""}`}>
      <ul className='SidebarList'>
      {filteredSidebarData.map((val, key) => {
        return (
          <li className='row' key={key} onClick={() => { window.location.pathname = val.link }}>
            <div>{val.icon}</div>
            <div>{val.title}</div>
          </li>
        );
      })}
      </ul>
    </div>
  );
}

export default Sidebar;
