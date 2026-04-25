import { useState, useEffect } from "react";
import { playlistService } from "../services/playlist.service";
import { useAuth } from "../context/AuthContext";
import { FiFolder, FiPlay, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import CreatePlaylistModal from "../components/CreatePlaylistModal";

const Playlists = () => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!user?._id) return;
      try {
        setLoading(true);
        const response = await playlistService.getUserPlaylists(user._id);
        setPlaylists(response.data || []);
      } catch (error) {
        console.error("Failed to load playlists", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [user]);

  // When a new playlist is created in the modal, immediately add it to our UI
  const handlePlaylistCreated = (newPlaylist) => {
    setPlaylists((prev) => [newPlaylist, ...prev]);
  };

  if (loading) return <div className="text-center mt-10 text-brand-muted">Loading playlists...</div>;

  return (
    <div className="max-w-7xl mx-auto pb-10">
      
      {/* Header Row */}
      <div className="flex justify-between items-center mb-8 border-b border-brand-secondary pb-4">
        <div className="flex items-center gap-3">
          <FiFolder className="text-3xl text-brand-accent" />
          <h1 className="text-2xl font-bold text-white">Your Playlists</h1>
        </div>
        
        {/* NEW BUTTON TO OPEN MODAL */}
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="flex items-center gap-2 bg-brand-secondary hover:bg-white/10 text-white px-4 py-2 rounded-full font-medium transition-colors"
        >
          <FiPlus className="w-5 h-5" /> 
          <span className="hidden sm:inline">New Playlist</span>
        </button>
      </div>

      {/* The Modal Component */}
      <CreatePlaylistModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handlePlaylistCreated} 
      />

      {playlists.length === 0 ? (
        <div className="text-center mt-20 text-brand-muted">
          <p className="text-xl font-semibold text-white mb-2">No playlists found</p>
          <p>Create a playlist to start organizing your videos!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <Link key={playlist._id} to={`/playlist/${playlist._id}`} className="group cursor-pointer">
              <div className="relative w-full aspect-video bg-brand-secondary rounded-xl overflow-hidden mb-3 border border-brand-secondary group-hover:border-brand-accent transition-colors">
                
                {playlist.videos?.length > 0 ? (
                  <img src={playlist.videos[0].thumbnail} alt="thumbnail" className="w-full h-full object-cover opacity-80" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#181818]">
                    <FiFolder className="text-4xl text-brand-muted" />
                  </div>
                )}
                
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-black/80 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                  <span className="font-bold text-lg">{playlist.videos?.length || 0}</span>
                  <FiPlay className="text-xl mt-1" />
                </div>
              </div>
              <h3 className="text-white font-semibold text-lg truncate group-hover:text-brand-accent transition-colors">
                {playlist.name}
              </h3>
              <p className="text-brand-muted text-sm truncate">{playlist.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Playlists;