import api from './api';

export const settingService = {
  /**
   * @param {Object} data - { oldPassword, newPassword }
   */
  async changePassword(data) {
    const payload = {
      oldPassword: data.oldPassword,
      currentPassword: data.oldPassword,
      newPassword: data.newPassword,
      password: data.newPassword,
      confirmPassword: data.confirmPassword || data.newPassword,
    };

    try {
      const response = await api.patch('/api/settings/changepassword', payload);
      return response.data;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        const fallbackRes = await api.patch('/api/setting/changepassword', payload);
        return fallbackRes.data;
      }
      throw err;
    }
  },

  /**
   * @param {Object} data - { password }
   */
  async deleteAccount(data) {
    const payload = {
      password: data.password,
      currentPassword: data.password,
    };

    try {
      const response = await api.delete('/api/settings/deleteAccount', { data: payload });
      return response.data;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        const fallbackRes = await api.delete('/api/setting/deleteAccount', { data: payload });
        return fallbackRes.data;
      }
      throw err;
    }
  },
};

export default settingService;


