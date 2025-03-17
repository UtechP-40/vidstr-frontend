import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import VideoPlayer from '../components/VideoPlayer';
import Recommendations from '../components/Recommendations';
import VideoInfo from '../components/VideoInfo';
import CommentSection from '../components/Comments';
import { trackVideoAction } from '../redux/features/recommendation.slice';
import { useSelector } from 'react-redux';
import {fetchCurrentVideo} from "../redux/features/video.slice"
const WatchPage = () => {
    const { videoId } = useParams();
    const dispatch = useDispatch();
    const [watchDuration, setWatchDuration] = useState(0);
  useEffect(()=>{
    dispatch(fetchCurrentVideo(videoId))
  },[])
    useEffect(() => {
        // Track video view when component unmounts or video changes
        return () => {
            if (watchDuration > 0) {
                dispatch(trackVideoAction({
                    videoId,
                    action: {
                        type: 'WATCH',
                        duration: watchDuration
                    }
                }));
            }
        };
    }, [videoId, watchDuration, dispatch]);

    const handleTimeUpdate = (currentTime) => {
        setWatchDuration(currentTime);
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <VideoPlayer 
                        videoId={videoId} 
                        onTimeUpdate={handleTimeUpdate}
                    />
                    <VideoInfo videoId={videoId} />
                    <CommentSection videoId={videoId} />
                </div>
                <div className="lg:col-span-1">
                    <Recommendations 
                        currentVideoId={videoId}
                        limit={10}
                        showGrid={false} // Display in list layout for watch page
                    />
                </div>
            </div>
        </div>
    );
};

export default WatchPage;
