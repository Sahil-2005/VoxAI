const express = require('express');
const router = express.Router();
const { createBot, getBots, getBot, updateBot, deleteBot, getDashboardStats } = require('../controllers/botController');
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

module.exports = router;
