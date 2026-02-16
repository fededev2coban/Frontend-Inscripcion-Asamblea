import api from '../config/api';

export const catalogoService = {
  getComisiones: async () => {
    const response = await api.get('/catalogos/comisiones');
    return response.data;
  },

  getPuestos: async () => {
    const response = await api.get('/catalogos/puestos');
    return response.data;
  }
};
