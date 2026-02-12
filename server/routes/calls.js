const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const CallLog = require('../models/CallLog');

// Get call logs for a specific bot
router.get('/bot/:botId', protect, async (req, res) => {
    try {
        const { botId } = req.params;
        
        // Find all call logs for this bot
        const calls = await CallLog.find({ bot: botId })
            .sort({ createdAt: -1 }) // Most recent first
            .limit(50); // Limit to last 50 calls
        
        res.status(200).json({
            success: true,
            data: { calls }
        });
    } catch (error) {
        console.error('Error fetching call logs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch call logs'
        });
    }
});

// Get all call logs for the authenticated user
router.get('/', protect, async (req, res) => {
    try {
        const calls = await CallLog.find({ user: req.user.id })
            .populate('bot', 'name')
            .sort({ createdAt: -1 })
            .limit(100);
        
        res.status(200).json({
            success: true,
            data: { calls }
        });
    } catch (error) {
        console.error('Error fetching call logs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch call logs'
        });
    }
});

module.exports = router;
