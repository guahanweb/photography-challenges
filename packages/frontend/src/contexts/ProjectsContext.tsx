import React, { createContext, useContext, useState, useCallback } from 'react';
import { Project } from '../types/projects';
import { projects } from '../api/client';

interface ProjectsContextType {
  // State
  projects: Project[];
  isLoading: boolean;
  error: Error | null;
  selectedProject: Project | null;

  // Actions
  fetchProjects: () => Promise<void>;
  fetchProject: (projectId: string, version: number) => Promise<void>;
  createProject: (
    project: Omit<Project, 'projectId' | 'version' | 'createdAt' | 'updatedAt'>
  ) => Promise<Project>;
  updateProject: (
    projectId: string,
    version: number,
    project: Partial<Project>
  ) => Promise<Project>;
  deleteProject: (projectId: string, version: number) => Promise<void>;
  selectProject: (project: Project | null) => void;
  clearError: () => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projectsList, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await projects.listProjects();
      if (!response.success) {
        throw new Error(response.data.error);
      }
      setProjects(response.data.items);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch projects'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProject = useCallback(async (projectId: string, version: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const project = await projects.getProject(projectId, version);
      setProjects(prev => {
        const index = prev.findIndex(p => p.projectId === projectId);
        if (index === -1) return [...prev, project];
        const newProjects = [...prev];
        newProjects[index] = project;
        return newProjects;
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch project'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProject = useCallback(
    async (project: Omit<Project, 'projectId' | 'version' | 'createdAt' | 'updatedAt'>) => {
      setIsLoading(true);
      setError(null);
      try {
        const newProject = await projects.createProject(project);
        setProjects(prev => [...prev, newProject]);
        return newProject;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to create project'));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateProject = useCallback(
    async (projectId: string, version: number, project: Partial<Project>) => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedProject = await projects.updateProject(projectId, version, project);
        setProjects(prev => prev.map(p => (p.projectId === projectId ? updatedProject : p)));
        if (selectedProject?.projectId === projectId) {
          setSelectedProject(updatedProject);
        }
        return updatedProject;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to update project'));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [selectedProject]
  );

  const deleteProject = useCallback(
    async (projectId: string, version: number) => {
      setIsLoading(true);
      setError(null);
      try {
        await projects.deleteProject(projectId, version);
        setProjects(prev => prev.filter(p => p.projectId !== projectId));
        if (selectedProject?.projectId === projectId) {
          setSelectedProject(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to delete project'));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [selectedProject]
  );

  const selectProject = useCallback((project: Project | null) => {
    setSelectedProject(project);
  }, []);

  return (
    <ProjectsContext.Provider
      value={{
        projects: projectsList,
        isLoading,
        error,
        selectedProject,
        fetchProjects,
        fetchProject,
        createProject,
        updateProject,
        deleteProject,
        selectProject,
        clearError,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
}
