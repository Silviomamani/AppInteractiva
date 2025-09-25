const express = require('express');
const EtiquetaController = require('../controllers/etiquetaController');
const validaciones = require('../utils/validations');
const manejarValidacion = require('../middleware/validation');
const auth = require('../middleware/auth');
const { verificarAccesoEquipo } = require('../middleware/equipoAccess');

const router = express.Router();

router.use(auth);

router.post('/:equipoId/etiquetas', 
  validaciones.validarUUID('equipoId'),
  validaciones.crearEtiqueta,
  manejarValidacion,
  verificarAccesoEquipo,
  EtiquetaController.crear
);

router.get('/:equipoId/etiquetas', 
  validaciones.validarUUID('equipoId'),
  manejarValidacion,
  verificarAccesoEquipo,
  EtiquetaController.listar
);

router.put('/etiquetas/:etiquetaId', 
  validaciones.validarUUID('etiquetaId'),
  validaciones.crearEtiqueta,
  manejarValidacion,
  EtiquetaController.actualizar
);

router.delete('/etiquetas/:etiquetaId', 
  validaciones.validarUUID('etiquetaId'),
  manejarValidacion,EtiquetaController.eliminar
);

// Asociaciones tarea-etiqueta
router.post('/etiquetas/:etiquetaId/tareas/:tareaId', 
  validaciones.validarUUID('etiquetaId'),
  validaciones.validarUUID('tareaId'),
  manejarValidacion,
  EtiquetaController.asociarTarea
);

router.delete('/etiquetas/:etiquetaId/tareas/:tareaId', 
  validaciones.validarUUID('etiquetaId'),
  validaciones.validarUUID('tareaId'),
  manejarValidacion,
  EtiquetaController.desasociarTarea
);

module.exports = router;