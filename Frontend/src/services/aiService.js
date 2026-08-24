import api from './api';

export const aiService = {
  /**
   * @param {string} prompt
   */
  async askQuestion(prompt) {
    const response = await api.post('/api/ai/ask', { prompt });
    return response.data;
  },

  async getAllChats() {
    try {
      const response = await api.post('/api/ai/getAllChats');
      return response.data;
    } catch (err) {
      try {
        const response = await api.get('/api/ai/getAllChats');
        return response.data;
      } catch (getErr) {
        throw err;
      }
    }
  },
};

export default aiService;

