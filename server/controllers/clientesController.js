import db from '../config/db.js';

//Obtener todos los clientes (opcionalmente filtrar por usuario_id)
const getClientes = (req, res) => {
  const { usuario_id } = req.query;
  if (usuario_id) {
    db.query('SELECT id, nombre, usuario_id, correo, telefono, direccion, canal_preferido FROM clientes WHERE usuario_id = ?', [usuario_id], (err, results) => {
      if (err) return res.status(500).json({ error: 'Error al obtener clientes' });
      return res.json(results);
    });
  } else {
    db.query('SELECT id, nombre, usuario_id, correo, telefono, direccion, canal_preferido FROM clientes', (err, results) => {
      if (err) return res.status(500).json({ error: 'Error al obtener clientes' });
      return res.json(results);
    });
  }
};

//Obtener cliente por ID
const getClienteById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT id, nombre, usuario_id, correo, telefono, direccion, canal_preferido FROM clientes WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener cliente' });
    if (results.length === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
    return res.json(results[0]);
  });
};

//Crear nuevo cliente (asociado opcionalmente a un usuario con usuario_id)
const crearCliente = async (req, res) => {
  try {
    const { nombre, correo, telefono = null, direccion = '', canal_pref = '', usuario_id = null } = req.body;
    const insertClienteSql = 'INSERT INTO clientes (nombre, usuario_id, correo, telefono, direccion, canal_preferido) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(insertClienteSql, [nombre, usuario_id, correo, telefono, direccion, canal_pref], (cErr, cRes) => {
      if (cErr) {
        if (cErr.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Correo ya registrado' });
        return res.status(500).json({ error: 'Error creando cliente', details: cErr });
      }
      db.query('SELECT id, nombre, usuario_id, correo, telefono, direccion, canal_preferido FROM clientes WHERE id = ?', [cRes.insertId], (err2, rows) => {
        if (err2) return res.status(500).json({ error: 'Error al recuperar cliente creado' });
        return res.status(201).json(rows[0]);
      });
    });
  } catch (err) {
    return res.status(500).json({ error: 'Error interno', details: err.message });
  }
};
//Obtener pedidos por el id del cliente especifico
const getPedidosByCliente = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM pedidos WHERE cliente_id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener pedidos' });
    return res.json(results);
  });
};

export default {
  getClientes,
  getClienteById,
  crearCliente,
  getPedidosByCliente
};
