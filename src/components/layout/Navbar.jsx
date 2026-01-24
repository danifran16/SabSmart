// NombreDelComponente.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/"> Home </Link>            
            </li>

            <li>
              <Link to="/signup"> Registrate </Link>            
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}

export default Navbar;