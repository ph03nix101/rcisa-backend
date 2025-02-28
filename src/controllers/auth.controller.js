const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { AuthenticationError } = require('../utils/errors');

class AuthController {
  async register(body) {
    try {
      const { email, password, name } = body;

      // Check if user already exists
      const [existingUser] = await db.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUser.length) {
        throw new AuthenticationError('User already exists');
      }

      // Check if user credentials are empty 
      if (email.length === 0 || password.length === 0 || name.length === 0){
        throw new AuthenticationError("Name, Email, and Password cannot be empty!")
      }

      // Check if email characters are valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new AuthenticationError("Not a valid email!");
      }


      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const [result] = await db.execute(
        'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
        [email, hashedPassword, name]
      );

      // Get user
      const [users] = await db.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      const user = users[0];

      const token = jwt.sign(
        { userId: result.insertId },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return {status: "success", 
        userInfo: {id: user.id, email:user.email, name: user.name}, 
        token}

    } catch (error) {
      throw new AuthenticationError(error);
    }
  }

  async login(body) {
    try {
 
      const { email, password } = body;

      // Get user
      const [users] = await db.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      const user = users[0];

      // Check password
      const isValid = await bcrypt.compare(password, user.password);

      if (!users.length || !isValid) {
        throw new AuthenticationError('Invalid credentials');
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return {status: "success", 
              userInfo: {id: user.id, email:user.email, name: user.name}, 
              token}

    } catch (TypeError) {
      throw new AuthenticationError('Invalid credentials');
    }
  }
}

module.exports = new AuthController();
