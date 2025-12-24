import api from './api'

export const lichHenService = {

  getAllLichHen: async () => {
    try {
      const response = await api.get('/lichHen/all')
      return response.data
    } catch (error) {
      throw error
    }
  },


  updateLichHen: async (id, data) => {
    try {
      const response = await api.put(`/lichHen/${id}`, data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  createSTT: async (data) => {
    try {
      const response = await api.post('/lichHen/createstt', data)
      return response.data
    } catch (error) {
      throw error
    }
  }
}