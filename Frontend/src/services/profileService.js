import api from './api';

export const profileService = {
  async getProfile() {
    try {
      const response = await api.get('/api/profile/get');
      return response.data;
    } catch (err) {
      if (err.response?.status === 404) {
        const fallback = await api.get('/api/profile');
        return fallback.data;
      }
      throw err;
    }
  },

  /**
   * @param {Object} data 
   */
  async updateProfile(data) {
    const payload = {
      username: data.username ?? data.name ?? data.fullName,
      email: data.email,
      targetRole: data.targetRole ?? data.role ?? data.desiredRole,
      collegeName: data.collegeName ?? data.college ?? data.university,
      currentYear: data.currentYear ?? data.year,
      leetcodeName: data.leetcodeName,
      gfgName: data.gfgName ?? data.gfgUsername ?? data.gfg,
    };

    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });

    try {
      const response = await api.patch('/api/profile/update', payload);
      return response.data;
    } catch (err) {
      if (err.response?.status === 404) {
        const fallback = await api.put('/api/profile/update', payload);
        return fallback.data;
      }
      throw err;
    }
  },
};

export default profileService;

