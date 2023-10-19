import "./App.css";
import LoginSignup from "./Components/LoginSignup/LoginSignup";
import Main from "./Components/Main/Main";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";

const App = () => {
  return (
    <Router>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<LoginSignup />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
