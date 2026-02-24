import React, { useState, useEffect } from 'react';
import { rolService } from '../../services/rolService';

const RolModal = ({ editingId, onClose, onSuccess, showAlert }) => {
  const [formData, setFormData] = useState({
    rolname: '',
    estado: 1
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const loadRol = async () => {
    try {
      const response = await rolService.getById(editingId);
      const rol = response.data;
      setFormData({
        rolname: rol.rolname,
        estado: rol.estado
      });
    } catch (error) {
      showAlert('Error al cargar datos del rol', 'error');
      onClose();
    }
  };

  if (editingId) {
    loadRol();
  }
}, [editingId, onClose, showAlert]); // Agregamos estas props que también se usan dentro

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.rolname) {
      showAlert('Por favor ingrese el nombre del rol', 'error');
      return;
    }

    setLoading(true);
    
    try {
      if (editingId) {
        await rolService.update(editingId, formData);
        showAlert('Rol actualizado exitosamente');
      } else {
        await rolService.create(formData);
        showAlert('Rol creado exitosamente');
      }
      
      onSuccess();
    } catch (error) {
      showAlert(error.response?.data?.error || 'Error al guardar rol', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{editingId ? 'Editar Rol' : 'Nuevo Rol'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Nombre del Rol *</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.rolname}
                onChange={(e) => setFormData({ ...formData, rolname: e.target.value })} 
                required 
                maxLength={50}
                placeholder="Ej: Administrador, Operador, Consultor..."
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Estado</label>
              <select 
                className="form-select" 
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: parseInt(e.target.value) })}
                disabled={loading}
              >
                <option value="1">Activo</option>
                <option value="0">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : (editingId ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RolModal;