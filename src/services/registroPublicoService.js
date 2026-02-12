import api from '../config/api';

export const registroPublicoService = {
  getEventoPublico: async (link) => {
    const response = await api.get(`/public/evento/${link}`);
    return response.data;
  },

  getCooperativasPublicas: async () => {
    const response = await api.get('/public/cooperativas');
    return response.data;
  },

  registrarEvento: async (link, datos) => {
    const response = await api.post(`/public/registro/${link}`, datos);
    return response.data;
  }
};
