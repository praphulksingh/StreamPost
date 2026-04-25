import { api } from "./api";

export const videoService = {
  getAllVideos: async (page = 1, limit = 12) => {
    const response = await api.get(`/videos?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  getVideoById: async (videoId) => {
    const response = await api.get(`/videos/${videoId}`);
    return response.data;
  },

  // NEW METHOD ADDED
  publishVideo: async (formData) => {
    const response = await api.post("/videos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
};