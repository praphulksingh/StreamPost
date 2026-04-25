import { api } from "./api";

export const likeService = {
  toggleVideoLike: async (videoId) => {
    const response = await api.post(`/likes/toggle/v/${videoId}`);
    return response.data;
  }
};