
// Carga las variables de entorno definidas en el archivo .env
require('dotenv').config();

// Exporta la configuración de la base de datos para los distintos entornos
module.exports = {
  // Configuración para entorno de desarrollo
  development: {
    // Usuario de la base de datos (desde .env)
    username: process.env.DB_USER,
    // Contraseña del usuario de la base de datos (desde .env)
    password: process.env.DB_PASS,
    // Nombre de la base de datos (desde .env)
    database: process.env.DB_NAME,
    // Host donde corre la base de datos (desde .env)
    host: process.env.DB_HOST,
    // Puerto de conexión (por defecto 3306 para MySQL)
    port: process.env.DB_PORT || 3306,
    // Dialecto de la base de datos (MySQL en este caso)
    dialect: 'mysql',
    // Muestra logs de las consultas SQL en consola
    logging: console.log,
    // Zona horaria para guardar fechas en la base de datos
    timezone: '-03:00' 
  },
  // Configuración para entorno de producción
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    // Desactiva logs de SQL en producción
    logging: false,
    // Configuración del pool de conexiones
    pool: {
      max: 5,      // Máximo de conexiones simultáneas
      min: 0,      // Mínimo de conexiones
      acquire: 30000, // Tiempo máximo (ms) para intentar conectar antes de lanzar error
      idle: 10000     // Tiempo máximo (ms) que una conexión puede estar inactiva antes de ser liberada
    },
    timezone: '-03:00'
  }
};