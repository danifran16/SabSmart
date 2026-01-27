CREATE DATABASE IF NOT EXISTS sabsmart;
USE sabsmart;

CREATE TABLE IF NOT EXISTS usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  correo VARCHAR(50) UNIQUE NOT NULL,
  contrasenia VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'cliente'
); 

CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  usuario_id INT NOT NULL,
  correo VARCHAR(50) UNIQUE NOT NULL,
  telefono INT NOT NULL,
  direccion VARCHAR(50),
  canal_preferido VARCHAR(20) NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE SET NULL
); 

CREATE TABLE IF NOT EXISTS pedidos (
  pedido_id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  abono INT,
  Precio_total_pedido INT,
  estado VARCHAR(50) NOT NULL,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
); 

CREATE TABLE IF NOT EXISTS detalle_pedidos (
  detalle_pedido_id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  fecha_entrega DATE,
  Cantidad_total_prendas INT,
  Precio_total_prendas INT,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(pedido_id) ON DELETE CASCADE
); 

CREATE TABLE IF NOT EXISTS prenda (
  prenda_id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT,
  detalle_pedido_id INT,  
  tipo_prenda VARCHAR(50) NOT NULL,
  cantidad INT NOT NULL,
  Precio_unitario INT NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(pedido_id) ON DELETE CASCADE,
  FOREIGN KEY (detalle_pedido_id) REFERENCES detalle_pedidos(detalle_pedido_id) ON DELETE SET NULL
); 

CREATE TABLE IF NOT EXISTS detalle_prenda (
  detalle_prenda_id INT AUTO_INCREMENT PRIMARY KEY,
  prenda_id INT,
  detalle_pedido_id INT,
  descripcion_tarea VARCHAR(50),
  medidas VARCHAR(50),
  checklist_materiales VARCHAR(50),
  FOREIGN KEY (prenda_id) REFERENCES prenda(prenda_id) ON DELETE CASCADE,
  FOREIGN KEY (detalle_pedido_id) REFERENCES detalle_pedidos(detalle_pedido_id) ON DELETE SET NULL
); 

CREATE TABLE IF NOT EXISTS notificacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  pedido_id INT,
  mensaje VARCHAR(200),
  estado_envio VARCHAR(50) NOT NULL,
  fecha_envio DATETIME,
  tipo VARCHAR(50) NOT NULL,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(pedido_id) ON DELETE SET NULL
); 
