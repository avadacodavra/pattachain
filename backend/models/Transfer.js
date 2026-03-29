const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  requestId: {
    type: Number,
    required: true,
    unique: true,
  },
  tokenId: {
    type: Number,
    required: true,
  },
  seller: {
    type: String,
    required: true,
  },
  buyer: {
    type: String,
    required: true,
  },
  salePrice: {
    type: String,
    required: true,
  },
  taxAmount: {
    type: String,
    required: true,
  },
  sellerApproved: {
    type: Boolean,
    default: false,
  },
  buyerApproved: {
    type: Boolean,
    default: false,
  },
  registrarApproved: {
    type: Boolean,
    default: false,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  isCancelled: {
    type: Boolean,
    default: false,
  },
  transactionHash: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Transfer', transferSchema);