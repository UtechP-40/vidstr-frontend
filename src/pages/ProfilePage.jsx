import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {axiosInstance} from '../lib/axios';
import VideoCard from '../components/VideoCard';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('videos');
  const { username } = useParams();
  const currentUser = useSelector(state => state.user.user);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get(`/users/c/${username}`);
        setProfile(response.data.data);
        setIsSubscribed(response.data.data.isSubscribed);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleSubscribe = async () => {
    if (!currentUser) {
      // Redirect to login if not authenticated
      return <Navigate to="/login" />;
    }

    try {
      const response = await axiosInstance.post(`/users/subscribe/${profile._id}`);
      setIsSubscribed(!isSubscribed);
      setProfile(prev => ({
        ...prev,
        subscribersCount: isSubscribed ? prev.subscribersCount - 1 : prev.subscribersCount + 1
      }));
    } catch (error) {
      console.error('Error subscribing:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!profile) {
    return <div className="flex items-center justify-center min-h-screen">Channel not found</div>;
  }

  const isOwner = currentUser?._id === profile._id;

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="w-full h-[300px] overflow-hidden">
        <img 
          src={profile.coverImage} 
          alt="channel banner" 
          className="w-full h-full object-cover"
        />
        {isOwner && (
          <button className="absolute top-4 right-4 bg-black/50 text-white px-4 py-2 rounded">
            Edit Cover
          </button>
        )}
      </div>

      <div className="flex items-center gap-5 p-5">
        <div className="relative">
          <img 
            src={profile.avatar} 
            alt="profile avatar" 
            className="w-20 h-20 rounded-full"
          />
          {isOwner && (
            <button className="absolute bottom-0 right-0 bg-black/50 text-white p-1 rounded-full">
              Edit
            </button>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold m-0">{profile.fullName}</h1>
          <p className="text-muted-foreground">@{profile.username}</p>
          <p className="text-muted-foreground">{profile.subscribersCount} subscribers</p>
        </div>
        {isOwner ? (
          <button className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-semibold hover:bg-primary/90">
            Edit Profile
          </button>
        ) : (
          <button 
            onClick={handleSubscribe}
            className={`px-5 py-2 rounded-full font-semibold ${
              isSubscribed 
                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {isSubscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        )}
      </div>

      <div className="flex border-b border-border mt-5">
        <button 
          className={`px-8 py-4 font-medium ${
            activeTab === 'videos' 
              ? 'border-b-2 border-primary text-foreground' 
              : 'text-muted-foreground'
          }`}
          onClick={() => setActiveTab('videos')}
        >
          {isOwner ? 'MY VIDEOS' : 'VIDEOS'}
        </button>
        <button 
          className={`px-8 py-4 font-medium ${
            activeTab === 'about' 
              ? 'border-b-2 border-primary text-foreground' 
              : 'text-muted-foreground'
          }`}
          onClick={() => setActiveTab('about')}
        >
          ABOUT
        </button>
        {isOwner && (
          <button 
            className={`px-8 py-4 font-medium ${
              activeTab === 'analytics' 
                ? 'border-b-2 border-primary text-foreground' 
                : 'text-muted-foreground'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            ANALYTICS
          </button>
        )}
      </div>

      <div className="p-5">
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {profile.videos.map((video) => (
              <VideoCard key={video._id} video={video} isOwner={isOwner} />
            ))}
          </div>
        )}
        {activeTab === 'about' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">About {profile.fullName}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-muted-foreground">Stats</h3>
                <p>Joined {new Date(profile.createdAt).toLocaleDateString()}</p>
                <p>{profile.videosCount} videos</p>
                <p>{profile.subscribersCount} subscribers</p>
                {isOwner && (
                  <>
                    <p>Total Views: {profile.totalViews}</p>
                    <p>Email: {profile.email}</p>
                  </>
                )}
              </div>
              {profile.description && (
                <div>
                  <h3 className="font-medium text-muted-foreground">Description</h3>
                  <p>{profile.description}</p>
                </div>
              )}
            </div>
          </div>
        )}
        {isOwner && activeTab === 'analytics' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Channel Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded">
                <h3>Views This Month</h3>
                <p className="text-2xl font-bold">{profile.monthlyViews || 0}</p>
              </div>
              <div className="p-4 border rounded">
                <h3>New Subscribers</h3>
                <p className="text-2xl font-bold">{profile.monthlySubscribers || 0}</p>
              </div>
              {/* Add more analytics as needed */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
