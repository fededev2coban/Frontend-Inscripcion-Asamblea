import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaToggleOn, FaToggleOff, FaUserShield } from 'react-icons/fa';
import { usuarioService } from '../../services/usuarioService';
import { rolService } from '../../services/rolService';
import UsuarioModal from './UsuarioModal';
import './Usuarios.css';

const UsuariosList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.rolname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="list-container">
      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <div className="list-header">
        <h3>
          <FaUserShield /> Gestión de Usuarios
        </h3>
        <button 
          className="btn btn-primary" 
          onClick={() => { 
            setEditingId(null);
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
                        onClick={() => {
                          setEditingId(usuario.id_usuario);
                          setShowModal(true);
                        }} 
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
        <UsuarioModal
          editingId={editingId}
          roles={roles}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            loadUsuarios();
            setShowModal(false);
          }}
          showAlert={showAlert}
        />
      )}
    </div>
  );
};

export default UsuariosList;