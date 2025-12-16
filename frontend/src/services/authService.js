import api from './api';

export const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

   registerDoctor: async (userData) => {
    try {
      const response = await api.post('/auth/registerDoctor', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    // Xóa token và user info khỏi localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Có thể thêm các cleanup khác nếu cần
  },

    getAllAccounts: async () => {
    try {
      const response = await api.get('/auth/accounts');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateAccountStatus: async (userId, isActive) => {
    try {
      const response = await api.put(`/auth/accounts/${userId}/status`, { isActive });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (username, newPassword) => {
    try {
      const response = await api.post('/auth/forgot-password', {
        username,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};