import db from '../config/db.js';
import bcrypt from 'bcrypt';

const saltRounds = 10;

// Listar usuarios (sin contrasenia)
const getUsuarios = (req, res) => {
  db.query('SELECT id, nombre, correo, role FROM usuario', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener usuarios' });
    return res.json(results);
  });
};

// Obtener usuario por id
const getUsuarioById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT id, nombre, correo, role FROM usuario WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener usuario' });
    if (results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    return res.json(results[0]);
  });
};

// Crear usuario
const crearUsuario = async (req, res) => {
  try {
    let { nombre, correo, contrasenia, role = 'cliente' } = req.body;
    nombre = (nombre || '').toString().trim();
    correo = (correo || '').toString().trim();
    contrasenia = (contrasenia || '').toString();
    role = role === 'admin' ? 'admin' : 'cliente';

    if (!nombre || !correo || !contrasenia) {
      return res.status(400).json({ error: 'Nombre, correo y contraseña son requeridos' });
    }
    const pwd = contrasenia.trim();
    if (pwd.length < 6) return res.status(400).json({ error: 'La contrasenia debe tener al menos 6 caracteres' });

    const hash = await bcrypt.hash(pwd, saltRounds);
    db.query('INSERT INTO usuario (nombre, correo, contrasenia, role) VALUES (?, ?, ?, ?)', [nombre, correo, hash, role], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Correo ya registrado' });
        return res.status(500).json({ error: 'Error creando usuario', details: err });
      }
      const insertedId = result.insertId;
      db.query('SELECT id, nombre, correo, role FROM usuario WHERE id = ?', [insertedId], (e2, rows) => {
        if (e2) return res.status(500).json({ error: 'Error recuperando usuario creado' });
        return res.status(201).json(rows[0]);
      });
    });
  } catch (err) {
    return res.status(500).json({ error: 'Error interno', details: err.message });
  }
};

// Login: verifica correo + contraseña y devuelve usuario
const login = (req, res) => {
  const { correo, contrasenia } = req.body;
  if (!correo || !contrasenia) return res.status(400).json({ error: 'Correo y contrasenia requeridos' });
  const correoT = String(correo).trim();
  const pwd = String(contrasenia).trim();

  db.query('SELECT id, nombre, correo, contrasenia, role FROM usuario WHERE correo = ?', [correoT], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en la BD' });
    if (results.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });

    const user = results[0];
    try {
      if (!user.contrasenia) return res.status(401).json({ error: 'Credenciales inválidas' });
      const match = await bcrypt.compare(pwd, user.contrasenia);
      if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });

      return res.json({ success: true, user: { id: user.id, nombre: user.nombre, correo: user.correo, role: user.role } });
    } catch (err) {
      console.error('Error en login:', err);
      return res.status(500).json({ error: 'Error verificando credenciales' });
    }
  });
};

// Devuelve información del usuario autenticado (simplificado, no usado)
const getMe = (req, res) => {
  return res.status(501).json({ error: 'Endpoint no implementado' });
};

// Actualizar usuario
const updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, contrasenia, role } = req.body;
  try {
    const updates = [];
    const params = [];
    if (nombre) { updates.push('nombre = ?'); params.push(nombre); }
    if (correo) { updates.push('correo = ?'); params.push(correo); }
    if (role) { updates.push('role = ?'); params.push(role); }
    if (contrasenia) {
      const hash = await bcrypt.hash(contrasenia, saltRounds);
      updates.push('contrasenia = ?');
      params.push(hash);
    }
    if (updates.length === 0) return res.status(400).json({ error: 'Nada que actualizar' });
    params.push(id);
    const sql = `UPDATE usuario SET ${updates.join(', ')} WHERE id = ?`;
    db.query(sql, params, (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Correo ya registrado' });
        return res.status(500).json({ error: 'Error al actualizar usuario', details: err });
      }
      if (!result || result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
      db.query('SELECT id, nombre, correo, role FROM usuario WHERE id = ?', [id], (e2, rows) => {
        if (e2) return res.status(500).json({ error: 'Error recuperando usuario actualizado' });
        return res.json(rows[0]);
      });
    });
  } catch (err) {
    return res.status(500).json({ error: 'Error interno', details: err.message });
  }
};

// Eliminar usuario
const deleteUsuario = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM usuario WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar usuario', details: err });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    return res.json({ message: 'Usuario eliminado' });
  });
};

export default {
  getUsuarios,
  getUsuarioById,
  crearUsuario,
  login,
  getMe,
  updateUsuario,
  deleteUsuario
};
