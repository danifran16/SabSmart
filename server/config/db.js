import mysql from 'mysql2';

// Configuración de la conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,    
    user: process.env.DB_USER || 'sabsmart_user',
    password: process.env.DB_PASSWORD || 'sabsmart_2026',
    database: process.env.DB_NAME || 'sabsmart'
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a MySQL');
});

export default db;  
