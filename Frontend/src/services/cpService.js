import api from './api';

export const cpService = {
  async getGfgData() {
    const candidateConfigs = [
      { url: '/api/cp/gfgData', method: 'post' },
      { url: '/api/cp/gfgdata', method: 'post' },
      { url: '/api/cp/gfgData', method: 'get' },
      { url: '/api/cp/gfg', method: 'get' },
      { url: '/api/cp/gfg', method: 'post' },
    ];

    let lastErr = null;
    for (const item of candidateConfigs) {
      try {
        const response = await api[item.method](item.url);
        return response.data;
      } catch (err) {
        lastErr = err;
        if (err.response?.status === 404) continue;
        throw err;
      }
    }
    throw lastErr || new Error('Failed to fetch CP data');
  },
};

export default cpService;

