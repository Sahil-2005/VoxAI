import api from './api';

export const authService = {
  /**
   * Register a new user
   * @param {Object} data - { name, email, password }
   * @returns {Promise} - { success, data: { token, user } }
   */
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  /**
   * Login user
   * @param {Object} data - { email, password }
   * @returns {Promise} - { success, data: { token, user } }
   */
  login: async (data) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  /**
   * Get current authenticated user
   * @returns {Promise} - { success, data: { user } }
   */
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Update user profile
   * @param {Object} data - { name, avatar }
   * @returns {Promise} - { success, data: { user } }
   */
  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  /**
   * Update Twilio configuration
   * @param {Object} data - { accountSid, authToken, phoneNumber }
   * @returns {Promise} - { success, data: { user } }
   */
  updateTwilioConfig: async (data) => {
    const response = await api.put('/auth/twilio', data);
    return response.data;
  }
};

export default authService;
