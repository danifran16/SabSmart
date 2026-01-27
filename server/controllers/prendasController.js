import db from '../config/db.js';

// Obtener prenda y sus tareas (detalle_prenda)
const getPrendaYTareas = (req, res) => {
  const { id } = req.params;
  db.query('SELECT prenda_id, pedido_id, tipo_prenda AS detalle, tipo_prenda, cantidad, Precio_unitario FROM prenda WHERE prenda_id = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener prenda', details: err });
    if (rows.length === 0) return res.status(404).json({ error: 'Prenda no encontrada' });
    const prenda = rows[0];
    db.query('SELECT detalle_prenda_id, descripcion_tarea, medidas, checklist_materiales FROM detalle_prenda WHERE prenda_id = ?', [id], (e2, tareas) => {
      if (e2) return res.status(500).json({ error: 'Error al obtener tareas', details: e2 });
      return res.json({ prenda, tareas: tareas || [] });
    });
  });
};

// Crear tarea para una prenda
const crearTareaParaPrenda = (req, res) => {
  const { id } = req.params; // prenda_id
  const { descripcion_tarea = '', medidas = '', checklist_materiales = '' } = req.body;
  if (!descripcion_tarea) return res.status(400).json({ error: 'descripcion_tarea requerida' });
  const sql = 'INSERT INTO detalle_prenda (prenda_id, descripcion_tarea, medidas, checklist_materiales) VALUES (?, ?, ?, ?)';
  db.query(sql, [id, descripcion_tarea, medidas, checklist_materiales], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error creando tarea', details: err });
    db.query('SELECT detalle_prenda_id, descripcion_tarea, medidas, checklist_materiales FROM detalle_prenda WHERE detalle_prenda_id = ?', [result.insertId], (e2, rows) => {
      if (e2) return res.status(500).json({ error: 'Error recuperando tarea creada', details: e2 });
      return res.status(201).json(rows[0]);
    });
  });
};

export default {
  getPrendaYTareas,
  crearTareaParaPrenda,
};
