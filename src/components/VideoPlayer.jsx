import React, { useRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import ReactPlayer from 'react-player';
import { trackVideoAction } from '../redux/features/recommendation.slice';

const VideoPlayer = ({ videoId, videoUrl, onTimeUpdate }) => {
    const playerRef = useRef(null);
    const dispatch = useDispatch();
    const [lastTrackedTime, setLastTrackedTime] = useState(0);
    
    const handleProgress = ({ playedSeconds }) => {
        const currentTime = Math.floor(playedSeconds);
        if (currentTime - lastTrackedTime >= 10) { // Track every 10 seconds
            onTimeUpdate?.(currentTime);
            setLastTrackedTime(currentTime);
            
            // Dispatch tracking action
            dispatch(trackVideoAction({
                videoId,
                action: {
                    type: 'WATCH',
                    duration: currentTime
                }
            }));
        }
    };

    // Cleanup and final tracking on unmount
    useEffect(() => {
        return () => {
            if (lastTrackedTime > 0) {
                dispatch(trackVideoAction({
                    videoId,
                    action: {
                        type: 'WATCH',
                        duration: lastTrackedTime
                    }
                }));
            }
        };
    }, [dispatch, videoId, lastTrackedTime]);

    return (
        <div className="relative w-full aspect-video">
            <ReactPlayer
                ref={playerRef}
                url={videoUrl}
                className="w-full h-full rounded-lg"
                width="100%"
                height="100%"
                controls={true}
                playing={true}
                playsinline={true}
                onProgress={handleProgress}
                progressInterval={1000}
            />
        </div>
    );
};

export default VideoPlayer;