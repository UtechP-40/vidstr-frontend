import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchRecommendations } from '../redux/features/recommendation.slice';
import VideoCard from './VideoCard';

const SuggestedVideos = ({ videoId, currentCategory, currentTags }) => {
  const dispatch = useDispatch();
  const { recommendations, loading, error } = useSelector(
    (state) => state.recommendations
  ); 

  useEffect(() => {
    dispatch(fetchRecommendations({
      limit: 10,
      currentVideoId: videoId,
      category: currentCategory,
      tags: currentTags
    }));
  }, [dispatch, videoId, currentCategory, currentTags]);

  if (loading) return <div className="text-center p-4">Loading suggestions...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Recommended Videos</h3>
      {recommendations.map((video) => (
        <Link 
          key={video._id} 
          to={`/watch/${video._id}`}
          className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
        >
          <VideoCard
            video={video}
            isCompact={true}
          />
        </Link>
      ))}
    </div>
  );
};

export default SuggestedVideos;
