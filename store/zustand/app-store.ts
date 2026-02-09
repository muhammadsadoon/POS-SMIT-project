"use client";

import { create } from 'zustand';
import { Project, AppState } from '@/types';
import { getUserProjects } from '@/lib/firestore/projects';

interface AppStore extends AppState {
  setCurrentProject: (project: Project | null) => void;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  removeProject: (projectId: string) => void;
  setLoading: (loading: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setDefaultProjectForStaff: (userId: string) => Promise<void>;
}

export const useAppStore = create<AppStore>((set) => ({
  currentProject: null,
  projects: [],
  isLoading: false,
  sidebarCollapsed: false,

  setCurrentProject: (project) => set({ currentProject: project }),

  setProjects: (projects) => set({ projects }),

  addProject: (project) => set((state) => ({ 
    projects: [...state.projects, project] 
  })),

  updateProject: (projectId, updates) => set((state) => ({
    projects: state.projects.map((p) =>
      p.id === projectId ? { ...p, ...updates } : p
    ),
    currentProject: state.currentProject?.id === projectId
      ? { ...state.currentProject, ...updates }
      : state.currentProject,
  })),

  removeProject: (projectId) => set((state) => ({
    projects: state.projects.filter((p) => p.id !== projectId),
    currentProject: state.currentProject?.id === projectId
      ? null
      : state.currentProject,
  })),

  setLoading: (isLoading) => set({ isLoading }),

  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),

  setDefaultProjectForStaff: async (userId: string) => {
    try {
      const projects = await getUserProjects(userId);
      if (projects.length > 0) {
        set({ currentProject: projects[0] });
      }
    } catch (error) {
      console.error('Error setting default project for staff:', error);
    }
  },
}));
