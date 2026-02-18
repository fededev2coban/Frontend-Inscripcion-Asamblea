import api from '../config/api';

export const usuarioService = {
  getAll: async () => {
    const response = await api.get('/usuarios');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/personas/${id}`);
    return response.data;
  },

  getByDpi: async (dpi) => {
    const response = await api.get(`/personas/dpi/${dpi}`);
    return response.data;
  },

  getByCooperativa: async (idCooperativa) => {
    const response = await api.get(`/personas/cooperativa/${idCooperativa}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/personas', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/personas/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/personas/${id}`);
    return response.data;
  },
};
