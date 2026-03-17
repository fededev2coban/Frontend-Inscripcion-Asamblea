import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { registroPublicoService } from '../../services/registroPublicoService';
import { catalogoService } from '../../services/catalogoService';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaBuilding, FaBriefcase } from 'react-icons/fa';
import './RegistroPublico.css';

const Nuevo_RegistroPublico = () => {
  const { link } = useParams();
  const [evento, setEvento] = useState(null);
  const [cooperativas, setCooperativas] = useState([]);
  const [comisiones, setComisiones] = useState([]);
  const [puestos, setPuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [tipoRegistro, setTipoRegistro] = useState('interno'); // 'interno' o 'externo'
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    dpi: '',
    telefono: '',
    id_cooperativa: '',
    id_comision: '',
    id_puesto: '',
    institucion: '',
    puesto: ''
  });

  const loadData = useCallback(async () => {
  try {
    setLoading(true);
    const [eventoRes, coopRes, comRes, puesRes] = await Promise.all([
      registroPublicoService.getEventoPublico(link),
      registroPublicoService.getCooperativasPublicas(),
      catalogoService.getComisiones(),
      catalogoService.getPuestos()
    ]);
    
    if (eventoRes.success) setEvento(eventoRes.data);
    else setError('Evento no encontrado');
    
    if (coopRes.success) setCooperativas(coopRes.data);
    if (comRes.success) setComisiones(comRes.data);
    if (puesRes.success) setPuestos(puesRes.data);
  } catch (err) {
    setError('Error al cargar el evento');
  } finally {
    setLoading(false);
  }
}, [link]);

  useEffect(() => {
  loadData();
}, [loadData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const datos = {
        tipo_registro: tipoRegistro,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        dpi: parseInt(formData.dpi),
        email: formData.email || "ejemplo@mail.com",
        telefono: formData.telefono || null
      };

      if (tipoRegistro === 'interno') {
        datos.id_cooperativa = parseInt(formData.id_cooperativa);
        datos.id_comision = parseInt(formData.id_comision);
        datos.id_puesto = parseInt(formData.id_puesto);
      } else {
        datos.institucion = formData.institucion;
        datos.puesto = formData.puesto;
      }

      const response = await registroPublicoService.registrarEvento(link, datos);
      
      if (response.success) {
        setSuccess(true);
        resetForm();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombres: '',
      apellidos: '',
      email: '',
      dpi: '',
      telefono: '',
      id_cooperativa: '',
      id_comision: '',
      id_puesto: '',
      institucion: '',
      puesto: ''
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // Dividimos la cadena "2026-03-11" en partes
    const [year, month, day] = dateString.split('T')[0].split('-').map(Number);
    
    // Creamos la fecha usando el constructor local (el mes es 0-indexado, por eso -1)
    const date = new Date(year, month - 1, day);
    
    return date.toLocaleDateString('es-GT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="registro-publico-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (error && !evento) {
    return (
      <div className="registro-publico-page">
        <div className="error-container">
          <FaTimesCircle className="error-icon" />
          <h2>Evento No Disponible</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="registro-publico-page">
        <div className="success-container">
          <FaCheckCircle className="success-icon" />
          <h2>¡Registro Exitoso!</h2>
          <p>Te has inscrito al evento:</p>
          <h3>{evento.nombre_evento}</h3>
          <div className="success-details">
            <p><FaCalendarAlt /> {formatDate(evento.fecha_evento)}</p>
            <p><FaClock /> {evento.hora_evento}</p>
            <p><FaMapMarkerAlt /> {evento.lugar_evento}</p>
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => setSuccess(false)}>
            Registrar otra persona
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="registro-publico-page">
      <div className="registro-container">
        <div className="registro-header">
          <h1>FEDECOVERA</h1>
          <h2>Inscripción a Evento</h2>
        </div>

        <div className="evento-info-card">
          <h3>{evento.nombre_evento}</h3>
          <div className="evento-details">
            <div className="evento-detail">
              <FaCalendarAlt /> <span>{formatDate(evento.fecha_evento)}</span>
            </div>
            <div className="evento-detail">
              <FaClock /> <span>{evento.hora_evento}</span>
            </div>
            <div className="evento-detail">
              <FaMapMarkerAlt /> <span>{evento.lugar_evento}</span>
            </div>
          </div>
        </div>

        <div className="registro-card">
          <h4>Datos del Participante</h4>

          <div className="tipo-registro-section">
            <label className="form-label">Tipo de Participante *</label>
            <div className="tipo-registro-buttons">
              <button
                type="button"
                className={`tipo-btn ${tipoRegistro === 'interno' ? 'active' : ''}`}
                onClick={() => setTipoRegistro('interno')}
              >
                <FaBuilding />
                <span>Cooperativa</span>
              </button>
              <button
                type="button"
                className={`tipo-btn ${tipoRegistro === 'externo' ? 'active' : ''}`}
                onClick={() => setTipoRegistro('externo')}
              >
                <FaBriefcase />
                <span>Colaboradores/Externo</span>
              </button>
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="registro-form">
            <div className="form-section">
              <h5>Datos Personales</h5>
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
                  <input type="text" className="form-input" value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
            </div>

            {tipoRegistro === 'interno' ? (
              <div className="form-section form-section-interno">
                <h5>Datos de Cooperativa</h5>
                <div className="form-group">
                  <label className="form-label">Cooperativa *</label>
                  <select className="form-select" value={formData.id_cooperativa}
                    onChange={(e) => setFormData({ ...formData, id_cooperativa: e.target.value })} required>
                    <option value="">Seleccionar</option>
                    {cooperativas.map(c => <option key={c.id_cooperativa} value={c.id_cooperativa}>{c.name_cooperativa}</option>)}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Comisión *</label>
                    <select className="form-select" value={formData.id_comision}
                      onChange={(e) => setFormData({ ...formData, id_comision: e.target.value })} required>
                      <option value="">Seleccionar</option>
                      {comisiones.map(c => <option key={c.id_comision} value={c.id_comision}>{c.name_comision}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Puesto *</label>
                    <select className="form-select" value={formData.id_puesto}
                      onChange={(e) => setFormData({ ...formData, id_puesto: e.target.value })} required>
                      <option value="">Seleccionar</option>
                      {puestos.map(p => <option key={p.id_puesto} value={p.id_puesto}>{p.name_puesto}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="form-section form-section-externo">
                <h5>Datos de Institución</h5>
                <div className="form-group">
                  <label className="form-label">Institución *</label>
                  <input type="text" className="form-input" value={formData.institucion}
                    onChange={(e) => setFormData({ ...formData, institucion: e.target.value })} required maxLength={50} />
                </div>

                <div className="form-group">
                  <label className="form-label">Puesto *</label>
                  <input type="text" className="form-input" value={formData.puesto}
                    onChange={(e) => setFormData({ ...formData, puesto: e.target.value })} required maxLength={50} />
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={submitting}>
              {submitting ? <><div className="spinner-small"></div> Registrando...</> : 'Registrarse'}
            </button>
          </form>
        </div>

        <div className="registro-footer">
          <p>© {new Date().getFullYear()} FEDECOVERA V3</p>
        </div>
      </div>
    </div>
  );
};

export default Nuevo_RegistroPublico;
