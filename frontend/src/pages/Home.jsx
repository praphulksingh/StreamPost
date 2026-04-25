import { useState, useEffect } from "react";
import { videoService } from "../services/video.service";
import VideoCard from "../components/VideoCard";
import VideoSkeleton from "../components/VideoSkeleton";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await videoService.getAllVideos();
        // Assuming the aggregation pipeline pagination returns data in response.data.docs
        setVideos(response.data.docs || response.data); 
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (error) {
    return (
      <div className="w-full flex justify-center mt-10">
        <div className="bg-red-500/10 text-red-500 border border-red-500 p-4 rounded-lg text-center">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="mt-2 text-sm underline hover:text-red-400">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-10">
      {loading ? (
        // 👇 UPDATED: Now using your reusable VideoSkeleton component 👇
        [...Array(12)].map((_, i) => (
          <VideoSkeleton key={i} />
        ))
      ) : videos.length === 0 ? (
        // EMPTY STATE
        <div className="col-span-full flex flex-col items-center justify-center mt-20 text-brand-muted">
          <p className="text-xl font-semibold text-white">No videos found</p>
          <p>Be the first to upload a video!</p>
        </div>
      ) : (
        // RENDER ACTUAL VIDEOS
        videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))
      )}
    </div>
  );
};

export default Home;