const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { BCRYPT_SALT_ROUNDS } = require('../config/constants');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: ''
  },
  twilioConfig: {
    accountSid: { type: String, default: '' },
    authToken: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    isConfigured: { type: Boolean, default: false }
  },
  subscription: {
    plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
    minutesUsed: { type: Number, default: 0 },
    minutesLimit: { type: Number, default: 100 }
  }
}, { 
  timestamps: true 
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, BCRYPT_SALT_ROUNDS);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive fields when converting to JSON
UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

module.exports = mongoose.model('User', UserSchema);