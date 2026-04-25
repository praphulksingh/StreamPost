import { api } from "./api";

export const videoService = {
  getAllVideos: async (params = {}) => {
    const { page = 1, limit = 12, query = "", sortBy = "createdAt", sortType = "desc", userId = "" } = params;
    
    // Build the query string dynamically
    let queryString = `/videos?page=${page}&limit=${limit}&sortBy=${sortBy}&sortType=${sortType}`;
    if (query) queryString += `&query=${encodeURIComponent(query)}`;
    if (userId) queryString += `&userId=${userId}`;

    const response = await api.get(queryString);
    return response.data;
  },
  
  getVideoById: async (videoId) => {
    const response = await api.get(`/videos/${videoId}`);
    return response.data;
  },


  publishVideo: async (formData) => {
    const response = await api.post("/videos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },


 
  updateVideo: async (videoId, formData) => {
    const response = await api.patch(`/videos/${videoId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteVideo: async (videoId) => {
    const response = await api.delete(`/videos/${videoId}`);
    return response.data;
  },

  togglePublishStatus: async (videoId) => {
    const response = await api.patch(`/videos/toggle/publish/${videoId}`);
    return response.data;
  }
};