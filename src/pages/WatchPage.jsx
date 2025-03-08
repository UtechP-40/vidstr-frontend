import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useParams } from 'react-router-dom';
import { FaThumbsUp, FaThumbsDown, FaShare, FaSave } from 'react-icons/fa';
import Comments from '../components/Comments';
import SuggestedVideos from '../components/SuggestedVideos';
import { fetchCurrentVideo } from '../redux/features/video.slice';
import { useDispatch, useSelector } from 'react-redux';

const WatchPage = () => {
  const { videoId } = useParams();
  const dispatch = useDispatch();
  const { currentVideo } = useSelector((state) => state.video);

  useEffect(() => {
    dispatch(fetchCurrentVideo(videoId));
  }, [videoId, dispatch]);

  // Handle missing data with fallbacks
  if (!currentVideo) return <div className="text-center p-6">Loading...</div>;

  const {
    title = 'Untitled Video',
    views = '0',
    createdAt,
    owner = {},
    description = 'No description available.',
    videoFile = [],
  } = currentVideo;

  const videoUrl = videoFile[0] || ''; // Ensure a valid URL is available
  const formattedDate = new Date(createdAt).toLocaleDateString();

  return (
    <div className="flex flex-col lg:flex-row p-4 gap-4">
      {/* Video Player and Details */}
      <div className="flex-1">
        <ReactPlayer 
          url={videoUrl} 
          controls 
          width="100%" 
          height="500px" 
        />

        {/* Video Details */}
        <h1 className="text-xl font-bold mt-4">{title}</h1>
        <div className="flex justify-between text-gray-600 text-sm mt-1">
          <span>{views} views • {formattedDate}</span>
          <div className="flex gap-4">
            <button className="flex items-center gap-1"><FaThumbsUp /> 12K</button>
            <button className="flex items-center gap-1"><FaThumbsDown /> 500</button>
            <button className="flex items-center gap-1"><FaShare /> Share</button>
            <button className="flex items-center gap-1"><FaSave /> Save</button>
          </div>
        </div>

        {/* Channel Info */}
        <div className="flex items-center justify-between mt-4 p-2 border-t">
          <div className="flex items-center gap-3">
            <img 
              src={owner.avatar || 'https://via.placeholder.com/50'} 
              alt="Channel" 
              className="w-12 h-12 rounded-full" 
            />
            <div>
              <h2 className="font-bold">{owner.username || 'Unknown Creator'}</h2>
              <span className="text-sm text-gray-600">500K Subscribers</span>
            </div>
          </div>
          <button className="bg-red-600 text-white px-4 py-2 rounded-md">Subscribe</button>
        </div>

        {/* Video Description */}
        <p className="mt-3 text-gray-700">{description}</p>

        {/* Comments Section */}
        <Comments videoId={videoId} />
      </div>

      {/* Suggested Videos Sidebar */}
      <div className="lg:w-96">
        <SuggestedVideos videoId={videoId} />
      </div>
    </div>
  );
};

export default WatchPage;
