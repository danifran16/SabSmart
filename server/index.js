// 1er paso al configurar un backend, ya que aqui:
// iniciamos el servidor, configuramos express
// aqui creamos la app, se registran mdw, rutas y se levanta el servidor

import 'dotenv/config';
import express from "express"
import cors from 'cors';
import routes from './routes/routes.js';
// import db from './config/db.js';

const app = express(); // se crea la app de Express

app.use(cors()); // permite request desde react
app.use(express.json()); // aqui permite leer json en request

// Usa rutas bajo /api
app.use('/api', routes);

// Ruta raíz de prueba
app.get("/", (req, res) => {
  res.send("API SABSMART funcionando");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {  
  console.log(`Servidor corriendo en puerto ${PORT}`);
})

