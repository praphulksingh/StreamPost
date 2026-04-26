import { useState, useEffect } from "react";
import { userService } from "../services/user.service";
import VideoCard from "../components/VideoCard";
import VideoSkeleton from "../components/VideoSkeleton";
import { FiClock } from "react-icons/fi";

const WatchLater = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
  useEffect(() => {
    const fetchWatchLater = async () => {
      try {
        setLoading(true);
        const response = await userService.getWatchLater();
        
        const rawData = response.data?.docs || response.data || [];
        
        const extractedVideos = rawData
          .map(item => item.video || item)
          .filter(v => v && v._id);
          
        setVideos(extractedVideos);
      } catch (err) {
        setError("Failed to load Watch Later list.");
      } finally {
        setLoading(false);
      }
    };

    fetchWatchLater();
  }, []);

  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="flex items-center gap-3 mb-8 border-b border-brand-secondary pb-4">
        <FiClock className="text-3xl text-brand-accent" />
        <h1 className="text-2xl font-bold text-white">Watch Later</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {loading ? (
          [...Array(8)].map((_, i) => <VideoSkeleton key={i} />)
        ) : videos.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center mt-20 text-brand-muted">
            <p className="text-xl font-semibold text-white">Your Watch Later list is empty</p>
            <p>Save videos to watch later using the bookmark icon.</p>
          </div>
        ) : (
          videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))
        )}
      </div>
    </div>
  );
};

export default WatchLater;