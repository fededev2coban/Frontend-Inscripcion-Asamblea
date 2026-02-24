import React, { useState, useEffect } from 'react';
import { usuarioService } from '../../services/usuarioService';

const UsuarioModal = ({ editingId, roles, onClose, onSuccess, showAlert }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nombre_completo: '',
    id_rol: '',
    estado: 1
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUsuario = async () => {
        try {
        const response = await usuarioService.getById(editingId);
        const usuario = response.data;
        setFormData({
            username: usuario.username,
            password: '',
            nombre_completo: usuario.nombre_completo,
            id_rol: usuario.id_rol,
            estado: usuario.estado
        });
        } catch (error) {
        showAlert('Error al cargar datos del usuario', 'error');
        onClose();
        }
    };
    if (editingId) {
      loadUsuario();
    }
  }, [editingId, onClose, showAlert]);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.username || !formData.nombre_completo || !formData.id_rol) {
      showAlert('Por favor complete todos los campos requeridos', 'error');
      return;
    }

    if (!editingId && !formData.password) {
      showAlert('La contraseña es requerida para nuevos usuarios', 'error');
      return;
    }

    if (formData.password && formData.password.length < 6) {
      showAlert('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    setLoading(true);
    
    try {
      const data = {
        username: formData.username,
        nombre_completo: formData.nombre_completo,
        id_rol: parseInt(formData.id_rol),
        estado: parseInt(formData.estado)
      };

      if (formData.password) {
        data.password = formData.password;
      }

      if (editingId) {
        await usuarioService.update(editingId, data);
        showAlert('Usuario actualizado exitosamente');
      } else {
        await usuarioService.create(data);
        showAlert('Usuario creado exitosamente');
      }
      
      onSuccess();
    } catch (error) {
      showAlert(error.response?.data?.error || 'Error al guardar usuario', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{editingId ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Usuario *</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
                required 
                maxLength={50}
                placeholder="Nombre de usuario para login"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {editingId ? 'Contraseña (dejar en blanco para no cambiar)' : 'Contraseña *'}
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"}
                  className="form-input" 
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                  required={!editingId}
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--gray-600)'
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Nombre Completo *</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.nombre_completo}
                onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })} 
                required 
                maxLength={100}
                placeholder="Nombre completo del usuario"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Rol *</label>
              <select 
                className="form-select" 
                value={formData.id_rol}
                onChange={(e) => setFormData({ ...formData, id_rol: e.target.value })}
                required
                disabled={loading}
              >
                <option value="">-- Seleccionar Rol --</option>
                {roles.map(rol => (
                  <option key={rol.id_rol} value={rol.id_rol}>{rol.rolname}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Estado</label>
              <select 
                className="form-select" 
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
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

export default UsuarioModal;