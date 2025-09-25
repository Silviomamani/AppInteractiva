const { Etiqueta, TareaEtiqueta } = require('../models');
const ActividadService = require('../services/actividadService');

class EtiquetaController {
  static async crear(req, res) {
    try {
      const { nombre, color } = req.body;
      const { equipoId } = req.params;

      const etiqueta = await Etiqueta.create({
        nombre,
        color,
        equipoId
      });

      res.status(201).json({
        success: true,
        data: { etiqueta },
        message: 'Etiqueta creada exitosamente'
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'Ya existe una etiqueta con ese nombre en este equipo'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error al crear etiqueta'
      });
    }
  }

  static async listar(req, res) {
    try {
      const { equipoId } = req.params;

      const etiquetas = await Etiqueta.findAll({
        where: { equipoId },
        order: [['nombre', 'ASC']]
      });

      res.json({
        success: true,
        data: { etiquetas }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al listar etiquetas'
      });
    }
  }

  static async actualizar(req, res) {
    try {
      const { etiquetaId } = req.params;
      const { nombre, color } = req.body;

      const etiqueta = await Etiqueta.findByPk(etiquetaId);
      if (!etiqueta) {
        return res.status(404).json({
          success: false,
          message: 'Etiqueta no encontrada'
        });
      }

      await etiqueta.update({ nombre, color });

      res.json({
        success: true,
        data: { etiqueta },
        message: 'Etiqueta actualizada exitosamente'
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'Ya existe una etiqueta con ese nombre en este equipo'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error al actualizar etiqueta'
      });
    }
  }

  static async eliminar(req, res) {
    try {
      const { etiquetaId } = req.params;

      const etiqueta = await Etiqueta.findByPk(etiquetaId);
      if (!etiqueta) {
        return res.status(404).json({
          success: false,
          message: 'Etiqueta no encontrada'
        });
      }

      await TareaEtiqueta.destroy({
        where: { etiquetaId }
      });

      await etiqueta.destroy();

      res.json({
        success: true,
        message: 'Etiqueta eliminada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar etiqueta'
      });
    }
  }

  static async asociarTarea(req, res) {
    try {
      const { etiquetaId, tareaId } = req.params;

      const asociacionExistente = await TareaEtiqueta.findOne({
        where: { tareaId, etiquetaId }
      });

      if (asociacionExistente) {
        return res.status(400).json({
          success: false,
          message: 'La etiqueta ya está asociada a esta tarea'
        });
      }

      await TareaEtiqueta.create({ tareaId, etiquetaId });

      res.json({
        success: true,
        message: 'Etiqueta asociada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al asociar etiqueta'
      });
    }
  }

  static async desasociarTarea(req, res) {
    try {
      const { etiquetaId, tareaId } = req.params;

      const asociacion = await TareaEtiqueta.findOne({
        where: { tareaId, etiquetaId }
      });

      if (!asociacion) {
        return res.status(404).json({
          success: false,
          message: 'Asociación no encontrada'
        });
      }

      await asociacion.destroy();

      res.json({
        success: true,
        message: 'Etiqueta desasociada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al desasociar etiqueta'
      });
    }
  }
}

module.exports = EtiquetaController;