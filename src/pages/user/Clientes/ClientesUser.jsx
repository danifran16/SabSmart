import React, { useEffect, useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import axios from 'axios';
import './ClientesUser.css';
import { useNavigate } from 'react-router-dom';


function ClientesUser() {
  const [clientes, setClientes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: '', correo: '', telefono: '', direccion: '', canal_pref: '' });
  const [selectedClient, setSelectedClient] = useState(null);
  // const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

  // Obtener clientes al cargar
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const qs = user?.id ? `?usuario_id=${user.id}` : '';
    axios.get(`/api/clientes${qs}`)
      .then(res => setClientes(res.data))
      .catch(err => console.error(err));
  }, []);

  // Obtener pedidos para cliente seleccionado
/*   useEffect(() => {
    if (!selectedClient) return;
    axios.get(`/api/clientes/${selectedClient.id}/pedidos`)
      .then(res => setPedidos(res.data))
      .catch(err => {
        console.warn('No hay pedidos o el endpoint no existe aún', err);
        setPedidos([]);
      });
  }, [selectedClient]); */

  // Manejar cambios en el formulario
  const handleChange = e => {
    setNuevoCliente({ ...nuevoCliente, [e.target.name]: e.target.value });
  };

  // Agregar nuevo cliente
  const handleSubmit = e => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const payload = { ...nuevoCliente, usuario_id: user?.id || null };
    axios.post('/api/clientes', payload)
      .then(res => {
        setClientes([...clientes, res.data]);
        setShowForm(false);
        setNuevoCliente({ nombre: '', correo: '', telefono: '', direccion: '', canal_pref: '' });
      })
      .catch(err => { console.error(err); alert('Error al agregar cliente'); });
  };

  return (
    <MainLayout title="Clientes">
      {/* Vista base: lista izquierda, tarjeta central con tabla y botón "Agregar Cliente" */}

      <div className="clientes-page">
        <div className="clientes-left">
          <h3 className="section-title">Clientes</h3>
          <ul className="clients-list">
            {clientes.length === 0 ? (
              <li className="empty">No hay clientes aún</li>
            ) : (
              clientes.map(c => (
                <li
                  key={c.id}
                  className={`client-item ${selectedClient?.id === c.id ? 'active' : ''}`}
                  onClick={() => setSelectedClient(c)}
                >
                  {c.nombre || c.name || 'Nombre'}
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="clientes-main">
          <div className="top-row">
            <h2 className="main-title">Listado de Clientes</h2>
            <button className="btn-add" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancelar' : 'Agregar Cliente'}
            </button>
          </div>
          {showForm && (
            <form onSubmit={handleSubmit} className="cliente-form">
              <input
                name="nombre"
                placeholder="Nombre"
                value={nuevoCliente.nombre}
                onChange={handleChange}
                required
              />
              <input
                name="correo"
                type="email"
                placeholder="Correo"
                value={nuevoCliente.correo}
                onChange={handleChange}
                required
              />
              <input
                name="telefono"
                type="tel"
                placeholder="Teléfono"
                value={nuevoCliente.telefono}
                onChange={handleChange}
              />
              <input
                name="direccion"
                placeholder="Dirección"
                value={nuevoCliente.direccion}
                onChange={handleChange}
              />
              <input
                name="canal_pref"
                placeholder="Canal Preferido"
                value={nuevoCliente.canal_pref}
                onChange={handleChange}
              />
              <button type="submit" className="btn-primary">Guardar</button>
            </form>
          )}

          <div className="table-card">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Telefono</th>
                  <th>Direccion</th>
                  <th>Canal</th>
                  <th>Pedido</th>
                </tr>
              </thead>
              <tbody>
                {selectedClient ? (
                  <tr>
                    <td>{selectedClient.nombre}</td>
                    <td>{selectedClient.correo}</td>
                    <td>{selectedClient.telefono}</td>
                    <td>{selectedClient.direccion}</td>
                    <td>{selectedClient.canal_preferido || selectedClient.canal_pref}</td>
                    <td>
                      <button
                        className="btn-icon"
                        title="Ver pedidos"
                        onClick={() => navigate('/pedidos', { state: { clientId: selectedClient.id, createIfNone: true } })}
                      >
                        🔍
                      </button>
                    </td>
                  </tr>
                ) : clientes.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty">No hay clientes aún</td>
                  </tr>
                ) : (
                  clientes.map(c => (
                    <tr key={c.id}>
                      <td>{c.nombre}</td>
                      <td>{c.correo}</td>
                      <td>{c.telefono}</td>
                      <td>{c.direccion}</td>
                      <td>{c.canal_preferido || c.canal_pref}</td>
                      <td>
                        <button
                          className="btn-icon"
                          title="Ver pedidos"
                          onClick={() => {
                            setSelectedClient(c);
                            navigate('/pedidos', { state: { clientId: c.id } });
                          }}
                        >
                          🔍
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </MainLayout>
  );
}

export default ClientesUser;