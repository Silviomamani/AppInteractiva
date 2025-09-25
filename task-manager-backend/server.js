require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync();
      console.log('Modelos sincronizados');
    }

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
      console.log(`API disponible en http://localhost:${PORT}/api/v1`);
      console.log(`Health check en http://localhost:${PORT}/api/v1/health`);
    });

  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();