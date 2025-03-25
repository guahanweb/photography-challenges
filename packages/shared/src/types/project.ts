export type ProjectCategory =
  | 'SELF_PORTRAIT'
  | 'LANDSCAPE'
  | 'STREET'
  | 'MACRO'
  | 'PORTRAIT'
  | 'STILL_LIFE'
  | 'ARCHITECTURE'
  | 'WILDLIFE'
  | 'SPORTS'
  | 'NIGHT';

export type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface Duration {
  days: number;
  startDate: string | null;
  endDate: string | null;
}

export interface Mission {
  text: string;
  dailyRequirements: string[];
}

export interface Tip {
  title: string;
  description: string;
}

export interface Equipment {
  required: string[];
  optional: string[];
}

export interface ProgressTracking {
  milestones: {
    day: number;
    title: string;
    message: string;
  }[];
}

export interface Project {
  projectId: string;
  version: number;
  projectNumber: number;
  title: string;
  shortDescription: string;
  fullDescription: string;
  duration: Duration;
  mission: Mission;
  rules: string[];
  tips: Tip[];
  reminders: string[];
  sharingInstructions: string[];
  feedback: {
    policy: string;
  };
  projectCategory: ProjectCategory;
  difficultyLevel: DifficultyLevel;
  technicalFocus: string[];
  equipment: Equipment;
  progressTracking: ProgressTracking;
  followUpQuestions: string[];
  relatedProjects: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isActive: boolean;
  isPublished: boolean;
}

export interface ProjectInstance {
  instanceId: string;
  projectId: string;
  assignedTo: string;
  assignedBy: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  actualDates: {
    startDate: string;
    scheduledEndDate: string;
    actualEndDate: string | null;
    lastActivity: string;
  };
  progress: {
    daysCompleted: number;
    totalDays: number;
    completionPercentage: number;
    milestonesReached: string[];
  };
  reflections: {
    midpoint: string | null;
    final: string | null;
  };
  createdAt: string;
  updatedAt: string;
  deleted?: boolean;
}

export interface ProjectSubmission {
  instanceId: string;
  day: number;
  date: string;
  mediaUrls: string[];
  notes: string;
  feedback: {
    text: string;
    givenAt: string;
    givenBy: string;
  } | null;
}

export interface ProjectMessage {
  instanceId: string;
  messageId: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export type ProjectInstanceItem = ProjectInstance | ProjectSubmission | ProjectMessage;
