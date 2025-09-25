module.exports = (sequelize, DataTypes) => {
  const Actividad = sequelize.define('Actividad', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    tipo: {
      type: DataTypes.ENUM(
        'tarea_creada', 'tarea_editada', 'tarea_asignada', 'tarea_estado_cambiado',
        'comentario_agregado', 'etiqueta_agregada', 'etiqueta_removida',
        'miembro_agregado', 'miembro_removido'
      ),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
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
    equipoId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'equipos',
        key: 'id'
      }
    },
    tareaId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'tareas',
        key: 'id'
      }
    },
    metadatos: {
      type: DataTypes.JSON, 
      allowNull: true
    }
  }, {
    tableName: 'actividades',
    timestamps: true,
    indexes: [
      {
        fields: ['usuarioId', 'createdAt']
      },
      {
        fields: ['equipoId', 'createdAt']
      },
      {
        fields: ['tareaId', 'createdAt']
      }
    ]
  });

  Actividad.associate = (models) => {
    Actividad.belongsTo(models.Usuario, {
      foreignKey: 'usuarioId',
      as: 'usuario'
    });
    
    Actividad.belongsTo(models.Equipo, {
      foreignKey: 'equipoId',
      as: 'equipo'
    });
    
    Actividad.belongsTo(models.Tarea, {
      foreignKey: 'tareaId',
      as: 'tarea'
    });
  };

  return Actividad;
};