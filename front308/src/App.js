import "./App.css";
import LoginSignup from "./Components/LoginSignup/LoginSignup";
import Main from "./Components/Main/Main";
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
        <Route path="/login" element={<LoginSignup showLogin={true} />} />
        <Route path="/signup" element={<LoginSignup showLogin={false} />} />
      </Routes>
    </Router>
  );
};

export default App;
