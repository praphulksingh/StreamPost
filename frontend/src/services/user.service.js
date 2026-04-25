import { api } from "./api";

export const userService = {
  getChannelProfile: async (username) => {
    const response = await api.get(`/users/c/${username}`);
    return response.data;
  }
};

getWatchHistory: async () => {
    const response = await api.get("/users/history");
    return response.data;
}