'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const existingUsers = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM usuarios',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (existingUsers[0].count > 0) {
      console.log('Los datos de prueba ya existen, saltando seeder...');
      return;
    }

    // ID
    const usuario1Id = uuidv4();
    const usuario2Id = uuidv4();
    const usuario3Id = uuidv4();
    const equipo1Id = uuidv4();
    const equipo2Id = uuidv4();

    // Hash 
    const hashedPassword = await bcrypt.hash('123456', 12);

    // Usuarios
    await queryInterface.bulkInsert('usuarios', [
      {
        id: usuario1Id,
        nombre: 'Ana García',
        email: 'ana@example.com',
        password: hashedPassword,
        avatar: null,
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: usuario2Id,
        nombre: 'Carlos López',
        email: 'carlos@example.com',
        password: hashedPassword,
        avatar: null,
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: usuario3Id,
        nombre: 'María Rodríguez',
        email: 'maria@example.com',
        password: hashedPassword,
        avatar: null,
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Equipos
    await queryInterface.bulkInsert('equipos', [
      {
        id: equipo1Id,
        nombre: 'Desarrollo Frontend',
        descripcion: 'Equipo encargado del desarrollo de la interfaz de usuario',
        color: '#3B82F6',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: equipo2Id,
        nombre: 'Backend & API',
        descripcion: 'Equipo responsable del desarrollo del backend y APIs',
        color: '#10B981',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Membresías
    await queryInterface.bulkInsert('membresias', [
      {
        id: uuidv4(),
        usuarioId: usuario1Id,
        equipoId: equipo1Id,
        rol: 'admin',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        usuarioId: usuario2Id,
        equipoId: equipo1Id,
        rol: 'miembro',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        usuarioId: usuario2Id,
        equipoId: equipo2Id,
        rol: 'admin',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        usuarioId: usuario3Id,
        equipoId: equipo2Id,
        rol: 'miembro',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    console.log('Datos de prueba insertados correctamente');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('membresias', null, {});
    await queryInterface.bulkDelete('equipos', null, {});
    await queryInterface.bulkDelete('usuarios', null, {});
  }
};