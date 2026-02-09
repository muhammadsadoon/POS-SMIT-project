"use client";

import { create } from 'zustand';
import { Project, AppState } from '@/types';

interface AppStore extends AppState {
  setCurrentProject: (project: Project | null) => void;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  removeProject: (projectId: string) => void;
  setLoading: (loading: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
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
}));
