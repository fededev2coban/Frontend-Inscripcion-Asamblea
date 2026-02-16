import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Cooperativas from './pages/Cooperativas/Cooperativas';
import Eventos from './pages/Eventos/Eventos';
import Personas from './pages/Personas/Personas';
import Usuarios from './pages/Usuarios/Usuarios';
import Inscripciones from './pages/Inscripciones/Inscripciones';
import Nuevo_RegistroPublico from './pages/RegistroPublico/Nuevo_RegistroPublico';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta Pública de Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Ruta Pública de Registro */}
          <Route path="/registro/:link" element={<Nuevo_RegistroPublico />} />
          
          {/* Rutas Privadas con Layout */}
          <Route path="/" element={
            <PrivateRoute>
              <Layout>
                <Home />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/cooperativas" element={
            <PrivateRoute>
              <Layout>
                <Cooperativas />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/eventos" element={
            <PrivateRoute>
              <Layout>
                <Eventos />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/personas" element={
            <PrivateRoute>
              <Layout>
                <Personas />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/usuarios" element={
            <PrivateRoute>
              <Layout>
                <Usuarios />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/inscripciones" element={
            <PrivateRoute>
              <Layout>
                <Inscripciones />
              </Layout>
            </PrivateRoute>
          } />

          {/* Redirección de rutas no encontradas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
