import api from './api';

export const lichLamViecService = {
  // Lấy tất cả ca làm việc
  getAllCaLamViec: async () => {
    try {
      const response = await api.get('/lichLamViec/ca-lam-viec');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy lịch làm việc của bác sĩ
  getLichLamViecByDoctorId: async (doctorId) => {
    try {
      const response = await api.get(`/lichLamViec/doctor/${doctorId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy lịch làm việc của bác sĩ theo ngày cụ thể
  getLichLamViecByDoctorIdAndDate: async (doctorId, date) => {
    try {
      const response = await api.get(`/lichLamViec/doctor/${doctorId}/date`, {
        params: { date }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tạo hoặc cập nhật lịch làm việc
  createOrUpdateLichLamViec: async (doctorId, weekSchedule) => {
    try {
      const response = await api.post(`/lichLamViec/doctor/${doctorId}`, {
        weekSchedule
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Xóa lịch làm việc
  deleteLichLamViec: async (id) => {
    try {
      const response = await api.delete(`/lichLamViec/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

