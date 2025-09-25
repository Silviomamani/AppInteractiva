const express = require('express');
const EquipoController = require('../controllers/equipoController');
const validaciones = require('../utils/validations');
const manejarValidacion = require('../middleware/validation');
const auth = require('../middleware/auth');
const { verificarAccesoEquipo, verificarAdminEquipo } = require('../middleware/equipoAccess');

const router = express.Router();

// Rutas públicas
router.use(auth);

router.post('/', 
  validaciones.crearEquipo,
  manejarValidacion,
  EquipoController.crear
);

router.get('/', EquipoController.listar);

// Rutas privadas (con acceso al equipo)
router.get('/:equipoId', 
  validaciones.validarUUID('equipoId'),
  manejarValidacion,
  verificarAccesoEquipo,
  EquipoController.obtener
);

router.put('/:equipoId', 
  validaciones.validarUUID('equipoId'),
  validaciones.crearEquipo,
  manejarValidacion,
  verificarAccesoEquipo,
  verificarAdminEquipo,
  EquipoController.actualizar
);

router.delete('/:equipoId', 
  validaciones.validarUUID('equipoId'),
  manejarValidacion,
  verificarAccesoEquipo,
  verificarAdminEquipo,
  EquipoController.eliminar
);

// Gestión de miembros (solo admins)
router.post('/:equipoId/miembros', 
  validaciones.validarUUID('equipoId'),
  manejarValidacion,
  verificarAccesoEquipo,
  verificarAdminEquipo,
  EquipoController.agregarMiembro
);

router.delete('/:equipoId/miembros/:usuarioId', 
  validaciones.validarUUID('equipoId'),
  validaciones.validarUUID('usuarioId'),
  manejarValidacion,
  verificarAccesoEquipo,
  verificarAdminEquipo,
  EquipoController.removerMiembro
);

router.put('/:equipoId/miembros/:usuarioId/rol', 
  validaciones.validarUUID('equipoId'),
  validaciones.validarUUID('usuarioId'),
  manejarValidacion,
  verificarAccesoEquipo,
  verificarAdminEquipo,
  EquipoController.actualizarRol
);

module.exports = router;