import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { useParams } from 'react-router-dom';
import { FaThumbsUp, FaThumbsDown, FaShare, FaSave } from 'react-icons/fa';
import Comments from '../components/Comments';
import SuggestedVideos from '../components/SuggestedVideos';
import { 
    fetchCurrentVideo,  
    likeVideo, 
    dislikeVideo 
} from '../redux/features/video.slice';
import { trackVideoProgress } from '../redux/features/recommendation.slice';
import { useDispatch, useSelector } from 'react-redux';

const WatchPage = () => {
  const { videoId } = useParams();
  const dispatch = useDispatch();
  const playerRef = useRef(null);
  const { currentVideo, loading, error } = useSelector((state) => state.video);
  const { user } = useSelector((state) => state.user);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [isDislikeAnimating, setIsDislikeAnimating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    dispatch(fetchCurrentVideo(videoId));
  }, [videoId, dispatch]);

  useEffect(() => {
    if (currentVideo) {
      setLikes(currentVideo.likeCount);
      setDislikes(currentVideo.dislikeCount);
      setIsLiked(currentVideo.isLiked);
      setIsDisliked(currentVideo.isDisliked);
    }
  }, [currentVideo]);

  const handleLike = () => {
    if (!user) return;
    setIsLikeAnimating(true);
    
    // Optimistic update
    if (isLiked) {
      setLikes(prev => prev - 1);
      setIsLiked(false);
    } else {
      setLikes(prev => prev + 1);
      if (isDisliked) {
        setDislikes(prev => prev - 1);
        setIsDisliked(false);
      }
      setIsLiked(true);
    }
    
    dispatch(likeVideo(videoId));
    setTimeout(() => setIsLikeAnimating(false), 300);
  };

  const handleDislike = () => {
    if (!user) return;
    setIsDislikeAnimating(true);

    // Optimistic update
    if (isDisliked) {
      setDislikes(prev => prev - 1);
      setIsDisliked(false);
    } else {
      setDislikes(prev => prev + 1);
      if (isLiked) {
        setLikes(prev => prev - 1);
        setIsLiked(false);
      }
      setIsDisliked(true);
    }

    dispatch(dislikeVideo(videoId));
    setTimeout(() => setIsDislikeAnimating(false), 300);
  };

  // Add new useEffect for tracking video progress
  useEffect(() => {
    let progressInterval;
    if (isPlaying && user) {
      progressInterval = setInterval(() => {
        const currentTime = playerRef.current?.getCurrentTime() || 0;
        dispatch(trackVideoProgress({
          videoId,
          action: {
            type: 'WATCH',
            duration: currentTime
          }
        }));
      }, 30000); // Track every 30 seconds
    }

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [isPlaying, videoId, user, dispatch]);

  // Add handlers for video player events
  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    // Track final progress when video ends
    const duration = playerRef.current?.getCurrentTime() || 0;
    dispatch(trackVideoProgress({
      videoId,
      action: {
        type: 'WATCH',
        duration
      }
    }));
  };

  // Update ReactPlayer component with new props
  return (
    <div className="flex flex-col lg:flex-row p-4 gap-4">
      <div className="flex-1">
        <ReactPlayer 
          ref={playerRef}
          url={videoFile}
          controls 
          width="100%" 
          height="500px" 
          playing
          className="react-player"
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
        />

        <h1 className="text-xl font-bold mt-4">{title}</h1>
        <div className="flex justify-between text-gray-600 text-sm mt-1">
          <span>{views} views • {formattedDate}</span>
          <div className="flex gap-4">
            <button 
              className={`flex items-center gap-1 transition-all duration-200 hover:text-blue-600 
                ${isLiked ? 'text-blue-600' : ''} 
                ${isLikeAnimating ? 'scale-125' : ''}`}
              onClick={handleLike}
            >
              <FaThumbsUp className={`transform ${isLikeAnimating ? 'animate-bounce' : ''}`} /> 
              {likes}
            </button>
            <button 
              className={`flex items-center gap-1 transition-all duration-200 hover:text-blue-600 
                ${isDisliked ? 'text-blue-600' : ''} 
                ${isDislikeAnimating ? 'scale-125' : ''}`}
              onClick={handleDislike}
            >
              <FaThumbsDown className={`transform ${isDislikeAnimating ? 'animate-bounce' : ''}`} /> 
              {dislikes}
            </button>
            <button className="flex items-center gap-1 hover:text-blue-600 transition-all duration-200">
              <FaShare /> Share
            </button>
            <button className="flex items-center gap-1 hover:text-blue-600 transition-all duration-200">
              <FaSave /> Save
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 p-2 border-t">
          <div className="flex items-center gap-3">
            <img 
              src={owner.avatar || 'https://via.placeholder.com/50'} 
              alt="Channel" 
              className="w-12 h-12 rounded-full" 
            />
            <div>
              <h2 className="font-bold">{owner.username || 'Unknown Creator'}</h2>
              <span className="text-sm text-gray-600">{subscribers} Subscribers</span>
            </div>
          </div>
          <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200">
            Subscribe
          </button>
        </div>

        <p className="mt-3 text-gray-700">{description}</p>

        <Comments videoId={videoId} />
      </div>

      <div className="lg:w-96">
        <SuggestedVideos 
          videoId={videoId} 
          currentCategory={currentVideo?.category}
          currentTags={currentVideo?.tags}
        />
      </div>
    </div>
  );
};

export default WatchPage;
