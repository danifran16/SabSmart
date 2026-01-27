import React, { useEffect, useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import axios from 'axios';
import '../../user/PedidosUser/PedidosUser.css';
import { useNavigate } from 'react-router-dom';

function PedidosClient() {
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || !user.correo) {
      alert('Usuario no válido');
      return;
    }

    // Obtener pedidos por correo del cliente
    axios.get(`/api/pedidos?correo=${encodeURIComponent(user.correo)}`)
      .then(async res => {
        const list = res.data || [];
        // Por cada pedido, obtener detalle/prendas y meta
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
      })
      .catch(err => {
        console.error('Error al cargar pedidos', err);
        alert(err?.response?.data?.error || 'Error al cargar pedidos');
      });
  }, []);

  return (
    <MainLayout title="Mis Pedidos">
      <div className="clientes-page">
        <div className="clientes-main" style={{width: '100%'}}>
          <div className="top-row">
            <h2 className="main-title">Mis Pedidos</h2>
          </div>

          <div className="table-card">
            {pedidos.length > 0 ? (
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Descripcion</th>
                    <th>Abono</th>
                    <th>Total</th>
                    <th>Fecha entrega</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map(p => (
                    <tr key={p.pedido_id}>
                      <td>{p.pedido_id}</td>
                      <td>
                        {(p.prendas && p.prendas.length > 0) 
                          ? p.prendas.map(x => x.detalle).slice(0, 2).join(', ') 
                          : 'Sin prendas'}
                      </td>
                      <td>{p.abono ?? '-'}</td>
                      <td>{(p.meta && p.meta.Precio_total_prendas) || p.Precio_total_pedido || '-'}</td>
                      <td>{(p.meta && p.meta.fecha_entrega) || '-'}</td>
                      <td>{p.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="empty">No tienes pedidos aún</p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default PedidosClient;