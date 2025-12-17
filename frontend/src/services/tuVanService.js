import api from './api';

export const tuVanService = {
  // Tạo yêu cầu tư vấn mới
  createTuVan: async (tuVanData) => {
    try {
      const response = await api.post('/tuVan', tuVanData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách tư vấn của user
  getTuVanByUserId: async (userId) => {
    try {
      const response = await api.get(`/tuVan/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách tư vấn của bác sĩ
  getTuVanByDoctorId: async (doctorId) => {
    try {
      const response = await api.get(`/tuVan/doctor/${doctorId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật tư vấn
  updateTuVan: async (tuVanId, updateData) => {
    try {
      const response = await api.put(`/tuVan/${tuVanId}`, updateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Xóa tư vấn
  deleteTuVan: async (tuVanId) => {
    try {
      const response = await api.delete(`/tuVan/${tuVanId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

