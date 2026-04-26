import { api } from "./api";

export const likeService = {
  toggleVideoLike: async (videoId) => {
    const response = await api.post(`/likes/toggle/v/${videoId}`);
    return response.data;
  },
  getLikedVideos: async () => {
    const response = await api.get("/likes/videos");
    return response.data;
  },
  // 👇 ADD THIS NEW METHOD 👇
  toggleCommentLike: async (commentId) => {
    const response = await api.post(`/likes/toggle/c/${commentId}`);
    return response.data;
  }
};