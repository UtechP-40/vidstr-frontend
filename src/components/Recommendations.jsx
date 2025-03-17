import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecommendations, trackVideoAction } from '../redux/features/recommendation.slice';
import { fetchAllVideos } from '../redux/features/video.slice';
import VideoCard from './VideoCard';
import { Skeleton } from './ui/skeleton';

const Recommendations = ({ currentVideoId, limit = 10 }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { 
        recommendations, 
        isLoading, 
        totalPages,
        currentPage: serverPage,
        error 
    } = useSelector((state) => state.recommendations);
    const { videos } = useSelector((state) => state.video);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [localVideos, setLocalVideos] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        if (user) {
            dispatch(fetchRecommendations({ 
                limit, 
                page: currentPage,
                currentVideoId 
            }));
        } else {
            dispatch(fetchAllVideos({ 
                page: currentPage,
                limit 
            }));
        }
    }, [dispatch, limit, currentPage, currentVideoId, user]);

    useEffect(() => {
        if (user && recommendations) {
            setLocalVideos(prev => currentPage === 1 ? recommendations : [...prev, ...recommendations]);
            setHasMore(currentPage < totalPages);
        } else if (!user && videos) {
            setLocalVideos(prev => currentPage === 1 ? videos : [...prev, ...videos]);
            setHasMore(currentPage < totalPages);
        }
    }, [recommendations, videos, user, currentPage, totalPages]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.innerHeight + window.pageYOffset;
            const documentHeight = document.documentElement.scrollHeight;
            
            if (scrollPosition >= documentHeight - 100 && !isLoading && hasMore) {
                setCurrentPage(prev => prev + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoading, hasMore]);

    const handleVideoInteraction = (videoId, actionType, duration) => {
        dispatch(trackVideoAction({
            videoId,
            action: {
                type: actionType,
                duration
            }
        }));
    };

    if (isLoading && currentPage === 1) {
        return (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
                {[...Array(limit)].map((_, i) => (
                    <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">Recommended Videos</h2>
            <div className="grid grid-cols-1 gap-4">
                {localVideos
                    .filter(video => video._id !== currentVideoId)
                    .map((video) => (
                        <VideoCard
                            key={video._id}
                            video={video}
                            compact
                            onWatch={(duration) => handleVideoInteraction(video._id, 'WATCH', duration)}
                            onLike={() => handleVideoInteraction(video._id, 'LIKE')}
                        />
                    ))}
                {isLoading && (
                    [...Array(limit)].map((_, i) => (
                        <Skeleton key={`loading-${i}`} className="h-[200px] w-full rounded-lg" />
                    ))
                )}
            </div>
        </div>
    );
};

export default Recommendations;