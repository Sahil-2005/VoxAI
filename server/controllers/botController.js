const Bot = require('../models/Bot');
const { HTTP_STATUS, MESSAGES } = require('../config/constants');

// @desc    Create new bot
// @route   POST /api/bots
// @access  Private
exports.createBot = async (req, res, next) => {
  try {
    const { name, description, voiceType, language, systemPrompt, greeting, personality } = req.body;
    
    const bot = await Bot.create({
      user: req.user.id,
      name,
      description,
      voiceType,
      language,
      systemPrompt,
      greeting,
      personality
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: MESSAGES.BOT.CREATED,
      data: { bot }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bots for current user
// @route   GET /api/bots
// @access  Private
exports.getBots = async (req, res, next) => {
  try {
    const bots = await Bot.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: bots.length,
      data: { bots }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single bot
// @route   GET /api/bots/:id
// @access  Private
exports.getBot = async (req, res, next) => {
  try {
    const bot = await Bot.findOne({ _id: req.params.id, user: req.user.id });

    if (!bot) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.BOT.NOT_FOUND
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { bot }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update bot
// @route   PUT /api/bots/:id
// @access  Private
exports.updateBot = async (req, res, next) => {
  try {
    const { name, description, voiceType, language, systemPrompt, greeting, personality, isActive } = req.body;
    
    let bot = await Bot.findOne({ _id: req.params.id, user: req.user.id });

    if (!bot) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.BOT.NOT_FOUND
      });
    }

    bot = await Bot.findByIdAndUpdate(
      req.params.id,
      { name, description, voiceType, language, systemPrompt, greeting, personality, isActive },
      { new: true, runValidators: true }
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.BOT.UPDATED,
      data: { bot }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete bot
// @route   DELETE /api/bots/:id
// @access  Private
exports.deleteBot = async (req, res, next) => {
  try {
    const bot = await Bot.findOne({ _id: req.params.id, user: req.user.id });

    if (!bot) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.BOT.NOT_FOUND
      });
    }

    await bot.deleteOne();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.BOT.DELETED,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/bots/stats/dashboard
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    const bots = await Bot.find({ user: req.user.id });
    
    const totalBots = bots.length;
    const activeBots = bots.filter(b => b.isActive).length;
    const totalCalls = bots.reduce((sum, b) => sum + b.stats.totalCalls, 0);
    const totalMinutes = bots.reduce((sum, b) => sum + b.stats.totalMinutes, 0);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        stats: {
          totalBots,
          activeBots,
          totalCalls,
          totalMinutes
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
