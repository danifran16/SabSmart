import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function SidebarLogin() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/">Iniciar sesión</Link>
          </li>
          <li>
            <Link to="/signup">Registrarse</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default SidebarLogin;