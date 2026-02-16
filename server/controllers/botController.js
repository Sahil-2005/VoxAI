const Bot = require('../models/Bot');
const { HTTP_STATUS, MESSAGES } = require('../config/constants');

// @desc    Create new bot
// @route   POST /api/bots
// @access  Private
exports.createBot = async (req, res, next) => {
  try {
    const { name, description, voiceType, language, recognitionLanguage, systemPrompt, greeting, personality, scriptFlow } = req.body;
    
    // Generate slug from name
    const baseSlug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const slug = `${baseSlug}_${randomSuffix}`;
    
    const bot = await Bot.create({
      user: req.user.id,
      name,
      description,
      voiceType,
      language,
      recognitionLanguage,
      systemPrompt,
      greeting,
      personality,
      scriptFlow: scriptFlow || [],
      slug
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
    let bot = await Bot.findOne({ _id: req.params.id, user: req.user.id });

    if (!bot) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.BOT.NOT_FOUND
      });
    }

    const { name, description, voiceType, language, recognitionLanguage, systemPrompt, greeting, personality, scriptFlow, isActive } = req.body;

    const updateData = {
      name,
      description,
      voiceType,
      language,
      recognitionLanguage,
      systemPrompt,
      greeting,
      personality,
      isActive // isActive is still a direct update field
    };

    // Handle script flow updates and audio deletion
    if (scriptFlow !== undefined) {
      const oldKeys = new Set(bot.scriptFlow.filter(item => item.is_question).map(item => item.key));
      const newKeys = new Set(scriptFlow.filter(item => item.is_question).map(item => item.key));
      
      // Find removed question keys
      const removedKeys = [...oldKeys].filter(key => !newKeys.has(key));
      
      // Delete audio files for removed questions
      if (removedKeys.length > 0 && bot.slug) {
        try {
          const axios = require('axios');
          const CALLENGINE_URL = process.env.CALLENGINE_URL;
          
          await axios.post(`${CALLENGINE_URL}/calls/${bot.slug}/delete-audio`, {
            keys: removedKeys
          });
          
          console.log(`Deleted audio files for keys: ${removedKeys.join(', ')}`);
        } catch (error) {
          console.error('Error deleting audio files:', error.message);
          // Continue with update even if audio deletion fails
        }
      }
      
      updateData.scriptFlow = scriptFlow;
      updateData.hasAudioGenerated = false; // Reset audio flag when script changes
    }

    bot = await Bot.findByIdAndUpdate(
      req.params.id,
      updateData,
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

// @desc    Trigger a call for a bot
// @route   POST /api/bots/:id/trigger-call
// @access  Private
exports.triggerCall = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;
    const { id } = req.params;

    if (!phoneNumber) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Get bot and verify ownership
    const bot = await Bot.findOne({ _id: id, user: req.user.id });
    if (!bot) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.BOT.NOT_FOUND
      });
    }

    // Get user with Twilio config
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    
    if (!user.twilioConfig.isConfigured) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Please configure your Twilio credentials in Settings first'
      });
    }

    // Check if bot has script flow
    if (!bot.scriptFlow || bot.scriptFlow.length === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Bot must have a script flow to make calls'
      });
    }

    // Call Python callEngine API to trigger call
    const axios = require('axios');
    const CALLENGINE_URL = process.env.CALLENGINE_URL;
    
    try {
      const response = await axios.post(`${CALLENGINE_URL}/calls/trigger`, {
        phone_number: phoneNumber,
        script_slug: bot.slug,
        twilio_account_sid: user.twilioConfig.accountSid,
        twilio_auth_token: user.twilioConfig.authToken,
        twilio_phone: user.twilioConfig.phoneNumber,
        script_data: {
          slug: bot.slug,
          name: bot.name,
          language: bot.language,
          voice_type: bot.voiceType,
          recognition_language: bot.recognitionLanguage || 'en-US',
          flow: bot.scriptFlow
        }
      });

      // Create call log
      const CallLog = require('../models/CallLog');
      await CallLog.create({
        user: req.user.id,
        bot: bot._id,
        phoneNumber,
        direction: 'outbound',
        status: 'queued',
        twilioCallSid: response.data.call_sid
      });

      // Update bot stats
      bot.stats.totalCalls += 1;
      await bot.save();

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Call triggered successfully',
        data: {
          callSid: response.data.call_sid,
          status: 'queued'
        }
      });
    } catch (error) {
      console.error('CallEngine API error:', error.response?.data || error.message);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to trigger call. Please ensure CallEngine is running.'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Generate audio files for bot script
// @route   POST /api/bots/:id/generate-audio
// @access  Private
exports.generateAudio = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get bot and verify ownership
    const bot = await Bot.findOne({ _id: id, user: req.user.id });
    if (!bot) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.BOT.NOT_FOUND
      });
    }

    if (!bot.scriptFlow || bot.scriptFlow.length === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Bot must have a script flow to generate audio'
      });
    }

    // Call Python callEngine API to generate audio
    const axios = require('axios');
    const CALLENGINE_URL = process.env.CALLENGINE_URL;
    
    try {
      const response = await axios.post(`${CALLENGINE_URL}/calls/${bot.slug}/generate-audio`, {
        script_data: {
          slug: bot.slug,
          name: bot.name,
          language: bot.language,
          voice_type: bot.voiceType,
          flow: bot.scriptFlow
        }
      });

      // Update bot
      bot.hasAudioGenerated = true;
      await bot.save();

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Audio files generated successfully',
        data: { bot }
      });
    } catch (error) {
      console.error('CallEngine API error:', error.response?.data || error.message);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to generate audio. Please ensure CallEngine is running.'
      });
    }
  } catch (error) {
    next(error);
  }
};

