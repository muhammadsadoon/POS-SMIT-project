const express = require('express');
const ProjectViewModel = require('../viewModels/ProjectViewModel');
const { authMiddleware } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validator');

const projectRouter = express.Router();

// @route   GET /api/projects
// @desc    Get all projects for authenticated user
// @access  Private
projectRouter.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const result = await ProjectViewModel.getUserProjects(
      req.user._id,
      parseInt(page),
      parseInt(limit)
    );
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private
projectRouter.post('/', authMiddleware, async (req, res, next) => {
  try {
    const result = await ProjectViewModel.createProject(req.body, req.user._id);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Private
projectRouter.get('/:id', authMiddleware, validateObjectId, async (req, res, next) => {
  try {
    const result = await ProjectViewModel.getProjectById(req.params.id);
    
    // Check if user is owner or member
    if (result.data.owner._id.toString() !== req.user._id.toString() && 
        !result.data.members.some(m => m.user._id.toString() === req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Owner only)
projectRouter.put('/:id', authMiddleware, validateObjectId, async (req, res, next) => {
  try {
    const result = await ProjectViewModel.updateProject(req.params.id, req.body, req.user._id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project (soft delete)
// @access  Private (Owner only)
projectRouter.delete('/:id', authMiddleware, validateObjectId, async (req, res, next) => {
  try {
    const result = await ProjectViewModel.deleteProject(req.params.id, req.user._id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/projects/:id/members
// @desc    Add team member to project
// @access  Private (Owner only)
projectRouter.post('/:id/members', authMiddleware, validateObjectId, async (req, res, next) => {
  try {
    const { email, role } = req.body;
    
    const result = await ProjectViewModel.addMember(
      req.params.id,
      req.user._id,
      email,
      role,
      req.user._id
    );
    
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/projects/:id/members/:memberId
// @desc    Remove team member from project
// @access  Private (Owner only)
projectRouter.delete('/:id/members/:memberId', authMiddleware, validateObjectId, async (req, res, next) => {
  try {
    const result = await ProjectViewModel.removeMember(req.params.id, req.params.memberId, req.user._id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = projectRouter;
