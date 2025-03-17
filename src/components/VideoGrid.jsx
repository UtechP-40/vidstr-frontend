import React from 'react';
import VideoCard from './VideoCard';
import { Skeleton } from './ui/skeleton';

export const VideoGrid = ({ videos, isLoading }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="aspect-video w-full rounded-lg" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos?.map((video) => (
                <VideoCard
                    key={video._id}
                    video={video}
                    compact={false}
                />
            ))}
        </div>
    );
};