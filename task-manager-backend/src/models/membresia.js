module.exports = (sequelize, DataTypes) => {
  const Membresia = sequelize.define('Membresia', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
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
      allowNull: false,
      references: {
        model: 'equipos',
        key: 'id'
      }
    },
    rol: {
      type: DataTypes.ENUM('admin', 'miembro'),
      allowNull: false,
      defaultValue: 'miembro'
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'membresias',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['usuarioId', 'equipoId']
      }
    ]
  });

  Membresia.associate = (models) => {
    Membresia.belongsTo(models.Usuario, {
      foreignKey: 'usuarioId',
      as: 'usuario'
    });
    
    Membresia.belongsTo(models.Equipo, {
      foreignKey: 'equipoId',
      as: 'equipo'
    });
  };

  return Membresia;
};