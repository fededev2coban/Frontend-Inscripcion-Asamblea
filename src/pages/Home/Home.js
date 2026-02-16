import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBuilding, 
  FaCalendarAlt, 
  FaUsers, 
  FaUser,
  FaClipboardList,
  FaChartLine 
} from 'react-icons/fa';
import { eventoService } from '../../services/eventoService';
import './Home.css';

const Home = () => {
  const [proximosEventos, setProximosEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProximosEventos();
  }, []);

  const loadProximosEventos = async () => {
    try {
      const response = await eventoService.getUpcoming();
      setProximosEventos(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error al cargar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const quickLinks = [
    {
      title: 'Cooperativas',
      description: 'Gestionar cooperativas afiliadas',
      icon: <FaBuilding />,
      path: '/cooperativas',
      color: '#003B7A'
    },
    {
      title: 'Eventos',
      description: 'Crear y administrar eventos',
      icon: <FaCalendarAlt />,
      path: '/eventos',
      color: '#0066CC'
    },
    {
      title: 'Personas',
      description: 'Registro de participantes',
      icon: <FaUsers />,
      path: '/personas',
      color: '#4A90E2'
    },
      {
      title: 'Usuarios',
      description: 'Registro de participantes',
      icon: <FaUser />,
      path: '/personas',
      color: '#4A90E2'
    },
    {
      title: 'Inscripciones',
      description: 'Gestionar inscripciones a eventos',
      icon: <FaClipboardList />,
      path: '/inscripciones',
      color: '#10B981'
    }
  ];

  return (
    <div className="home">
      <div className="welcome-section">
        <h2>Bienvenido al Sistema de Inscripción</h2>
        <p>Gestiona eventos, cooperativas, personas e inscripciones de manera eficiente</p>
      </div>

      <div className="quick-links-grid">
        {quickLinks.map((link, index) => (
          <Link 
            key={index} 
            to={link.path} 
            className="quick-link-card"
            style={{ '--card-color': link.color }}
          >
            <div className="quick-link-icon" style={{ color: link.color }}>
              {link.icon}
            </div>
            <h3>{link.title}</h3>
            <p>{link.description}</p>
          </Link>
        ))}
      </div>

      <div className="upcoming-events-section">
        <div className="section-header">
          <h3>
            <FaCalendarAlt /> Próximos Eventos
          </h3>
          <Link to="/eventos" className="btn btn-sm btn-primary">
            Ver todos
          </Link>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : proximosEventos.length > 0 ? (
          <div className="events-grid">
            {proximosEventos.map((evento) => (
              <div key={evento.id_evento} className="event-card">
                <div className="event-date">
                  <span className="event-day">
                    {new Date(evento.fecha_evento).getDate()}
                  </span>
                  <span className="event-month">
                    {new Date(evento.fecha_evento).toLocaleDateString('es-GT', { month: 'short' })}
                  </span>
                </div>
                <div className="event-info">
                  <h4>{evento.nombre_evento}</h4>
                  <p className="event-location">
                    📍 {evento.lugar_evento}
                  </p>
                  <p className="event-time">
                    🕐 {evento.hora_evento}
                  </p>
                </div>
                <Link 
                  to={`/inscripciones?evento=${evento.id_evento}`} 
                  className="btn btn-sm btn-primary"
                >
                  Ver inscripciones
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <p className="empty-state-text">No hay eventos próximos</p>
            <p className="empty-state-subtext">
              Crea un nuevo evento para comenzar
            </p>
          </div>
        )}
      </div>

      <div className="stats-section">
        <div className="section-header">
          <h3>
            <FaChartLine /> Estadísticas Rápidas
          </h3>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#DBEAFE' }}>
              <FaBuilding style={{ color: '#003B7A' }} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Cooperativas</p>
              <Link to="/cooperativas" className="stat-link">
                Ver listado →
              </Link>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#DBEAFE' }}>
              <FaCalendarAlt style={{ color: '#0066CC' }} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Eventos</p>
              <Link to="/eventos" className="stat-link">
                Ver listado →
              </Link>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#DBEAFE' }}>
              <FaUsers style={{ color: '#4A90E2' }} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Personas</p>
              <Link to="/personas" className="stat-link">
                Ver listado →
              </Link>
            </div>
          </div>
            <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#DBEAFE' }}>
              <FaUser style={{ color: '#4A90E2' }} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Usuarios</p>
              <Link to="/personas" className="stat-link">
                Ver listado →
              </Link>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#D1FAE5' }}>
              <FaClipboardList style={{ color: '#10B981' }} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Inscripciones</p>
              <Link to="/inscripciones" className="stat-link">
                Ver listado →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
