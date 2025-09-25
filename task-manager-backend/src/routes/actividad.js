const express = require('express');
const ActividadController = require('../controllers/actividadController');
const validaciones = require('../utils/validations');
const manejarValidacion = require('../middleware/validation');
const auth = require('../middleware/auth');
const { verificarAccesoEquipo } = require('../middleware/equipoAccess');

const router = express.Router();

router.use(auth);

router.get('/usuario', ActividadController.obtenerPorUsuario);

router.get('/:equipoId/equipo', 
  validaciones.validarUUID('equipoId'),
  manejarValidacion,
  verificarAccesoEquipo,
  ActividadController.obtenerPorEquipo
);

module.exports = router;