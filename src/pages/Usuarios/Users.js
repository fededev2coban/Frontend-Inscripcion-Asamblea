import React, { useState } from 'react';
import UsuariosList from './UsuariosList';
import RolesList from '../Roles/RolesList';
import './Usuarios.css';

const Usuarios = () => {
  const [activeTab, setActiveTab] = useState('usuarios'); // 'usuarios' o 'roles'

  return (
    <div className="usuarios-module">
      {/* Tabs de navegación */}
      <div className="tabs-container">
        <div className="tabs-header">
          <button 
            className={`tab-btn ${activeTab === 'usuarios' ? 'active' : ''}`}
            onClick={() => setActiveTab('usuarios')}
          >
            👥 Usuarios
          </button>
          <button 
            className={`tab-btn ${activeTab === 'roles' ? 'active' : ''}`}
            onClick={() => setActiveTab('roles')}
          >
            🔐 Roles
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'usuarios' ? <UsuariosList /> : <RolesList />}
        </div>
      </div>
    </div>
  );
};

export default Usuarios;