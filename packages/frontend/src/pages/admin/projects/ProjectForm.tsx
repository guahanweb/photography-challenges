import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjects } from '../../../contexts/ProjectsContext';
import { Project, ProjectCategory, DifficultyLevel, Tip } from '../../../types/projects';
import { FiArrowLeft, FiPlus, FiTrash2 } from 'react-icons/fi';
import { ArrayField } from '../../../components/forms/ArrayField';
import { ToggleSwitch } from '../../../components/forms/ToggleSwitch';
import { useDebugForm } from '../../../contexts/DebugContext';

const PROJECT_CATEGORIES: ProjectCategory[] = [
  'SELF_PORTRAIT',
  'LANDSCAPE',
  'STREET',
  'MACRO',
  'PORTRAIT',
  'STILL_LIFE',
  'ARCHITECTURE',
  'WILDLIFE',
  'SPORTS',
  'NIGHT',
];

const DIFFICULTY_LEVELS: DifficultyLevel[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

export function ProjectForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { projects, createProject, updateProject, fetchProject } = useProjects();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    shortDescription: '',
    fullDescription: '',
    projectCategory: 'SELF_PORTRAIT',
    difficultyLevel: 'BEGINNER',
    duration: {
      days: 7,
      startDate: null,
      endDate: null,
    },
    mission: {
      text: '',
      dailyRequirements: [],
    },
    rules: [],
    tips: [],
    reminders: [],
    sharingInstructions: [],
    feedback: {
      policy: '',
    },
    technicalFocus: [],
    equipment: {
      required: [],
      optional: [],
    },
    progressTracking: {
      milestones: [],
    },
    followUpQuestions: [],
    relatedProjects: [],
    isActive: false,
    isPublished: false,
  });

  // Memoize the debug form callbacks
  const getFormState = useCallback(() => formData, [formData]);
  const setFormState = useCallback((state: Partial<Project>) => setFormData(state), []);

  // Register form with debug system using memoized callbacks
  useDebugForm({
    id: 'project-form',
    getState: getFormState,
    setState: setFormState,
  });

  useEffect(() => {
    if (id) {
      const project = projects.find(p => p.projectId === id);
      if (project) {
        setFormData(project);
      } else {
        fetchProject(id, 1);
      }
    }
  }, [id, projects, fetchProject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (id) {
        const currentProject = projects.find(p => p.projectId === id);
        if (!currentProject) {
          throw new Error('Project not found');
        }
        // Filter out reserved fields for update
        const { projectId, version, createdAt, updatedAt, ...updateData } = formData;
        console.log('[ProjectForm] Updating project:', {
          id,
          version: currentProject.version,
          updateData,
        });
        await updateProject(id, currentProject.version, updateData);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { projectId, version, createdAt, updatedAt, ...newProject } = formData;
        await createProject(newProject as any);
      }
      navigate('/admin/projects');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save project'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Handle nested paths like "mission.text"
    const path = name.split('.');
    if (path.length === 1) {
      // Handle non-nested fields normally
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      // Handle nested fields
      setFormData(prev => {
        const result = { ...prev };
        let current: any = result;

        // Traverse the path until the last element
        for (let i = 0; i < path.length - 1; i++) {
          current[path[i]] = { ...current[path[i]] };
          current = current[path[i]];
        }

        // Set the final value
        current[path[path.length - 1]] = value;
        return result;
      });
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button
          onClick={() => navigate('/admin/projects')}
          className="flex items-center gap-2 text-secondary hover:text-primary"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </button>
        <h1 className="heading-lg">{id ? 'Edit Project' : 'New Project'}</h1>
      </div>

      {error && <div className="alert alert-error">{error.message}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <section className="card p-6">
          <div className="card-header mb-4">
            <h2 className="heading-md font-semibold">Basic Information</h2>
          </div>
          <div className="card-body space-y-4">
            <div className="form-group">
              <label htmlFor="title" className="text-base font-normal">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="shortDescription" className="text-base font-normal">
                Short Description
              </label>
              <textarea
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription || ''}
                onChange={handleChange}
                className="input"
                rows={2}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="fullDescription" className="text-base font-normal">
                Full Description
              </label>
              <textarea
                id="fullDescription"
                name="fullDescription"
                value={formData.fullDescription || ''}
                onChange={handleChange}
                className="input"
                rows={4}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="projectCategory" className="text-base font-normal">
                Category
              </label>
              <select
                id="projectCategory"
                name="projectCategory"
                value={formData.projectCategory || 'LANDSCAPE'}
                onChange={handleChange}
                className="input"
                required
              >
                {PROJECT_CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="difficultyLevel" className="text-base font-normal">
                Difficulty Level
              </label>
              <select
                id="difficultyLevel"
                name="difficultyLevel"
                value={formData.difficultyLevel || 'BEGINNER'}
                onChange={handleChange}
                className="input"
                required
              >
                {DIFFICULTY_LEVELS.map(level => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Duration and Schedule */}
        <section className="card p-6">
          <div className="card-header mb-4">
            <h2 className="heading-md font-semibold">Duration and Schedule</h2>
          </div>
          <div className="card-body space-y-4">
            <div className="form-group">
              <label htmlFor="duration.days" className="text-base font-normal">
                Duration (Days)
              </label>
              <input
                type="number"
                id="duration.days"
                name="duration.days"
                value={formData.duration?.days || 7}
                onChange={handleChange}
                className="input"
                min={1}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="duration.startDate" className="text-base font-normal">
                Start Date
              </label>
              <input
                type="date"
                id="duration.startDate"
                name="duration.startDate"
                value={formData.duration?.startDate || ''}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="duration.endDate" className="text-base font-normal">
                End Date
              </label>
              <input
                type="date"
                id="duration.endDate"
                name="duration.endDate"
                value={formData.duration?.endDate || ''}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>
        </section>

        {/* Mission and Rules */}
        <section className="card p-6">
          <div className="card-header mb-4">
            <h2 className="heading-md font-semibold">Mission and Rules</h2>
          </div>
          <div className="card-body space-y-4">
            <div className="form-group">
              <label htmlFor="mission.text" className="text-base font-normal">
                Mission
              </label>
              <textarea
                id="mission.text"
                name="mission.text"
                value={formData.mission?.text || ''}
                onChange={handleChange}
                className="input"
                rows={4}
              />
            </div>

            <ArrayField
              label="Daily Requirements"
              items={formData.mission?.dailyRequirements || []}
              onChange={items =>
                setFormData((prev: Record<string, any>) => ({
                  ...prev,
                  mission: {
                    ...prev.mission,
                    dailyRequirements: items,
                  },
                }))
              }
              addLabel="Add Daily Requirement"
              emptyMessage="No daily requirements added"
            />

            <ArrayField
              label="Rules"
              items={formData.rules || []}
              onChange={items =>
                setFormData((prev: Record<string, any>) => ({
                  ...prev,
                  rules: items,
                }))
              }
              addLabel="Add Rule"
              emptyMessage="No rules added"
            />
          </div>
        </section>

        {/* Equipment */}
        <section className="card p-6">
          <div className="card-header mb-4">
            <h2 className="heading-md font-semibold">Equipment</h2>
          </div>
          <div className="card-body space-y-4">
            <ArrayField
              label="Required Equipment"
              items={formData.equipment?.required || []}
              onChange={items =>
                setFormData((prev: Record<string, any>) => ({
                  ...prev,
                  equipment: {
                    ...prev.equipment,
                    required: items,
                  },
                }))
              }
              addLabel="Add Required Equipment"
              emptyMessage="No required equipment added"
            />

            <ArrayField
              label="Optional Equipment"
              items={formData.equipment?.optional || []}
              onChange={items =>
                setFormData((prev: Record<string, any>) => ({
                  ...prev,
                  equipment: {
                    ...prev.equipment,
                    optional: items,
                  },
                }))
              }
              addLabel="Add Optional Equipment"
              emptyMessage="No optional equipment added"
            />
          </div>
        </section>

        {/* Tips and Reminders */}
        <section className="card p-6">
          <div className="card-header mb-4">
            <h2 className="heading-md font-semibold">Tips and Reminders</h2>
          </div>
          <div className="card-body space-y-4">
            <div className="form-group">
              <label className="text-base font-normal">Tips</label>
              {formData.tips?.map((tip, index) => (
                <div key={index} className="compound-input-container">
                  <input
                    type="text"
                    value={tip.title || ''}
                    onChange={e => {
                      const newTips = [...(formData.tips || [])];
                      newTips[index] = { ...newTips[index], title: e.target.value };
                      setFormData(prev => ({ ...prev, tips: newTips }));
                    }}
                    className="input"
                    placeholder="Tip Title"
                  />
                  <textarea
                    value={tip.description || ''}
                    onChange={e => {
                      const newTips = [...(formData.tips || [])];
                      newTips[index] = { ...newTips[index], description: e.target.value };
                      setFormData(prev => ({ ...prev, tips: newTips }));
                    }}
                    className="input"
                    rows={2}
                    placeholder="Tip Description"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newTips = formData.tips?.filter((_, i) => i !== index) || [];
                      setFormData(prev => ({ ...prev, tips: newTips }));
                    }}
                    className="btn-caution btn-action"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newTips = [...(formData.tips || []), { title: '', description: '' }];
                  setFormData(prev => ({ ...prev, tips: newTips }));
                }}
                className="btn-primary btn-action mt-4"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add Tip</span>
              </button>
            </div>

            <ArrayField
              label="Reminders"
              items={formData.reminders || []}
              onChange={items =>
                setFormData(prev => ({
                  ...prev,
                  reminders: items,
                }))
              }
              addLabel="Add Reminder"
              emptyMessage="No reminders added"
            />
          </div>
        </section>

        {/* Sharing and Feedback */}
        <section className="card p-6">
          <div className="card-header mb-4">
            <h2 className="heading-md font-semibold">Sharing and Feedback</h2>
          </div>
          <div className="card-body space-y-4">
            <ArrayField
              label="Sharing Instructions"
              items={formData.sharingInstructions || []}
              onChange={items =>
                setFormData(prev => ({
                  ...prev,
                  sharingInstructions: items,
                }))
              }
              addLabel="Add Sharing Instruction"
              emptyMessage="No sharing instructions added"
            />

            <div className="form-group">
              <label htmlFor="feedback.policy" className="text-base font-normal">
                Feedback Policy
              </label>
              <textarea
                id="feedback.policy"
                name="feedback.policy"
                value={formData.feedback?.policy || ''}
                onChange={handleChange}
                className="input"
                rows={3}
              />
            </div>
          </div>
        </section>

        {/* Technical Details */}
        <section className="card p-6">
          <div className="card-header mb-4">
            <h2 className="heading-md font-semibold">Technical Details</h2>
          </div>
          <div className="card-body space-y-4">
            <ArrayField
              label="Technical Focus Areas"
              items={formData.technicalFocus || []}
              onChange={items =>
                setFormData(prev => ({
                  ...prev,
                  technicalFocus: items,
                }))
              }
              addLabel="Add Technical Focus Area"
              emptyMessage="No technical focus areas added"
            />
          </div>
        </section>

        {/* Progress Tracking */}
        <section className="card p-6">
          <div className="card-header mb-4">
            <h2 className="heading-md font-semibold">Progress Tracking</h2>
          </div>
          <div className="card-body space-y-4">
            <div className="form-group">
              <label className="text-base font-normal">Milestones</label>
              {formData.progressTracking?.milestones?.map((milestone, index) => (
                <div key={index} className="compound-input-container">
                  <input
                    type="number"
                    value={milestone.day}
                    onChange={e => {
                      const newMilestones = [...(formData.progressTracking?.milestones || [])];
                      newMilestones[index] = {
                        ...newMilestones[index],
                        day: parseInt(e.target.value),
                      };
                      setFormData(prev => ({
                        ...prev,
                        progressTracking: { ...prev.progressTracking, milestones: newMilestones },
                      }));
                    }}
                    className="input"
                    placeholder="Day Number"
                    min={1}
                  />
                  <input
                    type="text"
                    value={milestone.title}
                    onChange={e => {
                      const newMilestones = [...(formData.progressTracking?.milestones || [])];
                      newMilestones[index] = { ...newMilestones[index], title: e.target.value };
                      setFormData(prev => ({
                        ...prev,
                        progressTracking: { ...prev.progressTracking, milestones: newMilestones },
                      }));
                    }}
                    className="input"
                    placeholder="Milestone Title"
                  />
                  <textarea
                    value={milestone.message}
                    onChange={e => {
                      const newMilestones = [...(formData.progressTracking?.milestones || [])];
                      newMilestones[index] = { ...newMilestones[index], message: e.target.value };
                      setFormData(prev => ({
                        ...prev,
                        progressTracking: { ...prev.progressTracking, milestones: newMilestones },
                      }));
                    }}
                    className="input"
                    rows={2}
                    placeholder="Milestone Message"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newMilestones =
                        formData.progressTracking?.milestones?.filter((_, i) => i !== index) || [];
                      setFormData(prev => ({
                        ...prev,
                        progressTracking: { ...prev.progressTracking, milestones: newMilestones },
                      }));
                    }}
                    className="btn-caution btn-action"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newMilestones = [
                    ...(formData.progressTracking?.milestones || []),
                    { day: 1, title: '', message: '' },
                  ];
                  setFormData(prev => ({
                    ...prev,
                    progressTracking: { ...prev.progressTracking, milestones: newMilestones },
                  }));
                }}
                className="btn-primary btn-action mt-4"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add Milestone</span>
              </button>
            </div>
          </div>
        </section>

        {/* Follow-up Questions */}
        <section className="card p-6">
          <div className="card-header mb-4">
            <h2 className="heading-md font-semibold">Follow-up Questions</h2>
          </div>
          <div className="card-body space-y-4">
            <ArrayField
              label="Follow-up Questions"
              items={formData.followUpQuestions || []}
              onChange={items =>
                setFormData(prev => ({
                  ...prev,
                  followUpQuestions: items,
                }))
              }
              addLabel="Add Follow-up Question"
              emptyMessage="No follow-up questions added"
            />
          </div>
        </section>

        {/* Project Status */}
        <section className="card p-6">
          <div className="card-header mb-4">
            <h2 className="heading-md font-semibold">Project Status</h2>
          </div>
          <div className="card-body space-y-4">
            <div className="form-group">
              <div className="space-y-4 max-w-xs">
                <div className="flex items-center gap-3">
                  <ToggleSwitch
                    checked={!!formData.isActive}
                    onChange={checked => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                  <span className="text-base">Active</span>
                </div>
                <div className="flex items-center gap-3">
                  <ToggleSwitch
                    checked={formData.isPublished || false}
                    onChange={checked => setFormData(prev => ({ ...prev, isPublished: checked }))}
                  />
                  <span className="text-base">Published</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/projects')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </form>
    </div>
  );
}
