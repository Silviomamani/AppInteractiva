module.exports = (sequelize, DataTypes) => {
  const Tarea = sequelize.define('Tarea', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 200]
      }
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'en_curso', 'finalizada', 'cancelada'),
      allowNull: false,
      defaultValue: 'pendiente'
    },
    prioridad: {
      type: DataTypes.ENUM('baja', 'media', 'alta', 'critica'),
      allowNull: false,
      defaultValue: 'media'
    },
    fechaLimite: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: true,
        isFuture(value) {
          if (value && new Date(value) < new Date()) {
            throw new Error('La fecha límite debe ser futura');
          }
        }
      }
    },
    equipoId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'equipos',
        key: 'id'
      }
    },
    creadoPor: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    asignadoA: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    orden: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'tareas',
    timestamps: true,
    hooks: {
      beforeUpdate: (tarea, options) => {
        // Validar transiciones de estado
        if (tarea.changed('estado')) {
          const estadoAnterior = tarea._previousDataValues.estado;
          const nuevoEstado = tarea.estado;
          
          const transicionesValidas = {
            'pendiente': ['en_curso', 'cancelada'],
            'en_curso': ['finalizada', 'cancelada', 'pendiente'],
            'finalizada': [],
            'cancelada': ['pendiente']
          };
          
          if (!transicionesValidas[estadoAnterior].includes(nuevoEstado)) {
            throw new Error(`Transición de estado inválida: ${estadoAnterior} -> ${nuevoEstado}`);
          }
        }
        
        // Restricciones de edición para tareas finalizadas/canceladas
        if (['finalizada', 'cancelada'].includes(tarea._previousDataValues.estado)) {
          const camposPermitidos = ['estado'];
          const cambiosRealizados = Object.keys(tarea.changed() || {});
          const cambiosNoPermitidos = cambiosRealizados.filter(campo => !camposPermitidos.includes(campo));
          
          if (cambiosNoPermitidos.length > 0) {
            throw new Error('No se puede editar una tarea finalizada o cancelada');
          }
        }
      }
    }
  });

  Tarea.associate = (models) => {
    Tarea.belongsTo(models.Equipo, {
      foreignKey: 'equipoId',
      as: 'equipo'
    });
    
    Tarea.belongsTo(models.Usuario, {
      foreignKey: 'creadoPor',
      as: 'creador'
    });
    
    Tarea.belongsTo(models.Usuario, {
      foreignKey: 'asignadoA',
      as: 'asignado'
    });
    
    Tarea.hasMany(models.Comentario, {
      foreignKey: 'tareaId',
      as: 'comentarios'
    });
    
    Tarea.hasMany(models.HistorialEstado, {
      foreignKey: 'tareaId',
      as: 'historialEstados'
    });
    
    Tarea.belongsToMany(models.Etiqueta, {
      through: models.TareaEtiqueta,
      foreignKey: 'tareaId',
      otherKey: 'etiquetaId',
      as: 'etiquetas'
    });
  };

  return Tarea;
};