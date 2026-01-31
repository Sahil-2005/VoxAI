const jwt = require('jsonwebtoken');
const { JWT_SECRET, HTTP_STATUS, MESSAGES } = require('../config/constants');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.AUTH.TOKEN_REQUIRED
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: MESSAGES.AUTH.TOKEN_INVALID
    });
  }
};

module.exports = authMiddleware;
