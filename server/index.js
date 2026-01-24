// 1er paso al configurar un backend, ya que aqui:
// iniciamos el servidor, configuramos express
// aqui creamos la app, se registran mdw, rutas y se levanta el servidor

import express from "express"
import cors from 'cors';


const app = express(); // se crea la app de Express

app.use(cors()); // permite request desde react
app.use(express.json()); // aqui permite leer json en request

// Aquí luego conectas las rutas
app.get("/", (req, res) => {
  res.send("API SABSMART funcionando");
});

app.listen(3000, () => {  
  console.log('Servidor corriendo en http://localhost:3000');
})


/* 
Express:
framework de node.js que crea servidores HTTP que:
  recibe solicitudes (req) desde un navegador o una app
  responde con informacion (responses)





*/