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

  async login(body, res) {
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

      const accessToken = jwt.sign(
        { userId: user.id, email: user.email},
        process.env.JWT_SECRET,
        { expiresIn: '45s' }
      );
      const refreshToken = jwt.sign(
        { userId: user.id }, 
        process.env.JWT_SECRET,
        { expiresIn: '3d'}
      )

      await db.execute('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 3 DAY))',
        [user.id, refreshToken]);

      res.cookie('refreshToken', refreshToken, {httpOnly: true, sameSite: 'strict'}).header('accessToken', accessToken);
      // body[1].json({ accessToken });
      console.log("cookie=>",res.cookie.refreshToken)
      return [{status: "success", 
              userInfo: {id: user.id, email:user.email, name: user.name}, 
              accessToken, refreshToken}, refreshToken]

    } catch (TypeError) {
      throw new AuthenticationError('Invalid credentials');
    }
  }

  async getRefreshTokens(refreshToken, res){
    try{
      // Check if refresh token is in the database
      const [tokens] = await db.execute(
        'SELECT * FROM refresh_tokens WHERE token = ?', 
        [refreshToken]);

      if (tokens.length === 0){
        throw new AuthenticationError('Invalid refresh token'); 
      }

      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        if (err) return new AuthenticationError('Refresh Token is Invalid or Expired.');
      
        // Delete old refresh token
        await db.execute('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);

        // Generate new refresh token
        const newRefreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '3d'});

        await db.query('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
                      [user.id, newRefreshToken]);

        const newAccessToken = jwt.sign(
          { userId: user.id, email: user.email},
          process.env.JWT_SECRET,
          { expiresIn: '45s' }
        );

        res.cookie('refreshToken', refreshToken, {httpOnly: true, sameSite: 'strict'}).header('accessToken', newAccessToken);

        console.log("newAccessToken=>",newAccessToken)
        return {status: "success",
                userId: refreshToken.user_id, 
                newRefreshToken}
      });
    } catch(TypeError){
      throw new AuthenticationError(TyperError);
    }
  }
  
  async logout(refreshToken){
    const sql = 'DELETE FROM refresh_tokens WHERE token = ?';
    await db.execute(sql, [refreshToken]); 
  }
}

module.exports = new AuthController();
