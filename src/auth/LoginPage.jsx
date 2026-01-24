// LoginPage.jsx
import React from 'react';
import NavBar from '../components/layout/Navbar';


import { useNavigate } from "react-router-dom";
import { useState } from "react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  //Funcion al hacer submit, guarda un token simulado y navega al dashboard
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulación: setea un token fake en localStorage
    localStorage.setItem("token", "demo-token");
    navigate("/dashboard");
  };

  return (
    <div>
      <NavBar></NavBar>



      <form onSubmit={handleSubmit} className='form'>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Iniciar Sesión</button>
      </form>



      



    </div>
  );
}

export default LoginPage;