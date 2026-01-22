import Project from "../models/Project.js";

export const createProjectVM = async ({ name, userId }) => {
  try {
    const sameProjectIsExisted = await Project.findOne({ name });
    const sameOwnerIsExisted = await Project.findOne({ name, owner: userId });
    if (sameOwnerIsExisted && sameProjectIsExisted) throw { status: false, message: "Project with same name already exists for this owner" };
    return await Project.create({
      name,
      owner: userId,
      members: [userId]
    });
  } catch (e) {
    return new Error({ message: e.message });
  }
};

export const addMemberVM = async ({ projectId, userId }) => {
  const project = await Project.findById(projectId);
  project.members.push(userId);
  await project.save();
  return project;
};
