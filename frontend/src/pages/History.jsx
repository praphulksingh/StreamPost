import { useState, useEffect } from "react";
import { userService } from "../services/user.service";
import VideoCard from "../components/VideoCard";
import { MdHistory } from "react-icons/md";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await userService.getWatchHistory();
        setHistory(response.data);
      } catch (err) {
        setError("Failed to load watch history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <div className="text-center mt-10 text-brand-muted">Loading history...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="flex items-center gap-3 mb-8 border-b border-brand-secondary pb-4">
        <MdHistory className="text-3xl text-brand-accent" />
        <h1 className="text-2xl font-bold text-white">Watch History</h1>
      </div>

      {history.length === 0 ? (
        <div className="text-center mt-20 text-brand-muted">
          <p className="text-xl font-semibold text-white mb-2">No videos in your history</p>
          <p>Videos you watch will show up here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {history.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default History;