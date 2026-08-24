import api from './api';

export const goalService = {
  async getAllGoals() {
    try {
      const response = await api.get('/api/goals/getAll');
      return response.data;
    } catch (err) {
      if (err.response?.status === 404) {
        try {
          const response = await api.get('/api/goals/getAll');
          return response.data;
        } catch (err2) {
          const response = await api.get('/api/goal/getAll');
          return response.data;
        }
      }
      throw err;
    }
  },

  async getGoalById(goalId) {
    try {
      const response = await api.post('/api/goals/get', { goalId });
      return response.data;
    } catch (err) {
      const response = await api.get(`/api/goals/get?goalId=${goalId}`);
      return response.data;
    }
  },

  /**
   * @param {Object} goalData 
   */
  async createGoal(goalData) {
    const payload = {
      title: goalData.title || goalData.goalName,
      description: goalData.description || '',
      color: goalData.color,
      unit: goalData.unit || 'Problems',
      currentValue: Number(goalData.currentValue ?? goalData.completed ?? goalData.current ?? 0),
      targetValue: Number(goalData.targetValue ?? goalData.target ?? 100),
      targetDate: goalData.targetDate || '31 Dec 2026',
      status: goalData.status || (Number(goalData.currentValue ?? goalData.completed ?? 0) >= Number(goalData.targetValue ?? goalData.target ?? 100) ? 'Completed' : 'Active'),
    };

    try {
      const response = await api.post('/api/goals/create', payload);
      return response.data;
    } catch (err) {
      if (err.response?.status === 404) {
        const response = await api.post('/api/goal/create', payload);
        return response.data;
      }
      throw err;
    }
  },

  /**
   * @param {string} goalId
   * @param {Object} updateFields 
   */
  async updateGoal(goalId, updateFields) {
    const payload = {
      goalId,
      ...(updateFields.title !== undefined ? { title: updateFields.title } : {}),
      ...(updateFields.description !== undefined ? { description: updateFields.description } : {}),
      ...(updateFields.unit !== undefined ? { unit: updateFields.unit } : {}),
      ...(updateFields.currentValue !== undefined
        ? { currentValue: Number(updateFields.currentValue) }
        : updateFields.completed !== undefined
        ? { currentValue: Number(updateFields.completed) }
        : updateFields.current !== undefined
        ? { currentValue: Number(updateFields.current) }
        : {}),
      ...(updateFields.targetValue !== undefined
        ? { targetValue: Number(updateFields.targetValue) }
        : updateFields.target !== undefined
        ? { targetValue: Number(updateFields.target) }
        : {}),
      ...(updateFields.targetDate !== undefined ? { targetDate: updateFields.targetDate } : {}),
      ...(updateFields.status !== undefined
        ? { status: updateFields.status }
        : updateFields.completedStatus !== undefined
        ? { status: updateFields.completedStatus ? 'Completed' : 'Active' }
        : {}),
    };

    try {
      const response = await api.patch('/api/goals/update', payload);
      return response.data;
    } catch (err) {
      if (err.response?.status === 404) {
        try {
          const response = await api.patch('/api/goal/update', payload);
          return response.data;
        } catch (err2) {
          const response = await api.put(`/api/goals/update/${goalId}`, payload);
          return response.data;
        }
      }
      throw err;
    }
  },

  /**
   */
  async deleteGoal(goalId) {
    try {
      const response = await api.delete('/api/goals/delete', { data: { goalId } });
      return response.data;
    } catch (err) {
      if (err.response?.status === 404) {
        try {
          const response = await api.delete(`/api/goals/delete/${goalId}`);
          return response.data;
        } catch (err2) {
          const response = await api.delete(`/api/goal/delete/${goalId}`);
          return response.data;
        }
      }
      throw err;
    }
  },

  async deleteAllGoals() {
    try {
      const response = await api.delete('/api/goals/deleteAll');
      return response.data;
    } catch (err) {
      if (err.response?.status === 404) {
        const response = await api.delete('/api/goal/deleteAll');
        return response.data;
      }
      throw err;
    }
  },
};

export default goalService;


