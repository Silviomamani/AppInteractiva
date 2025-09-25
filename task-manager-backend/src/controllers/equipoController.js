const { Equipo, Membresia, Usuario, Tarea } = require('../models');
const { Op } = require('sequelize');
const ActividadService = require('../services/actividadService');

// Controlador para operaciones relacionadas con equipos

class EquipoController {
  // Crea un nuevo equipo y agrega al usuario como admin
  static async crear(req, res) {
    try {
      const { nombre, descripcion, color } = req.body;
      const usuarioId = req.usuario.id;

      const equipo = await Equipo.create({
        nombre,
        descripcion,
        color
      });

      await Membresia.create({
        usuarioId,
        equipoId: equipo.id,
        rol: 'admin'
      });

      await ActividadService.registrarActividad({
        tipo: 'miembro_agregado',
        descripcion: `${req.usuario.nombre} creó el equipo ${nombre}`,
        usuarioId,
        equipoId: equipo.id
      });

      res.status(201).json({
        success: true,
        data: { equipo },
        message: 'Equipo creado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear equipo'
      });
    }
  }

  // Lista todos los equipos activos donde el usuario es miembro
  static async listar(req, res) {
    try {
      const usuarioId = req.usuario.id;

      const equipos = await Equipo.findAll({
        include: [
          {
            model: Membresia,
            as: 'membresias',
            where: { usuarioId, activo: true },
            attributes: ['rol']
          },
          {
            model: Usuario,
            as: 'miembros',
            attributes: ['id', 'nombre', 'email', 'avatar'],
            through: {
              where: { activo: true },
              attributes: ['rol']
            }
          }
        ],
        where: { activo: true },
        order: [['nombre', 'ASC']]
      });

      res.json({
        success: true,
        data: { equipos }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al listar equipos'
      });
    }
  }

  // Obtiene la información de un equipo específico, incluyendo sus miembros
  static async obtener(req, res) {
    try {
      const { equipoId } = req.params;

      const equipo = await Equipo.findByPk(equipoId, {
        include: [
          {
            model: Usuario,
            as: 'miembros',
            attributes: ['id', 'nombre', 'email', 'avatar'],
            through: {
              where: { activo: true },
              attributes: ['rol', 'createdAt']
            }
          }
        ]
      });

      if (!equipo) {
        return res.status(404).json({
          success: false,
          message: 'Equipo no encontrado'
        });
      }

      res.json({
        success: true,
        data: { equipo }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener equipo'
      });
    }
  }

  // Actualiza los datos de un equipo
  static async actualizar(req, res) {
    try {
      const { equipoId } = req.params;
      const { nombre, descripcion, color } = req.body;

      const equipo = await Equipo.findByPk(equipoId);
      if (!equipo) {
        return res.status(404).json({
          success: false,
          message: 'Equipo no encontrado'
        });
      }

      await equipo.update({ nombre, descripcion, color });

      res.json({
        success: true,
        data: { equipo },
        message: 'Equipo actualizado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar equipo'
      });
    }
  }

  // Elimina lógicamente un equipo si no tiene tareas activas
  static async eliminar(req, res) {
    try {
      const { equipoId } = req.params;

      const tareasActivas = await Tarea.count({
        where: {
          equipoId,
          estado: { [Op.in]: ['pendiente', 'en_curso'] }
        }
      });

      if (tareasActivas > 0) {
        return res.status(400).json({
          success: false,
          message: 'No se puede eliminar un equipo con tareas pendientes o en curso'
        });
      }

      await Equipo.update(
        { activo: false },
        { where: { id: equipoId } }
      );

      res.json({
        success: true,
        message: 'Equipo eliminado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar equipo'
      });
    }}

  // Agrega un usuario existente al equipo, o reactiva su membresía si ya existía
  static async agregarMiembro(req, res) {
    try {
      const { equipoId } = req.params;
      const { usuarioId, email, rol = 'miembro' } = req.body;

      let usuario;
      if (usuarioId) {
        usuario = await Usuario.findByPk(usuarioId);
      } else if (email) {
        usuario = await Usuario.findOne({ where: { email } });
      }

      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      const membresiaExistente = await Membresia.findOne({
        where: { usuarioId: usuario.id, equipoId }
      });

      if (membresiaExistente) {
        if (membresiaExistente.activo) {
          return res.status(400).json({
            success: false,
            message: 'El usuario ya es miembro del equipo'
          });
        }
        await membresiaExistente.update({ activo: true, rol });
      } else {
        await Membresia.create({
          usuarioId: usuario.id,
          equipoId,
          rol
        });
      }

      await ActividadService.registrarActividad({
        tipo: 'miembro_agregado',
        descripcion: `${req.usuario.nombre} agregó a ${usuario.nombre} al equipo`,
        usuarioId: req.usuario.id,
        equipoId
      });

      res.json({
        success: true,
        message: 'Miembro agregado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al agregar miembro'
      });
    }
  }

  // Remueve (desactiva) la membresía de un usuario en un equipo
  static async removerMiembro(req, res) {
    try {
      const { equipoId, usuarioId } = req.params;

      const membresia = await Membresia.findOne({
        where: { usuarioId, equipoId, activo: true }
      });

      if (!membresia) {
        return res.status(404).json({
          success: false,
          message: 'Membresía no encontrada'
        });
      }

      await membresia.update({ activo: false });

      const usuario = await Usuario.findByPk(usuarioId);
      
      await ActividadService.registrarActividad({
        tipo: 'miembro_removido',
        descripcion: `${req.usuario.nombre} removió a ${usuario.nombre} del equipo`,
        usuarioId: req.usuario.id,
        equipoId
      });

      res.json({
        success: true,
        message: 'Miembro removido exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al remover miembro'
      });
    }
  }

  // Cambia el rol de un miembro dentro del equipo
  static async actualizarRol(req, res) {
    try {
      const { equipoId, usuarioId } = req.params;
      const { rol } = req.body;

      const membresia = await Membresia.findOne({
        where: { usuarioId, equipoId, activo: true }
      });

      if (!membresia) {
        return res.status(404).json({
          success: false,
          message: 'Membresía no encontrada'
        });
      }

      await membresia.update({ rol });

      res.json({
        success: true,
        message: 'Rol actualizado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar rol'
      });
    }
  }
}

module.exports = EquipoController;