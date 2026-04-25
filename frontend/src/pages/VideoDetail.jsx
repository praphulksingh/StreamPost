import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { videoService } from "../services/video.service";
import { formatTimeAgo } from "../utils/formatters";
import { likeService } from "../services/like.service";
import { subscriptionService } from "../services/subscription.service";
import CommentSection from "../components/CommentSection";
import { FiThumbsUp, FiThumbsDown, FiShare2, FiMoreHorizontal, FiBookmark } from "react-icons/fi";
import SaveToPlaylistModal from "../components/SaveToPlaylistModal";


const VideoDetail = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  // Handlers for interactions
  const handleLike = async () => {
    try {
      const res = await likeService.toggleVideoLike(videoId);
      setIsLiked(res.data.isLiked);
    } catch (error) {
      console.error("Like failed", error);
    }
  };

  const handleSubscribe = async () => {
    try {
      const res = await subscriptionService.toggleSubscription(video.owner._id);
      setIsSubscribed(res.data.isSubscribed);
    } catch (error) {
      console.error("Subscription failed", error);
    }
  };

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const response = await videoService.getVideoById(videoId);
        setVideo(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load video");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  if (loading) {
    return <div className="flex justify-center items-center h-full text-white">Loading video...</div>;
  }

  if (error || !video) {
    return <div className="text-red-500 text-center mt-10">{error || "Video not found"}</div>;
  }

  const ownerName = video.owner?.fullName || "Unknown Creator";
  const ownerAvatar = video.owner?.avatar || "https://via.placeholder.com/150";
  const ownerUsername = video.owner?.username || "";

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 pb-10">
      {/* Primary Content Area (Video & Details) */}
      <div className="flex-1 w-full max-w-5xl">
        
        {/* The Video Player */}
        <div className="w-full bg-black rounded-xl overflow-hidden aspect-video">
          <video 
            src={video.videoFile} 
            poster={video.thumbnail}
            controls 
            autoPlay
            className="w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Video Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-white mt-4">{video.title}</h1>

        {/* Video Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3">
          
          {/* Channel Info */}
          <div className="flex items-center gap-4">
            <Link to={`/channel/${ownerUsername}`}>
              <img src={ownerAvatar} alt={ownerName} className="w-10 h-10 rounded-full object-cover" />
            </Link>
            <div>
              <Link to={`/channel/${ownerUsername}`}>
                <h3 className="text-white font-semibold hover:text-brand-accent transition-colors">{ownerName}</h3>
              </Link>
            </div>
            {/* UPDATED SUBSCRIBE BUTTON */}
            <button 
              onClick={handleSubscribe}
              className={`font-semibold px-4 py-2 rounded-full ml-2 transition-colors ${
                isSubscribed 
                  ? "bg-brand-secondary text-white hover:bg-opacity-80" 
                  : "bg-white text-black hover:bg-gray-200"
              }`}
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            <div className="flex items-center bg-brand-secondary rounded-full">
              {/* UPDATED LIKE BUTTON */}
              <button 
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-l-full transition-colors border-r border-white/10 font-medium ${
                  isLiked ? "bg-brand-accent text-white" : "hover:bg-white/10 text-white"
                }`}
              >
                <FiThumbsUp /> {isLiked ? "Liked" : "Like"}
              </button>
              <button className="px-4 py-2 hover:bg-white/10 rounded-r-full transition-colors text-white">
                <FiThumbsDown />
              </button>
            </div>
            <button className="flex items-center gap-2 bg-brand-secondary hover:bg-white/10 text-white px-4 py-2 rounded-full font-medium transition-colors">
              <FiShare2 /> Share
            </button>
            <button 
              onClick={() => setIsSaveModalOpen(true)}
              className="flex items-center gap-2 bg-brand-secondary hover:bg-white/10 text-white px-4 py-2 rounded-full font-medium transition-colors"
            >
              <FiBookmark /> Save
            </button>
            <button className="flex items-center justify-center bg-brand-secondary hover:bg-white/10 text-white w-10 h-10 rounded-full transition-colors">
              <FiMoreHorizontal />
            </button>
          </div>
        </div>

        {/* Video Description Box */}
        <div className="bg-brand-secondary/50 rounded-xl p-3 sm:p-4 mt-4 text-sm">
          <p className="text-white font-semibold mb-1">
            {video.views} views • {formatTimeAgo(video.createdAt)}
          </p>
          <p className="text-brand-text whitespace-pre-wrap">{video.description}</p>
        </div>

        {/* Render our new CommentSection component */}
        <div className="mt-8">
          <CommentSection videoId={videoId} />
        </div>
      </div>

      {/* Suggested Videos Sidebar Placeholder */}
      <div className="w-full lg:w-[350px] xl:w-[400px] flex flex-col gap-4">
          <h3 className="text-white font-semibold">Suggested Videos</h3>
          <div className="p-4 border border-brand-secondary rounded-xl text-brand-muted text-center h-64 flex items-center justify-center">
            Suggestions coming soon...
          </div>
      </div>
      <SaveToPlaylistModal 
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        videoId={videoId}
      />
    </div>
  );
};

export default VideoDetail;