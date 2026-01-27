import React, { useEffect, useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import axios from 'axios';
import './PedidosUser.css';
import { useNavigate, useLocation } from 'react-router-dom';


function PedidosUser() {
  const [clientes, setClientes] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [nuevoPedido, setNuevoPedido] = useState({ abono: '', Precio_total_pedido: '', estado: 'nuevo' });
  const [editingEstado, setEditingEstado] = useState(null); // { pedidoId: id, estado: 'valor' }
  const navigate = useNavigate();

  const location = useLocation();
  const incomingClientId = location?.state?.clientId;
  // const incomingCreateIfNone = location?.state?.createIfNone;

  // Obtener clientes al cargar
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const qs = user?.id ? `?usuario_id=${user.id}` : '';
    axios.get(`/api/clientes${qs}`)
      .then(res => {
        setClientes(res.data);
        if (incomingClientId) {
          const found = res.data.find(c => String(c.id) === String(incomingClientId));
          if (found) {
            setSelectedClient(found);
          } else {
            // si no está en la lista, pedir el cliente por id
            axios.get(`/api/clientes/${incomingClientId}`)
              .then(r2 => setSelectedClient(r2.data))
              .catch(() => {});
          }
        }
      })
      .catch(err => console.error(err));
  }, [incomingClientId]);

  // Cuando se selecciona cliente, obtener pedidos
  useEffect(() => {
    if (!selectedClient) return;
    axios.get(`/api/clientes/${selectedClient.id}/pedidos`)
      .then(async res => {
        const list = res.data || [];
        // por cada pedido, obtener detalle/prendas y meta
        const withMeta = await Promise.all(list.map(async p => {
          try {
            const r = await axios.get(`/api/pedidos/${p.pedido_id}/detalle`);
            const prendas = r.data.prendas || [];
            const meta = r.data.meta || null;
            return { ...p, prendas, meta };
          } catch (e) {
            return { ...p, prendas: [], meta: null };
          }
        }));
        setPedidos(withMeta);
        setShowOrderForm((withMeta || []).length === 0);
      })
      .catch(err => {
        console.warn('Error al cargar pedidos', err);
        setPedidos([]);
        setShowOrderForm(true);
      });
  }, [selectedClient]);

  const handleOrderChange = e => setNuevoPedido({ ...nuevoPedido, [e.target.name]: e.target.value });

  const handleEstadoChange = (pedidoId, nuevoEstado) => {
    axios.put(`/api/pedidos/${pedidoId}`, { estado: nuevoEstado })
      .then(res => {
        setPedidos(prev => prev.map(p => p.pedido_id === pedidoId || p.id === pedidoId ? { ...p, estado: nuevoEstado } : p));
        setEditingEstado(null);
      })
      .catch(err => {
        console.error(err);
        alert(err?.response?.data?.error || 'Error actualizando estado');
      });
  };

  const handleCreateOrder = e => {
    e.preventDefault();
    if (!selectedClient) return alert('Seleccione un cliente primero');
    const payload = { cliente_id: selectedClient.id, abono: nuevoPedido.abono || null, Precio_total_pedido: nuevoPedido.Precio_total_pedido || null, estado: nuevoPedido.estado };
    axios.post('/api/pedidos', payload)
      .then(res => {
        setPedidos([res.data]);
        setShowOrderForm(false);
        setNuevoPedido({ abono: '', Precio_total_pedido: '', estado: 'nuevo' });
      })
      .catch(err => {
        console.error(err);
        alert(err?.response?.data?.error || 'Error creando pedido');
      });
  };

  return (
    <MainLayout title="Pedidos">
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
                  {c.nombre}
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="clientes-main">
          <div className="top-row">
            <h2 className="main-title">Pedidos por Cliente</h2>
          </div>

          <div className="table-card">
            {selectedClient ? (
              <>
                <h3>{selectedClient.nombre}</h3>
                {pedidos.length > 0 ? (
                  <>
                    <table className="orders-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Descripcion</th>
                          <th>Abono</th>
                          <th>Total</th>
                          <th>Fecha entrega</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pedidos.map(p => (
                          <tr key={p.pedido_id || p.id}>
                            <td>{p.pedido_id || p.id}</td>
                            <td>
                              <button className="link-like" onClick={() => navigate('/tareas', { state: { pedidoId: p.pedido_id || p.id } })}>
                                { (p.prendas && p.prendas.length>0) ? p.prendas.map(x=>x.detalle).slice(0,2).join(', ') : 'Ver detalle' }
                              </button>
                            </td>
                            <td>{p.abono ?? '-'}</td>
                            <td>{ (p.meta && p.meta.Precio_total_prendas) || p.Precio_total_pedido || '-' }</td>
                            <td>{ (p.meta && p.meta.fecha_entrega) || '-' }</td>
                            <td>
                              {editingEstado?.pedidoId === (p.pedido_id || p.id) ? (
                                <select 
                                  value={editingEstado.estado} 
                                  onChange={e => setEditingEstado({ ...editingEstado, estado: e.target.value })}
                                  onBlur={() => handleEstadoChange(p.pedido_id || p.id, editingEstado.estado)}
                                  autoFocus
                                >
                                  <option value="nuevo">Nuevo</option>
                                  <option value="en_proceso">En proceso</option>
                                  <option value="finalizado">Finalizado</option>
                                </select>
                              ) : (
                                <span onClick={() => setEditingEstado({ pedidoId: p.pedido_id || p.id, estado: p.estado })} style={{cursor: 'pointer'}}>
                                  {p.estado}
                                </span>
                              )}
                            </td>
                            <td>
                              <button className="btn-small" onClick={() => navigate('/tareas', { state: { pedidoId: p.pedido_id || p.id } })}>Ver Tareas</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* La descripción redirige a /tareas para ver las prendas y sus tareas */}
                  </>
                ) : (
                  <div>
                    <p>No hay pedidos para este cliente. Crear uno:</p>
                    {showOrderForm && (
                      <form onSubmit={handleCreateOrder} className="cliente-form">
                        <input name="abono" placeholder="Abono" value={nuevoPedido.abono} onChange={handleOrderChange} />
                        <input name="Precio_total_pedido" placeholder="Precio total" value={nuevoPedido.Precio_total_pedido} onChange={handleOrderChange} />
                        <select name="estado" value={nuevoPedido.estado} onChange={handleOrderChange}>
                          <option value="nuevo">Nuevo</option>
                          <option value="en_proceso">En proceso</option>
                          <option value="finalizado">Finalizado</option>
                        </select>
                        <button type="submit" className="btn-primary">Crear Pedido</button>
                      </form>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="empty">Selecciona un cliente para ver sus pedidos</p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default PedidosUser;