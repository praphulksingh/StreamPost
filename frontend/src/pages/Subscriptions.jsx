import { useState, useEffect } from "react";
import { subscriptionService } from "../services/subscription.service";
import { Link } from "react-router-dom";
import { FiYoutube } from "react-icons/fi";
import { useAuth } from "../context/AuthContext"; // 👇 NEW: Import Auth Context

const Subscriptions = () => {
  const { user } = useAuth(); // 👇 NEW: Get the logged-in user
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubscribedChannels = async () => {
      // Guard clause: Ensure we have a user ID before making the request
      if (!user?._id) return; 

      try {
        setLoading(true);
        // 👇 FIX: Pass the user's ID to the backend
        const response = await subscriptionService.getSubscribedChannels(user._id); 
        
        const rawData = response.data?.docs || response.data || [];
        
        const extractedChannels = rawData
          .map(item => item.subscribedChannel || item.channel || item)
          .filter(c => c && c._id);
          
        setChannels(extractedChannels);
      } catch (err) {
        setError("Failed to load subscriptions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribedChannels();
  }, [user]); // Re-run if the user state changes

  if (loading) return <div className="text-center mt-10 text-brand-muted">Loading subscriptions...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="flex items-center gap-3 mb-8 border-b border-brand-secondary pb-4 mt-6">
        <FiYoutube className="text-3xl text-brand-accent" />
        <h1 className="text-2xl font-bold text-white">Your Subscriptions</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {channels.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center mt-20 text-brand-muted">
            <p className="text-xl font-semibold text-white">No subscriptions yet</p>
            <p>Find some amazing creators and subscribe to their channels!</p>
          </div>
        ) : (
          channels.map((channel) => (
            <Link 
              key={channel._id} 
              to={`/channel/${channel.username}`}
              className="bg-brand-secondary/20 border border-brand-secondary rounded-xl p-6 flex flex-col items-center text-center hover:bg-brand-secondary/40 transition-colors"
            >
              <img 
                src={channel.avatar || "https://ui-avatars.com/api/?name=User&background=random"} 
                alt={channel.fullName} 
                className="w-24 h-24 rounded-full object-cover mb-4 border border-brand-secondary"
              />
              <h3 className="text-white font-bold text-lg">{channel.fullName}</h3>
              <p className="text-brand-muted text-sm">@{channel.username}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Subscriptions;