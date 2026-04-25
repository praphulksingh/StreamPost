import { useState, useEffect } from "react";
import { FiX, FiCheck } from "react-icons/fi";
import { playlistService } from "../services/playlist.service";
import { useAuth } from "../context/AuthContext";

const SaveToPlaylistModal = ({ isOpen, onClose, videoId }) => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch the user's playlists when the modal opens
  useEffect(() => {
    if (!isOpen || !user?._id) return;
    
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        const res = await playlistService.getUserPlaylists(user._id);
        setPlaylists(res.data || []);
      } catch (error) {
        console.error("Failed to fetch playlists", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
    setMessage(""); // Reset status message
  }, [isOpen, user]);

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await playlistService.addVideoToPlaylist(videoId, playlistId);
      setMessage("Added to playlist!");
      
      // Clear the success message after 2 seconds
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      // If the backend says "Video is already in the playlist", show that!
      setMessage(error.response?.data?.message || "Failed to add video.");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
      <div className="bg-[#181818] w-full max-w-sm rounded-2xl border border-brand-secondary p-6 shadow-2xl">
        
        <div className="flex justify-between items-center mb-4 border-b border-brand-secondary pb-4">
          <h2 className="text-xl font-bold text-white">Save to Playlist</h2>
          <button onClick={onClose} className="text-brand-muted hover:text-white transition-colors">
            <FiX className="w-6 h-6"/>
          </button>
        </div>

        {/* Status Message (Success or Error) */}
        {message && (
          <div className="bg-brand-secondary/50 text-brand-accent p-2 rounded mb-4 text-center text-sm font-medium">
            {message}
          </div>
        )}

        {/* Playlist List */}
        {loading ? (
          <p className="text-brand-muted text-center py-4">Loading your playlists...</p>
        ) : playlists.length === 0 ? (
          <p className="text-brand-muted text-center py-4">
            No playlists found. Go to the Playlists tab to create one first!
          </p>
        ) : (
          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto custom-scrollbar">
            {playlists.map((playlist) => (
              <button
                key={playlist._id}
                onClick={() => handleAddToPlaylist(playlist._id)}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-brand-secondary text-left transition-colors text-white group"
              >
                <span className="truncate pr-4">{playlist.name}</span>
                <FiCheck className="text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SaveToPlaylistModal;