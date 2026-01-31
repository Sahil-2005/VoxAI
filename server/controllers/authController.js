const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE, HTTP_STATUS, MESSAGES } = require('../config/constants');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.AUTH.USER_EXISTS
      });
    }

    // Create user
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: MESSAGES.AUTH.REGISTRATION_SUCCESS,
      data: {
        token,
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.AUTH.INVALID_CREDENTIALS
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.AUTH.INVALID_CREDENTIALS
      });
    }

    const token = generateToken(user._id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.AUTH.LOGIN_SUCCESS,
      data: {
        token,
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.USER.NOT_FOUND
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, avatar },
      { new: true, runValidators: true }
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.USER.UPDATED,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Twilio configuration
// @route   PUT /api/auth/twilio
// @access  Private
exports.updateTwilioConfig = async (req, res, next) => {
  try {
    const { accountSid, authToken, phoneNumber } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        twilioConfig: {
          accountSid,
          authToken,
          phoneNumber,
          isConfigured: !!(accountSid && authToken && phoneNumber)
        }
      },
      { new: true }
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.TWILIO.CONFIGURED,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};
