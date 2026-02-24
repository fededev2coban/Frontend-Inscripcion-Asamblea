import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaTrash, FaChartBar, FaBuilding, FaBriefcase, FaUsers } from 'react-icons/fa';
import { registroService } from '../../services/registroService';
import { eventoService } from '../../services/eventoService';
import '../Cooperativas/Cooperativas.css';
import './Inscripciones.css';

const Inscripciones = () => {
  const [searchParams] = useSearchParams();
  const [registros, setRegistros] = useState({ inscritostotal: [], internos: [], externos: [], total: 0 });
  const [eventos, setEventos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEvento, setSelectedEvento] = useState(searchParams.get('evento') || '');
  const [tabActivo, setTabActivo] = useState('internos'); // 'internos' o 'externos'
  const [alert, setAlert] = useState(null);

  const loadEventos = useCallback(async () => {
    try {
      const response = await eventoService.getActive();
      setEventos(response.data);
    } catch (error) {
      console.error('Error al cargar eventos');
    }
  }, []);

  const loadRegistros = useCallback(async (eventoId) => {
    try {
      setLoading(true);
      const response = await registroService.getByEvento(eventoId);
      setRegistros(response.data);
    } catch (error) {
      showAlert('Error al cargar inscripciones', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStats = useCallback(async (eventoId) => {
    try {
      const response = await registroService.getEventoStats(eventoId);
      setStats(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas');
    }
  }, []);

  useEffect(() => {
    loadEventos();
  }, [loadEventos]);

  useEffect(() => {
    if (selectedEvento) {
      loadRegistros(selectedEvento);
      loadStats(selectedEvento);
    }
  }, [selectedEvento, loadRegistros, loadStats]);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
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

  return (
    <div className="inscripciones-page">
      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <div className="page-header">
        <h2>Gestión de Inscripciones</h2>
      </div>

      <div className="filter-section">
        <div className="form-group" style={{marginBottom: 0}}>
          <label className="form-label">Seleccionar Evento</label>
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
              <div className="stat-value-mini">{stats.total_inscritos}</div>
              <div className="stat-label-mini">Total Inscritos</div>
            </div>
          </div>
          <div className="stat-card-mini">
            <FaBuilding className="stat-icon-mini" />
            <div>
              <div className="stat-value-mini">{stats.total_internos}</div>
              <div className="stat-label-mini">Cooperativas</div>
            </div>
          </div>
          <div className="stat-card-mini">
            <FaBriefcase className="stat-icon-mini" />
            <div>
              <div className="stat-value-mini">{stats.total_externos}</div>
              <div className="stat-label-mini">Externos</div>
            </div>
          </div>
        </div>
      )}

      {selectedEvento ? (
        <>
          {/* TABS */}
          <div className="tabs-container">
            <button
              className={`tab-btn ${tabActivo === 'inscritos' ? 'active' : ''}`}
              onClick={() => setTabActivo('inscritos')}
            >
              <FaUsers /> Total Inscritos ({registros.inscritostotal.length})
            </button>
            <button
              className={`tab-btn ${tabActivo === 'internos' ? 'active' : ''}`}
              onClick={() => setTabActivo('internos')}
            >
              <FaBuilding /> Cooperativas ({registros.internos.length})
            </button>
            <button
              className={`tab-btn ${tabActivo === 'externos' ? 'active' : ''}`}
              onClick={() => setTabActivo('externos')}
            >
              <FaBriefcase /> Externos ({registros.externos.length})
            </button>
          </div>

          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : (
            <>
              {/* TAB INSCRITOS */}
              {tabActivo === 'inscritos' && (
                registros.inscritostotal.length > 0 ? (
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Nombre Completo</th>
                          <th>DPI</th>
                          <th>Email</th>
                          <th>Teléfono</th>
                          <th>Institución / Coop.</th>
                          <th>Puesto</th>
                          <th>Comisión</th>
                          <th>Fecha</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registros.inscritostotal.map((registro) => (
                          <tr key={registro.id_registro_evento}>
                            <td className="font-semibold">{`${registro.nombres} ${registro.apellidos}`}</td>
                            <td>{registro.dpi}</td>
                            <td>{registro.email || '-'}</td>
                            <td>{registro.telefono || '-'}</td>
                            <td>{registro.institucion || '-'}</td>
                            <td>
                              <span className="badge badge-success">{registro.puesto || '-'}</span>
                            </td>
                            <td>
                              {registro.comision ? (
                                <span className="badge badge-info">{registro.comision}</span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td>{new Date(registro.createdat).toLocaleDateString('es-GT')}</td>
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
                    <p className="empty-state-text">No hay total de inscritos</p>
                  </div>
                )
              )}
              {/* TAB INTERNOS */}
              {tabActivo === 'internos' && (
                registros.internos.length > 0 ? (
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Nombre Completo</th>
                          <th>DPI</th>
                          <th>Email</th>
                          <th>Teléfono</th>
                          <th>Cooperativa</th>
                          <th>Comisión</th>
                          <th>Puesto</th>
                          <th>Fecha</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registros.internos.map((registro) => (
                          <tr key={registro.id_registro_evento}>
                            <td className="font-semibold">{`${registro.nombres} ${registro.apellidos}`}</td>
                            <td>{registro.dpi}</td>
                            <td>{registro.email || '-'}</td>
                            <td>{registro.telefono || '-'}</td>
                            <td>{registro.name_cooperativa}</td>
                            <td><span className="badge badge-info">{registro.name_comision}</span></td>
                            <td><span className="badge badge-success">{registro.name_puesto}</span></td>
                            <td>{new Date(registro.createdat).toLocaleDateString('es-GT')}</td>
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
                    <div className="empty-state-icon">🏢</div>
                    <p className="empty-state-text">No hay inscritos de cooperativas</p>
                  </div>
                )
              )}

              {/* TAB EXTERNOS */}
              {tabActivo === 'externos' && (
                registros.externos.length > 0 ? (
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Nombre Completo</th>
                          <th>DPI</th>
                          <th>Email</th>
                          <th>Teléfono</th>
                          <th>Institución</th>
                          <th>Puesto</th>
                          <th>Fecha</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registros.externos.map((registro) => (
                          <tr key={registro.id_registro_evento}>
                            <td className="font-semibold">{`${registro.nombres} ${registro.apellidos}`}</td>
                            <td>{registro.dpi}</td>
                            <td>{registro.email || '-'}</td>
                            <td>{registro.telefono || '-'}</td>
                            <td>{registro.institucion}</td>
                            <td><span className="badge badge-info">{registro.puesto}</span></td>
                            <td>{new Date(registro.createdat).toLocaleDateString('es-GT')}</td>
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
                    <div className="empty-state-icon">💼</div>
                    <p className="empty-state-text">No hay inscritos externos</p>
                  </div>
                )
              )}
            </>
          )}
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p className="empty-state-text">Selecciona un evento</p>
        </div>
      )}
    </div>
  );
};

export default Inscripciones;
