import { api } from "./api";

export const tweetService = {
  getUserTweets: async (userId) => {
    const response = await api.get(`/tweets/user/${userId}`);
    return response.data;
  },
  createTweet: async (content) => {
    const response = await api.post("/tweets", { content });
    return response.data;
  },
  deleteTweet: async (tweetId) => {
    const response = await api.delete(`/tweets/${tweetId}`);
    return response.data;
  }
};