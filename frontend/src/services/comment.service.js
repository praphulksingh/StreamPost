import { api } from "./api";

export const commentService = {
  getVideoComments: async (videoId) => {
    const response = await api.get(`/comments/${videoId}`);
    return response.data;
  },
  addComment: async (videoId, data) => {
    const response = await api.post(`/comments/${videoId}`, data);
    return response.data;
  },
  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/c/${commentId}`);
    return response.data;
  },
  
  addReply: async (commentId, data) => {
    // This assumes your backend route looks like /comments/reply/:commentId
    // Adjust the URL if you named your backend route differently!
    const response = await api.post(`/comments/reply/${commentId}`, data);
    return response.data;
  }
};