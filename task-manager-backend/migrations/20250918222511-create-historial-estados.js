'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('historial_estados', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      tareaId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'tareas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      estadoAnterior: {
        type: Sequelize.ENUM('pendiente', 'en_curso', 'finalizada', 'cancelada'),
        allowNull: true
      },
      estadoNuevo: {
        type: Sequelize.ENUM('pendiente', 'en_curso', 'finalizada', 'cancelada'),
        allowNull: false
      },
      usuarioId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      comentario: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('historial_estados', ['tareaId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('historial_estados');
  }
};