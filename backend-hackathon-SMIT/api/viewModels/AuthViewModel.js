const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = class AuthViewModel {
  // Register new user
  static async register(userData) {
    try {
      // Check if user exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('Email already registered');
      }

      const user = new User(userData);
      await user.save();

      // Generate token
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          token
        }
      };
    } catch (error) {
      throw new Error(`Registration Error: ${error.message}`);
    }
  }

  // Login user
  static async login(email, password) {
    try {
      const user = await User.findOne({ email, isActive: true });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate token
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          token
        }
      };
    } catch (error) {
      throw new Error(`Login Error: ${error.message}`);
    }
  }
}