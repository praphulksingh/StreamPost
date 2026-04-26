import { api } from "./api";

export const subscriptionService = {
  toggleSubscription: async (channelId) => {
    const response = await api.post(`/subscriptions/c/${channelId}`);
    return response.data;
  },
  
  // 👇 FIX: Accept the subscriberId and place it in the URL
  getSubscribedChannels: async (subscriberId) => {
    const response = await api.get(`/subscriptions/u/${subscriberId}`); 
    return response.data;
  }
};