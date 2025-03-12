import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecommendations, trackVideoAction } from '../redux/features/recommendation.slice';
import VideoCard from './VideoCard';
import { Skeleton } from './ui/skeleton';

const Recommendations = ({ currentVideoId, limit = 10 }) => {
    const dispatch = useDispatch();
    const { recommendations, isLoading } = useSelector((state) => state.recommendations);

    useEffect(() => {
        dispatch(fetchRecommendations({ limit }));
    }, [dispatch, limit]);

    const handleVideoInteraction = (videoId, actionType, duration) => {
        dispatch(trackVideoAction({
            videoId,
            action: {
                type: actionType,
                duration
            }
        }));
    };

    if (isLoading) {
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
                {recommendations
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
            </div>
        </div>
    );
};

export default Recommendations;