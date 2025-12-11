import api from './api';

export const doctorService = {
    getAllDoctors: async () => {
        try {
            const response = await api.get('/doctor');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getDoctorID: async (id) => {
        try {
            const response = await api.get(`/doctor/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getDoctorsByKhoa: async (khoaId) => {
        try {
            const response = await api.get(`/doctor/khoa/${khoaId}`);
            if (response.data && response.data.data) {
                return response.data.data;
            } else if (Array.isArray(response.data)) {
                return response.data;
            }
            return [];
        } catch (error) {
            throw error;
        }
    },

};