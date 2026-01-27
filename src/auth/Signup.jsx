import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './auth.css';

function Signup() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [role, setRole] = useState('cliente');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/usuarios', { nombre, correo, contrasenia, role });
      alert('Usuario creado correctamente. Ingresa para continuar.');
      navigate('/');
    } catch (err) {
      const msg = err?.response?.data?.error || 'Error creando usuario';
      alert(msg);
    }
  };

  return (
    <MainLayout showSidebar={false} showTabs={true}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <form onSubmit={handleSubmit} className="form auth-card">
          <label className="label">Nombre</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" required />

          <label className="label">Correo</label>
          <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="Correo" required />

          <label className="label">Contraseña</label>
          <input type="password" value={contrasenia} onChange={(e) => setContrasenia(e.target.value)} placeholder="Contraseña" required />

          <label className="label">Rol</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="cliente">Cliente</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" className="btn-primary">Registrar</button>
        </form>
      </div>
    </MainLayout>
  );
}

export default Signup;
