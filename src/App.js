import "./App.css";
import Signup from "./Components/LoginSignup/Signup";
import Main from "./Components/Main/Main";
import Login from "./Components/LoginSignup/Login";
import Dashboard from "./Components/Dashboard/Dashboard";
import React, { useState } from "react";
import SubmissionPage from "./Components/Submission/Submission";
import MySongs from "./Components/MySongs/MySongs";
import MyArtists from "./Components/MyArtists/MyArtists";
import MyAlbums from "./Components/MyAlbums/MyAlbums";
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
        <Route path="/songs" element={<MySongs />} />
        <Route path="/login" element={<Login showLogin={true} />} />
        <Route path="/signup" element={<Signup showLogin={false} />} />
        <Route path="/artists" element={<MyArtists />} />
        <Route path="/albums" element={<MyAlbums />} />
      </Routes>
    </Router>
  );
};

export default App;
