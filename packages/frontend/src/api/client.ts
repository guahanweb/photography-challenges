import axios, { InternalAxiosRequestConfig } from 'axios';
import { UserRole } from '../types/auth';
import {
  Project,
  ProjectListResponse,
  ProjectResponse,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectInstance,
  ProjectSubmission,
  ProjectMessage,
} from '../types/projects';

const client = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  console.log('[Auth Client] Request interceptor:', {
    url: config.url,
    hasToken: !!token,
    headers: config.headers,
  });

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
    console.log('[Auth Client] Added token to request:', {
      url: config.url,
      hasAuthHeader: !!config.headers.Authorization,
    });
  }
  return config;
});

// Handle 401 responses
client.interceptors.response.use(
  response => {
    console.log('[Auth Client] Response success:', {
      url: response.config.url,
      status: response.status,
      hasAuthHeader: !!response.config.headers.Authorization,
    });
    return response;
  },
  error => {
    console.log('[Auth Client] Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      hasAuthHeader: !!error.config?.headers.Authorization,
    });

    if (error.response?.status === 401) {
      console.log('[Auth Client] Unauthorized response, clearing token');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface LoginResponse {
  token: string;
}

export interface UserData {
  email: string;
  roles: UserRole[];
  createdAt: string;
}

export const auth = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    console.log('[Auth Client] Attempting login');
    const response = await client.post<LoginResponse>('/auth/login', { email, password });
    console.log('[Auth Client] Login successful, storing token');
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  register: async (email: string, password: string): Promise<LoginResponse> => {
    console.log('[Auth Client] Attempting registration');
    const response = await client.post<LoginResponse>('/auth/register', { email, password });
    console.log('[Auth Client] Registration successful, storing token');
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  validateToken: async (): Promise<UserData> => {
    console.log('[Auth Client] Validating token');
    const token = localStorage.getItem('token');
    console.log('[Auth Client] Token exists:', !!token);

    const response = await client.get<UserData>('/auth/validate');
    console.log('[Auth Client] Token validation response:', {
      email: response.data.email,
      roles: response.data.roles,
    });
    return response.data;
  },

  logout: () => {
    console.log('[Auth Client] Logging out, clearing token');
    localStorage.removeItem('token');
    window.location.href = '/login';
  },
};

export const projects = {
  listProjects: async (
    limit: number = 100,
    lastEvaluatedKey?: Record<string, unknown>
  ): Promise<ProjectListResponse> => {
    console.log('[Projects Client] Fetching projects list');
    const { data } = await client.get<ProjectListResponse>('/projects', {
      params: { limit, lastEvaluatedKey },
    });
    return data;
  },

  getProject: async (projectId: string, version: number): Promise<Project> => {
    console.log('[Projects Client] Fetching project:', { projectId, version });
    const { data } = await client.get<ProjectResponse>(`/projects/${projectId}`, {
      params: { version },
    });
    console.log('[Projects Client] Fetched project:', {
      projectId: data.data.item.projectId,
      title: data.data.item.title,
    });
    return data.data.item;
  },

  createProject: async (data: CreateProjectRequest): Promise<Project> => {
    console.log('[Projects Client] Creating project:', { title: data.title });
    const response = await client.post<ProjectResponse>('/projects', data);
    console.log('[Projects Client] Created project:', {
      projectId: response.data.data.item.projectId,
      title: response.data.data.item.title,
    });
    return response.data.data.item;
  },

  updateProject: async (
    projectId: string,
    version: number,
    data: UpdateProjectRequest
  ): Promise<Project> => {
    console.log('[Projects Client] Updating project:', { projectId, version, title: data.title });
    const response = await client.put<ProjectResponse>(`/projects/${projectId}`, data, {
      params: { version },
    });
    console.log('[Projects Client] Updated project:', {
      projectId: response.data.data.item.projectId,
      title: response.data.data.item.title,
    });
    return response.data.data.item;
  },

  deleteProject: async (projectId: string, version: number): Promise<void> => {
    console.log('[Projects Client] Deleting project:', { projectId, version });
    await client.delete(`/projects/${projectId}`, {
      params: { version },
    });
    console.log('[Projects Client] Deleted project:', { projectId });
  },
};

export const challenges = {
  listMyInstances: async (): Promise<ProjectInstance[]> => {
    console.log('[Challenges Client] Fetching user instances');
    const response = await client.get<{ instances: ProjectInstance[] }>('/challenges/my');
    return response.data.instances;
  },

  listMentoringInstances: async (): Promise<ProjectInstance[]> => {
    console.log('[Challenges Client] Fetching mentoring instances');
    const response = await client.get<{ instances: ProjectInstance[] }>('/challenges/mentoring');
    return response.data.instances;
  },

  getInstance: async (instanceId: string): Promise<ProjectInstance> => {
    console.log('[Challenges Client] Fetching instance:', { instanceId });
    const response = await client.get<{ instance: ProjectInstance }>(`/challenges/${instanceId}`);
    return response.data.instance;
  },

  createInstance: async (projectId: string, assignedTo: string): Promise<ProjectInstance> => {
    console.log('[Challenges Client] Creating instance:', { projectId, assignedTo });
    const response = await client.post<{ instance: ProjectInstance }>('/challenges', {
      projectId,
      assignedTo,
    });
    return response.data.instance;
  },

  updateInstance: async (
    instanceId: string,
    data: Partial<ProjectInstance>
  ): Promise<ProjectInstance> => {
    console.log('[Challenges Client] Updating instance:', { instanceId });
    const response = await client.put<{ instance: ProjectInstance }>(
      `/challenges/${instanceId}`,
      data
    );
    return response.data.instance;
  },

  deleteInstance: async (instanceId: string): Promise<void> => {
    console.log('[Challenges Client] Deleting instance:', { instanceId });
    await client.delete(`/challenges/${instanceId}`);
  },

  addSubmission: async (
    instanceId: string,
    data: Omit<ProjectSubmission, 'instanceId'>
  ): Promise<ProjectSubmission> => {
    console.log('[Challenges Client] Adding submission:', { instanceId });
    const response = await client.post<{ submission: ProjectSubmission }>(
      `/challenges/${instanceId}/submissions`,
      data
    );
    return response.data.submission;
  },

  getSubmissions: async (instanceId: string): Promise<ProjectSubmission[]> => {
    console.log('[Challenges Client] Fetching submissions:', { instanceId });
    const response = await client.get<{ submissions: ProjectSubmission[] }>(
      `/challenges/${instanceId}/submissions`
    );
    return response.data.submissions;
  },

  addMessage: async (instanceId: string, text: string): Promise<ProjectMessage> => {
    console.log('[Challenges Client] Adding message:', { instanceId });
    const response = await client.post<{ message: ProjectMessage }>(
      `/challenges/${instanceId}/messages`,
      { text }
    );
    return response.data.message;
  },

  getMessages: async (instanceId: string): Promise<ProjectMessage[]> => {
    console.log('[Challenges Client] Fetching messages:', { instanceId });
    const response = await client.get<{ messages: ProjectMessage[] }>(
      `/challenges/${instanceId}/messages`
    );
    return response.data.messages;
  },
};
