import api from './api';

export const progressService = {
  async getAllProgress() {
    const response = await api.get('/api/progress/getAll');
    return response.data;
  },

  async getSummary() {
    const response = await api.get('/api/progress/summary');
    return response.data;
  },

  /**
   * @param {string} subject
   */
  async getSubjectProgress(subject) {
    const response = await api.get(`/api/progress/get/${encodeURIComponent(subject)}`);
    return response.data;
  },

  /**
   * @param {Object} data 
   */
  async addTopicManually(data) {
    const response = await api.post('/api/progress/addManually', data);
    return response.data;
  },

  /**
   * @param {string} progressId
   */
  async deleteProgress(progressId) {
    const response = await api.delete(`/api/progress/deleteProgess/${encodeURIComponent(progressId)}`);
    return response.data;
  },

  /**
   * @param {string} subject
   */
  async deleteSubject(subject) {
    const response = await api.delete(`/api/progress/deleteSubject/${encodeURIComponent(subject)}`);
    return response.data;
  },

  async deleteAllProgress() {
    const response = await api.delete('/api/progress/deleteAll');
    return response.data;
  },
};

export default progressService;

