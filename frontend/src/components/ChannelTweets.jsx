import { useState, useEffect } from "react";
import { tweetService } from "../services/tweet.service";
import { useAuth } from "../context/AuthContext";
import TweetCard from "./TweetCard";

const ChannelTweets = ({ channelId }) => {
  const { user } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [newTweet, setNewTweet] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Check if the logged-in user is viewing their own channel
  const isOwner = user?._id === channelId;

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        setLoading(true);
        const response = await tweetService.getUserTweets(channelId);
        setTweets(response.data?.docs || response.data || []);
      } catch (error) {
        console.error("Failed to fetch tweets", error);
      } finally {
        setLoading(false);
      }
    };

    if (channelId) fetchTweets();
  }, [channelId]);

  const handlePostTweet = async (e) => {
    e.preventDefault();
    if (!newTweet.trim()) return;

    try {
      setSubmitting(true);
      const res = await tweetService.createTweet(newTweet);
      
      // Add the new tweet to the top of the UI immediately
      const createdTweet = { ...res.data, owner: user, likesCount: 0, isLiked: false };
      setTweets([createdTweet, ...tweets]);
      setNewTweet("");
    } catch (error) {
      console.error("Failed to post tweet", error);
      alert("Failed to post tweet. Check backend routes.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    if (!window.confirm("Delete this tweet?")) return;
    try {
      await tweetService.deleteTweet(tweetId);
      setTweets(tweets.filter(t => t._id !== tweetId));
    } catch (error) {
      console.error("Failed to delete tweet", error);
    }
  };

  if (loading) return <div className="text-brand-muted mt-6 text-center">Loading community posts...</div>;

  return (
    <div className="flex flex-col gap-6 mt-6 max-w-4xl mx-auto w-full">
      
      {/* Create Tweet Box (Only visible to the Channel Owner) */}
      {isOwner && (
        <form onSubmit={handlePostTweet} className="bg-brand-secondary/20 border border-brand-secondary rounded-xl p-4 flex gap-4">
          <img 
            src={user.avatar || "https://ui-avatars.com/api/?name=User"} 
            alt="You" 
            className="w-12 h-12 rounded-full object-cover shrink-0"
          />
          <div className="flex flex-col w-full gap-3">
            <textarea 
              value={newTweet}
              onChange={(e) => setNewTweet(e.target.value)}
              placeholder="What's on your mind? Post an update to your subscribers!"
              className="bg-transparent border-b border-brand-secondary text-white pb-2 focus:outline-none focus:border-white transition-colors resize-none min-h-[60px]"
            />
            {newTweet.trim() && (
              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setNewTweet("")}
                  className="px-4 py-2 text-sm text-brand-muted hover:text-white font-medium rounded-full"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-brand-accent text-white px-5 py-2 text-sm font-medium rounded-full hover:bg-opacity-90 disabled:opacity-50"
                >
                  {submitting ? "Posting..." : "Post"}
                </button>
              </div>
            )}
          </div>
        </form>
      )}

      {/* Render Tweets List */}
      {tweets.length === 0 ? (
        <div className="text-center text-brand-muted mt-10">
          This channel hasn't posted any updates yet.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {tweets.map((tweet) => (
            <TweetCard 
              key={tweet._id} 
              tweet={tweet} 
              onDelete={handleDeleteTweet} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChannelTweets;
