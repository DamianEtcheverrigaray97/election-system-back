const mysql = require('mysql2');
require('dotenv').config(); // Para cargar las variables de entorno
const globalConstants = require('../const/globalConstants');

// Crear conexión a la base de datos
const db = mysql.createPool({
    host: globalConstants.DB_HOST,
    user: globalConstants.DB_USER,
    password: globalConstants.DB_PASSWORD,
    database: globalConstants.DB_NAME,
}).promise();

// Probar conexión
db.getConnection((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
    } else {
        console.log('Conexión exitosa a la base de datos');
    }
});

// Exportar conexión como Promesa
module.exports = db;
