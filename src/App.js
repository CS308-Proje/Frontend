import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Main from "./Components/Main/Main";
import Dashboard from "./Components/Dashboard/Dashboard";
import AddSongs from "./Components/AddSongs/AddSongs";
import MySongs from "./Components/MySongs/MySongs";
import MyArtists from "./Components/MyArtists/MyArtists";
import MyAlbums from "./Components/MyAlbums/MyAlbums";
import Login from "./Components/LoginSignup/Login";
import Signup from "./Components/LoginSignup/Signup";
import Friends from "./Components/Friends/Friends";
import Recommendations from "./Components/Recommendations/Recommendation";
import { useAuth, AuthProvider } from "./Components/Authentication/Auth";
import Analysis from "./Components/Analysis/Analysis";
import ForgotPassword from "./Components/LoginSignup/ForgotPassword";
import ResetPassword from './Components/ResetPassword/ResetPassword';
import ExportSongs from "./Components/ExportSongs/ExportSongs";
import AdminPage from "./Components/AdminPage/AdminPage";
import AdminSongPage from "./Components/AdminPage/AdminSongPage";
// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, userRole } = useAuth();
  
  if (!isLoggedIn) {
    // Redirect to the login page if not logged in
    return <Navigate to="/" />;
  }

  return children;
};

const AdminProtectedRoute = ({ children }) => {
  const { isLoggedIn, userRole, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or some other loading indicator
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (userRole !== 'admin') {
    console.log(userRole);
    return <Navigate to="/dashboard" />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/auth/resetpassword/:token" element={<ResetPassword />} />
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addsongs"
            element={
              <ProtectedRoute>
                <AddSongs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/songs"
            element={
              <ProtectedRoute>
                <MySongs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/artists"
            element={
              <ProtectedRoute>
                <MyArtists />
              </ProtectedRoute>
            }
          />
          <Route
            path="/albums"
            element={
              <ProtectedRoute>
                <MyAlbums />
              </ProtectedRoute>
            }
          />
          <Route
            path="/friends"
            element={
              <ProtectedRoute>
                <Friends />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommendations"
            element={
              <ProtectedRoute>
                <Recommendations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analysis"
            element={
              <ProtectedRoute>
                <Analysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/export"
            element={
              <ProtectedRoute>
                <ExportSongs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminpage"
            element={
              <AdminProtectedRoute>
                <AdminPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/adminsongpage"
            element={
              <AdminProtectedRoute>
                <AdminSongPage />
              </AdminProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
