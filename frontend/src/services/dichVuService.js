import api from './api';

export const dichVuService = {
    getAllDichVu: async () => {
        try {
            const response = await api.get('/dichvu');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getDichVuById: async (id) => {
        try {
            const response = await api.get(`/dichvu/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createDichVu: async (dichVuData) => {
        try {
            const response = await api.post('/dichvu', dichVuData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateDichVu: async (id, dichVuData) => {
        try {
            const response = await api.put(`/dichvu/${id}`, dichVuData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteDichVu: async (id) => {
        try {
            const response = await api.delete(`/dichvu/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};