import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaPlus, FaTrash, FaChartBar } from 'react-icons/fa';
import { registroService } from '../../services/registroService';
import { eventoService } from '../../services/eventoService';
import { personaService } from '../../services/personaService';
import '../Cooperativas/Cooperativas.css';
import './Inscripciones.css';

const Inscripciones = () => {
  const [searchParams] = useSearchParams();
  const [registros, setRegistros] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState(searchParams.get('evento') || '');
  const [formData, setFormData] = useState({
    id_evento: '',
    id_persona: ''
  });
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    loadEventos();
    loadPersonas();
  }, []);

  useEffect(() => {
    if (selectedEvento) {
      loadRegistros(selectedEvento);
      loadStats(selectedEvento);
    }
  }, [selectedEvento]);

  const loadEventos = async () => {
    try {
      const response = await eventoService.getActive();
      setEventos(response.data);
    } catch (error) {
      console.error('Error al cargar eventos');
    }
  };

  const loadPersonas = async () => {
    try {
      const response = await personaService.getAll();
      setPersonas(response.data);
    } catch (error) {
      console.error('Error al cargar personas');
    }
  };

  const loadRegistros = async (eventoId) => {
    try {
      setLoading(true);
      const response = await registroService.getByEvento(eventoId);
      setRegistros(response.data);
    } catch (error) {
      showAlert('Error al cargar inscripciones', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async (eventoId) => {
    try {
      const response = await registroService.getEventoStats(eventoId);
      setStats(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas');
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registroService.create({
        id_evento: parseInt(formData.id_evento),
        id_persona: parseInt(formData.id_persona)
      });
      showAlert('Persona inscrita exitosamente');
      setShowModal(false);
      resetForm();
      if (selectedEvento) {
        loadRegistros(selectedEvento);
        loadStats(selectedEvento);
      }
    } catch (error) {
      showAlert(error.response?.data?.error || 'Error al inscribir persona', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de cancelar esta inscripción?')) {
      try {
        await registroService.delete(id);
        showAlert('Inscripción cancelada exitosamente');
        if (selectedEvento) {
          loadRegistros(selectedEvento);
          loadStats(selectedEvento);
        }
      } catch (error) {
        showAlert('Error al cancelar inscripción', 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id_evento: selectedEvento || '',
      id_persona: ''
    });
  };

  return (
    <div className="inscripciones-page">
      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <div className="page-header">
        <h2>Gestión de Inscripciones</h2>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <FaPlus /> Nueva Inscripción
        </button>
      </div>

      <div className="filter-section">
        <div className="form-group" style={{marginBottom: 0}}>
          <label className="form-label">Filtrar por Evento</label>
          <select
            className="form-select"
            value={selectedEvento}
            onChange={(e) => setSelectedEvento(e.target.value)}
          >
            <option value="">-- Seleccionar Evento --</option>
            {eventos.map(evento => (
              <option key={evento.id_evento} value={evento.id_evento}>
                {evento.nombre_evento} - {new Date(evento.fecha_evento).toLocaleDateString('es-GT')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedEvento && stats && (
        <div className="stats-cards">
          <div className="stat-card-mini">
            <FaChartBar className="stat-icon-mini" />
            <div>
              <div className="stat-value-mini">{stats.estadisticas.total_inscritos}</div>
              <div className="stat-label-mini">Total Inscritos</div>
            </div>
          </div>
          <div className="stat-card-mini">
            <FaChartBar className="stat-icon-mini" />
            <div>
              <div className="stat-value-mini">{stats.estadisticas.total_cooperativas}</div>
              <div className="stat-label-mini">Cooperativas</div>
            </div>
          </div>
          <div className="stat-card-mini">
            <FaChartBar className="stat-icon-mini" />
            <div>
              <div className="stat-value-mini">{stats.estadisticas.inscritos_con_cooperativa}</div>
              <div className="stat-label-mini">Con Cooperativa</div>
            </div>
          </div>
          <div className="stat-card-mini">
            <FaChartBar className="stat-icon-mini" />
            <div>
              <div className="stat-value-mini">{stats.estadisticas.inscritos_sin_cooperativa}</div>
              <div className="stat-label-mini">Sin Cooperativa</div>
            </div>
          </div>
        </div>
      )}

      {selectedEvento ? (
        loading ? (
          <div className="loading"><div className="spinner"></div></div>
        ) : registros.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre Completo</th>
                  <th>DPI</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Cooperativa/Institución</th>
                  <th>Puesto</th>
                  <th>Fecha Inscripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((registro) => (
                  <tr key={registro.id_registro_evento}>
                    <td className="font-semibold">{`${registro.nombres} ${registro.apellidos}`}</td>
                    <td>{registro.dpi}</td>
                    <td>{registro.email || '-'}</td>
                    <td>{registro.telefono || '-'}</td>
                    <td>{registro.name_cooperativa || registro.institucion || '-'}</td>
                    <td>{registro.puesto}</td>
                    <td>{new Date(registro.createdAt).toLocaleDateString('es-GT')}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(registro.id_registro_evento)}
                        title="Cancelar inscripción"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <p className="empty-state-text">No hay inscripciones para este evento</p>
            <p className="empty-state-subtext">Inscribe personas al evento para comenzar</p>
          </div>
        )
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p className="empty-state-text">Selecciona un evento</p>
          <p className="empty-state-subtext">Elige un evento del menú desplegable para ver sus inscripciones</p>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Nueva Inscripción</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Evento *</label>
                  <select
                    className="form-select"
                    value={formData.id_evento}
                    onChange={(e) => setFormData({ ...formData, id_evento: e.target.value })}
                    required
                  >
                    <option value="">-- Seleccionar Evento --</option>
                    {eventos.map(evento => (
                      <option key={evento.id_evento} value={evento.id_evento}>
                        {evento.nombre_evento} - {new Date(evento.fecha_evento).toLocaleDateString('es-GT')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Persona *</label>
                  <select
                    className="form-select"
                    value={formData.id_persona}
                    onChange={(e) => setFormData({ ...formData, id_persona: e.target.value })}
                    required
                  >
                    <option value="">-- Seleccionar Persona --</option>
                    {personas.map(persona => (
                      <option key={persona.id_persona} value={persona.id_persona}>
                        {persona.nombres} {persona.apellidos} - DPI: {persona.dpi}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Inscribir</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inscripciones;
