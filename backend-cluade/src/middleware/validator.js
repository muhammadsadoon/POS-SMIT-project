const Joi = require('joi');
const mongoose = require('mongoose');

// Validate Product
const validateProduct = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().trim(),
    sku: Joi.string().required().trim(),
    description: Joi.string().allow('').trim(),
    price: Joi.number().required().min(0),
    costPrice: Joi.number().required().min(0),
    category: Joi.string().required(),
    quantity: Joi.number().min(0).default(0),
    minStockLevel: Joi.number().min(0).default(10),
    imageUrl: Joi.string().uri().allow(null, ''),
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
  validateObjectId
};