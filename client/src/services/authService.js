import api from './api';

export const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      localStorage.setItem('voxai_token', response.data.data.token);
      localStorage.setItem('voxai_user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    if (response.data.success) {
      localStorage.setItem('voxai_user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Update Twilio config
  updateTwilioConfig: async (twilioData) => {
    const response = await api.put('/auth/twilio', twilioData);
    if (response.data.success) {
      localStorage.setItem('voxai_user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('voxai_token');
    localStorage.removeItem('voxai_user');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('voxai_token');
  },

  // Get stored user
  getStoredUser: () => {
    const user = localStorage.getItem('voxai_user');
    return user ? JSON.parse(user) : null;
  }
};
