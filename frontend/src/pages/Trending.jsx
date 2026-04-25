import { useState, useEffect } from "react";
import { videoService } from "../services/video.service";
import VideoCard from "../components/VideoCard";
import { FiTrendingUp } from "react-icons/fi";

const Trending = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        // Ask backend to sort by views, descending
        const response = await videoService.getAllVideos({ sortBy: "views", sortType: "desc" });
        setVideos(response.data?.docs || response.data);
      } catch (error) {
        console.error("Failed to load trending videos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (loading) return <div className="text-center mt-10 text-white">Loading trending videos...</div>;

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="flex items-center gap-3 mb-8 border-b border-brand-secondary pb-4">
        <FiTrendingUp className="text-3xl text-brand-accent" />
        <h1 className="text-2xl font-bold text-white">Trending Now</h1>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default Trending;