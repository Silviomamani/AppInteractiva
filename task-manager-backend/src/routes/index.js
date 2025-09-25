const express = require('express');
const authRoutes = require('./auth');
const equipoRoutes = require('./equipos');
const tareaRoutes = require('./tareas');
const etiquetaRoutes = require('./etiquetas');
const actividadRoutes = require('./actividad');

const router = express.Router();

// Rutas de la API
router.use('/auth', authRoutes);
router.use('/equipos', equipoRoutes);
router.use('/tareas', tareaRoutes);
router.use('/etiquetas', etiquetaRoutes);
router.use('/actividad', actividadRoutes);

// Ruta de health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date()
  });
});

// Ruta base de API
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API disponible, usa rutas como /api/v1/usuarios, /api/v1/tareas',
    version: '1.0.0'
  });
});

module.exports = router;
