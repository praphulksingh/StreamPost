import { api } from "./api";

export const userService = {
  getChannelProfile: async (username) => {
    const response = await api.get(`/users/c/${username}`);
    return response.data;
  },
  getWatchHistory: async () => {
    const response = await api.get("/users/history");
    return response.data;
  },

  updateAccountDetails: async (data) => {
    const response = await api.patch("/users/update-account", data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await api.post("/users/change-password", data);
    return response.data;
  },

  updateAvatar: async (formData) => {
    const response = await api.patch("/users/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateCoverImage: async (formData) => {
    const response = await api.patch("/users/cover-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getWatchLater: async () => {
    // If you added it to playlist routes, it should be "/playlist/watch-later" or "/playlists/watch-later" depending on your app.js setup. 
    // Assuming your playlist route is api/v1/playlist:
    const response = await api.get("/playlist/watch-later"); 
    return response.data;
  },
};

