import React, { useEffect, useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import axios from 'axios';
import './TareasUser.css';
import { useNavigate, useLocation } from 'react-router-dom';


function TareasUser(){
  const [prendas, setPrendas] = useState([]);
  const [selectedPrenda, setSelectedPrenda] = useState(null);
  const [tareas, setTareas] = useState([]);
  const [nuevoTarea, setNuevoTarea] = useState({ descripcion_tarea: '', medidas: '', checklist_materiales: '' });
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pedidoId = location?.state?.pedidoId;
  const prendaId = location?.state?.prendaId;

  useEffect(()=>{
    if (pedidoId) {
      // cargar prendas del pedido
      axios.get(`/api/pedidos/${pedidoId}/detalle`).then(res => {
        const list = res.data.prendas || [];
        setPrendas(list);
        if (list.length>0) setSelectedPrenda(list[0]);
      }).catch(err => console.error(err));
    } else if (prendaId) {
      // cargar prenda individual
      axios.get(`/api/prendas/${prendaId}`).then(res => {
        setPrendas([res.data.prenda]);
        setSelectedPrenda(res.data.prenda);
        setTareas(res.data.tareas || []);
      }).catch(err => console.error(err));
    } else {
      setPrendas([]);
    }
  }, [pedidoId, prendaId]);

  useEffect(()=>{
    if (!selectedPrenda) return;
    // si ya tenemos tareas en selectedPrenda preferir consulta directa
    axios.get(`/api/prendas/${selectedPrenda.prenda_id}`).then(res => {
      setTareas(res.data.tareas || []);
      setSelectedPrenda(res.data.prenda || selectedPrenda);
      setShowForm((res.data.tareas || []).length === 0);
    }).catch(err => {
      console.error(err);
      setTareas([]);
      setShowForm(true);
    });
  }, [selectedPrenda?.prenda_id]);

  const handleTareaChange = e => setNuevoTarea({...nuevoTarea, [e.target.name]: e.target.value});

  const handleCreateTarea = e => {
    e.preventDefault();
    if (!selectedPrenda) return alert('Seleccione una prenda');
    axios.post(`/api/prendas/${selectedPrenda.prenda_id}/tareas`, nuevoTarea)
      .then(res => {
        setTareas([...tareas, res.data]);
        setNuevoTarea({ descripcion_tarea: '', medidas: '', checklist_materiales: '' });
        setShowForm(false);
      })
      .catch(err => {
        console.error(err);
        alert(err?.response?.data?.error || 'Error al crear tarea');
      });
  };

  return (
    <MainLayout title="Tareas">
      <div className="clientes-page">
        <div className="clientes-left">
          <h3 className="section-title">Prendas</h3>
          <ul className="clients-list">
            {prendas.length === 0 ? (
              <li className="empty">No hay prendas para mostrar</li>
            ) : (
              prendas.map(p => (
                <li key={p.prenda_id} className={`client-item ${selectedPrenda?.prenda_id === p.prenda_id ? 'active' : ''}`} onClick={() => setSelectedPrenda(p)}>
                  {p.detalle || p.tipo_prenda}
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="clientes-main">
          <div className="top-row">
            <h2 className="main-title">Tareas por Prenda</h2>
          </div>

          <div className="table-card">
            {selectedPrenda ? (
              <>
                <h3>{selectedPrenda.detalle || selectedPrenda.tipo_prenda}</h3>
                <p>Unidad: {selectedPrenda.Precio_unitario || selectedPrenda.Precio_unitario}</p>
                <p>Cantidad: {selectedPrenda.cantidad}</p>

                {tareas.length > 0 ? (
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Prenda</th>
                        <th>Tarea</th>
                        <th>Medidas</th>
                        <th>Checklist</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tareas.map(t => (
                        <tr key={t.detalle_prenda_id}>
                          <td>{selectedPrenda.detalle || selectedPrenda.tipo_prenda}</td>
                          <td>{t.descripcion_tarea}</td>
                          <td>{t.medidas || '-'}</td>
                          <td>{t.checklist_materiales || '-'}</td>
                          <td>
                            <button className="btn-small" onClick={() => navigate('/tareas/detalle', { state: { tareaId: t.detalle_prenda_id } })}>Ver</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div>
                    <p>No hay tareas para esta prenda.</p>
                    {showForm && (
                      <form onSubmit={handleCreateTarea} className="cliente-form">
                        <input name="descripcion_tarea" placeholder="Descripción tarea" value={nuevoTarea.descripcion_tarea} onChange={handleTareaChange} required />
                        <input name="medidas" placeholder="Medidas" value={nuevoTarea.medidas} onChange={handleTareaChange} />
                        <input name="checklist_materiales" placeholder="Checklist" value={nuevoTarea.checklist_materiales} onChange={handleTareaChange} />
                        <button type="submit" className="btn-primary">Agregar Tarea</button>
                      </form>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="empty">Selecciona una prenda para ver sus tareas</p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default TareasUser;