const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('../utils/errors');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new AuthenticationError('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    next(new AuthenticationError('Invalid token'));
  }
};

module.exports = { authenticateToken };
