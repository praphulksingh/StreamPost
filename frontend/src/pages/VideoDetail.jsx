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
  const [suggestedVideos, setSuggestedVideos] = useState([]);

  // Handlers
  const handleLike = async () => {
    try {
      const res = await likeService.toggleVideoLike(videoId);
      setIsLiked(res.data.isLiked);
    } catch (error) {
      console.error("Like failed", error);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Video link copied to clipboard!"); // Replace with a toast later
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
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        // Fetch the main video
        const response = await videoService.getVideoById(videoId);
        setVideo(response.data);

        // 👇 Fetch suggested videos (using your existing getAllVideos service)
        const suggestionsRes = await videoService.getAllVideos();
        const allVids = suggestionsRes.data?.docs || suggestionsRes.data || [];
        
        // Filter out the video we are currently watching, and grab the first 5
        const filteredSuggestions = allVids
          .filter(v => v._id !== videoId)
          .slice(0, 5);
          
        setSuggestedVideos(filteredSuggestions);

      } catch (err) {
        setError(err.response?.data?.message || "Failed to load video");
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
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
      {/* Primary Content Area */}
      <div className="flex-1 w-full max-w-5xl">
        {/* Video Player */}
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

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-white mt-4">{video.title}</h1>

        {/* Action Bar */}
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
            {/* Subscribe Button */}
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
              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-l-full transition-colors border-r border-white/10 font-medium ${
                  isLiked ? "bg-brand-accent text-white" : "hover:bg-white/10 text-white"
                }`}
              >
                <FiThumbsUp /> {isLiked ? "Liked" : "Like"}
              </button>

              {/* Dislike Button (visual only, but removes like if active) */}
              <button
                onClick={() => {
                  if (isLiked) handleLike(); // Remove the like
                  alert("Dislike registered"); // Optional feedback
                }}
                className="px-4 py-2 hover:bg-white/10 rounded-r-full transition-colors text-white"
                title="I dislike this"
              >
                <FiThumbsDown />
              </button>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-brand-secondary hover:bg-white/10 text-white px-4 py-2 rounded-full font-medium transition-colors"
            >
              <FiShare2 /> Share
            </button>

            {/* Save Button */}
            <button
              onClick={() => setIsSaveModalOpen(true)}
              className="flex items-center gap-2 bg-brand-secondary hover:bg-white/10 text-white px-4 py-2 rounded-full font-medium transition-colors"
            >
              <FiBookmark /> Save
            </button>

            {/* More Options */}
            <button className="flex items-center justify-center bg-brand-secondary hover:bg-white/10 text-white w-10 h-10 rounded-full transition-colors">
              <FiMoreHorizontal />
            </button>
          </div>
        </div>

        {/* Video Description */}
        <div className="bg-brand-secondary/50 rounded-xl p-3 sm:p-4 mt-4 text-sm">
          <p className="text-white font-semibold mb-1">
            {video.views} views • {formatTimeAgo(video.createdAt)}
          </p>
          <p className="text-brand-text whitespace-pre-wrap">{video.description}</p>
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <CommentSection videoId={videoId} />
        </div>
      </div>

      {/* Suggested Videos Sidebar (placeholder) */}
      {/* Suggested Videos Sidebar */}
      <div className="w-full lg:w-[350px] xl:w-[400px] flex flex-col gap-4">
        <h3 className="text-white font-semibold text-lg">Up Next</h3>
        
        {suggestedVideos.length === 0 ? (
          <div className="text-brand-muted text-sm">No suggestions available.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {suggestedVideos.map((suggested) => (
              <Link 
                key={suggested._id} 
                to={`/video/${suggested._id}`}
                className="flex gap-2 group cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="w-40 h-24 shrink-0 bg-brand-secondary rounded-xl overflow-hidden relative">
                  <img 
                    src={suggested.thumbnail} 
                    alt={suggested.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Duration overlay could go here */}
                </div>
                
                {/* Video Info */}
                <div className="flex flex-col overflow-hidden py-1">
                  <h4 className="text-white text-sm font-semibold line-clamp-2 group-hover:text-brand-accent transition-colors">
                    {suggested.title}
                  </h4>
                  <p className="text-brand-muted text-xs mt-1 truncate">
                    {suggested.owner?.fullName || "Creator"}
                  </p>
                  <p className="text-brand-muted text-xs">
                    {suggested.views} views • {formatTimeAgo(suggested.createdAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Save to Playlist Modal */}
      <SaveToPlaylistModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        videoId={videoId}
      />
    </div>
  );
};

export default VideoDetail;