import { api } from "./api";

export const dashboardService = {
  getChannelStats: async () => {
    const response = await api.get("/dashboard/stats");
    return response.data;
  },
  getChannelVideos: async () => {
    const response = await api.get("/dashboard/videos");
    return response.data;
  }
};