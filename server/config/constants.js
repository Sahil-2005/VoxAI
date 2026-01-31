module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'voxai_super_secret_key_2026',
  JWT_EXPIRE: '7d',
  BCRYPT_SALT_ROUNDS: 12,
  
  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  },

  // Error Messages
  MESSAGES: {
    AUTH: {
      INVALID_CREDENTIALS: 'Invalid email or password',
      TOKEN_REQUIRED: 'Access denied. No token provided',
      TOKEN_INVALID: 'Invalid token',
      USER_EXISTS: 'User already exists with this email',
      REGISTRATION_SUCCESS: 'Registration successful',
      LOGIN_SUCCESS: 'Login successful'
    },
    USER: {
      NOT_FOUND: 'User not found',
      UPDATED: 'Profile updated successfully'
    },
    BOT: {
      CREATED: 'Bot created successfully',
      UPDATED: 'Bot updated successfully',
      DELETED: 'Bot deleted successfully',
      NOT_FOUND: 'Bot not found'
    },
    TWILIO: {
      CONFIGURED: 'Twilio credentials configured successfully',
      INVALID: 'Invalid Twilio credentials'
    }
  }
};
