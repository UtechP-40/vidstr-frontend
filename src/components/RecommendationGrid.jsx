import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecommendations, trackVideoAction } from '../redux/features/recommendation.slice';
import VideoCard from './VideoCard';
import { Skeleton } from './ui/skeleton';

const RecommendationGrid = ({ limit = 20 }) => {
    const dispatch = useDispatch();
    const { recommendations,SelectedCategory, isLoading, totalPages, currentPage: serverPage } = useSelector((state) => state.recommendations);
    const [page, setPage] = useState(1);
    const [allVideos, setAllVideos] = useState([]);
    const observerRef = useRef();
    const loadingRef = useRef(null);
    const hasMore = page < totalPages;

    console.log(allVideos)
    // Reset videos when component mounts
    useEffect(() => {
        setAllVideos([]);
        setPage(1);
    }, []);

    useEffect(() => {
        if (recommendations?.length) {
            setAllVideos(prev => {
                const uniqueVideos = recommendations.filter(
                    video => !prev.some(v => v._id === video._id)
                );
                return [...prev, ...uniqueVideos];
            });
        }
    }, [recommendations]);

    const lastVideoRef = useCallback(node => {
        if (isLoading || !hasMore) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1);
            }
        });

        if (node) observerRef.current.observe(node);
    }, [isLoading, hasMore]);

    useEffect(() => {
        dispatch(fetchRecommendations({ limit, page }));
    }, [dispatch,SelectedCategory, limit, page]);

    const handleVideoInteraction = (videoId, actionType, duration) => {
        dispatch(trackVideoAction({
            videoId,
            action: {
                type: actionType,
                duration
            }
        }));
    };

    if (isLoading && page === 1) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(limit)].map((_, i) => (
                    <Skeleton key={i} className="aspect-video w-full rounded-lg" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Recommended Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {allVideos?.map((video, index) => (
                    <div
                        key={`${video._id}-${index}`}
                        ref={index === allVideos.length - 1 ? lastVideoRef : null}
                    >
                        <VideoCard
                            video={video}
                            compact={false}
                            onWatch={(duration) => handleVideoInteraction(video._id, 'WATCH', duration)}
                            onLike={() => handleVideoInteraction(video._id, 'LIKE')}
                        />
                    </div>
                ))}
                {allVideos?.length === 0 && (
                    <div className="col-span-full text-center py-10">
                        <p className="text-gray-500">No videos available</p>
                    </div>
                )}
            </div>
            
            {isLoading && page > 1 && (
                <div ref={loadingRef} className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            )}
        </div>
    );
};

export default RecommendationGrid;