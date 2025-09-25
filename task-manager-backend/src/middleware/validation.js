const { validationResult } = require('express-validator');

const manejarValidacion = (req, res, next) => {
  const errores = validationResult(req);
  
  if (!errores.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errores: errores.array()
    });
  }
  
  next();
};

module.exports = manejarValidacion;