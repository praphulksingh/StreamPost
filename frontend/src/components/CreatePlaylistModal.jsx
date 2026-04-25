import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiX, FiFolderPlus } from "react-icons/fi";
import { playlistService } from "../services/playlist.service";

const CreatePlaylistModal = ({ isOpen, onClose, onSuccess }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await playlistService.createPlaylist(data);
      reset(); // Clear the form
      onSuccess(res.data); // Pass the new playlist back to the main page
      onClose(); // Close modal
    } catch (error) {
      console.error("Failed to create playlist", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
      <div className="bg-[#181818] w-full max-w-md rounded-2xl border border-brand-secondary p-6 shadow-2xl">
        
        <div className="flex justify-between items-center mb-6 border-b border-brand-secondary pb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FiFolderPlus className="text-brand-accent" /> New Playlist
          </h2>
          <button onClick={onClose} className="text-brand-muted hover:text-white transition-colors">
            <FiX className="w-6 h-6"/>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">Playlist Name</label>
            <input 
              {...register("name", { required: "Name is required" })} 
              className="w-full bg-brand-dark border border-brand-secondary rounded-lg px-4 py-3 text-white outline-none focus:border-brand-accent transition-colors" 
              placeholder="e.g., Web Dev Tutorials" 
            />
            {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">Description</label>
            <textarea 
              {...register("description", { required: "Description is required" })} 
              className="w-full bg-brand-dark border border-brand-secondary rounded-lg px-4 py-3 text-white outline-none focus:border-brand-accent transition-colors min-h-[100px]" 
              placeholder="What is this playlist about?" 
            />
            {errors.description && <span className="text-red-500 text-xs mt-1">{errors.description.message}</span>}
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-brand-accent text-white font-bold py-3 rounded-lg hover:bg-opacity-90 disabled:opacity-50 transition-all mt-4"
          >
            {loading ? "Creating..." : "Create Playlist"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default CreatePlaylistModal;