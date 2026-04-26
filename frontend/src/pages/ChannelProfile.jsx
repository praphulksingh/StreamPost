import { useState, useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { userService } from "../services/user.service";
import { videoService } from "../services/video.service";
import { subscriptionService } from "../services/subscription.service";
import VideoCard from "../components/VideoCard";
import ChannelTweets from "../components/ChannelTweets"; // Handles the entire Community Tab
import { useAuth } from "../context/AuthContext";

const ChannelProfile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("videos"); // "videos" or "tweets"

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        setLoading(true);
        // 1. Fetch profile
        const profileRes = await userService.getChannelProfile(username);
        const channelData = profileRes.data;
        setProfile(channelData);

        // 2. Fetch videos
        const videosRes = await videoService.getAllVideos({ userId: channelData._id });
        setVideos(videosRes.data?.docs || videosRes.data || []);

      } catch (err) {
        setError(err.response?.data?.message || "Failed to load channel");
      } finally {
        setLoading(false);
      }
    };

    fetchChannelData();
  }, [username]);

  const handleSubscribe = async () => {
    try {
      const res = await subscriptionService.toggleSubscription(profile._id);
      setProfile(prev => ({
        ...prev,
        isSubscribed: res.data.isSubscribed,
        subscribersCount: res.data.isSubscribed ? prev.subscribersCount + 1 : prev.subscribersCount - 1
      }));
    } catch (error) {
      console.error("Subscription failed", error);
    }
  };

  if (loading) return <div className="text-center mt-10 text-brand-muted">Loading channel...</div>;
  if (error || !profile) return <div className="text-center mt-10 text-red-500">{error}</div>;

  const isOwner = currentUser?.username === profile.username;

  return (
    <div className="w-full flex flex-col pb-10">
      {/* Cover Image Banner */}
      <div className="w-full h-32 sm:h-48 lg:h-64 bg-brand-secondary relative">
        {profile.coverImage ? (
          <img src={profile.coverImage} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-brand-accent to-purple-900 opacity-50"></div>
        )}
      </div>

      {/* Channel Header Info */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 px-4 sm:px-8">
        <img 
          src={profile.avatar} 
          alt={profile.fullName} 
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-brand-dark -mt-12 sm:-mt-16 relative z-10 bg-brand-secondary"
        />
        
        <div className="flex-1 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center sm:items-start w-full gap-4 mt-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{profile.fullName}</h1>
            <p className="text-brand-muted mt-1 text-sm sm:text-base">
              @{profile.username} • {profile.subscribersCount} subscribers
            </p>
          </div>
          
          {!isOwner && (
            <button 
              onClick={handleSubscribe}
              className={`font-bold px-6 py-2.5 rounded-full transition-colors ${
                profile.isSubscribed 
                  ? "bg-brand-secondary text-white hover:bg-opacity-80" 
                  : "bg-white text-black hover:bg-gray-200"
              }`}
            >
              {profile.isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          )}
          {isOwner && (
            <button 
            onClick={() => navigate("/settings")}
            className="bg-brand-secondary text-white font-medium px-6 py-2.5 rounded-full hover:bg-white/10 transition-colors">
              Customize Channel
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-8 px-4 sm:px-8 mt-8 border-b border-brand-secondary">
        <button 
          onClick={() => setActiveTab("videos")}
          className={`pb-3 font-semibold text-lg transition-colors border-b-2 ${
            activeTab === "videos" ? "border-brand-accent text-white" : "border-transparent text-brand-muted hover:text-white"
          }`}
        >
          Videos
        </button>
        <button 
          onClick={() => setActiveTab("tweets")}
          className={`pb-3 font-semibold text-lg transition-colors border-b-2 ${
            activeTab === "tweets" ? "border-brand-accent text-white" : "border-transparent text-brand-muted hover:text-white"
          }`}
        >
          Community
        </button>
      </div>

      {/* Tab Content */}
      <div className="px-4 sm:px-8 mt-6">
        
        {/* VIDEOS TAB */}
        {activeTab === "videos" && (
          videos.length === 0 ? (
            <p className="text-brand-muted text-center mt-10">This channel hasn't uploaded any videos yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {videos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          )
        )}

        {/* COMMUNITY TAB (Delegated to ChannelTweets Component) */}
        {activeTab === "tweets" && (
          <ChannelTweets channelId={profile._id} />
        )}

      </div>
    </div>
  );
};

export default ChannelProfile;