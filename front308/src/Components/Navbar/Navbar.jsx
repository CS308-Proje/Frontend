import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from "../Assets/logo-white.png";

const Navbar = () => {
  const location = useLocation();
  const isLoginPageOrSignUpPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <nav>
      <Link to="/">
        <img src={logo} alt="Logo" className="logo" />
      </Link>
      <ul>
        {!isLoginPageOrSignUpPage ? (
          <>
            <li>
              <Link to="/login" className="button">Log in</Link>
            </li>
            <li>
              <Link to="/signup" className="button gray">Sign Up</Link>
            </li>
          </>
        ) : null}
      </ul>
    </nav>
  );
}

export default Navbar;
