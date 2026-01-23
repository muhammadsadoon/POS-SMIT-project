const Joi = require('joi');
const mongoose = require('mongoose');

// Validate Product
const validateProduct = (req, res, next) => {
  const schema = Joi.object({
    project: Joi.string().required(),
    name: Joi.string().required().trim(),
    sku: Joi.string().required().trim(),
    description: Joi.string().allow('').trim(),
    price: Joi.number().required().min(0),
    costPrice: Joi.number().required().min(0),
    category: Joi.string().required(),
    quantity: Joi.number().min(0).default(0),
    minStockLevel: Joi.number().min(0).default(10),
    imageUrl: Joi.string().uri().allow(null, ''),
    img: Joi.string().uri().allow(null, ''),
    barcode: Joi.string().allow(null, '').trim(),
    isActive: Joi.boolean().default(true)
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: error.details.map(d => d.message)
    });
  }
  
  next();
};

// Validate Stock Add/Remove
const validateStockMovement = (req, res, next) => {
  const schema = Joi.object({
    project: Joi.string().required(),
    productId: Joi.string().required(),
    quantity: Joi.number().required().min(1),
    reason: Joi.string().required().trim(),
    performedBy: Joi.string().required().trim(),
    notes: Joi.string().allow('').trim()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: error.details.map(d => d.message)
    });
  }
  
  next();
};

// Validate Stock Adjust
const validateStockAdjust = (req, res, next) => {
  const schema = Joi.object({
    project: Joi.string().required(),
    productId: Joi.string().required(),
    newQuantity: Joi.number().required().min(0),
    reason: Joi.string().required().trim(),
    performedBy: Joi.string().required().trim(),
    notes: Joi.string().allow('').trim()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: error.details.map(d => d.message)
    });
  }
  
  next();
};

// Validate Transaction (Sale)
const validateTransaction = (req, res, next) => {
  const schema = Joi.object({
    project: Joi.string().required(),
    items: Joi.array().items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().required().min(1)
      })
    ).required().min(1),
    discount: Joi.number().min(0).default(0),
    discountType: Joi.string().valid('FIXED', 'PERCENTAGE').default('FIXED'),
    paymentMethod: Joi.string().valid('CASH', 'CARD', 'UPI', 'WALLET', 'OTHER').required(),
    amountPaid: Joi.number().required().min(0),
    customerName: Joi.string().allow('').trim(),
    customerPhone: Joi.string().allow('').trim(),
    notes: Joi.string().allow('').trim()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: error.details.map(d => d.message)
    });
  }
  
  next();
};

// Validate ObjectId
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  next();
};

module.exports = {
  validateProduct,
  validateStockMovement,
  validateStockAdjust,
  validateTransaction,
  validateObjectId
};