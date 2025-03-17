import { useState } from "react";
import { FaSignOutAlt, FaCog, FaQuestionCircle, FaGlobe, FaPalette, FaLanguage, FaExchangeAlt } from "react-icons/fa";
import { useTheme } from "../context/theme.context";
import { useSelector } from "react-redux";

const ProfileMenu = () => {
//   const [isOpen, setIsOpen] = useState(false);
const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";

    const handleThemeChange = () => {
        setTheme(isDark ? "light" : "dark");
    };
// const user = {
//     fullName:"Pradeep Pandey",
//     email:"pradeep2420pradeep@gmail.com",
//     username:"VaibhavSecurities",
//     avatar:"https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?semt=ais_hybrid"
// }
//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };
const {user} = useSelector(state=>state.user)
console.log(user)
  return (
    <div className="relative">
      {/* <button  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-200">
        <img src="https://via.placeholder.com/40" alt="Avatar" className="w-10 h-10 rounded-full" />
        <span className="font-medium">Vaibhav Securities</span>
      </button> */}

        <div className="absolute right-0 mt-2 w-64 bg-background shadow-md rounded-lg p-4 border border-border">
          <div className="flex flex-col items-center mb-4">
            <img src={user.avatar} alt="Avatar" className="w-16 h-16 rounded-full" />
            <p className="font-semibold text-foreground">{user.fullName}</p>
            <p className="text-muted-foreground text-sm">@{user.username}</p>
          </div>

          <div className="space-y-2">
            <button className="w-full flex items-center p-2 rounded-md hover:bg-accent text-foreground">
              <FaExchangeAlt className="mr-2" />
              Switch Account
            </button>
            <button className="w-full flex items-center p-2 rounded-md hover:bg-accent text-foreground">
              <FaSignOutAlt className="mr-2" />
              Sign Out
            </button>
            <hr className="border-border" />

            <button className="w-full flex items-center p-2 rounded-md hover:bg-accent text-foreground" onClick={handleThemeChange}>
              <FaPalette className="mr-2" />
              Appearance: {isDark ? 'Dark' : 'Light'}
            </button>
            <button className="w-full flex items-center p-2 rounded-md hover:bg-gray-500">
              <FaLanguage className="mr-2" />
              Language: English
            </button>
            <button className="w-full flex items-center p-2 rounded-md hover:bg-gray-500">
              <FaGlobe className="mr-2" />
              Location: Japan
            </button>
            <hr />

            <button className="w-full flex items-center p-2 rounded-md hover:bg-gray-500">
              <FaCog className="mr-2" />
              Settings
            </button>
            <button className="w-full flex items-center p-2 rounded-md hover:bg-gray-500">
              <FaQuestionCircle className="mr-2" />
              Help & Feedback
            </button>
          </div>
        </div>
      
    </div>
  );
};

export default ProfileMenu;
