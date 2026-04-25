import { api } from "./api";

export const subscriptionService = {
  toggleSubscription: async (channelId) => {
    const response = await api.post(`/subscriptions/c/${channelId}`);
    return response.data;
  }
};