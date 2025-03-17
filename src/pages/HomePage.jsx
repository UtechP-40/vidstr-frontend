import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Recommendations from '../components/RecommendationGrid';
import CategoryFilter from '../components/CategoryFilter';
import { fetchAllVideos } from '../redux/features/video.slice';
import { VideoGrid } from '../components/VideoGrid';

const HomePage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    const { videos, isLoading } = useSelector(state => state.video);

    useEffect(() => {
        if (!user) {
            dispatch(fetchAllVideos({ limit: 20 }));
        }
    }, [dispatch, user]);

    return (
        <div className="container mx-auto px-4 py-6">
            <CategoryFilter />
            <div className="mt-6">
                {user ? (
                    <Recommendations 
                        limit={20}
                        showGrid={true}
                    />
                ) : (
                    <VideoGrid 
                        videos={videos}
                        isLoading={isLoading}
                    />
                )}
            </div>
        </div>
    );
};

export default HomePage;