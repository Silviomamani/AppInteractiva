const { Op } = require('sequelize');

class QueryBuilder {
  static buildTareaFilters(queryParams) {
    const where = {};
    const {
      estado,
      prioridad,
      fechaDesde,
      fechaHasta,
      asignadoA,
      equipoId,
      busqueda
    } = queryParams;

    if (equipoId) {
      where.equipoId = equipoId;
    }

    if (estado) {
      const estados = estado.split(',');
      where.estado = { [Op.in]: estados };
    }

    if (prioridad) {
      const prioridades = prioridad.split(',');
      where.prioridad = { [Op.in]: prioridades };
    }

    if (fechaDesde || fechaHasta) {
      where.fechaLimite = {};
      if (fechaDesde) {
        where.fechaLimite[Op.gte] = new Date(fechaDesde);
      }
      if (fechaHasta) {
        where.fechaLimite[Op.lte] = new Date(fechaHasta);
      }
    }

    if (asignadoA) {
      where.asignadoA = asignadoA;
    }

    if (busqueda) {
      where[Op.or] = [
        { titulo: { [Op.iLike]: `%${busqueda}%` } },
        { descripcion: { [Op.iLike]: `%${busqueda}%` } }
      ];
    }

    return where;
  }

  static buildOrderClause(ordenarPor = 'createdAt', direccion = 'DESC') {
    const ordenValido = ['createdAt', 'updatedAt', 'fechaLimite', 'prioridad', 'titulo'];
    const direccionValida = ['ASC', 'DESC'];

    if (!ordenValido.includes(ordenarPor)) {
      ordenarPor = 'createdAt';
    }

    if (!direccionValida.includes(direccion.toUpperCase())) {
      direccion = 'DESC';
    }

    // Orden especial para prioridad
    if (ordenarPor === 'prioridad') {
      return [
        [
          'prioridad',
          direccion === 'ASC' ? 
            ['baja', 'media', 'alta', 'critica'] : 
            ['critica', 'alta', 'media', 'baja']
        ]
      ];
    }

    return [[ordenarPor, direccion]];
  }

  static buildPagination(pagina = 1, limite = 20) {
    const paginaNum = Math.max(1, parseInt(pagina));
    const limiteNum = Math.min(100, Math.max(1, parseInt(limite)));
    const offset = (paginaNum - 1) * limiteNum;

    return {
      limit: limiteNum,
      offset,
      pagina: paginaNum
    };
  }
}

module.exports = QueryBuilder;