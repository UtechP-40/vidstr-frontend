import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { Avatar } from './ui/avatar';

const VideoCard = ({ video, compact = false }) => {
    const {
        _id,
        title,
        thumbnail,
        owner,
        views,
        createdAt,
        duration
    } = video;

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <Link to={`/watch/${_id}`} className="group">
            <div className={`flex ${compact ? 'flex-row gap-2' : 'flex-col gap-4'}`}>
                <div className={`relative ${compact ? 'w-40' : 'w-full'}`}>
                    <img
                        src={thumbnail}
                        alt={title}
                        className="w-full aspect-video object-cover rounded-lg"
                    />
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 text-xs rounded">
                        {formatDuration(duration)}
                    </span>
                </div>
                <div className="flex gap-3">
                    {!compact && (
                        <Avatar
                            src={owner?.avatar}
                            alt={owner?.username}
                            className="w-9 h-9 rounded-full"
                        />
                    )}
                    <div className="flex flex-col">
                        <h3 className={`font-semibold ${compact ? 'text-sm' : 'text-base'}`}>
                            {title}
                        </h3>
                        <p className="text-sm text-gray-500">{owner?.username}</p>
                        <div className="text-sm text-gray-500">
                            {views.toLocaleString()} views • {formatDistance(new Date(createdAt), new Date(), { addSuffix: true })}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default VideoCard;