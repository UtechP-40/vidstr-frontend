import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Moon, Languages, ShieldAlert, Globe2, Keyboard, Settings, HelpCircle, MessageSquarePlus } from 'lucide-react';
import { useTheme } from "../context/theme.context";


const Menu1 = () => {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";

    const handleThemeChange = () => {
        setTheme(isDark ? "light" : "dark");
    };

    return (
        <div className="bg-white w-72 rounded-lg shadow-lg border border-gray-200">
            <div className="py-2">
                {/* Main Menu Items */}
                <MenuItem icon={<Shield size={20} className="text-blue-600" />} text="Your Video Data" />
                <MenuItem 
                    icon={<Moon size={20} className="text-gray-600" />} 
                    text={`Appearance: ${theme}`} 
                    func={handleThemeChange} 
                    hasSubmenu 
                />
                <MenuItem icon={<Languages size={20} className="text-green-600" />} text="Language: English" hasSubmenu />
                <MenuItem icon={<ShieldAlert size={20} className="text-red-600" />} text="Limited Mode: Disabled" hasSubmenu />
                <MenuItem icon={<Globe2 size={20} className="text-purple-600" />} text="Location: India" hasSubmenu />
                <MenuItem icon={<Keyboard size={20} className="text-gray-600" />} text="Keyboard shortcuts" />
            </div>

            <div className="border-t border-gray-200">
                <MenuItem icon={<Settings size={20} className="text-gray-600" />} text="Settings" />
            </div>

            <div className="border-t border-gray-200">
                <MenuItem icon={<HelpCircle size={20} className="text-gray-600" />} text="Help" />
                <MenuItem icon={<MessageSquarePlus size={20} className="text-gray-600" />} text="Send feedback" />
            </div>
        </div>
    );
};

// MenuItem Component
const MenuItem = ({ icon, text, hasSubmenu = false, func = () => {} }) => {
    return (
        <Link 
            to="#" 
            className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 transition-colors" 
            onClick={func}
        >
            <div className="flex items-center gap-3">
                {icon}
                <span className="text-sm font-medium text-gray-700">{text}</span>
            </div>
            {hasSubmenu && (
                <svg 
                    className="h-4 w-4 text-gray-500" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 5l7 7-7 7" 
                    />
                </svg>
            )}
        </Link>
    );
};

export default Menu1;