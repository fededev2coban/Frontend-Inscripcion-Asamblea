import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Cooperativas from './pages/Cooperativas/Cooperativas';
import Eventos from './pages/Eventos/Eventos';
import Personas from './pages/Personas/Personas';
import Inscripciones from './pages/Inscripciones/Inscripciones';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cooperativas" element={<Cooperativas />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/personas" element={<Personas />} />
          <Route path="/inscripciones" element={<Inscripciones />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
