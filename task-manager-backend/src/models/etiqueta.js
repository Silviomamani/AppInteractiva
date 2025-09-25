module.exports = (sequelize, DataTypes) => {
  const Etiqueta = sequelize.define('Etiqueta', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50]
      }
    },
    color: {
      type: DataTypes.STRING(7),
      defaultValue: '#6B7280',
      validate: {
        is: /^#[0-9A-F]{6}$/i
      }
    },
    equipoId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'equipos',
        key: 'id'
      }
    }
  }, {
    tableName: 'etiquetas',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['nombre', 'equipoId']
      }
    ]
  });

  Etiqueta.associate = (models) => {
    Etiqueta.belongsTo(models.Equipo, {
      foreignKey: 'equipoId',
      as: 'equipo'
    });
    
    Etiqueta.belongsToMany(models.Tarea, {
      through: models.TareaEtiqueta,
      foreignKey: 'etiquetaId',
      otherKey: 'tareaId',
      as: 'tareas'
    });
  };

  return Etiqueta;
};