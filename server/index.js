// 1er paso al configurar un backend, ya que aqui:
// iniciamos el servidor, configuramos express
// aqui creamos la app, se registran mdw, rutas y se levanta el servidor

import 'dotenv/config';
import express from "express"
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import routes from './routes/routes.js';
// import db from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); // se crea la app de Express

app.use(cors()); // permite request desde react
app.use(express.json()); // aqui permite leer json en request

// Usa rutas bajo /api
app.use('/api', routes);

const distPath = path.join(__dirname, '../dist');
const distExists = existsSync(distPath);

// Servir archivos estáticos del frontend en producción
if (process.env.NODE_ENV === 'production') {
  if (distExists) {
    console.log('✅ Carpeta dist/ encontrada, sirviendo frontend');
    app.use(express.static(distPath));
    
    // Todas las rutas que no sean /api devuelven el index.html (Express 5 compatible)
    app.use((req, res, next) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(distPath, 'index.html'));
      } else {
        next();
      }
    });
  } else {
    console.warn('⚠️ Carpeta dist/ NO encontrada. Ejecuta "npm run build" primero');
    app.get("/", (req, res) => {
      res.status(500).send(`
        <h1>⚠️ Frontend no construido</h1>
        <p>La carpeta dist/ no existe. Ejecuta <code>npm run build</code> antes de desplegar.</p>
        <p>API funcionando en <a href="/api">/api</a></p>
      `);
    });
  }
} else {
  // Ruta raíz de prueba en desarrollo
  app.get("/", (req, res) => {
    res.send("API SABSMART funcionando");
  });
}

const PORT = process.env.PORT || 3000;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

app.listen(PORT, HOST, () => {  
  console.log(`Servidor corriendo en ${HOST}:${PORT}`);
})

