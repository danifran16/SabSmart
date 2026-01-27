// 1er paso al configurar un backend, ya que aqui:
// iniciamos el servidor, configuramos express
// aqui creamos la app, se registran mdw, rutas y se levanta el servidor

import 'dotenv/config';
import express from "express"
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/routes.js';
// import db from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); // se crea la app de Express

app.use(cors()); // permite request desde react
app.use(express.json()); // aqui permite leer json en request

// Usa rutas bajo /api
app.use('/api', routes);

// Servir archivos estáticos del frontend en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  // Todas las rutas que no sean /api devuelven el index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
} else {
  // Ruta raíz de prueba en desarrollo
  app.get("/", (req, res) => {
    res.send("API SABSMART funcionando");
  });
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {  
  console.log(`Servidor corriendo en puerto ${PORT}`);
})

