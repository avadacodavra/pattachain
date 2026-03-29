const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  ownedLands: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Land',
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);