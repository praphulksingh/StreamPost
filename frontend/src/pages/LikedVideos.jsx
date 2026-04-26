import { useState, useEffect } from "react";
import { likeService } from "../services/like.service";
import VideoCard from "../components/VideoCard";
import VideoSkeleton from "../components/VideoSkeleton";
import { FiThumbsUp } from "react-icons/fi";

const LikedVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Inside LikedVideos.jsx...
  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        setLoading(true);
        const response = await likeService.getLikedVideos();
        
        // Safely extract the data, handling different backend response formats
        const rawData = response.data?.docs || response.data || [];
        
        
        // Check if the backend wraps the video in a 'video' or 'likedVideo' property, or just sends the video directly.
        // Then filter out any null values where the video might have been deleted.
        const extractedVideos = rawData
          .map(item => item.video || item.likedVideo || item)
          .filter(v => v && v._id); // Ensures the video object actually exists
          
          
        setVideos(extractedVideos);
      } catch (err) {
        setError("Failed to load liked videos.");
      } finally {
        setLoading(false);
      }
    };

    fetchLikedVideos();
  }, []);

  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="flex items-center gap-3 mb-8 border-b border-brand-secondary pb-4">
        <FiThumbsUp className="text-3xl text-brand-accent" />
        <h1 className="text-2xl font-bold text-white">Liked Videos</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {loading ? (
          [...Array(8)].map((_, i) => <VideoSkeleton key={i} />)
        ) : videos.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center mt-20 text-brand-muted">
            <p className="text-xl font-semibold text-white">No liked videos yet</p>
            <p>Videos you like will appear here!</p>
          </div>
        ) : (
          videos.map((video) => (
            video ? <VideoCard key={video._id} video={video} /> : null
          ))
        )}
      </div>
    </div>
  );
};

export default LikedVideos;