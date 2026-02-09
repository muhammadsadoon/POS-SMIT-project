import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project, ProjectMember, UserRole } from '@/types';

const COLLECTION_NAME = 'projects';

// Convert Firestore timestamp to Date
const convertTimestamp = (data: any) => {
  if (data?.createdAt && data.createdAt.toDate) {
    data.createdAt = data.createdAt.toDate();
  }
  if (data?.updatedAt && data.updatedAt.toDate) {
    data.updatedAt = data.updatedAt.toDate();
  }
  return data;
};

// Create a new project
export const createProject = async (
  name: string,
  ownerId: string
): Promise<string> => {
  try {
    const projectData = {
      name,
      ownerId,
      members: [{ uid: ownerId, role: 'admin' as UserRole }],
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), projectData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

// Get a project by ID
export const getProject = async (projectId: string): Promise<Project | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, projectId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...convertTimestamp(docSnap.data()),
    } as Project;
  } catch (error) {
    console.error('Error getting project:', error);
    throw error;
  }
};

// Get all projects for a user (owner or member)
export const getUserProjects = async (userId: string): Promise<Project[]> => {
  try {
    // Get all projects and filter client-side since Firestore doesn't support
    // complex array queries efficiently
    const allProjectsSnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const projects: Project[] = [];

    allProjectsSnapshot.forEach((doc) => {
      const data = doc.data();
      // Check if user is owner or member
      const isOwner = data.ownerId === userId;
      const isMember = data.members?.some((m: ProjectMember) => m.uid === userId);

      if (isOwner || isMember) {
        projects.push({
          id: doc.id,
          ...convertTimestamp(data),
        } as Project);
      }
    });

    return projects;
  } catch (error) {
    console.error('Error getting user projects:', error);
    throw error;
  }
};

// Update a project
export const updateProject = async (
  projectId: string,
  updates: Partial<Project>
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, projectId);
    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now(),
    };
    
    // Don't update id
    delete updateData.id;
    
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

// Add a member to a project
export const addProjectMember = async (
  projectId: string,
  member: ProjectMember
): Promise<void> => {
  try {
    const project = await getProject(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    // Check if member already exists
    const memberExists = project.members.some((m) => m.uid === member.uid);
    if (memberExists) {
      throw new Error('Member already exists in project');
    }

    await updateProject(projectId, {
      members: [...project.members, member],
    });
  } catch (error) {
    console.error('Error adding project member:', error);
    throw error;
  }
};

// Update member role
export const updateMemberRole = async (
  projectId: string,
  memberUid: string,
  role: UserRole
): Promise<void> => {
  try {
    const project = await getProject(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const updatedMembers = project.members.map((m) =>
      m.uid === memberUid ? { ...m, role } : m
    );

    await updateProject(projectId, { members: updatedMembers });
  } catch (error) {
    console.error('Error updating member role:', error);
    throw error;
  }
};

// Remove a member from a project
export const removeProjectMember = async (
  projectId: string,
  memberUid: string
): Promise<void> => {
  try {
    const project = await getProject(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const updatedMembers = project.members.filter((m) => m.uid !== memberUid);
    await updateProject(projectId, { members: updatedMembers });
  } catch (error) {
    console.error('Error removing project member:', error);
    throw error;
  }
};

// Delete a project
export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, projectId));
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};
