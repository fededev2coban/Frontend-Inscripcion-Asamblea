import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { usuarioService } from '../../services/usuarioService';
import { rolService } from '../../services/rolService';
import '../Cooperativas/Cooperativas.css';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nombre_completo: '',
    id_rol: '',
    estado: 1
  });
  const [alert, setAlert] = useState(null);

  const loadUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      const response = await usuarioService.getAll();
      setUsuarios(response.data);
    } catch (error) {
      showAlert('Error al cargar Usuarios', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRoles = useCallback(async () => {
    try {
      const response = await rolService.getAll();
      setRoles(response.data);
    } catch (error) {
      console.error('Error al cargar roles', error);
    }
  }, []);

  useEffect(() => {
    loadUsuarios();
    loadRoles();
  }, [loadUsuarios, loadRoles]);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validar que los campos requeridos estén presentes
      if (!formData.username || !formData.nombre_completo || !formData.id_rol) {
        showAlert('Por favor complete todos los campos requeridos', 'error');
        return;
      }

      // Para creación, la contraseña es requerida
      if (!editingId && !formData.password) {
        showAlert('La contraseña es requerida para nuevos usuarios', 'error');
        return;
      }

      const data = {
        username: formData.username,
        nombre_completo: formData.nombre_completo,
        id_rol: parseInt(formData.id_rol),
        estado: parseInt(formData.estado)
      };

      // Solo incluir password si se proporcionó (para creación o actualización con cambio de contraseña)
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
      
      setShowModal(false);
      resetForm();
      loadUsuarios();
    } catch (error) {
      showAlert(error.response?.data?.error || 'Error al guardar Usuario', 'error');
    }
  };

  const handleEdit = (usuario) => {
    setEditingId(usuario.id_usuario);
    setFormData({
      username: usuario.username,
      password: '', // No mostrar la contraseña actual
      nombre_completo: usuario.nombre_completo,
      id_rol: usuario.id_rol,
      estado: usuario.estado
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      try {
        await usuarioService.delete(id);
        showAlert('Usuario eliminado exitosamente');
        loadUsuarios();
      } catch (error) {
        showAlert('Error al eliminar usuario', 'error');
      }
    }
  };

  const handleToggleEstado = async (usuario) => {
    const nuevoEstado = usuario.estado === 1 ? 0 : 1;
    const accion = nuevoEstado === 1 ? 'activar' : 'desactivar';
    
    if (window.confirm(`¿Está seguro de ${accion} este usuario?`)) {
      try {
        await usuarioService.toggleEstado(usuario.id_usuario, { estado: nuevoEstado });
        showAlert(`Usuario ${accion}do exitosamente`);
        loadUsuarios();
      } catch (error) {
        showAlert(`Error al ${accion} usuario`, 'error');
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setShowPassword(false);
    setFormData({
      username: '',
      password: '',
      nombre_completo: '',
      id_rol: '',
      estado: 1
    });
  };

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.rolname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="personas-page">
      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <div className="page-header">
        <h2>Gestión de Usuarios</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => { 
            resetForm(); 
            setShowModal(true); 
          }}
        >
          <FaPlus /> Nuevo Usuario
        </button>
      </div>

      <div className="search-section">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Buscar por usuario, nombre o rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : filteredUsuarios.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Nombre Completo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Fecha Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsuarios.map((usuario) => (
                <tr key={usuario.id_usuario}>
                  <td className="font-semibold">{usuario.username}</td>
                  <td>{usuario.nombre_completo}</td>
                  <td>
                    <span className="badge badge-info">{usuario.rolname}</span>
                  </td>
                  <td>
                    <span className={`badge ${usuario.estado === 1 ? 'badge-success' : 'badge-error'}`}>
                      {usuario.estado === 1 ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>{new Date(usuario.createdat).toLocaleDateString('es-GT')}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-sm btn-secondary" 
                        onClick={() => handleEdit(usuario)} 
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className={`btn btn-sm ${usuario.estado === 1 ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => handleToggleEstado(usuario)} 
                        title={usuario.estado === 1 ? 'Desactivar' : 'Activar'}
                      >
                        {usuario.estado === 1 ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                      <button 
                        className="btn btn-sm btn-danger" 
                        onClick={() => handleDelete(usuario.id_usuario)} 
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">👤</div>
          <p className="empty-state-text">No se encontraron usuarios</p>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
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
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Rol *</label>
                  <select 
                    className="form-select" 
                    value={formData.id_rol}
                    onChange={(e) => setFormData({ ...formData, id_rol: e.target.value })}
                    required
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
                  >
                    <option value="1">Activo</option>
                    <option value="0">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;