module.exports = (sequelize, DataTypes) => {
  const Equipo = sequelize.define('Equipo', {
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
        len: [2, 100]
      }
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    color: {
      type: DataTypes.STRING(7),
      defaultValue: '#3B82F6',
      validate: {
        is: /^#[0-9A-F]{6}$/i
      }
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'equipos',
    timestamps: true
  });

  Equipo.associate = (models) => {
    Equipo.hasMany(models.Membresia, {
      foreignKey: 'equipoId',
      as: 'membresias'
    });
    
    Equipo.hasMany(models.Tarea, {
      foreignKey: 'equipoId',
      as: 'tareas'
    });
    
    Equipo.belongsToMany(models.Usuario, {
      through: models.Membresia,
      foreignKey: 'equipoId',
      otherKey: 'usuarioId',
      as: 'miembros'
    });
  };

  return Equipo;
};