import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { eventoService } from '../../services/eventoService';
import '../Cooperativas/Cooperativas.css';
import './Eventos.css';

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nombre_evento: '',
    estado_evento: 1,
    fecha_evento: '',
    lugar_evento: '',
    hora_evento: ''
  });
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    loadEventos();
  }, []);

  const loadEventos = async () => {
    try {
      setLoading(true);
      const response = await eventoService.getAll();
      setEventos(response.data);
    } catch (error) {
      showAlert('Error al cargar eventos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await eventoService.update(editingId, formData);
        showAlert('Evento actualizado exitosamente');
      } else {
        await eventoService.create(formData);
        showAlert('Evento creado exitosamente');
      }
      setShowModal(false);
      resetForm();
      loadEventos();
    } catch (error) {
      showAlert('Error al guardar evento', 'error');
    }
  };

  const handleEdit = (evento) => {
    setEditingId(evento.id_evento);
    setFormData({
      nombre_evento: evento.nombre_evento,
      estado_evento: evento.estado_evento,
      fecha_evento: evento.fecha_evento.split('T')[0],
      lugar_evento: evento.lugar_evento,
      hora_evento: evento.hora_evento
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este evento?')) {
      try {
        await eventoService.delete(id);
        showAlert('Evento eliminado exitosamente');
        loadEventos();
      } catch (error) {
        showAlert('Error al eliminar evento', 'error');
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      nombre_evento: '',
      estado_evento: 1,
      fecha_evento: '',
      lugar_evento: '',
      hora_evento: ''
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredEventos = eventos.filter(evento =>
    evento.nombre_evento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evento.lugar_evento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="eventos-page">
      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      <div className="page-header">
        <h2>Gestión de Eventos</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <FaPlus /> Nuevo Evento
        </button>
      </div>

      <div className="search-section">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Buscar evento por nombre o lugar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : filteredEventos.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Evento</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Lugar</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEventos.map((evento) => (
                <tr key={evento.id_evento}>
                  <td>{evento.id_evento}</td>
                  <td className="font-semibold">{evento.nombre_evento}</td>
                  <td>{formatDate(evento.fecha_evento)}</td>
                  <td>{evento.hora_evento}</td>
                  <td>{evento.lugar_evento}</td>
                  <td>
                    <span className={`badge ${evento.estado_evento ? 'badge-success' : 'badge-error'}`}>
                      {evento.estado_evento ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        to={`/inscripciones?evento=${evento.id_evento}`}
                        className="btn btn-sm btn-success"
                        title="Ver inscripciones"
                      >
                        <FaUsers />
                      </Link>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleEdit(evento)}
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(evento.id_evento)}
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
          <div className="empty-state-icon">📅</div>
          <p className="empty-state-text">No se encontraron eventos</p>
          <p className="empty-state-subtext">
            {searchTerm ? 'Intenta con otro término de búsqueda' : 'Crea un nuevo evento para comenzar'}
          </p>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Editar Evento' : 'Nuevo Evento'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nombre del Evento *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.nombre_evento}
                    onChange={(e) => setFormData({ ...formData, nombre_evento: e.target.value })}
                    required
                    maxLength={100}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Fecha *</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.fecha_evento}
                      onChange={(e) => setFormData({ ...formData, fecha_evento: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Hora *</label>
                    <input
                      type="time"
                      className="form-input"
                      value={formData.hora_evento}
                      onChange={(e) => setFormData({ ...formData, hora_evento: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Lugar *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.lugar_evento}
                    onChange={(e) => setFormData({ ...formData, lugar_evento: e.target.value })}
                    required
                    maxLength={100}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Estado</label>
                  <select
                    className="form-select"
                    value={formData.estado_evento}
                    onChange={(e) => setFormData({ ...formData, estado_evento: parseInt(e.target.value) })}
                  >
                    <option value={1}>Activo</option>
                    <option value={0}>Inactivo</option>
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

export default Eventos;
