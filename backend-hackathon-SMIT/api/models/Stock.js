const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  type: {
    type: String,
    enum: ['IN', 'OUT', 'ADJUSTMENT'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  performedBy: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  previousQuantity: {
    type: Number,
    required: true
  },
  newQuantity: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const Stock = mongoose.model('Stock', stockSchema, 'stocks');
module.exports = Stock;
