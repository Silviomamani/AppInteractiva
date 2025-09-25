const express = require('express');
const AuthController = require('../controllers/authController');
const validaciones = require('../utils/validations');
const manejarValidacion = require('../middleware/validation');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/registro', 
  validaciones.crearUsuario,
  manejarValidacion,
  AuthController.registro
);

router.post('/login', 
  validaciones.login,
  manejarValidacion,
  AuthController.login
);

router.get('/perfil', 
  auth,
  AuthController.perfil
);

module.exports = router;