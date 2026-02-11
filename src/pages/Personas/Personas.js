import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { personaService } from '../../services/personaService';
import { cooperativaService } from '../../services/cooperativaService';
import '../Cooperativas/Cooperativas.css';

const Personas = () => {
  const [personas, setPersonas] = useState([]);
  const [cooperativas, setCooperativas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    loadPersonas();
    loadCooperativas();
  }, []);

  const loadPersonas = async () => {
    try {
      setLoading(true);
      const response = await personaService.getAll();
      setPersonas(response.data);
    } catch (error) {
      showAlert('Error al cargar personas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadCooperativas = async () => {
    try {
      const response = await cooperativaService.getActive();
      setCooperativas(response.data);
    } catch (error) {
      console.error('Error al cargar cooperativas');
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        dpi: parseInt(formData.dpi),
        telefono: formData.telefono ? parseInt(formData.telefono) : null,
        id_cooperativa: formData.id_cooperativa ? parseInt(formData.id_cooperativa) : null
      };

      if (editingId) {
        await personaService.update(editingId, data);
        showAlert('Persona actualizada exitosamente');
      } else {
        await personaService.create(data);
        showAlert('Persona creada exitosamente');
      }
      setShowModal(false);
      resetForm();
      loadPersonas();
    } catch (error) {
      showAlert(error.response?.data?.error || 'Error al guardar persona', 'error');
    }
  };

  const handleEdit = (persona) => {
    setEditingId(persona.id_persona);
    setFormData({
      nombres: persona.nombres,
      apellidos: persona.apellidos,
      email: persona.email || '',
      dpi: persona.dpi.toString(),
      telefono: persona.telefono ? persona.telefono.toString() : '',
      id_cooperativa: persona.id_cooperativa || '',
      institucion: persona.institucion || '',
      puesto: persona.puesto
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta persona?')) {
      try {
        await personaService.delete(id);
        showAlert('Persona eliminada exitosamente');
        loadPersonas();
      } catch (error) {
        showAlert('Error al eliminar persona', 'error');
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
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
  };

  const filteredPersonas = personas.filter(persona =>
    persona.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    persona.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    persona.dpi.toString().includes(searchTerm)
  );

  return (
    <div className="personas-page">
      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <div className="page-header">
        <h2>Gestión de Personas</h2>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <FaPlus /> Nueva Persona
        </button>
      </div>

      <div className="search-section">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o DPI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : filteredPersonas.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre Completo</th>
                <th>DPI</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Cooperativa/Institución</th>
                <th>Puesto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPersonas.map((persona) => (
                <tr key={persona.id_persona}>
                  <td className="font-semibold">{`${persona.nombres} ${persona.apellidos}`}</td>
                  <td>{persona.dpi}</td>
                  <td>{persona.email || '-'}</td>
                  <td>{persona.telefono || '-'}</td>
                  <td>{persona.name_cooperativa || persona.institucion || '-'}</td>
                  <td>{persona.puesto}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(persona)} title="Editar">
                        <FaEdit />
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(persona.id_persona)} title="Eliminar">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <p className="empty-state-text">No se encontraron personas</p>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Editar Persona' : 'Nueva Persona'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
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
                    <input type="number" className="form-input" value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} maxLength={100} />
                </div>

                <div className="form-group">
                  <label className="form-label">Cooperativa</label>
                  <select className="form-select" value={formData.id_cooperativa}
                    onChange={(e) => setFormData({ ...formData, id_cooperativa: e.target.value })}>
                    <option value="">-- Seleccionar Cooperativa --</option>
                    {cooperativas.map(coop => (
                      <option key={coop.id_cooperativa} value={coop.id_cooperativa}>{coop.name_cooperativa}</option>
                    ))}
                  </select>
                  <small style={{color: 'var(--gray-500)', fontSize: '0.8125rem'}}>
                    Si no pertenece a ninguna cooperativa, complete el campo "Institución"
                  </small>
                </div>

                <div className="form-group">
                  <label className="form-label">Institución</label>
                  <input type="text" className="form-input" value={formData.institucion}
                    onChange={(e) => setFormData({ ...formData, institucion: e.target.value })} maxLength={100}
                    placeholder="Solo si no pertenece a una cooperativa" />
                </div>

                <div className="form-group">
                  <label className="form-label">Puesto *</label>
                  <input type="text" className="form-input" value={formData.puesto}
                    onChange={(e) => setFormData({ ...formData, puesto: e.target.value })} required maxLength={50} />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Personas;
