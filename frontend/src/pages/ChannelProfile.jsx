import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { userService } from "../services/user.service";
import { videoService } from "../services/video.service";
import { subscriptionService } from "../services/subscription.service";
import VideoCard from "../components/VideoCard";
import { useAuth } from "../context/AuthContext";

const ChannelProfile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        setLoading(true);
        // 1. Fetch the channel profile
        const profileRes = await userService.getChannelProfile(username);
        const channelData = profileRes.data;
        setProfile(channelData);

        // 2. Fetch the videos owned by this channel
        const videosRes = await videoService.getAllVideos(1, 50); // Optional: add userId query param to backend
        
        // Temporarily filtering on frontend until backend search is fully wired for userId
        const allVideos = videosRes.data?.docs || videosRes.data;
        const channelVideos = allVideos.filter(v => v.owner._id === channelData._id || v.owner === channelData._id);
        
        setVideos(channelVideos);
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
    <div className="w-full flex flex-col gap-6 pb-10">
      {/* Cover Image Banner */}
      <div className="w-full h-32 sm:h-48 lg:h-64 bg-brand-secondary rounded-xl overflow-hidden relative">
        {profile.coverImage ? (
          <img src={profile.coverImage} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-brand-accent to-purple-900 opacity-50"></div>
        )}
      </div>

      {/* Channel Header Info */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 px-4">
        <img 
          src={profile.avatar} 
          alt={profile.fullName} 
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-brand-dark -mt-12 sm:-mt-16 relative z-10 bg-brand-secondary"
        />
        
        <div className="flex-1 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center sm:items-start w-full gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{profile.fullName}</h1>
            <p className="text-brand-muted mt-1 text-sm sm:text-base">
              @{profile.username} • {profile.subscribersCount} subscribers • {profile.channelsSubscribedToCount} subscribed
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
            <button className="bg-brand-secondary text-white font-medium px-6 py-2.5 rounded-full hover:bg-white/10 transition-colors">
              Customize Channel
            </button>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-brand-secondary mt-2"></div>

      {/* Channel Videos Grid */}
      <div className="px-4">
        <h2 className="text-xl font-bold text-white mb-4">Videos</h2>
        {videos.length === 0 ? (
          <p className="text-brand-muted">This channel hasn't uploaded any videos yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelProfile;