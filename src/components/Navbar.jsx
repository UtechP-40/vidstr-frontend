import React, { useState, useEffect, useRef } from "react";
import { ModeToggle } from "./mode-toogle";
import { Button } from "./ui/button";
import { useNavigate, Link } from "react-router-dom";
import { logo } from "../utils/constants";
import SearchBar from "./SearchBar";
import { FaBars, FaUserCircle, FaEllipsisV, FaBell, FaUpload } from "react-icons/fa";
import Menu1 from "./Menu1";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { useSelector } from "react-redux";
import ProfileMenu from "./ProfileMenu";
import Notification from "./Notifications";

function Navbar() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [showMenu, setShowMenu] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
        setShowProfileMenu(false);
        setShowNotification(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };

  const handleSignInClick = () => {
    setShowSignIn(true);
  };

  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 py-2 bg-background border-b border-border sticky top-0 z-40">
      {/* Left - Menu & Logo */}
      <div className="flex items-center gap-4">
        {/* <button className="p-2 hover:bg-accent rounded-full transition-colors" onClick={toggleSidebar}>
          <FaBars className="text-foreground text-xl" />
        </button> */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="logo" className="h-6 sm:h-8 w-auto" />
        </Link>
      </div>

      {/* Center - Search Bar */}
      <div className="flex-1 max-w-2xl mx-4 hidden sm:block">
        <SearchBar />
      </div>

      {/* Right - User Actions */}
      <div className="flex items-center gap-3 relative" ref={menuRef}>
       {!user && (<button 
          className="p-2 hover:bg-accent rounded-full transition-colors hover:cursor-pointer"
          onClick={toggleMenu}
        >
          <FaEllipsisV className="text-foreground" />
        </button>)}
        {showMenu && (
          <div className="absolute top-full right-0 mt-2 z-50">
            <Menu1 />
          </div>
        )}
        {!user ? (
          <Button
            onClick={handleSignInClick}
            variant="primary"
            className="flex items-center gap-2 px-4 py-1.5 rounded-full hover:cursor-pointer"
          >
            <FaUserCircle className="text-xl" />
            Sign In
          </Button>
        ) : (
          <>
            <button 
              className="p-2 hover:bg-accent rounded-full transition-colors group relative"
              title="Upload" onClick={()=>navigate("/upload")}
            >
              <FaUpload className="text-foreground text-xl" />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-background border border-border px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Upload
              </span>
            </button>
            <button 
        className="p-2 hover:bg-accent rounded-full transition-colors group relative"
        title="Notifications"
        onClick={toggleNotification}
      >
        <FaBell className="text-foreground text-xl" />
        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-background border border-border px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Notifications
        </span>
      </button>
      {showNotification && (
        <div className="absolute top-12 right-0 mt-2 w-80 max-h-[480px] overflow-y-auto bg-background border border-border rounded-lg shadow-lg z-50">
          <Notification />
        </div>
      )}
            <button 
              className="p-2 hover:bg-accent rounded-full transition-colors group relative"
              title="Profile"
              onClick={toggleProfileMenu}
            >
              <img 
                src={user.avatar} 
                alt="User avatar" 
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";
                }}
              />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-background border border-border px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Profile
              </span>
            </button>
            {showProfileMenu && (
              <div className="absolute top-full right-0 mt-2 z-50">
                <ProfileMenu />
              </div>
            )}
          </>
        )}
      </div>

      {showSignIn && (
        <SignIn 
          onClose={() => setShowSignIn(false)} 
          showSignUp={() => {
            setShowSignUp(true);
            setShowSignIn(false);
          }}
        />
      )}
      
      {showSignUp && (
        <SignUp 
          onClose={() => setShowSignUp(false)}
          showSignIn={() => {
            setShowSignIn(true);
            setShowSignUp(false);
          }}
        />
      )}
    </nav>
  );
}

export default Navbar;
