'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tareas', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      titulo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      estado: {
        type: Sequelize.ENUM('pendiente', 'en_curso', 'finalizada', 'cancelada'),
        allowNull: false,
        defaultValue: 'pendiente'
      },
      prioridad: {
        type: Sequelize.ENUM('baja', 'media', 'alta', 'critica'),
        allowNull: false,
        defaultValue: 'media'
      },
      fechaLimite: {
        type: Sequelize.DATE,
        allowNull: true
      },
      equipoId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'equipos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      creadoPor: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      asignadoA: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      orden: {
        type: Sequelize.INTEGER,
        defaultValue: 0
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

    await queryInterface.addIndex('tareas', ['equipoId']);
    await queryInterface.addIndex('tareas', ['estado']);
    await queryInterface.addIndex('tareas', ['prioridad']);
    await queryInterface.addIndex('tareas', ['fechaLimite']);
    await queryInterface.addIndex('tareas', ['asignadoA']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tareas');
  }
};