import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaToggleOn, FaToggleOff, FaLock } from 'react-icons/fa';
import { rolService } from '../../services/rolService';
import RolModal from './RolModal';
import '../Usuarios/Usuarios.css';

const RolesList = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState(null);

  const loadRoles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await rolService.getAll();
      setRoles(response.data);
    } catch (error) {
      showAlert('Error al cargar Roles', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Está seguro de eliminar el rol "${nombre}"?`)) {
      try {
        await rolService.delete(id);
        showAlert('Rol eliminado exitosamente');
        loadRoles();
      } catch (error) {
        showAlert(error.response?.data?.error || 'Error al eliminar rol', 'error');
      }
    }
  };

  const handleToggleEstado = async (rol) => {
    const nuevoEstado = rol.estado === 1 ? 0 : 1;
    const accion = nuevoEstado === 1 ? 'activar' : 'desactivar';
    
    if (window.confirm(`¿Está seguro de ${accion} el rol "${rol.rolname}"?`)) {
      try {
        await rolService.update(rol.id_rol, { ...rol, estado: nuevoEstado });
        showAlert(`Rol ${accion}do exitosamente`);
        loadRoles();
      } catch (error) {
        showAlert(`Error al ${accion} rol`, 'error');
      }
    }
  };

  const filteredRoles = roles.filter(rol =>
    rol.rolname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="list-container">
      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <div className="list-header">
        <h3>
          <FaLock /> Gestión de Roles
        </h3>
        <button 
          className="btn btn-primary" 
          onClick={() => { 
            setEditingId(null);
            setShowModal(true); 
          }}
        >
          <FaPlus /> Nuevo Rol
        </button>
      </div>

      <div className="search-section">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Buscar por nombre de rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : filteredRoles.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre del Rol</th>
                <th>Estado</th>
                <th>Fecha Creación</th>
                <th>Última Actualización</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map((rol) => (
                <tr key={rol.id_rol}>
                  <td>{rol.id_rol}</td>
                  <td className="font-semibold">{rol.rolname}</td>
                  <td>
                    <span className={`badge ${rol.estado === 1 ? 'badge-success' : 'badge-error'}`}>
                      {rol.estado === 1 ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>{new Date(rol.createdat).toLocaleDateString('es-GT')}</td>
                  <td>{new Date(rol.updatedat).toLocaleDateString('es-GT')}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-sm btn-secondary" 
                        onClick={() => {
                          setEditingId(rol.id_rol);
                          setShowModal(true);
                        }} 
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className={`btn btn-sm ${rol.estado === 1 ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => handleToggleEstado(rol)} 
                        title={rol.estado === 1 ? 'Desactivar' : 'Activar'}
                      >
                        {rol.estado === 1 ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                      <button 
                        className="btn btn-sm btn-danger" 
                        onClick={() => handleDelete(rol.id_rol, rol.rolname)} 
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
          <div className="empty-state-icon">🔐</div>
          <p className="empty-state-text">No se encontraron roles</p>
        </div>
      )}

      {showModal && (
        <RolModal
          editingId={editingId}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            loadRoles();
            setShowModal(false);
          }}
          showAlert={showAlert}
        />
      )}
    </div>
  );
};

export default RolesList;