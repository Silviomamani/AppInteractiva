const { Membresia } = require('../models');

const verificarAccesoEquipo = async (req, res, next) => {
  try {
    const { equipoId } = req.params;
    const usuarioId = req.usuario.id;

    const membresia = await Membresia.findOne({
      where: {
        usuarioId,
        equipoId,
        activo: true
      }
    });

    if (!membresia) {
      return res.status(403).json({
        success: false,
        message: 'No tienes acceso a este equipo'
      });
    }

    req.membresia = membresia;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verificando acceso al equipo'
    });
  }
};

const verificarAdminEquipo = async (req, res, next) => {
  try {
    if (!req.membresia || req.membresia.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Se requieren permisos de administrador'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verificando permisos de administrador'
    });
  }
};

module.exports = {
  verificarAccesoEquipo,
  verificarAdminEquipo
};