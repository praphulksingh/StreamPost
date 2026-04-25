import { api } from "./api";

export const authService = {
  login: async (data) => {
    // data should contain either email/username and password
    const response = await api.post("/users/login", data);
    return response.data;
  },

  register: async (formData) => {
    // We use formData because we are sending files (avatar, coverImage)
    const response = await api.post("/users/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/users/logout");
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/users/current-user");
    return response.data;
  },
};