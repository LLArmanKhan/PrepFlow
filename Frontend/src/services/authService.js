import api from './api';

export const authService = {
  /**
   * @param {Object} userData 
   */
  async register(userData) {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  /**
   * @param {string} email
   * @param {string} otp
   */
  async verifyOtp(email, otp) {
    const response = await api.post('/api/auth/verify', { email, otp });
    return response.data;
  },

  /**
   * @param {string} identifier
   * @param {string} password
   */
  async login(identifier, password) {
    const cleanId = (identifier || '').trim();
    const isEmail = cleanId.includes('@');
    
    const payload = {
      identifier: cleanId,
      email: cleanId,
      username: cleanId,
      password,
    };

    const response = await api.post('/api/auth/login', payload);
    const data = response.data;

    if (data.accessToken) {
      localStorage.setItem('token', data.accessToken);
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  },

  async refreshToken() {
    const response = await api.post('/api/auth/refreshToken');
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
    }
    return response.data;
  },

  async logout() {
    try {
      await api.post('/api/auth/logout');
    } catch (e) {
      console.warn('Logout API failed:', e);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  async logoutAll() {
    try {
      await api.post('/api/auth/logoutAll');
    } catch (e) {
      console.warn('LogoutAll API failed:', e);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getStoredUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('token');
  },
};

export default authService;
