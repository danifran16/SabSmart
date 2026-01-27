// NombreDelComponente.jsx
import React from 'react';
import './Sidebar.css';

import { Link, useNavigate } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Lógica para cerrar sesión
    localStorage.removeItem('token');
    navigate('/');
  }
  const role = localStorage.getItem('role');

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>

          {role === 'admin' && (
            <>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/clientes">Clientes</Link>
              </li>
              <li>
                <Link to="/pedidos">Pedidos</Link>
              </li>
              <li>
                <Link to="/tareas">Tareas</Link>
              </li>
              <li>
                <Link to="/notificaciones">Notificaciones</Link>
              </li>
            </>
          )}

          {role === 'cliente' && (
            <>
              <li>
                <Link to="/mi-dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/mis-pedidos">Mis Pedidos</Link>
              </li>

            </>
          )}

        </ul>
      </nav>
      <button className='logout-btn' onClick={handleLogout}>Cerrar sesión</button>
    </aside>
  );
}

export default Sidebar;