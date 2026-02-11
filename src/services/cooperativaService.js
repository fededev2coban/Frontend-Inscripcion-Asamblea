import api from '../config/api';

export const cooperativaService = {
  getAll: async () => {
    const response = await api.get('/cooperativas');
    return response.data;
  },

  getActive: async () => {
    const response = await api.get('/cooperativas/activas');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/cooperativas/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/cooperativas', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/cooperativas/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/cooperativas/${id}`);
    return response.data;
  },
};
