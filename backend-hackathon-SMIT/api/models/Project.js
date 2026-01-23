const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  currency: {
    type: String,
    default: 'PKR'
  },
  taxRate: {
    type: Number,
    default: 0
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['ADMIN', 'CASHIER', 'MANAGER', 'STAFF'],
      default: 'STAFF'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    lowStockAlert: {
      type: Number,
      default: 10
    },
    autoBackup: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema, 'projects');
module.exports = Project;
