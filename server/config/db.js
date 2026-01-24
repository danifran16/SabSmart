import mysql from 'mysql2';

// Configuración de la conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'sabUser',
    password: 'sabsmart',
    database: 'sabSmartDB'
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a MySQL');
});

export default db;  