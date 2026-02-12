import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { registroPublicoService } from '../../services/registroPublicoService';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './RegistroPublico.css';

const RegistroPublico = () => {
  const { link } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState(null);
  const [cooperativas, setCooperativas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    dpi: '',
    telefono: '',
    id_cooperativa: '',
    institucion: '',
    puesto: ''
  });

  useEffect(() => {
    loadEventoYCooperativas();
  }, [link]);

  const loadEventoYCooperativas = async () => {
    try {
      setLoading(true);
      const [eventoRes, coopRes] = await Promise.all([
        registroPublicoService.getEventoPublico(link),
        registroPublicoService.getCooperativasPublicas()
      ]);
      
      if (eventoRes.success) {
        setEvento(eventoRes.data);
      } else {
        setError('Evento no encontrado o no disponible');
      }
      
      if (coopRes.success) {
        setCooperativas(coopRes.data);
      }
    } catch (err) {
      setError('Error al cargar el evento. Verifica que el link sea correcto.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const datos = {
        ...formData,
        dpi: parseInt(formData.dpi),
        telefono: formData.telefono ? formData.telefono.toString() : null,
        id_cooperativa: formData.id_cooperativa ? parseInt(formData.id_cooperativa) : 0
      };

      const response = await registroPublicoService.registrarEvento(link, datos);
      
      if (response.success) {
        setSuccess(true);
        // Resetear formulario
        setFormData({
          nombres: '',
          apellidos: '',
          email: '',
          dpi: '',
          telefono: '',
          id_cooperativa: '',
          institucion: '',
          puesto: ''
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar. Intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
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
          <p>Cargando información del evento...</p>
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
          <p className="error-hint">Verifica que el link sea correcto o contacta al organizador.</p>
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
          <p>Te has inscrito correctamente al evento:</p>
          <h3>{evento.nombre_evento}</h3>
          <div className="success-details">
            <p><FaCalendarAlt /> {formatDate(evento.fecha_evento)}</p>
            <p><FaClock /> {evento.hora_evento}</p>
            <p><FaMapMarkerAlt /> {evento.lugar_evento}</p>
          </div>
          <button 
            className="btn btn-primary btn-lg"
            onClick={() => setSuccess(false)}
          >
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
          <div className="header-logo">
            <h1>FEDECOVERA</h1>
          </div>
          <h2>Inscripción a Evento</h2>
        </div>

        <div className="evento-info-card">
          <h3>{evento.nombre_evento}</h3>
          <div className="evento-details">
            <div className="evento-detail">
              <FaCalendarAlt />
              <span>{formatDate(evento.fecha_evento)}</span>
            </div>
            <div className="evento-detail">
              <FaClock />
              <span>{evento.hora_evento}</span>
            </div>
            <div className="evento-detail">
              <FaMapMarkerAlt />
              <span>{evento.lugar_evento}</span>
            </div>
          </div>
        </div>

        <div className="registro-card">
          <h4>Datos del Participante</h4>
          <p className="form-description">
            Completa el formulario para registrarte al evento
          </p>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="registro-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nombres *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.nombres}
                  onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                  required
                  maxLength={50}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Apellidos *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.apellidos}
                  onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                  required
                  maxLength={50}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">DPI *</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.dpi}
                  onChange={(e) => setFormData({ ...formData, dpi: e.target.value })}
                  required
                  placeholder="Número de DPI"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="Número de teléfono"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                maxLength={100}
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cooperativa</label>
              <select
                className="form-select"
                value={formData.id_cooperativa}
                onChange={(e) => setFormData({ ...formData, id_cooperativa: e.target.value })}
              >
                <option value="">-- Seleccionar Cooperativa (Opcional) --</option>
                {cooperativas.map(coop => (
                  <option key={coop.id_cooperativa} value={coop.id_cooperativa}>
                    {coop.name_cooperativa}
                  </option>
                ))}
              </select>
              <small className="form-hint">
                Si no perteneces a ninguna cooperativa afiliada o no eres empleado de FEDECOVERA, completa el campo "Institución"
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Institución</label>
              <input
                type="text"
                className="form-input"
                value={formData.institucion}
                onChange={(e) => setFormData({ ...formData, institucion: e.target.value })}
                maxLength={100}
                placeholder="Solo si no perteneces a una cooperativa"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Puesto *</label>
              <input
                type="text"
                className="form-input"
                value={formData.puesto}
                onChange={(e) => setFormData({ ...formData, puesto: e.target.value })}
                required
                maxLength={50}
                placeholder="Cargo o puesto que desempeñas"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block btn-lg"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="spinner-small"></div>
                  Registrando...
                </>
              ) : (
                'Registrarse al Evento'
              )}
            </button>
          </form>
        </div>

        <div className="registro-footer">
          <p>© {new Date().getFullYear()} FEDECOVERA. Sistema de Inscripción a Eventos.</p>
        </div>
      </div>
    </div>
  );
};

export default RegistroPublico;
