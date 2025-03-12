import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ReactPlayer from 'react-player'

const HomeVideoCard = ({video}) => {
  const [isHovering, setIsHovering] = useState(false);
  const playerRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  
  const {
    videoFile,
    thumbnail,
    owner,
    title,
    description,
    duration,
    views,
    createdAt,
    isPublished,
    _id
  }=video

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);
// console.log(video)
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovering(false);
    }, 100);
  };

  return (
    <div className="w-full max-w-[360px] cursor-pointer">
      <Link to={`/watch/${_id}`}>
        <div 
          className="relative" 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {!isHovering ? (
            <img 
              src={thumbnail} 
              alt={title}
              className="w-full aspect-video rounded-xl object-cover"
            />
          ) : (
            <ReactPlayer
              ref={playerRef}
              url={videoFile}
              width="100%"
              height="100%"
              playing={isHovering}
              muted={true}
              loop={true}
              className="aspect-video rounded-xl overflow-hidden"
              style={{ aspectRatio: '16/9' }}
            />
          )}
          <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 text-sm rounded">
            {formatDuration(duration)}
          </span>
        </div>
        <div className="flex gap-3 mt-3">
          <div className="w-10 h-10">
            <img 
              src={owner?.avatar} 
              alt={owner?.username}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <h3 className="font-medium text-base line-clamp-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600">
              {owner?.username}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{views} views</span>
              <span>•</span>
              <span>{(() => {
                const now = new Date();
                const uploadDate = new Date(createdAt);
                const diff = now - uploadDate;
                
                const seconds = Math.floor(diff / 1000);
                const minutes = Math.floor(seconds / 60);
                const hours = Math.floor(minutes / 60);
                const days = Math.floor(hours / 24);
                const months = Math.floor(days / 30);
                const years = Math.floor(days / 365);

                if (years > 0) return `${years} ${years === 1 ? 'year' : 'years'} ago`;
                if (months > 0) return `${months} ${months === 1 ? 'month' : 'months'} ago`;
                if (days > 0) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
                if (hours > 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
                if (minutes > 0) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
                return 'Just now';
              })()}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default HomeVideoCard
