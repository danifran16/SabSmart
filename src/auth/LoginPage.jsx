// LoginPage.jsx
import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import './auth.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  // Funcion al hacer submit: llama al endpoint de login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { correo: email, contrasenia: password });
      const { user } = res.data;
      localStorage.setItem('role', user.role);
      localStorage.setItem('user', JSON.stringify(user));
      if (user.role === 'admin') return navigate('/dashboard');
      if (user.role === 'cliente') return navigate('/mi-dashboard');
    } catch (err) {
      const msg = err?.response?.data?.error || 'Error al iniciar sesión';
      alert(msg);
    }
  };

  return (
    <MainLayout showSidebarLogin={true} showTabs={true}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <form onSubmit={handleSubmit} className="form auth-card">
          <label className="label">Correo</label>
          <input
            type="email"
            placeholder="Ingresa tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="label">Contraseña</label>
          <input
            type="password"
            placeholder="Ingresa contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn-primary">Iniciar Sesión</button>
          <div style={{ marginTop: '12px' }}>
            <Link to="/signup">Crear cuenta</Link>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}

export default LoginPage;
