import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import VideoCard from '../components/VideoCard';
import ChannelCard from '../components/ChannelCard';

const SearchPage = () => {
  const { searchQuery } = useParams();
  const [searchResults, setSearchResults] = useState({
    channels: [],
    videos: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(`/search?q=${encodeURIComponent(searchQuery)}`);
        
        if (response.data.statusCode === 200) {
          console.log('Search Response:', response.data.data); // Add this line
          setSearchResults({
            channels: response.data.data.channels || [],
            videos: response.data.data.videos || []
          });
        }
      } catch (err) {
        setError('Failed to fetch search results');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchSearchResults();
    }
  }, [searchQuery]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Search Results for "{searchQuery}"</h1>
      
      {/* Channels Section */}
      {searchResults.channels?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Channels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.channels.map(channel => (
              <ChannelCard
                key={channel._id}
                id={channel._id}
                username={channel.username}
                fullName={channel.fullName}
                avatar={channel.avatar}
                subscribersCount={channel.subscribersCount}
              />
            ))}
          </div>
        </div>
      )}

      {/* Videos Section */}
      {searchResults.videos?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {searchResults.videos.map(video => (
              <VideoCard
                key={video._id}
                video={{
                  _id: video._id,
                  title: video.title,
                  thumbnail: video.thumbnail,
                  duration: video.duration || 0, // Add fallback for duration
                  views: video.views || 0,
                  createdAt: video.createdAt, // Add createdAt if needed
                  owner: {
                    _id: video.owner._id,
                    username: video.owner.username,
                    avatar: video.owner.avatar
                  },
                  category: {
                    _id: video.category._id,
                    name: video.category.name
                  }
                }}
              />
            ))}
          </div>
        </div>
      )}

      {(!searchResults.channels?.length && !searchResults.videos?.length) && (
        <div className="text-center text-gray-500">
          No results found for "{searchQuery}"
        </div>
      )}
    </div>
  );
};

export default SearchPage;
