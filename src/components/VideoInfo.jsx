import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { formatDistance } from 'date-fns';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { Avatar } from './ui/avatar';
import { Button } from './ui/button';
import { trackVideoAction } from '../redux/features/recommendation.slice';
import { likeVideo, dislikeVideo } from '../redux/features/video.slice';
import { Skeleton } from './ui/skeleton';

const VideoInfo = ({ videoId }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    const { currentVideo, isLoading } = useSelector(state => state.video);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [isLikeAnimating, setIsLikeAnimating] = useState(false);
    const [isDislikeAnimating, setIsDislikeAnimating] = useState(false);

    useEffect(() => {
        if (currentVideo) {
            setLikes(currentVideo.likeCount);
            setDislikes(currentVideo.dislikeCount);
            setIsLiked(currentVideo.isLiked);
            setIsDisliked(currentVideo.isDisliked);
        }
    }, [currentVideo]);

    if (isLoading) {
        return (
            <div className="mt-4 space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-20" />
                        <Skeleton className="h-10 w-20" />
                    </div>
                </div>
                <Skeleton className="h-24 w-full" />
            </div>
        );
    }

    if (!currentVideo) {
        return <div className="mt-4 text-center">Video information not available</div>;
    }

    const {
        title,
        description,
        views,
        createdAt,
        owner,
    } = currentVideo;
console.log(currentVideo)
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
        dispatch(trackVideoAction({
            videoId,
            action: { type: 'LIKE' }
        }));
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
        dispatch(trackVideoAction({
            videoId,
            action: { type: 'DISLIKE' }
        }));
        setTimeout(() => setIsDislikeAnimating(false), 300);
    };

    return (
        <div className="mt-4">
            <h1 className="text-xl font-bold mb-2">{title}</h1>
            
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <Avatar
                        src={owner?.avatar}
                        alt={owner?.username}
                        className="w-10 h-10"
                    />
                    <div>
                        <h3 className="font-semibold">{owner?.username}</h3>
                        <p className="text-sm text-gray-500">
                            {views?.toLocaleString() || 0} views • 
                            {createdAt && formatDistance(new Date(createdAt), new Date(), { addSuffix: true })}
                        </p>
                    </div>
                </div>
                
                <div className="flex gap-2">
                    <Button
                        variant={isLiked ? "default" : "outline"}
                        onClick={handleLike}
                        className={`flex items-center gap-1 transition-all duration-200 ${isLikeAnimating ? 'scale-110' : ''}`}
                        disabled={!user}
                    >
                        <FaThumbsUp className={`transform ${isLikeAnimating ? 'animate-bounce' : ''}`} />
                        {likes?.toLocaleString() || 0}
                    </Button>
                    <Button
                        variant={isDisliked ? "default" : "outline"}
                        onClick={handleDislike}
                        className={`flex items-center gap-1 transition-all duration-200 ${isDislikeAnimating ? 'scale-110' : ''}`}
                        disabled={!user}
                    >
                        <FaThumbsDown className={`transform ${isDislikeAnimating ? 'animate-bounce' : ''}`} />
                        {dislikes?.toLocaleString() || 0}
                    </Button>
                </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <div className={`${isDescriptionExpanded ? '' : 'line-clamp-3'}`}>
                    {description || 'No description available'}
                </div>
                {description?.length > 150 && (
                    <button
                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                        className="text-blue-500 mt-2 text-sm font-medium"
                    >
                        {isDescriptionExpanded ? 'Show less' : 'Show more'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default VideoInfo;