import mysql from 'mysql2';

// Configuración de la conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,    
    user: 'sabsmart_user',
    password: 'sabsmart_2026',
    database: 'sabsmart'
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a MySQL');
});

export default db;  
