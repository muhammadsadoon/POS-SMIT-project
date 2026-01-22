const express = require('express');
const AuthViewModel = require('../viewModels/AuthViewModel');
const { authMiddleware } = require('../middleware/auth');

const authRouter = express.Router();


// Register
authRouter.post('/register', async (req, res, next) => {
  try {
    const result = await AuthViewModel.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// Login
authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await AuthViewModel.login(email, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// Get current user
authRouter.get('/me', authMiddleware, async (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

module.exports = authRouter;