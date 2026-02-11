import api from '../config/api';

export const eventoService = {
  getAll: async () => {
    const response = await api.get('/eventos');
    return response.data;
  },

  getActive: async () => {
    const response = await api.get('/eventos/activos');
    return response.data;
  },

  getUpcoming: async () => {
    const response = await api.get('/eventos/proximos');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/eventos/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/eventos', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/eventos/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/eventos/${id}`);
    return response.data;
  },
};
