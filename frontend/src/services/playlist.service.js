import { api } from "./api";

export const playlistService = {
  createPlaylist: async (data) => {
    const response = await api.post("/playlist", data);
    return response.data;
  },
  getUserPlaylists: async (userId) => {
    const response = await api.get(`/playlist/user/${userId}`);
    return response.data;
  },
  getPlaylistById: async (playlistId) => {
    const response = await api.get(`/playlist/${playlistId}`);
    return response.data;
  },
  addVideoToPlaylist: async (videoId, playlistId) => {
    const response = await api.patch(`/playlist/add/${videoId}/${playlistId}`);
    return response.data;
  }
};