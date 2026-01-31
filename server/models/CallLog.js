const mongoose = require('mongoose');

const CallLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bot',
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  direction: {
    type: String,
    enum: ['inbound', 'outbound'],
    default: 'outbound'
  },
  status: {
    type: String,
    enum: ['queued', 'ringing', 'in-progress', 'completed', 'failed', 'busy', 'no-answer'],
    default: 'queued'
  },
  duration: {
    type: Number,
    default: 0
  },
  twilioCallSid: {
    type: String,
    default: ''
  },
  transcript: {
    type: String,
    default: ''
  },
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative', 'unknown'],
    default: 'unknown'
  },
  startedAt: {
    type: Date
  },
  endedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
CallLogSchema.index({ user: 1, createdAt: -1 });
CallLogSchema.index({ bot: 1, createdAt: -1 });

module.exports = mongoose.model('CallLog', CallLogSchema);
