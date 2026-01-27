import express from "express";
// import authController from "../controllers/authController.js";
import clientesController from "../controllers/clientesController.js";
import loginController from "../controllers/LoginController.js";
import pedidosController from "../controllers/pedidosController.js";
import prendasController from "../controllers/prendasController.js";

const router = express.Router();

// Usuarios (CRUD sobre tabla 'usuarios')
router.get('/usuarios', loginController.getUsuarios);
router.get('/usuarios/:id', loginController.getUsuarioById);
router.post('/usuarios', loginController.crearUsuario); // Registro público
router.put('/usuarios/:id', loginController.updateUsuario);
router.delete('/usuarios/:id', loginController.deleteUsuario);

// Auth endpoints
router.post('/auth/login', loginController.login);

// (CRUD sobre tabla 'clientes')
router.get("/clientes", clientesController.getClientes);
router.get("/clientes/:id", clientesController.getClienteById);
router.post("/clientes", clientesController.crearCliente);
router.get("/clientes/:id/pedidos", clientesController.getPedidosByCliente);

// Pedidos
router.get('/pedidos', pedidosController.getPedidosByCorreo); // GET /api/pedidos?correo=xxx
router.post('/pedidos', pedidosController.crearPedido);
router.get('/pedidos/:id', pedidosController.getPedidoById);
router.put('/pedidos/:id', pedidosController.updateEstadoPedido);
router.get('/pedidos/:id/detalle', pedidosController.getDetalleByPedido);
// Prendas / tareas
router.get('/prendas/:id', prendasController.getPrendaYTareas);
router.post('/prendas/:id/tareas', prendasController.crearTareaParaPrenda);

export default router;