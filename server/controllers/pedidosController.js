import db from '../config/db.js';

// Crear pedido para un cliente
const crearPedido = (req, res) => {
  const { cliente_id, abono = null, Precio_total_pedido = null, estado = 'nuevo' } = req.body;
  if (!cliente_id) return res.status(400).json({ error: 'cliente_id requerido' });
  const sql = 'INSERT INTO pedidos (cliente_id, abono, Precio_total_pedido, estado) VALUES (?, ?, ?, ?)';
  db.query(sql, [cliente_id, abono, Precio_total_pedido, estado], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error creando pedido', details: err });
    db.query('SELECT * FROM pedidos WHERE pedido_id = ?', [result.insertId], (e2, rows) => {
      if (e2) return res.status(500).json({ error: 'Error recuperando pedido creado' });
      return res.status(201).json(rows[0]);
    });
  });
};

// Obtener pedido por id
const getPedidoById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM pedidos WHERE pedido_id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener pedido' });
    if (results.length === 0) return res.status(404).json({ error: 'Pedido no encontrado' });
    return res.json(results[0]);
  });
};

// Obtener detalle (prendas) de un pedido
const getDetalleByPedido = (req, res) => {
  const { id } = req.params;
  const prendasSql = `SELECT prenda_id, tipo_prenda AS detalle, cantidad, Precio_unitario, (cantidad * Precio_unitario) AS total
               FROM prenda WHERE pedido_id = ?`;
  db.query(prendasSql, [id], (err, prendas) => {
    if (err) return res.status(500).json({ error: 'Error al obtener prendas del pedido', details: err });
    // obtener meta (detalle_pedidos) si existe
    db.query('SELECT fecha_entrega, Cantidad_total_prendas, Precio_total_prendas FROM detalle_pedidos WHERE pedido_id = ? LIMIT 1', [id], (e2, metaRows) => {
      if (e2) return res.status(500).json({ error: 'Error al obtener meta del pedido', details: e2 });
      const meta = (metaRows && metaRows.length > 0) ? metaRows[0] : null;
      return res.json({ prendas: prendas || [], meta });
    });
  });
};

// Actualizar estado del pedido
const updateEstadoPedido = (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  if (!estado) return res.status(400).json({ error: 'estado requerido' });
  db.query('UPDATE pedidos SET estado = ? WHERE pedido_id = ?', [estado, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error actualizando estado', details: err });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Pedido no encontrado' });
    db.query('SELECT * FROM pedidos WHERE pedido_id = ?', [id], (e2, rows) => {
      if (e2) return res.status(500).json({ error: 'Error recuperando pedido actualizado' });
      return res.json(rows[0]);
    });
  });
};

// Obtener pedidos por correo de cliente
const getPedidosByCorreo = (req, res) => {
  const { correo } = req.query;
  if (!correo) return res.status(400).json({ error: 'correo requerido' });
  
  // Buscar cliente por correo
  db.query('SELECT id FROM clientes WHERE correo = ?', [correo], (err, clienteRows) => {
    if (err) return res.status(500).json({ error: 'Error buscando cliente', details: err });
    if (clienteRows.length === 0) return res.json([]);
    
    const clienteId = clienteRows[0].id;
    
    // Obtener pedidos del cliente
    db.query('SELECT * FROM pedidos WHERE cliente_id = ?', [clienteId], (e2, pedidos) => {
      if (e2) return res.status(500).json({ error: 'Error obteniendo pedidos', details: e2 });
      return res.json(pedidos || []);
    });
  });
};

export default {
  crearPedido,
  getPedidoById,
  getDetalleByPedido,
  updateEstadoPedido,
  getPedidosByCorreo,
};
