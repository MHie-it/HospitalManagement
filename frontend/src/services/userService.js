import api from './api';

export const userService = {
  // Lấy thông tin người dùng
  getUserInfo: async (userId) => {
    try {
      const response = await api.get(`/nguoiDung/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật thông tin người dùng
  updateUserInfo: async (userId, userData) => {
    try {
      const response = await api.put(`/nguoiDung/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách lịch hẹn
  getAppointments: async (userId) => {
    try {
      const response = await api.get(`/lichHen/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách lịch hẹn theo bác sĩ
  getAppointmentsByDoctor: async (doctorId) => {
    try {
      const response = await api.get(`/lichHen/doctor/${doctorId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tạo lịch hẹn mới
  createAppointment: async (appointmentData) => {
    try {
      const response = await api.post('/lichHen', appointmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách khoa
  getKhoaList: async () => {
    try {
      const response = await api.get('/khoa');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách bác sĩ theo khoa
  getDoctorsByKhoa: async (khoaId) => {
    try {
      const response = await api.get(`/doctor/khoa/${khoaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách dịch vụ theo khoa
  getDichVuByKhoa: async (khoaId) => {
    try {
      const response = await api.get(`/dichvu/khoa/${khoaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật lịch hẹn (trạng thái và ghi chú của bác sĩ)
  updateAppointment: async (appointmentId, updateData) => {
    try {
      const response = await api.put(`/lichHen/${appointmentId}`, updateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};


