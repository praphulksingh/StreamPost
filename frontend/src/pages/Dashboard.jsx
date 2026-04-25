import { useState, useEffect } from "react";
import { dashboardService } from "../services/dashboard.service";
import { videoService } from "../services/video.service";
import { FiEye, FiUsers, FiVideo, FiHeart, FiEdit2, FiTrash2, FiEyeOff } from "react-icons/fi";
import { formatTimeAgo } from "../utils/formatters";
import EditVideoModal from "../components/EditVideoModal";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const statsRes = await dashboardService.getChannelStats();
      const videosRes = await dashboardService.getChannelVideos();
      setStats(statsRes.data);
      setVideos(videosRes.data);
    } catch (error) {
      console.error("Failed to load dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video? This cannot be undone.")) return;
    try {
      await videoService.deleteVideo(videoId);
      setVideos(prev => prev.filter(v => v._id !== videoId));
      // Optionally refresh stats here: fetchDashboardData();
    } catch (error) {
      console.error("Failed to delete video", error);
    }
  };

  const handleTogglePublish = async (videoId) => {
    try {
      const res = await videoService.togglePublishStatus(videoId);
      setVideos(prev => prev.map(v => v._id === videoId ? { ...v, isPublished: res.data.isPublished } : v));
    } catch (error) {
      console.error("Failed to toggle publish status", error);
    }
  };

  const openEditModal = (video) => {
    setSelectedVideo(video);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = (updatedVideo) => {
    setVideos(prev => prev.map(v => v._id === updatedVideo._id ? updatedVideo : v));
  };

  if (loading) return <div className="text-center mt-10 text-brand-muted">Loading dashboard...</div>;

  const statCards = [
    { title: "Total Views", value: stats?.totalViews || 0, icon: <FiEye />, color: "text-blue-500" },
    { title: "Total Subscribers", value: stats?.totalSubscribers || 0, icon: <FiUsers />, color: "text-green-500" },
    { title: "Total Videos", value: stats?.totalVideos || 0, icon: <FiVideo />, color: "text-purple-500" },
    { title: "Total Likes", value: stats?.totalLikes || 0, icon: <FiHeart />, color: "text-red-500" },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-10 px-4">
      <div className="flex justify-between items-center mb-8 border-b border-brand-secondary pb-4 mt-6">
        <h1 className="text-2xl font-bold text-white">Creator Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-brand-secondary/30 border border-brand-secondary rounded-xl p-6 flex flex-col gap-2">
            <div className={`text-3xl ${stat.color} mb-2`}>{stat.icon}</div>
            <p className="text-brand-muted text-sm font-medium">{stat.title}</p>
            <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-brand-secondary/20 border border-brand-secondary rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-secondary">
          <h2 className="text-xl font-bold text-white">Manage Videos</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-brand-muted">
            <thead className="bg-brand-secondary/50 text-brand-text">
              <tr>
                <th className="px-6 py-3 font-semibold">Video</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Date Uploaded</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center">No videos uploaded yet.</td>
                </tr>
              ) : (
                videos.map((video) => (
                  <tr key={video._id} className="border-b border-brand-secondary/50 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-4">
                      <img src={video.thumbnail} alt={video.title} className="w-16 h-10 object-cover rounded" />
                      <span className="font-medium text-white truncate max-w-[200px]">{video.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${video.isPublished ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                        {video.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4">{formatTimeAgo(video.createdAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        {/* Toggle Publish Button */}
                        <button 
                          onClick={() => handleTogglePublish(video._id)}
                          className="text-brand-text hover:text-white transition-colors"
                          title={video.isPublished ? "Unpublish" : "Publish"}
                        >
                          {video.isPublished ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                        </button>
                        
                        {/* Edit Button */}
                        <button 
                          onClick={() => openEditModal(video)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                          title="Edit Video"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        
                        {/* Delete Button */}
                        <button 
                          onClick={() => handleDelete(video._id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Delete Video"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EditVideoModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        video={selectedVideo} 
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default Dashboard;