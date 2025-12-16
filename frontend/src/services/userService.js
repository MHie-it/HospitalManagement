import api from './api';

export const userService = {
  // Lấy thông tin người dùng
  getUserInfo: async (userId) => {
    try {
      const response = await api.get(`/nguoi-dung/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật thông tin người dùng
  updateUserInfo: async (userId, userData) => {
    try {
      const response = await api.put(`/nguoi-dung/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách lịch hẹn
  getAppointments: async (userId) => {
    try {
      const response = await api.get(`/lich-hen/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách lịch hẹn theo bác sĩ
  getAppointmentsByDoctor: async (doctorId) => {
    try {
      const response = await api.get(`/lich-hen/doctor/${doctorId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tạo lịch hẹn mới
  createAppointment: async (appointmentData) => {
    try {
      const response = await api.post('/lich-hen', appointmentData);
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
      const response = await api.get(`/dich-vu/khoa/${khoaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};


