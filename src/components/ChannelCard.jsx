import React from 'react';
import { Link } from 'react-router-dom';

const ChannelCard = ({ id, username, fullName, avatar, subscribersCount = 0 }) => {
    return (
        <Link 
            to={`/channel/${id}`} 
            className="flex flex-col items-center p-6 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-300 group"
        >
            <div className="w-24 h-24 mb-4 rounded-full overflow-hidden ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                {avatar ? (
                    <img 
                        src={avatar} 
                        alt={username} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-2xl font-bold text-white">
                        {username?.[0]?.toUpperCase()}
                    </div>
                )}
            </div>
            
            <div className="text-center">
                <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                    {fullName}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    @{username}
                </p>
                <div className="flex items-center justify-center gap-1 text-sm text-gray-500 dark:text-gray-500">
                    <span className="font-medium">
                        {(subscribersCount || 0).toLocaleString()}
                    </span>
                    <span>subscribers</span>
                </div>
            </div>
        </Link>
    );
};

export default ChannelCard;