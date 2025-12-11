import api from './api';

export const khoaService = {

    getAllKhoa: async () => {
        try {
            const response = await api.get('/khoa');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // ✅ THÊM các hàm này
    getKhoaId: async (id) => {
        try {
            const response = await api.get(`/khoa/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createKhoa: async (khoaData) => {
        try {
            const response = await api.post('/khoa', khoaData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateKhoa: async (id, khoaData) => {
        try {
            const response = await api.put(`/khoa/${id}`, khoaData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteKhoa: async (id) => {
        try {
            const response = await api.delete(`/khoa/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};