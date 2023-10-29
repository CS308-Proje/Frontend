import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from "../Assets/logo-white.png";

const Navbar = () => {
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";
  const isSignUpPage = location.pathname === "/signup";
  const isDashboard = location.pathname === "/dashboard";

  // Conditionally render the Navbar only if not on the dashboard page
  if (isDashboard) {
    return null; // Don't render the Navbar
  }

  return (
    <nav>
      <Link to="/">
        <img src={logo} alt="Logo" className="logo" />
      </Link>
      <ul>
        {!isLoginPage && (
          <li>
            <Link to="/login" className={`button ${isSignUpPage ? "gray" : ""}`}>Log in</Link>
          </li>
        )}
        {!isSignUpPage && (
          <li>
            <Link to="/signup" className="button gray">Sign Up</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
