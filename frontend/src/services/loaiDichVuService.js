import api from './api';

export const loaiDichVuService = {
    getAllLoaiDichVu: async () => {
        try {
            const response = await api.get('/loaidv');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getLoaiDichVuById: async (id) => {
        try {
            const response = await api.get(`/loaidv/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createLoaiDichVu: async (loaiDichVuData) => {
        try {
            const response = await api.post('/loaidv', loaiDichVuData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateLoaiDichVu: async (id, loaiDichVuData) => {
        try {
            const response = await api.put(`/loaidv/${id}`, loaiDichVuData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteLoaiDichVu: async (id) => {
        try {
            const response = await api.delete(`/loaidv/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};