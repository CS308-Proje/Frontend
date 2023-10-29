import React from 'react';
import "./Dashboard.css";
import Sidebar from "../Sidebar/Sidebar";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        {/* Content of your dashboard goes here */}
      </div>
    </div>
  );
}

export default Dashboard;
