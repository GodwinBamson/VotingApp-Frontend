import { Link, NavLink } from "react-router-dom";
import { IoIosMoon } from "react-icons/io";
import { IoMdSunny } from "react-icons/io";
import { HiOutlineBars3 } from "react-icons/hi2";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [showNav, setShowNav] = useState(
    window.innerWidth < 600 ? false : true
  );
  const [darkTheme, setDarkTheme] = useState(
    localStorage.getItem("voting-app-theme") || ""
  );

  const token = useSelector((state) => state?.vote?.currentVoter?.token);
  // Function to close nav menu on small screens when link is clicked
  const closeNavMenu = () => {
    if (window.innerWidth < 600) {
      setShowNav(false);
    } else {
      setShowNav(true);
    }
  };

  // Function to change toggle Theme
  const changeThemeHandler = () => {
    if (localStorage.getItem("voting-app-theme") == "dark") {
      localStorage.setItem("voting-app-theme", ""); // reset to normal
    } else {
      localStorage.setItem("voting-app-theme", "dark"); // set dark
    }
    setDarkTheme(localStorage.getItem("voting-app-theme"));
  };

  useEffect(() => {
    document.body.className = localStorage.getItem("voting-app-theme");
  }, [darkTheme]);

  return (
    <nav>
      <div className="container nav_container">
        <Link to="/" className="nav_logo">
          FRESH
        </Link>
        <div>
          {token && showNav && (
            <menu>
              <NavLink to="/elections" onClick={closeNavMenu}>
                Elections
              </NavLink>
              <NavLink to="/results" onClick={closeNavMenu}>
                Results
              </NavLink>
              <NavLink to="/logout" onClick={closeNavMenu}>
                Logout
              </NavLink>
            </menu>
          )}
          <button className="theme_toggle-btn" onClick={changeThemeHandler}>
            {darkTheme ? <IoMdSunny /> : <IoIosMoon />}
          </button>
          <button
            className="nav_toggle-btn"
            onClick={() => setShowNav(!showNav)}
          >
            {showNav ? <AiOutlineClose /> : <HiOutlineBars3 />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
