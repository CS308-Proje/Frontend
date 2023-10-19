import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from "../Assets/logo-white.png";

const Navbar = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <nav>
      <Link to="/">
        <img src={logo} alt="Logo" className="logo" />
      </Link>
      <ul>
        {isLoginPage ? null : (
          <>
           <li>
            <a href="/login" className="button">Log in</a>
          </li>
          <li>
            <a href="/signup" className="button gray">Sign Up</a>
          </li>

          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
