import mysql from 'mysql2';

// Log de variables de entorno (para debug en Railway)
console.log('🔍 Variables de entorno DB:');
console.log('DB_HOST:', process.env.DB_HOST || 'NO DEFINIDO');
console.log('DB_PORT:', process.env.DB_PORT || 'NO DEFINIDO');
console.log('DB_USER:', process.env.DB_USER || 'NO DEFINIDO');
console.log('DB_NAME:', process.env.DB_NAME || 'NO DEFINIDO');

// Configuración de la conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT) || 3306,    
    user: process.env.DB_USER || 'sabsmart_user',
    password: process.env.DB_PASSWORD || 'sabsmart_2026',
    database: process.env.DB_NAME || 'sabsmart'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Error al conectar a la base de datos:', err);
        return;
    }
    console.log('✅ Conectado a MySQL exitosamente');
});

export default db;  
