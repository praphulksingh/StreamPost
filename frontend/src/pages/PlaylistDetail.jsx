import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { playlistService } from "../services/playlist.service";
import VideoCard from "../components/VideoCard";
import { FiFolder, FiTrash2 } from "react-icons/fi";
import { formatTimeAgo } from "../utils/formatters";

const PlaylistDetail = () => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        setLoading(true);
        const res = await playlistService.getPlaylistById(playlistId);
        setPlaylist(res.data);
      } catch (err) {
        setError("Failed to load playlist.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylist();
  }, [playlistId]);

  if (loading) return <div className="text-center mt-10 text-white">Loading playlist...</div>;
  if (error || !playlist) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto pb-10 flex flex-col md:flex-row gap-6">
      {/* Sidebar Details */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-brand-secondary/20 p-6 rounded-xl border border-brand-secondary h-fit sticky top-20">
        <div className="w-full aspect-video bg-black rounded-lg mb-4 overflow-hidden flex items-center justify-center">
          {playlist.videos?.length > 0 ? (
            <img src={playlist.videos[0].thumbnail} alt="cover" className="w-full h-full object-cover opacity-80" />
          ) : (
            <FiFolder className="text-5xl text-brand-muted" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">{playlist.name}</h1>
        <p className="text-brand-text mb-4 text-sm">{playlist.description}</p>
        <p className="text-brand-muted text-xs font-semibold mb-4">
          {playlist.videos?.length || 0} videos • Created {formatTimeAgo(playlist.createdAt)}
        </p>
      </div>

      {/* Video List */}
      <div className="flex-1">
        <h2 className="text-xl font-bold text-white mb-4">Videos</h2>
        {playlist.videos?.length === 0 ? (
          <div className="text-center mt-10 text-brand-muted p-10 border border-brand-secondary rounded-xl">
            This playlist is empty. Go add some videos!
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {playlist.videos?.map((video) => (
              <div key={video._id} className="flex gap-4 bg-brand-secondary/10 p-3 rounded-xl border border-brand-secondary hover:bg-brand-secondary/30 transition-colors">
                <Link to={`/video/${video._id}`} className="w-40 sm:w-48 shrink-0">
                  <img src={video.thumbnail} alt={video.title} className="w-full aspect-video object-cover rounded-lg" />
                </Link>
                <div className="flex flex-col justify-start">
                  <Link to={`/video/${video._id}`}>
                    <h3 className="text-white font-semibold text-lg line-clamp-2 hover:text-brand-accent transition-colors">{video.title}</h3>
                  </Link>
                  <p className="text-brand-muted text-sm mt-1">{video.views} views</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetail;