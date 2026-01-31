import api from './api';

export const botService = {
  // Get all bots
  getBots: async () => {
    const response = await api.get('/bots');
    return response.data;
  },

  // Get single bot
  getBot: async (botId) => {
    const response = await api.get(`/bots/${botId}`);
    return response.data;
  },

  // Create bot
  createBot: async (botData) => {
    const response = await api.post('/bots', botData);
    return response.data;
  },

  // Update bot
  updateBot: async (botId, botData) => {
    const response = await api.put(`/bots/${botId}`, botData);
    return response.data;
  },

  // Delete bot
  deleteBot: async (botId) => {
    const response = await api.delete(`/bots/${botId}`);
    return response.data;
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/bots/stats/dashboard');
    return response.data;
  }
};
