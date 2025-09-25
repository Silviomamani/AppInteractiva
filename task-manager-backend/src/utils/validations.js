const { body, param, query } = require('express-validator');

const validaciones = {
  // Validaciones de usuario
  crearUsuario: [
    body('nombre')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Email inválido'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres')
  ],

  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Email inválido'),
    body('password')
      .notEmpty()
      .withMessage('La contraseña es requerida')
  ],

  // Validaciones de equipo
  crearEquipo: [
    body('nombre')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('descripcion')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('La descripción no puede exceder 500 caracteres'),
    body('color')
      .optional()
      .matches(/^#[0-9A-F]{6}$/i)
      .withMessage('El color debe ser un código hexadecimal válido')
  ],

  // Validaciones de tarea
  crearTarea: [
    body('titulo')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('El título debe tener entre 1 y 200 caracteres'),
    body('descripcion')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('La descripción no puede exceder 2000 caracteres'),
    body('prioridad')
      .optional()
      .isIn(['baja', 'media', 'alta', 'critica'])
      .withMessage('Prioridad inválida'),
    body('fechaLimite')
      .optional()
      .isISO8601()
      .custom(value => {
        if (value && new Date(value) < new Date()) {
          throw new Error('La fecha límite debe ser futura');
        }
        return true;
      }),
    body('asignadoA')
      .optional()
      .isUUID()
      .withMessage('ID de usuario inválido')
  ],

  actualizarTarea: [
    body('titulo')
      .optional()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('El título debe tener entre 1 y 200 caracteres'),
    body('descripcion')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('La descripción no puede exceder 2000 caracteres'),
    body('estado')
      .optional()
      .isIn(['pendiente', 'en_curso', 'finalizada', 'cancelada'])
      .withMessage('Estado inválido'),
    body('prioridad')
      .optional()
      .isIn(['baja', 'media', 'alta', 'critica'])
      .withMessage('Prioridad inválida'),
    body('fechaLimite')
      .optional()
      .isISO8601()
      .custom(value => {
        if (value && new Date(value) < new Date()) {
          throw new Error('La fecha límite debe ser futura');
        }
        return true;
      }),
    body('asignadoA')
      .optional()
      .isUUID()
      .withMessage('ID de usuario inválido')
  ],

  // Validaciones de comentario
  crearComentario: [
    body('contenido')
      .trim()
      .isLength({ min: 1, max: 2000 })
      .withMessage('El comentario debe tener entre 1 y 2000 caracteres')
  ],

  // Validaciones de etiqueta
  crearEtiqueta: [
    body('nombre')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('El nombre debe tener entre 1 y 50 caracteres'),
    body('color')
      .optional()
      .matches(/^#[0-9A-F]{6}$/i)
      .withMessage('El color debe ser un código hexadecimal válido')
  ],

  // Validaciones de parámetros
  validarUUID: (nombreParam) => [
    param(nombreParam)
      .isUUID()
      .withMessage(`${nombreParam} debe ser un UUID válido`)
  ],

  // Validaciones de query params
  validarQueryTareas: [
    query('estado')
      .optional()
      .custom(value => {
        const estados = value.split(',');
        const estadosValidos = ['pendiente', 'en_curso', 'finalizada', 'cancelada'];
        return estados.every(estado => estadosValidos.includes(estado));
      })
      .withMessage('Estado inválido'),
    query('prioridad')
      .optional()
      .custom(value => {
        const prioridades = value.split(',');
        const prioridadesValidas = ['baja', 'media', 'alta', 'critica'];
        return prioridades.every(prioridad => prioridadesValidas.includes(prioridad));
      })
      .withMessage('Prioridad inválida'),
    query('fechaDesde')
      .optional()
      .isISO8601()
      .withMessage('Fecha desde inválida'),
    query('fechaHasta')
      .optional()
      .isISO8601()
      .withMessage('Fecha hasta inválida'),
    query('asignadoA')
      .optional()
      .isUUID()
      .withMessage('ID de usuario inválido'),
    query('pagina')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Página debe ser un número mayor a 0'),
    query('limite')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Límite debe estar entre 1 y 100'),
    query('ordenarPor')
      .optional()
      .isIn(['createdAt', 'updatedAt', 'fechaLimite', 'prioridad', 'titulo'])
      .withMessage('Campo de ordenamiento inválido'),
    query('direccion')
      .optional()
      .isIn(['ASC', 'DESC'])
      .withMessage('Dirección de ordenamiento inválida')
  ]
};

module.exports = validaciones;