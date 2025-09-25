const express = require('express');
const TareaController = require('../controllers/tareaController');
const validaciones = require('../utils/validations');
const manejarValidacion = require('../middleware/validation');
const auth = require('../middleware/auth');
const { verificarAccesoEquipo } = require('../middleware/equipoAccess');

const router = express.Router();

router.use(auth);

// Todas las rutas requieren acceso al equipo
router.post('/:equipoId/tareas', 
  validaciones.validarUUID('equipoId'),
  validaciones.crearTarea,
  manejarValidacion,
  verificarAccesoEquipo,
  TareaController.crear
);

router.get('/:equipoId/tareas', 
  validaciones.validarUUID('equipoId'),
  validaciones.validarQueryTareas,
  manejarValidacion,
  verificarAccesoEquipo,
  TareaController.listar
);

router.get('/:equipoId/tareas/:tareaId', 
  validaciones.validarUUID('equipoId'),
  validaciones.validarUUID('tareaId'),
  manejarValidacion,
  verificarAccesoEquipo,
  TareaController.obtener
);

router.put('/:equipoId/tareas/:tareaId', 
  validaciones.validarUUID('equipoId'),
  validaciones.validarUUID('tareaId'),
  validaciones.actualizarTarea,
  manejarValidacion,
  verificarAccesoEquipo,
  TareaController.actualizar
);

router.delete('/:equipoId/tareas/:tareaId', 
  validaciones.validarUUID('equipoId'),
  validaciones.validarUUID('tareaId'),
  manejarValidacion,
  verificarAccesoEquipo,
  TareaController.eliminar
);

router.post('/:equipoId/tareas/:tareaId/comentarios', 
  validaciones.validarUUID('equipoId'),
  validaciones.validarUUID('tareaId'),
  validaciones.crearComentario,
  manejarValidacion,
  verificarAccesoEquipo,
  TareaController.agregarComentario
);

router.delete('/comentarios/:comentarioId', 
  validaciones.validarUUID('comentarioId'),
  manejarValidacion,
  TareaController.eliminarComentario
);

module.exports = router;
