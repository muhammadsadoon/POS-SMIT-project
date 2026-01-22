const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String, // Store name for history
    sku: String,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    subtotal: {
      type: Number,
      required: true
    }
  }],
  subtotal: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  discountType: {
    type: String,
    enum: ['PERCENTAGE', 'FIXED'],
    default: 'FIXED'
  },
  tax: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['CASH', 'CARD', 'UPI', 'WALLET', 'OTHER'],
    required: true
  },
  amountPaid: {
    type: Number,
    required: true
  },
  changeReturned: {
    type: Number,
    default: 0
  },
  customerName: String,
  customerPhone: String,
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['COMPLETED', 'CANCELLED', 'REFUNDED'],
    default: 'COMPLETED'
  },
  notes: String
}, {
  timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema, 'transactions');
module.exports = Transaction;