const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
    trim: true,
  },

  balance: {
    type: Number,
    default: 1000,
    min: 0,
  },

  preferredLanguage: {
    type: String,
    default: 'he',
    trim: true,
  },

  preferredCurrency: {
    type: String,
    default: 'USD',
    trim: true,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  verificationToken: {
    type: String,
    default: null,
  },
});

module.exports = userSchema;
