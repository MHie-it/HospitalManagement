import api from './api';

export const thietBiService = {
    getAllThietBi: async () => {
        try {
            const response = await api.get('/thietbi');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getThietBiById: async (id) => {
        try {
            const response = await api.get(`/thietbi/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getThietBiByKhoa: async (khoaId) => {
        try {
            const response = await api.get(`/thietbi/khoa/${khoaId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createThietBi: async (thietBiData) => {
        try {
            const response = await api.post('/thietbi', thietBiData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateThietBi: async (id, thietBiData) => {
        try {
            const response = await api.put(`/thietbi/${id}`, thietBiData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteThietBi: async (id) => {
        try {
            const response = await api.delete(`/thietbi/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};