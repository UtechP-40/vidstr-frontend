import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const SuggestedVideos = () => {
  const { videos } = useSelector((state) => state.video); // Fetch suggested videos from Redux

  if (!videos || videos.length === 0) {
    return <p className="text-gray-500 text-center">No suggestions available.</p>;
  }

  return (
    <div className="w-full lg:w-96 p-2">
      <h2 className="text-lg font-bold mb-3">Suggested Videos</h2>
      <div className="flex flex-col gap-3">
        {videos.map((video) => (
          <Link
            to={`/watch/${video._id}`}
            key={video._id}
            className="flex gap-3 hover:bg-gray-100 p-2 rounded-md transition"
          >
            {/* Video Thumbnail */}
            <img
              src={video.thumbnail || "https://via.placeholder.com/160"}
              alt={video.title}
              className="w-36 h-20 rounded-md object-cover"
            />

            {/* Video Details */}
            <div className="flex flex-col flex-1">
              <h3 className="text-sm font-semibold leading-tight">{video.title}</h3>
              <p className="text-xs text-gray-600">{video.owner?.username || "Unknown Creator"}</p>
              <p className="text-xs text-gray-500">{video.views} views • {new Date(video.createdAt).toLocaleDateString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SuggestedVideos;
