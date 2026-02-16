import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { usuarioService } from '../../services/usuarioService';
import { rolService } from '../../services/rolService';
import '../Cooperativas/Cooperativas.css';

const Personas = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [rol, setRol] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    estado: 1,
    id_rol: '',
    nombre_completo: '',

  });
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    loadUsuarios();
    loadCooperativas();
  }, []);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const response = await usuarioService.getAll();
      setUsuarios(response.data);
    } catch (error) {
      showAlert('Error al cargar Usuarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadCooperativas = async () => {
    try {
      const response = await rolService.getActive();
      setRol(response.data);
    } catch (error) {
      console.error('Error al cargar cooperativas');
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        dpi: parseInt(formData.dpi),
        telefono: formData.telefono ? formData.telefono.toString() : null,
        id_rol: parseInt(formData.id_rol),
      };

      if (editingId) {
        await usuarioService.update(editingId, data);
        showAlert('Usuario actualizada exitosamente');
      } else {
        await usuarioService.create(data);
        showAlert('Usuario creada exitosamente');
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
      estado: usuario.estado,
      id_rol: usuario.id_rol,
      nombre_completo: usuario.nombre_completo,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta persona?')) {
      try {
        await usuarioService.delete(id);
        showAlert('Persona eliminada exitosamente');
        loadUsuarios();
      } catch (error) {
        showAlert('Error al eliminar persona', 'error');
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      nombres: '',
      apellidos: '',
      email: '',
      dpi: '',
      telefono: '',
      id_rol: '',
      institucion: '',
      puesto: ''
    });
  };

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.rolname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.nombre_completo.toString().includes(searchTerm)
  );

  return (
    <div className="personas-page">
      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <div className="page-header">
        <h2>Gestión de Personas</h2>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <FaPlus /> Nueva Persona
        </button>
      </div>

      <div className="search-section">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o DPI..."
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
                <th>Nombre de Usuario</th>
                <th>estado</th>
                <th>nombre rol</th>
                <th>Nombre completo</th>
                <th>Fecha de creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsuarios.map((usuario) => (
                <tr key={usuario.id_usuario}>
                  <td className="font-semibold">{`${usuario.username}`}</td>
                  <td>
                    <span className={`badge ${usuario.estado ? 'badge-success' : 'badge-error'}`}>
                      {usuario.estado ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  {/* <td>{usuario.rolname}</td> */}
                  
                  <td>{usuario.nombre_completo}</td>
                  <td>{new Date(usuario.createdAt).toLocaleDateString('es-GT')}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(usuario)} title="Editar">
                        <FaEdit />
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(usuario.id_usuario)} title="Eliminar">
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
          <div className="empty-state-icon">👥</div>
          <p className="empty-state-text">No se encontraron usuarios</p>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Editar Persona' : 'Nueva Persona'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nombres *</label>
                    <input type="text" className="form-input" value={formData.nombres}
                      onChange={(e) => setFormData({ ...formData, nombres: e.target.value })} required maxLength={50} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Apellidos *</label>
                    <input type="text" className="form-input" value={formData.apellidos}
                      onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })} required maxLength={50} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">DPI *</label>
                    <input type="number" className="form-input" value={formData.dpi}
                      onChange={(e) => setFormData({ ...formData, dpi: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Teléfono</label>
                    <input type="number" className="form-input" value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} maxLength={100} />
                </div>

                <div className="form-group">
                  <label className="form-label">Cooperativa</label>
                  <select className="form-select" value={formData.id_rol}
                    onChange={(e) => setFormData({ ...formData, id_rol: e.target.value })}>
                    <option value="">-- Seleccionar Cooperativa --</option>
                    {rol.map(coop => (
                      <option key={coop.id_rol} value={coop.id_rol}>{coop.name_cooperativa}</option>
                    ))}
                  </select>
                  <small style={{color: 'var(--gray-500)', fontSize: '0.8125rem'}}>
                    Si no pertenece a ninguna cooperativa, complete el campo "Institución"
                  </small>
                </div>

                <div className="form-group">
                  <label className="form-label">Institución</label>
                  <input type="text" className="form-input" value={formData.institucion}
                    onChange={(e) => setFormData({ ...formData, institucion: e.target.value })} maxLength={100}
                    placeholder="Solo si no pertenece a una cooperativa" />
                </div>

                <div className="form-group">
                  <label className="form-label">Puesto *</label>
                  <input type="text" className="form-input" value={formData.puesto}
                    onChange={(e) => setFormData({ ...formData, puesto: e.target.value })} required maxLength={50} />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Personas;
