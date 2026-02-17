import api from '../config/api';

export const asistenciaService = {
  // Marcar asistencia individual
  marcarAsistencia: async (idRegistro, estado, notas = null) => {
    const response = await api.post(`/asistencia/${idRegistro}/marcar`, {
      estado_asistencia: estado,
      notas
    });
    return response.data;
  },

  // Marcar asistencia masiva
  marcarAsistenciaMasiva: async (registros, estado) => {
    const response = await api.post('/asistencia/masiva', {
      registros,
      estado_asistencia: estado
    });
    return response.data;
  },

  // Obtener lista de asistencia de un evento
  getAsistenciaEvento: async (idEvento) => {
    const response = await api.get(`/asistencia/evento/${idEvento}`);
    return response.data;
  },

  // Obtener bitácora
  getBitacora: async (idRegistro) => {
    const response = await api.get(`/asistencia/${idRegistro}/bitacora`);
    return response.data;
  },

  // Generar reporte Excel
  descargarExcel: async (idEvento) => {
    const response = await api.get(`/reportes/asistencia/${idEvento}/excel`, {
      responseType: 'blob'
    });
    
    // Crear link de descarga
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Asistencia_${idEvento}_${Date.now()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Generar reporte PDF
  descargarPDF: async (idEvento) => {
    const response = await api.get(`/reportes/asistencia/${idEvento}/pdf`, {
      responseType: 'blob'
    });
    
    // Crear link de descarga
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Asistencia_${idEvento}_${Date.now()}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};
