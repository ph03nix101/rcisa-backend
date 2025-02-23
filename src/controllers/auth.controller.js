const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { AuthenticationError } = require('../utils/errors');

class AuthController {
  async register(req, res, next) {
    try {
      const { email, password, name } = req.body;

      // Check if user already exists
      const [existingUser] = await db.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUser.length) {
        throw new AuthenticationError('User already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const [result] = await db.execute(
        'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
        [email, hashedPassword, name]
      );

      const token = jwt.sign(
        { userId: result.insertId },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(201).json({
        status: 'success',
        data: {
          token,
          user: {
            id: result.insertId,
            email,
            name
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Get user
      const [users] = await db.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (!users.length) {
        throw new AuthenticationError('Invalid credentials');
      }

      const user = users[0];

      // Check password
      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        throw new AuthenticationError('Invalid credentials');
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({
        status: 'success',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
