import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { useProjects } from '../../contexts/ProjectsContext';
import type { Project } from '../../types/projects';

export function ProjectLoader({
  children,
  isLoading,
}: {
  children: React.ReactNode;
  isLoading: boolean;
}) {
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="text-secondary">Loading projects...</div>
      </div>
    );

  return <>{children}</>;
}

export function ProjectCardGrid({ projects }: { projects: Project[] }) {
  console.log('[Projects] ProjectCardGrid:', { projects });
  return projects.length === 0 ? (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] gap-6">
      <div className="text-xl text-secondary">No projects yet created</div>
      <Link to="/admin/projects/new" className="btn-primary">
        <FiPlus className="w-5 h-5 mr-2" />
        New Project
      </Link>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project: Project) => (
        <div key={project.projectId} className="card p-6">
          <h3 className="text-lg font-semibold text-primary mb-2">{project.title}</h3>
          <p className="text-secondary mb-4">{project.shortDescription}</p>
          <div className="flex items-center justify-between text-sm text-muted">
            <span>{project.duration.startDate}</span>
            <span>{project.duration.endDate}</span>
            <span
              className={`badge ${
                project.isActive
                  ? 'badge-primary'
                  : project.isPublished
                    ? 'badge-secondary'
                    : 'badge-muted'
              }`}
            >
              {project.isActive ? 'Active' : project.isPublished ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Projects() {
  const { projects, isLoading, error, fetchProjects } = useProjects();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  if (error) {
    return (
      <div>
        <div className="content-header">
          <h1 className="content-title">Projects</h1>
        </div>
        <div className="alert alert-error">{error.message}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="content-header">
        <h1 className="content-title">Projects</h1>
      </div>
      <ProjectLoader isLoading={isLoading}>
        <ProjectCardGrid projects={projects} />
      </ProjectLoader>
    </div>
  );
}
