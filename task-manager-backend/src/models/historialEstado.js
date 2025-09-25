module.exports = (sequelize, DataTypes) => {
  const HistorialEstado = sequelize.define('HistorialEstado', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    tareaId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'tareas',
        key: 'id'
      }
    },
    estadoAnterior: {
      type: DataTypes.ENUM('pendiente', 'en_curso', 'finalizada', 'cancelada'),
      allowNull: true
    },
    estadoNuevo: {
      type: DataTypes.ENUM('pendiente', 'en_curso', 'finalizada', 'cancelada'),
      allowNull: false
    },
    usuarioId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'historial_estados',
    timestamps: true
  });

  HistorialEstado.associate = (models) => {
    HistorialEstado.belongsTo(models.Tarea, {
      foreignKey: 'tareaId',
      as: 'tarea'
    });
    
    HistorialEstado.belongsTo(models.Usuario, {
      foreignKey: 'usuarioId',
      as: 'usuario'
    });
  };

  return HistorialEstado;
};