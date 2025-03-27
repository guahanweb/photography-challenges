import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProjects } from '../../contexts/ProjectsContext';

export function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, isLoading, error, fetchProject } = useProjects();

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
    }
  }, [projectId, fetchProject]);

  const project = projects.find(p => p.id === projectId);

  if (error) {
    return (
      <div>
        <div className="content-header">
          <h1 className="content-title">Project Details</h1>
        </div>
        <div className="alert alert-error">{error.message}</div>
      </div>
    );
  }

  if (isLoading || !project) {
    return (
      <div>
        <div className="content-header">
          <h1 className="content-title">Project Details</h1>
        </div>
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
          <div className="text-secondary">Loading project details...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="content-header">
        <h1 className="content-title">{project.title}</h1>
      </div>

      <div className="card p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-primary mb-2">Description</h2>
          <p className="text-secondary">{project.description}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-primary mb-2">Schedule</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-muted">Start Date:</span>
              <p className="text-secondary">{project.startDate}</p>
            </div>
            <div>
              <span className="text-muted">End Date:</span>
              <p className="text-secondary">{project.endDate}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-primary mb-2">Status</h2>
          <span
            className={`badge ${
              project.status === 'active'
                ? 'badge-primary'
                : project.status === 'upcoming'
                  ? 'badge-secondary'
                  : 'badge-muted'
            }`}
          >
            {project.status}
          </span>
        </div>

        {project.submissions && project.submissions.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-primary mb-2">Submissions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.submissions.map(submission => (
                <div key={submission.id} className="card p-4">
                  <img
                    src={submission.imageUrl}
                    alt={submission.description || 'Submission'}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  {submission.description && (
                    <p className="text-secondary">{submission.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
