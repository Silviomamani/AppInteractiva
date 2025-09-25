const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 255]
      }
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'usuarios',
    timestamps: true,
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.password) {
          usuario.password = await bcrypt.hash(usuario.password, 12);
        }
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed('password')) {
          usuario.password = await bcrypt.hash(usuario.password, 12);
        }
      }
    }
  });

  Usuario.prototype.verificarPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  Usuario.associate = (models) => {
    Usuario.hasMany(models.Membresia, {
      foreignKey: 'usuarioId',
      as: 'membresias'
    });
    
    Usuario.hasMany(models.Tarea, {
      foreignKey: 'creadoPor',
      as: 'tareasCreadas'
    });
    
    Usuario.hasMany(models.Tarea, {
      foreignKey: 'asignadoA',
      as: 'tareasAsignadas'
    });
    
    Usuario.hasMany(models.Comentario, {
      foreignKey: 'usuarioId',
      as: 'comentarios'
    });
    
    Usuario.hasMany(models.Actividad, {
      foreignKey: 'usuarioId',
      as: 'actividades'
    });
  };

  return Usuario;
};