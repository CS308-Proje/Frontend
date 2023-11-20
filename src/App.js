import "./App.css";
import Signup from "./Components/LoginSignup/Signup";
import Main from "./Components/Main/Main";
import Login from "./Components/LoginSignup/Login";
import Dashboard from "./Components/Dashboard/Dashboard";
import React, { useState } from "react";
import SubmissionPage from "./Components/Submission/Submission";
import LikedSongs from "./Components/LikedSongs/LikedSongs";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";

const App = () => {
  return (
    <Router>
      <Navbar isLoginPage={window.location.pathname === "/login"}></Navbar>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/submitmusic" element={<SubmissionPage />} />
        <Route path="/likedsongs" element={<LikedSongs />} />
        <Route path="/login" element={<Login showLogin={true} />} />
        <Route path="/signup" element={<Signup showLogin={false} />} />
      </Routes>
    </Router>
  );
};

export default App;
