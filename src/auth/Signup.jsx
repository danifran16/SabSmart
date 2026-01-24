// LoginPage.jsx
import React from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import NavBar from '../components/layout/Navbar';

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  

  //Funcion al hacer submit, redirecciona a login
  const handleSubmit = (e) => {
    e.preventDefault();
    // Cuando se registra lo redirecciona a login apra que inicie sesion
    navigate("/login");
  };

  return (
    <div>
      <NavBar></NavBar>
      <h1>Registrate</h1>

      <form onSubmit={handleSubmit} className='form'>
        
        <input
          type="text"
          placeholder="Ingresa tu nombre"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
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
        <button type="submit">Registrarse</button>
      </form>

    </div>
  );
}

export default Signup;