import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FaCheck, FaTimes, FaClock, FaFileExcel, FaFilePdf,
  FaSearch, FaUserCheck, FaChartBar, FaBuilding, FaBriefcase,
  FaUndo, FaUsers
} from 'react-icons/fa';
import { asistenciaService } from '../../services/asistenciaService';
import { eventoService } from '../../services/eventoService';
import '../Cooperativas/Cooperativas.css';
import './Asistencia.css';

// ─── Constantes de estado ────────────────────────────────────────────────────
const ESTADOS = {
  todos:       { key: 'todos',      label: 'Total Inscritos', icon: <FaUsers />,     color: 'blue'   },
  registrado:  { key: 'registrado', label: 'Pendientes',      icon: <FaClock />,     color: 'warning'},
  asistio:     { key: 'asistio',    label: 'Asistieron',      icon: <FaUserCheck />, color: 'success'},
  no_asistio:  { key: 'no_asistio', label: 'No Asistieron',   icon: <FaTimes />,     color: 'error'  },
};

const TABS = [
  { key: 'total',    label: 'Total',    icon: <FaChartBar /> },
  { key: 'internos', label: 'Internos', icon: <FaBuilding /> },
  { key: 'externos', label: 'Externos', icon: <FaBriefcase /> },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const badgeClase = (estado) => {
  if (estado === 'asistio')    return 'badge badge-success';
  if (estado === 'no_asistio') return 'badge badge-error';
  return 'badge badge-warning';
};

const badgeLabel = (estado) => {
  if (estado === 'asistio')    return 'Asistió';
  if (estado === 'no_asistio') return 'No asistió';
  return 'Pendiente';
};

// ─── Botones de acción por estado actual ─────────────────────────────────────
const BotonesAccion = ({ registro, onMarcar }) => {
  const actual = registro.estado_asistencia;
  return (
    <div className="action-buttons">
      {actual !== 'asistio' && (
        <button
          className="btn btn-sm btn-success"
          onClick={() => onMarcar(registro.id_registro_evento, 'asistio')}
          title="Marcar como asistió"
        >
          <FaCheck /> Asistió
        </button>
      )}
      {actual !== 'no_asistio' && (
        <button
          className="btn btn-sm btn-danger"
          onClick={() => onMarcar(registro.id_registro_evento, 'no_asistio')}
          title="Marcar como no asistió"
        >
          <FaTimes /> No asistió
        </button>
      )}
      {actual !== 'registrado' && (
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => onMarcar(registro.id_registro_evento, 'registrado')}
          title="Revertir a pendiente"
        >
          <FaUndo /> Pendiente
        </button>
      )}
    </div>
  );
};

// ─── Componente de tabla unificada ───────────────────────────────────────────
const TablaParticipantes = ({ lista, onMarcar, esInterno, esExterno }) => {
  if (lista.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📭</div>
        <p className="empty-state-text">No hay participantes en esta sección</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>DPI</th>
            <th>Email</th>
            {!esExterno && <th>Cooperativa</th>}
            {!esExterno && <th>Comisión</th>}
            {!esInterno && <th>Institución</th>}
            <th>Puesto</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((r) => (
            <tr key={r.id_registro_evento} className={`fila-${r.estado_asistencia}`}>
              <td className="font-semibold">{r.nombres} {r.apellidos}</td>
              <td>{r.dpi}</td>
              <td>{r.email || '—'}</td>
              {!esExterno && <td>{r.tipo_participante === 'interno' ? r.cooperativa : '—'}</td>}
              {!esExterno && <td>{r.tipo_participante === 'interno' ? r.comision : '—'}</td>}
              {!esInterno && <td>{r.tipo_participante === 'externo' ? r.institucion : '—'}</td>}
              <td>{r.tipo_participante === 'interno' ? r.puesto_interno : r.puesto_externo}</td>
              <td><span className={badgeClase(r.estado_asistencia)}>{badgeLabel(r.estado_asistencia)}</span></td>
              <td><BotonesAccion registro={r} onMarcar={onMarcar} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── Componente Principal ─────────────────────────────────────────────────────
const Asistencia = () => {
  const [searchParams] = useSearchParams();
  const [eventos, setEventos]           = useState([]);
  const [selectedEvento, setSelectedEvento] = useState(searchParams.get('evento') || '');
  const [todos, setTodos]               = useState([]);   // todos los registros del evento
  const [loading, setLoading]           = useState(false);
  const [searchTerm, setSearchTerm]     = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');   // card activa
  const [tabActivo, setTabActivo]       = useState('total');   // tab activa
  const [alert, setAlert]               = useState(null);
  const [generando, setGenerando]       = useState(false);

  // ── Carga inicial ──────────────────────────────────────────────────────────

  const loadAsistencia = useCallback(async (id) => {
    try {
      setLoading(true);
      const res = await asistenciaService.getAsistenciaEvento(id);
      const todo = [
        ...res.data.asistieron,
        ...res.data.registrados,
        ...res.data.no_asistieron,
      ];
      setTodos(todo);
    } catch {
      showAlert('Error al cargar asistencia', 'error');
    } finally {
      setLoading(false);
    }
  }, []); 

  useEffect(() => { 
    if (selectedEvento) {
      loadAsistencia(selectedEvento); 
    }
  }, [selectedEvento, loadAsistencia]);

  const loadEventos = useCallback(async () => {
    try {
      const res = await eventoService.getActive();
      setEventos(res.data);
    } catch { /* silencioso */ }
  }, []);

  useEffect(() => { 
    loadEventos(); 
  }, [loadEventos]);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  // ── Estadísticas ───────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:      todos.length,
    asistio:    todos.filter(r => r.estado_asistencia === 'asistio').length,
    registrado: todos.filter(r => r.estado_asistencia === 'registrado').length,
    no_asistio: todos.filter(r => r.estado_asistencia === 'no_asistio').length,
    porcentaje: todos.length
      ? ((todos.filter(r => r.estado_asistencia === 'asistio').length / todos.length) * 100).toFixed(1)
      : 0,
  }), [todos]);

  // ── Filtros encadenados: estado → tipo → búsqueda ─────────────────────────
  const listaFiltrada = useMemo(() => {
    let lista = todos;

    // 1. Filtro por card (estado)
    if (filtroEstado !== 'todos') {
      lista = lista.filter(r => r.estado_asistencia === filtroEstado);
    }

    // 2. Filtro por tab (tipo)
    if (tabActivo === 'internos') {
      lista = lista.filter(r => r.tipo_participante === 'interno');
    } else if (tabActivo === 'externos') {
      lista = lista.filter(r => r.tipo_participante === 'externo');
    }

    // 3. Búsqueda texto
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      lista = lista.filter(r =>
        `${r.nombres} ${r.apellidos}`.toLowerCase().includes(term) ||
        r.dpi?.toString().includes(term) ||
        r.cooperativa?.toLowerCase().includes(term) ||
        r.institucion?.toLowerCase().includes(term)
      );
    }

    return lista;
  }, [todos, filtroEstado, tabActivo, searchTerm]);

  // ── Sub-conteos para el tab activo ─────────────────────────────────────────
  const subStats = useMemo(() => {
    const base = filtroEstado === 'todos' ? todos
      : todos.filter(r => r.estado_asistencia === filtroEstado);
    return {
      total:    base.length,
      internos: base.filter(r => r.tipo_participante === 'interno').length,
      externos: base.filter(r => r.tipo_participante === 'externo').length,
    };
  }, [todos, filtroEstado]);

  // ── Acción: marcar/desmarcar asistencia ────────────────────────────────────
  const handleMarcar = async (idRegistro, nuevoEstado) => {
    try {
      await asistenciaService.marcarAsistencia(idRegistro, nuevoEstado);
      // Actualizar localmente (sin reload completo)
      setTodos(prev =>
        prev.map(r =>
          r.id_registro_evento === idRegistro
            ? { ...r, estado_asistencia: nuevoEstado }
            : r
        )
      );
      showAlert(`Estado actualizado: ${badgeLabel(nuevoEstado)}`);
    } catch {
      showAlert('Error al actualizar estado', 'error');
    }
  };

  // ── Exportar ───────────────────────────────────────────────────────────────
  const handleExcel = async () => {
    try { setGenerando(true); await asistenciaService.descargarExcel(selectedEvento); showAlert('Excel generado'); }
    catch { showAlert('Error al generar Excel', 'error'); }
    finally { setGenerando(false); }
  };

  const handlePDF = async () => {
    try { setGenerando(true); await asistenciaService.descargarPDF(selectedEvento); showAlert('PDF generado'); }
    catch { showAlert('Error al generar PDF', 'error'); }
    finally { setGenerando(false); }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="asistencia-page">
      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <div className="page-header">
        <h2>Control de Asistencia</h2>
      </div>

      {/* Selector de evento */}
      <div className="filter-section">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Seleccionar Evento</label>
          <select
            className="form-select"
            value={selectedEvento}
            onChange={(e) => { setSelectedEvento(e.target.value); setFiltroEstado('todos'); setTabActivo('total'); }}
          >
            <option value="">-- Seleccionar Evento --</option>
            {eventos.map(ev => (
              <option key={ev.id_evento} value={ev.id_evento}>
                {ev.nombre_evento} — {new Date(ev.fecha_evento).toLocaleDateString('es-GT')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedEvento && !loading && todos.length > 0 && (
        <>
          {/* ── Cards de estadísticas (clickeables) ── */}
          <div className="stats-cards-asistencia">
            {Object.values(ESTADOS).map(est => {
              const count = est.key === 'todos' ? stats.total : stats[est.key];
              return (
                <button
                  key={est.key}
                  className={`stat-card-asistencia stat-${est.color} ${filtroEstado === est.key ? 'activa' : ''}`}
                  onClick={() => { setFiltroEstado(est.key); setTabActivo('total'); setSearchTerm(''); }}
                >
                  <span className="stat-card-icon">{est.icon}</span>
                  <span className="stat-card-count">{count}</span>
                  <span className="stat-card-label">{est.label}</span>
                  {est.key === 'asistio' && stats.total > 0 && (
                    <span className="stat-card-pct">{stats.porcentaje}%</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Barra de búsqueda y exportación ── */}
          <div className="action-bar">
            <div className="action-left">
              <div className="search-wrapper">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Buscar por nombre, DPI, cooperativa o institución..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="action-right">
              <button
                className="btn btn-excel"
                onClick={handleExcel}
                disabled={generando || stats.asistio === 0}
                title={stats.asistio === 0 ? 'Sin asistentes marcados' : 'Exportar lista de asistentes'}
              >
                <FaFileExcel /> Excel
              </button>
              <button
                className="btn btn-pdf"
                onClick={handlePDF}
                disabled={generando || stats.asistio === 0}
                title={stats.asistio === 0 ? 'Sin asistentes marcados' : 'Exportar PDF con firmas'}
              >
                <FaFilePdf /> PDF
              </button>
            </div>
          </div>

          {/* ── Título de sección activa ── */}
          <div className={`seccion-header seccion-${ESTADOS[filtroEstado].color}`}>
            <span className="seccion-icon">{ESTADOS[filtroEstado].icon}</span>
            <span className="seccion-titulo">{ESTADOS[filtroEstado].label}</span>
            <span className="seccion-count">
              {filtroEstado === 'todos' ? stats.total : stats[filtroEstado]} participantes
            </span>
          </div>

          {/* ── Tabs Total / Internos / Externos ── */}
          <div className="tabs-container">
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={`tab-btn ${tabActivo === tab.key ? 'active' : ''}`}
                onClick={() => setTabActivo(tab.key)}
              >
                {tab.icon}
                {tab.label}
                <span className="tab-count">
                  {tab.key === 'total'    ? subStats.total    :
                   tab.key === 'internos' ? subStats.internos :
                   subStats.externos}
                </span>
              </button>
            ))}
          </div>

          {/* ── Tabla ── */}
          {listaFiltrada.length > 0 ? (
            <TablaParticipantes
              lista={listaFiltrada}
              onMarcar={handleMarcar}
              esInterno={tabActivo === 'internos'}
              esExterno={tabActivo === 'externos'}
            />
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <p className="empty-state-text">
                {searchTerm ? 'Sin resultados para la búsqueda' : 'No hay participantes en esta sección'}
              </p>
            </div>
          )}
        </>
      )}

      {selectedEvento && !loading && todos.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p className="empty-state-text">No hay inscritos en este evento</p>
        </div>
      )}

      {!selectedEvento && (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <p className="empty-state-text">Selecciona un evento para ver el control de asistencia</p>
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default Asistencia;
