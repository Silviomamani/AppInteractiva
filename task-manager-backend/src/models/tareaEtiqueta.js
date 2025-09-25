module.exports = (sequelize, DataTypes) => {
  const TareaEtiqueta = sequelize.define('TareaEtiqueta', {
    tareaId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'tareas',
        key: 'id'
      }
    },
    etiquetaId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'etiquetas',
        key: 'id'
      }
    }
  }, {
    tableName: 'tareas_etiquetas',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['tareaId', 'etiquetaId']
      }
    ]
  });

  return TareaEtiqueta;
};