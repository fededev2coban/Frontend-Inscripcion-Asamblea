import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { cooperativaService } from '../../services/cooperativaService';
import './Cooperativas.css';

const Cooperativas = () => {
  const [cooperativas, setCooperativas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name_cooperativa: '',
    afiliado: 1,
    estado: 1
  });
  const [alert, setAlert] = useState(null);

  const loadCooperativas = useCallback(async () => {
    try {
      setLoading(true);
      const response = await cooperativaService.getAll();
      setCooperativas(response.data);
    } catch (error) {
      showAlert('Error al cargar cooperativas', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCooperativas();
  }, [loadCooperativas])

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await cooperativaService.update(editingId, formData);
        showAlert('Cooperativa actualizada exitosamente');
      } else {
        await cooperativaService.create(formData);
        showAlert('Cooperativa creada exitosamente');
      }
      setShowModal(false);
      resetForm();
      loadCooperativas();
    } catch (error) {
      showAlert('Error al guardar cooperativa', 'error');
    }
  };

  const handleEdit = (cooperativa) => {
    setEditingId(cooperativa.id_cooperativa);
    setFormData({
      name_cooperativa: cooperativa.name_cooperativa,
      afiliado: cooperativa.afiliado,
      estado: cooperativa.estado
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta cooperativa?')) {
      try {
        await cooperativaService.delete(id);
        showAlert('Cooperativa eliminada exitosamente');
        loadCooperativas();
      } catch (error) {
        showAlert('Error al eliminar cooperativa', 'error');
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name_cooperativa: '',
      afiliado: 1,
      estado: 1
    });
  };

  const filteredCooperativas = cooperativas.filter(coop =>
    coop.name_cooperativa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="cooperativas-page">
      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      <div className="page-header">
        <h2>Gestión de Cooperativas</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <FaPlus /> Nueva Cooperativa
        </button>
      </div>

      <div className="search-section">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Buscar cooperativa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : filteredCooperativas.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Afiliado</th>
                <th>Estado</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCooperativas.map((cooperativa) => (
                <tr key={cooperativa.id_cooperativa}>
                  <td>{cooperativa.id_cooperativa}</td>
                  <td className="font-semibold">{cooperativa.name_cooperativa}</td>
                  <td>
                    <span className={`badge ${cooperativa.afiliado ? 'badge-success' : 'badge-warning'}`}>
                      {cooperativa.afiliado ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${cooperativa.estado ? 'badge-success' : 'badge-error'}`}>
                      {cooperativa.estado ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td>{new Date(cooperativa.createdat).toLocaleDateString('es-GT')}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleEdit(cooperativa)}
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(cooperativa.id_cooperativa)}
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
          <div className="empty-state-icon">🏢</div>
          <p className="empty-state-text">No se encontraron cooperativas</p>
          <p className="empty-state-subtext">
            {searchTerm ? 'Intenta con otro término de búsqueda' : 'Crea una nueva cooperativa para comenzar'}
          </p>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Editar Cooperativa' : 'Nueva Cooperativa'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nombre de la Cooperativa *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name_cooperativa}
                    onChange={(e) => setFormData({ ...formData, name_cooperativa: e.target.value })}
                    required
                    maxLength={100}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Afiliado</label>
                    <select
                      className="form-select"
                      value={formData.afiliado}
                      onChange={(e) => setFormData({ ...formData, afiliado: parseInt(e.target.value) })}
                    >
                      <option value={1}>Sí</option>
                      <option value={0}>No</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Estado</label>
                    <select
                      className="form-select"
                      value={formData.estado}
                      onChange={(e) => setFormData({ ...formData, estado: parseInt(e.target.value) })}
                    >
                      <option value={1}>Activa</option>
                      <option value={0}>Inactiva</option>
                    </select>
                  </div>
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

export default Cooperativas;
