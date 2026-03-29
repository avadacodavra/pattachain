const mongoose = require('mongoose');

const landSchema = new mongoose.Schema({
  tokenId: {
    type: Number,
    required: true,
    unique: true,
  },
  ulpin: {
    type: String,
    required: true,
    unique: true,
  },
  ulpinHash: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  ipfsDocumentHash: {
    type: String,
    required: true,
  },
  area: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  transactionHash: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Land', landSchema);