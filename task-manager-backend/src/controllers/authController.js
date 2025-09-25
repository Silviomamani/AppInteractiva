const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

class AuthController {
  static async registro(req, res) {
    try {
      const { nombre, email, password } = req.body;

      const usuarioExistente = await Usuario.findOne({ where: { email } });
      if (usuarioExistente) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está registrado'
        });
      }

      const usuario = await Usuario.create({
        nombre,
        email,
        password
      });

      const token = jwt.sign(
        { id: usuario.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        success: true,
        data: {
          usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            avatar: usuario.avatar
          },
          token
        },
        message: 'Usuario registrado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al registrar usuario'
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const usuario = await Usuario.findOne({ where: { email, activo: true } });
      if (!usuario || !(await usuario.verificarPassword(password))) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      const token = jwt.sign(
        { id: usuario.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({
        success: true,
        data: {
          usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            avatar: usuario.avatar
          },
          token
        },
        message: 'Login exitoso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error en el login'
      });
    }
  }

  static async perfil(req, res) {
    try {
      res.json({
        success: true,
        data: {
          usuario: req.usuario
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error obteniendo perfil'
      });
    }
  }
}

module.exports = AuthController;