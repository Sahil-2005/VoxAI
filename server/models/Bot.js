const mongoose = require('mongoose');

const BotSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Bot name is required'],
    trim: true,
    maxlength: [50, 'Bot name cannot exceed 50 characters']
  },
  description: {
    type: String,
    default: '',
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  voiceType: {
    type: String,
    enum: ['male', 'female', 'neutral'],
    default: 'female'
  },
  language: {
    type: String,
    default: 'en-US'
  },
  systemPrompt: {
    type: String,
    required: [true, 'System prompt is required'],
    maxlength: [5000, 'System prompt cannot exceed 5000 characters']
  },
  greeting: {
    type: String,
    default: 'Hello! How can I assist you today?',
    maxlength: [500, 'Greeting cannot exceed 500 characters']
  },
  personality: {
    type: String,
    enum: ['professional', 'friendly', 'casual', 'formal'],
    default: 'professional'
  },
  // Script-based flow for question/answer bots
  scriptFlow: [{
    key: { type: String, required: true },
    text: { type: String, required: true },
    hints: { type: String, default: '' },
    is_question: { type: Boolean, required: true }
  }],
  // Unique slug for script identification (auto-generated)
  slug: { 
    type: String, 
    unique: true, 
    sparse: true 
  },
  // Track if audio files have been generated
  hasAudioGenerated: { 
    type: Boolean, 
    default: false 
  },
  isActive: {
    type: Boolean,
    default: true
  },
  stats: {
    totalCalls: { type: Number, default: 0 },
    totalMinutes: { type: Number, default: 0 },
    avgDuration: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Index for faster queries
BotSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Bot', BotSchema);
