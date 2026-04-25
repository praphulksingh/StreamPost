import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiX, FiUploadCloud } from "react-icons/fi";
import { videoService } from "../services/video.service";

const VideoUploadModal = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("videoFile", data.videoFile[0]);
    formData.append("thumbnail", data.thumbnail[0]);

    try {
      await videoService.publishVideo(formData);
      reset(); // Clear the form
      onClose(); // Close the modal
      window.location.reload(); // Refresh the page to see the new video
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
      <div className="bg-[#181818] w-full max-w-2xl rounded-2xl border border-brand-secondary shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-brand-secondary">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FiUploadCloud className="text-brand-accent" /> Upload Video
          </h2>
          <button onClick={onClose} disabled={loading} className="p-2 text-brand-muted hover:text-white hover:bg-brand-secondary rounded-full transition-colors disabled:opacity-50">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <form id="upload-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-brand-text text-sm font-medium mb-1">Title</label>
              <input
                {...register("title", { required: "Title is required" })}
                className="w-full bg-brand-dark border border-brand-secondary rounded-lg px-4 py-2 focus:outline-none focus:border-brand-accent text-white"
                placeholder="Add a catchy title"
              />
              {errors.title && <span className="text-red-500 text-xs mt-1">{errors.title.message}</span>}
            </div>

            <div>
              <label className="block text-brand-text text-sm font-medium mb-1">Description</label>
              <textarea
                {...register("description", { required: "Description is required" })}
                className="w-full bg-brand-dark border border-brand-secondary rounded-lg px-4 py-2 focus:outline-none focus:border-brand-accent text-white min-h-[100px]"
                placeholder="Tell viewers about your video"
              />
              {errors.description && <span className="text-red-500 text-xs mt-1">{errors.description.message}</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-brand-secondary rounded-lg p-4 bg-brand-dark/50">
                <label className="block text-brand-text text-sm font-medium mb-2">Video File</label>
                <input
                  type="file"
                  accept="video/*"
                  {...register("videoFile", { required: "Video file is required" })}
                  className="w-full text-sm text-brand-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-secondary file:text-white hover:file:bg-brand-accent"
                />
              </div>

              <div className="border border-brand-secondary rounded-lg p-4 bg-brand-dark/50">
                <label className="block text-brand-text text-sm font-medium mb-2">Thumbnail Image</label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("thumbnail", { required: "Thumbnail is required" })}
                  className="w-full text-sm text-brand-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-secondary file:text-white hover:file:bg-brand-accent"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-brand-secondary flex justify-end gap-3 bg-[#181818]">
          <button 
            type="button" 
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 rounded-lg font-medium hover:bg-brand-secondary transition-colors disabled:opacity-50 text-white"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="upload-form"
            disabled={loading}
            className="px-6 py-2 bg-brand-accent hover:bg-opacity-90 text-white font-bold rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? "Uploading to Cloudinary..." : "Publish Video"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default VideoUploadModal;
