const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('../utils/errors');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    console.log("=>", authHeader, token);

    if (!token) {
      throw new AuthenticationError('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError'){
      return next(new AuthenticationError('Token Expired.'));
    } else if (error.name === 'JsonWebTokenError'){
      return next(new AuthenticationError('Invalid Token.'));
    }
    return next(new AuthenticationError(error));
  }
};

module.exports = { authenticateToken };
