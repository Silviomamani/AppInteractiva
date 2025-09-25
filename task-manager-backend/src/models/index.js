const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

const db = {
  sequelize,
  Sequelize,
  Usuario: require('./usuario')(sequelize, Sequelize),
  Equipo: require('./equipo')(sequelize, Sequelize),
  Membresia: require('./membresia')(sequelize, Sequelize),
  Tarea: require('./tarea')(sequelize, Sequelize),
  Comentario: require('./comentario')(sequelize, Sequelize),
  HistorialEstado: require('./historialEstado')(sequelize, Sequelize),
  Etiqueta: require('./etiqueta')(sequelize, Sequelize),
  TareaEtiqueta: require('./tareaEtiqueta')(sequelize, Sequelize),
  Actividad: require('./actividad')(sequelize, Sequelize)
};

// Definir asociaciones
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;