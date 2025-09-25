const { Actividad, Usuario, Equipo, Tarea } = require('../models');

class ActividadService {
  static async registrarActividad({
    tipo,
    descripcion,
    usuarioId,
    equipoId = null,
    tareaId = null,
    metadatos = null
  }) {
    try {
      return await Actividad.create({
        tipo,
        descripcion,
        usuarioId,
        equipoId,
        tareaId,
        metadatos
      });
    } catch (error) {
      console.error('Error registrando actividad:', error);
      throw error;
    }
  }

  static async obtenerActividadesPorUsuario(usuarioId, limite = 50, pagina = 1) {
    const offset = (pagina - 1) * limite;

    return await Actividad.findAndCountAll({
      where: { usuarioId },
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'email', 'avatar']
        },
        {
          model: Equipo,
          as: 'equipo',
          attributes: ['id', 'nombre', 'color']
        },
        {
          model: Tarea,
          as: 'tarea',
          attributes: ['id', 'titulo']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: limite,
      offset
    });
  }

  static async obtenerActividadesPorEquipo(equipoId, limite = 50, pagina = 1) {
    const offset = (pagina - 1) * limite;

    return await Actividad.findAndCountAll({
      where: { equipoId },
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'email', 'avatar']
        },
        {
          model: Tarea,
          as: 'tarea',
          attributes: ['id', 'titulo']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: limite,
      offset
    });
  }
}

module.exports = ActividadService;