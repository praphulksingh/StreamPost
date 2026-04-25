import { api } from "./api";

export const commentService = {
  getVideoComments: async (videoId, page = 1) => {
    const response = await api.get(`/comments/${videoId}?page=${page}`);
    return response.data;
  },
  addComment: async (videoId, content) => {
    const response = await api.post(`/comments/${videoId}`, { content });
    return response.data;
  }
};