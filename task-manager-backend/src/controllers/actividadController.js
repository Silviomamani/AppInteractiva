const ActividadService = require('../services/actividadService');

class ActividadController {
  static async obtenerPorUsuario(req, res) {
    try {
      const usuarioId = req.usuario.id;
      const { pagina = 1, limite = 50 } = req.query;

      const resultado = await ActividadService.obtenerActividadesPorUsuario(
        usuarioId,
        parseInt(limite),
        parseInt(pagina)
      );

      const totalPaginas = Math.ceil(resultado.count / limite);

      res.json({
        success: true,
        data: {
          actividades: resultado.rows,
          paginacion: {
            paginaActual: parseInt(pagina),
            totalPaginas,
            totalRegistros: resultado.count,
            registrosPorPagina: parseInt(limite)
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener actividades del usuario'
      });
    }
  }

  static async obtenerPorEquipo(req, res) {
    try {
      const { equipoId } = req.params;
      const { pagina = 1, limite = 50 } = req.query;

      const resultado = await ActividadService.obtenerActividadesPorEquipo(
        equipoId,
        parseInt(limite),
        parseInt(pagina)
      );

      const totalPaginas = Math.ceil(resultado.count / limite);

      res.json({
        success: true,
        data: {
          actividades: resultado.rows,
          paginacion: {
            paginaActual: parseInt(pagina),
            totalPaginas,
            totalRegistros: resultado.count,
            registrosPorPagina: parseInt(limite)
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener actividades del equipo'
      });
    }
  }
}

module.exports = ActividadController;