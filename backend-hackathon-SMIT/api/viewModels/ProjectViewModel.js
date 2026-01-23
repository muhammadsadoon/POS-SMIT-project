const Project = require('../models/Project');

module.exports = class ProjectViewModel {
  // Helper method to normalize roles (convert OWNER to ADMIN)
  static normalizeProjectRoles(project) {
    if (project.members && Array.isArray(project.members)) {
      project.members = project.members.map(member => {
        if (member.role === 'OWNER') {
          member.role = 'ADMIN';
        }
        return member;
      });
    }
    return project;
  }

  // Create new project
  static async createProject(projectData, userId) {
    try {
      const project = new Project({
        ...projectData,
        owner: userId,
        members: [
          {
            user: userId,
            role: 'ADMIN'
          }
        ]
      });

      await project.save();
      await project.populate('owner', 'name email');
      await project.populate('members.user', 'name email');

      return {
        success: true,
        message: 'Project created successfully',
        data: project
      };
    } catch (error) {
      throw new Error(`Create Project Error: ${error.message}`);
    }
  }

  // Get all projects for user
  static async getUserProjects(userId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const projects = await Project
        .find({
          $or: [
            { owner: userId },
            { 'members.user': userId }
          ]
        })
        .populate('owner', 'name email')
        .populate('members.user', 'name email')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      const total = await Project.countDocuments({
        $or: [
          { owner: userId },
          { 'members.user': userId }
        ]
      });

      return {
        success: true,
        data: projects,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      };
    } catch (error) {
      throw new Error(`Get Projects Error: ${error.message}`);
    }
  }

  // Get single project
  static async getProjectById(projectId) {
    try {
      const project = await Project
        .findById(projectId)
        .populate('owner', 'name email')
        .populate('members.user', 'name email');

      if (!project) {
        throw new Error('Project not found');
      }

      return {
        success: true,
        data: project
      };
    } catch (error) {
      throw new Error(`Get Project Error: ${error.message}`);
    }
  }

  // Update project
  static async updateProject(projectId, updateData, userId, userRole) {
    try {
      const project = await Project.findById(projectId);

      if (!project) {
        throw new Error('Project not found');
      }

      // Normalize roles (convert old OWNER to ADMIN)
      this.normalizeProjectRoles(project);

      // Check if user is ADMIN or MANAGER (either global role or project member role)
      const userMember = project.members.find(m => m.user.toString() === userId);
      const isAuthorized = ['ADMIN', 'MANAGER'].includes(userRole) || 
                          (userMember && ['ADMIN', 'MANAGER'].includes(userMember.role));
      
      if (!isAuthorized) {
        throw new Error('Only ADMIN or MANAGER can update project');
      }

      // Update allowed fields only
      const allowedFields = ['name', 'description', 'location', 'phone', 'email', 'currency', 'taxRate', 'settings'];
      Object.keys(updateData).forEach(key => {
        if (allowedFields.includes(key)) {
          project[key] = updateData[key];
        }
      });

      await project.save();
      await project.populate('owner', 'name email');
      await project.populate('members.user', 'name email');

      return {
        success: true,
        message: 'Project updated successfully',
        data: project
      };
    } catch (error) {
      throw new Error(`Update Project Error: ${error.message}`);
    }
  }

  // Delete project
  static async deleteProject(projectId, userId, userRole) {
    try {
      const project = await Project.findById(projectId);

      if (!project) {
        throw new Error('Project not found');
      }

      // Normalize roles (convert old OWNER to ADMIN)
      this.normalizeProjectRoles(project);

      // Check if user is ADMIN or MANAGER (either global role or project member role)
      const userMember = project.members.find(m => m.user.toString() === userId);
      const isAuthorized = ['ADMIN', 'MANAGER'].includes(userRole) || 
                          (userMember && ['ADMIN', 'MANAGER'].includes(userMember.role));
      
      if (!isAuthorized) {
        throw new Error('Only ADMIN or MANAGER can delete project');
      }

      // Soft delete
      project.isActive = false;
      await project.save();

      return {
        success: true,
        message: 'Project deleted successfully'
      };
    } catch (error) {
      throw new Error(`Delete Project Error: ${error.message}`);
    }
  }

  // Add team member
  static async addMember(projectId, userId, memberEmail, memberRole, ownerUserId, userRole) {
    try {
      const project = await Project.findById(projectId);

      if (!project) {
        throw new Error('Project not found');
      }

      // Normalize roles (convert old OWNER to ADMIN)
      this.normalizeProjectRoles(project);

      // Check if user is ADMIN or MANAGER (either global role or project member role)
      const userMember = project.members.find(m => m.user.toString() === ownerUserId);
      const isAuthorized = ['ADMIN', 'MANAGER'].includes(userRole) || 
                          (userMember && ['ADMIN', 'MANAGER'].includes(userMember.role));
      
      if (!isAuthorized) {
        throw new Error('Only ADMIN or MANAGER can add members');
      }

      const User = require('../models/User');
      const member = await User.findOne({ email: memberEmail });

      if (!member) {
        throw new Error('User not found');
      }

      // Check if member already exists
      const alreadyMember = project.members.find(m => m.user.toString() === member._id.toString());
      if (alreadyMember) {
        throw new Error('User is already a member of this project');
      }

      project.members.push({
        user: member._id,
        role: memberRole || 'STAFF'
      });

      await project.save();
      await project.populate('members.user', 'name email');

      return {
        success: true,
        message: 'Team member added successfully',
        data: project
      };
    } catch (error) {
      throw new Error(`Add Member Error: ${error.message}`);
    }
  }

  // Remove team member
  static async removeMember(projectId, memberId, ownerUserId, userRole) {
    try {
      const project = await Project.findById(projectId);

      if (!project) {
        throw new Error('Project not found');
      }

      // Normalize roles (convert old OWNER to ADMIN)
      this.normalizeProjectRoles(project);

      // Check if user is ADMIN or MANAGER (either global role or project member role)
      const userMember = project.members.find(m => m.user.toString() === ownerUserId);
      const isAuthorized = ['ADMIN', 'MANAGER'].includes(userRole) || 
                          (userMember && ['ADMIN', 'MANAGER'].includes(userMember.role));
      
      if (!isAuthorized) {
        throw new Error('Only ADMIN or MANAGER can remove members');
      }

      project.members = project.members.filter(m => m.user.toString() !== memberId);
      await project.save();
      await project.populate('members.user', 'name email');

      return {
        success: true,
        message: 'Team member removed successfully',
        data: project
      };
    } catch (error) {
      throw new Error(`Remove Member Error: ${error.message}`);
    }
  }
};
