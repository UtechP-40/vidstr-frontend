import React from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaHome, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useSelector } from "react-redux";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useSelector((state) => state.user);

  return (
    <nav id="sidebar" className={!isOpen ? 'close' : ''}>
      <ul>
        <li>
          {isOpen && <span className="logo">VidStr</span>}
          <button onClick={toggleSidebar} id="toggle-btn">
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </li>

        <li className="active">
          <Link to="/">
            <FaHome />
            {isOpen && <span>Home</span>}
          </Link>
        </li>

        {user && (
          <li>
            <Link to="/profile">
              <FaUser />
              {isOpen && <span>Profile</span>}
            </Link>
          </li>
        )}

        <li>
          <Link to="/settings">
            <FaCog />
            {isOpen && <span>Settings</span>}
          </Link>
        </li>

        <li>
          {user ? (
            <button className="dropdown-btn">
              <FaSignOutAlt />
              {isOpen && <span>Logout</span>}
            </button>
          ) : (
            <Link to="/login">
              <FaUser />
              {isOpen && <span>Login</span>}
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;