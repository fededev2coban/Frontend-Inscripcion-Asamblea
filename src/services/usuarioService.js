import api from '../config/api';

export const usuarioService = {
  getAll: async () => {
    const response = await api.get('/usuarios');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/usuarios', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/usuarios/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },

  searchByUsername: async (username) => {
    const response = await api.get(`/usuarios/buscar/${username}`);
    return response.data;
  },

  getByRol: async (id_rol) => {
    const response = await api.get(`/usuarios/rol/${id_rol}`);
    return response.data;
  },

  toggleEstado: async (id, data) => {
    const response = await api.patch(`/usuarios/${id}/estado`, data);
    return response.data;
  },
};
