const express = require('express');
const router = express.Router();
const { createBot, getBots, getBot, updateBot, deleteBot, getDashboardStats, triggerCall, generateAudio } = require('../controllers/botController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Dashboard stats
router.get('/stats/dashboard', getDashboardStats);

// CRUD routes
router.route('/')
  .get(getBots)
  .post(createBot);

router.route('/:id')
  .get(getBot)
  .put(updateBot)
  .delete(deleteBot);

// Call triggering and audio generation
router.post('/:id/trigger-call', triggerCall);
router.post('/:id/generate-audio', generateAudio);

module.exports = router;
