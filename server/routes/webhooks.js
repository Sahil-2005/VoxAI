const express = require('express');
const router = express.Router();
const CallLog = require('../models/CallLog');

// @desc    Handle call completion webhook from CallEngine
// @route   POST /api/webhooks/call-completed
// @access  Public (called by CallEngine)
router.post('/call-completed', async (req, res) => {
    try {
        const { callSid, responses, duration, status } = req.body;

        if (!callSid) {
            return res.status(400).json({
                success: false,
                message: 'Call SID is required'
            });
        }

        // Find and update the CallLog
        const callLog = await CallLog.findOne({ twilioCallSid: callSid });

        if (!callLog) {
            console.log(`⚠️ CallLog not found for SID: ${callSid}`);
            return res.status(404).json({
                success: false,
                message: 'Call log not found'
            });
        }

        // Update with conversation data
        callLog.responses = responses || {};
        callLog.duration = duration || 0;
        callLog.status = status || 'completed';
        callLog.endedAt = new Date();

        // Generate transcript from responses
        if (responses && Object.keys(responses).length > 0) {
            const transcript = Object.entries(responses)
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n');
            callLog.transcript = transcript;
        }

        await callLog.save();

        console.log(`✅ Updated CallLog for ${callSid} with ${Object.keys(responses || {}).length} responses`);

        res.status(200).json({
            success: true,
            message: 'Call log updated successfully'
        });
    } catch (error) {
        console.error('❌ Error updating call log:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update call log',
            error: error.message
        });
    }
});

module.exports = router;
