import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.username, formData.password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Usuario o contraseña incorrectos');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <h1>FEDECOVERA</h1>
              <div className="logo-underline"></div>
            </div>
            <h2>Sistema de Inscripción</h2>
            <p>Ingresa tus credenciales para acceder</p>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">
                <FaUser /> Usuario
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Ingresa tu usuario"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <FaLock /> Contraseña
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="Ingresa tu contraseña"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner-small"></div>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <FaSignInAlt /> Iniciar Sesión
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            {/* <p className="login-info">
              Usuario por defecto: <strong>admin</strong> / <strong>admin123</strong>
            </p> */}
            <p className="login-version">
              v3.1 - Sistema de Gestión de Eventos
            </p>
          </div>
        </div>

        <div className="login-decoration">
          <div className="decoration-circle decoration-circle-1"></div>
          <div className="decoration-circle decoration-circle-2"></div>
          <div className="decoration-circle decoration-circle-3"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
