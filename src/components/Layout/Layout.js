import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaBuilding, 
  FaCalendarAlt, 
  FaUsers, 
  FaClipboardList 
} from 'react-icons/fa';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: <FaHome />, label: 'Inicio' },
    { path: '/cooperativas', icon: <FaBuilding />, label: 'Cooperativas' },
    { path: '/eventos', icon: <FaCalendarAlt />, label: 'Eventos' },
    { path: '/personas', icon: <FaUsers />, label: 'Personas' },
    { path: '/inscripciones', icon: <FaClipboardList />, label: 'Inscripciones' },
  ];

  return (
    <div className="layout">
      <header className="header">
        <div className="header-container">
          <div className="header-logo">
            <h1>FEDECOVERA</h1>
            <p>Sistema de Inscripción a Eventos</p>
          </div>
        </div>
      </header>

      <nav className="navbar">
        <div className="navbar-container">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>

      <footer className="footer">
        <div className="footer-container">
          <p>© {new Date().getFullYear()} FEDECOVERA. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
