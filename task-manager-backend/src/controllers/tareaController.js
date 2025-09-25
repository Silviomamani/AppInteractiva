const { Tarea, Usuario, Equipo, Etiqueta, Comentario, HistorialEstado, TareaEtiqueta } = require('../models');
const { Op } = require('sequelize');
const QueryBuilder = require('../utils/queryBuilder');
const ActividadService = require('../services/actividadService');

class TareaController {
  static async crear(req, res) {
    try {
      const { titulo, descripcion, prioridad, fechaLimite, asignadoA, etiquetas } = req.body;
      const { equipoId } = req.params;
      const creadoPor = req.usuario.id;

      const tarea = await Tarea.create({
        titulo,
        descripcion,
        prioridad,
        fechaLimite,
        equipoId,
        creadoPor,
        asignadoA
      });

      if (etiquetas && etiquetas.length > 0) {
        await tarea.setEtiquetas(etiquetas);
      }

      await HistorialEstado.create({
        tareaId: tarea.id,
        estadoAnterior: null,
        estadoNuevo: 'pendiente',
        usuarioId: creadoPor
      });

      await ActividadService.registrarActividad({
        tipo: 'tarea_creada',
        descripcion: `${req.usuario.nombre} creó la tarea "${titulo}"`,
        usuarioId: creadoPor,
        equipoId,
        tareaId: tarea.id
      });

      const tareaCompleta = await Tarea.findByPk(tarea.id, {
        include: [
          { model: Usuario, as: 'creador', attributes: ['id', 'nombre', 'email'] },
          { model: Usuario, as: 'asignado', attributes: ['id', 'nombre', 'email'] },
          { model: Etiqueta, as: 'etiquetas' }
        ]
      });

      res.status(201).json({
        success: true,
        data: { tarea: tareaCompleta },
        message: 'Tarea creada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear tarea'
      });
    }
  }

  static async listar(req, res) {
    try {
      const { equipoId } = req.params;
      const where = QueryBuilder.buildTareaFilters({ ...req.query, equipoId });
      const order = QueryBuilder.buildOrderClause(req.query.ordenarPor, req.query.direccion);
      const { limit, offset, pagina } = QueryBuilder.buildPagination(req.query.pagina, req.query.limite);

      let etiquetasWhere = {};
      if (req.query.etiquetas) {
        const etiquetasIds = req.query.etiquetas.split(',');
        etiquetasWhere = {
          include: [{
            model: Etiqueta,
            as: 'etiquetas',
            where: { id: { [Op.in]: etiquetasIds } },
            through: { attributes: [] }
          }]
        };
      }

      const result = await Tarea.findAndCountAll({
        where,
        include: [
          { model: Usuario, as: 'creador', attributes: ['id', 'nombre', 'email', 'avatar'] },
          { model: Usuario, as: 'asignado', attributes: ['id', 'nombre', 'email', 'avatar'] },
          { 
            model: Etiqueta, 
            as: 'etiquetas',
            through: { attributes: [] }
          },
          {
            model: Comentario,
            as: 'comentarios',
            attributes: ['id'],
            separate: true
          }
        ],
        order,
        limit,
        offset,
        distinct: true
      });

      const totalPaginas = Math.ceil(result.count / limit);

      res.json({
        success: true,
        data: {
          tareas: result.rows.map(tarea => ({
            ...tarea.toJSON(),
            totalComentarios: tarea.comentarios.length
          })),
          paginacion: {
            paginaActual: pagina,
            totalPaginas,
            totalRegistros: result.count,
            registrosPorPagina: limit
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al listar tareas'
      });
    }
  }

  static async obtener(req, res) {
    try {
      const { tareaId } = req.params;

      const tarea = await Tarea.findByPk(tareaId, {
        include: [
          { model: Usuario, as: 'creador', attributes: ['id', 'nombre', 'email', 'avatar'] },
          { model: Usuario, as: 'asignado', attributes: ['id', 'nombre', 'email', 'avatar'] },
          { model: Equipo, as: 'equipo', attributes: ['id', 'nombre', 'color'] },
          { 
            model: Etiqueta, 
            as: 'etiquetas',
            through: { attributes: [] }
          },
          {
            model: Comentario,
            as: 'comentarios',
            include: [{
              model: Usuario,
              as: 'usuario',
              attributes: ['id', 'nombre', 'email', 'avatar']
            }],
            order: [['createdAt', 'ASC']]
          },
          {
            model: HistorialEstado,
            as: 'historialEstados',
            include: [{
              model: Usuario,
              as: 'usuario',
              attributes: ['id', 'nombre', 'email', 'avatar']
            }],
            order: [['createdAt', 'DESC']]
          }
        ]
      });

      if (!tarea) {
        return res.status(404).json({
          success: false,
          message: 'Tarea no encontrada'
        });
      }

      res.json({
        success: true,
        data: { tarea }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener tarea'
      });
    }
  }

  static async actualizar(req, res) {
    try {
      const { tareaId } = req.params;
      const { titulo, descripcion, estado, prioridad, fechaLimite, asignadoA, etiquetas } = req.body;
      const usuarioId = req.usuario.id;

      const tarea = await Tarea.findByPk(tareaId);
      if (!tarea) {
        return res.status(404).json({
          success: false,
          message: 'Tarea no encontrada'
        });
      }

      const estadoAnterior = tarea.estado;
      
      await tarea.update({
        titulo,
        descripcion,
        estado,
        prioridad,
        fechaLimite,
        asignadoA
      });

      if (estado && estado !== estadoAnterior) {
        await HistorialEstado.create({
          tareaId: tarea.id,
          estadoAnterior,
          estadoNuevo: estado,
          usuarioId
        });

        await ActividadService.registrarActividad({
          tipo: 'tarea_estado_cambiado',
          descripcion: `${req.usuario.nombre} cambió el estado de "${tarea.titulo}" de ${estadoAnterior} a ${estado}`,
          usuarioId,
          equipoId: tarea.equipoId,
          tareaId: tarea.id,
          metadatos: { estadoAnterior, estadoNuevo: estado }
        });
      }

      if (etiquetas !== undefined) {
        await tarea.setEtiquetas(etiquetas);
      }

      if (!estado || estado === estadoAnterior) {
        await ActividadService.registrarActividad({
          tipo: 'tarea_editada',
          descripcion: `${req.usuario.nombre} editó la tarea "${tarea.titulo}"`,
          usuarioId,
          equipoId: tarea.equipoId,
          tareaId: tarea.id
        });
      }

      const tareaActualizada = await Tarea.findByPk(tarea.id, {
        include: [
          { model: Usuario, as: 'creador', attributes: ['id', 'nombre', 'email'] },
          { model: Usuario, as: 'asignado', attributes: ['id', 'nombre', 'email'] },
          { model: Etiqueta, as: 'etiquetas' }
        ]
      });

      res.json({
        success: true,
        data: { tarea: tareaActualizada },
        message: 'Tarea actualizada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error al actualizar tarea'
      });
    }
  }

  static async eliminar(req, res) {
    try {
      const { tareaId } = req.params;

      const tarea = await Tarea.findByPk(tareaId);
      if (!tarea) {
        return res.status(404).json({
          success: false,
          message: 'Tarea no encontrada'
        });
      }

      await tarea.destroy();

      res.json({
        success: true,
        message: 'Tarea eliminada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar tarea'
      });
    }
  }

  static async agregarComentario(req, res) {
    try {
      const { tareaId } = req.params;
      const { contenido } = req.body;
      const usuarioId = req.usuario.id;

      const tarea = await Tarea.findByPk(tareaId);
      if (!tarea) {
        return res.status(404).json({
          success: false,
          message: 'Tarea no encontrada'
        });
      }

      const comentario = await Comentario.create({
        contenido,
        tareaId,
        usuarioId
      });

      // Registrar actividad
      await ActividadService.registrarActividad({
        tipo: 'comentario_agregado',
        descripcion: `${req.usuario.nombre} comentó en la tarea "${tarea.titulo}"`,
        usuarioId,
        equipoId: tarea.equipoId,
        tareaId: tarea.id
      });

      const comentarioCompleto = await Comentario.findByPk(comentario.id, {
        include: [{
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'email', 'avatar']
        }]
      });

      res.status(201).json({
        success: true,
        data: { comentario: comentarioCompleto },
        message: 'Comentario agregado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al agregar comentario'
      });
    }
  }

  static async eliminarComentario(req, res) {
    try {
      const { comentarioId } = req.params;
      const usuarioId = req.usuario.id;

      const comentario = await Comentario.findByPk(comentarioId);
      if (!comentario) {
        return res.status(404).json({
          success: false,
          message: 'Comentario no encontrado'
        });
      }

      // Solo el autor puede eliminar su comentario
      if (comentario.usuarioId !== usuarioId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para eliminar este comentario'
        });
      }

      await comentario.destroy();

      res.json({
        success: true,
        message: 'Comentario eliminado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar comentario'
      });
    }
  }
}

module.exports = TareaController;