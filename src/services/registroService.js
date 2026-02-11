import api from '../config/api';

export const registroService = {
  getAll: async () => {
    const response = await api.get('/registros');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/registros/${id}`);
    return response.data;
  },

  getByEvento: async (idEvento) => {
    const response = await api.get(`/registros/evento/${idEvento}`);
    return response.data;
  },

  getEventoStats: async (idEvento) => {
    const response = await api.get(`/registros/evento/${idEvento}/stats`);
    return response.data;
  },

  getByPersona: async (idPersona) => {
    const response = await api.get(`/registros/persona/${idPersona}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/registros', data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/registros/${id}`);
    return response.data;
  },
};
