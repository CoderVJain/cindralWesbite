export enum DivisionType {
  LABS = 'Labs',
  STUDIOS = 'Studios',
  IMMERSIVE = 'Immersive',
  ENTERTAINMENT = 'Entertainment'
}

export interface Division {
  id: string;
  type: DivisionType;
  title: string;
  tagline: string;
  description: string;
  iconName: string; // Used to map to Lucide icons
  color: string; // Tailwind text color class
  themeColor: string; // Hex code for gradients
  bannerImage?: string; // URL for the hero background
}

export interface Project {
  id: string;
  divisionId: string;
  title: string;
  client?: string;
  summary: string;
  content: string; // HTML or Markdown supported content
  images: string[];
  year: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedIn?: string;
  projectIds: string[]; // IDs of projects they contributed to
  csrActivities: string[]; // Descriptions of CSR work
  skills: string[];
  interests: string[];
  quote?: string;
  learningStats?: {
    currentStreak: number; // Days
    totalHours: number; // Total hours logged
    lastTopic: string;
  };
  fitnessStats?: {
    activityType: string;
    weeklyMinutes: number;
    personalBest: string;
  };
}

export interface CSRStat {
  name: string;
  value: number;
  unit: string;
}

export interface Partner {
  name: string;
  type: 'NGO' | 'Corporate' | 'Educational';
  logo: string;
}

export type ContactSubmissionStatus = 'new' | 'in_progress' | 'responded';

export interface ContactSubmission {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: ContactSubmissionStatus;
}

export type ClientTaskStatus = 'todo' | 'in_progress' | 'done' | 'cancelled';
export type ProjectHealth = 'green' | 'amber' | 'red';

export interface ClientProjectTimelineItem {
  id: string;
  label: string;
  date: string;
  status: 'complete' | 'active' | 'upcoming';
  description?: string;
}

export interface ClientProjectTask {
  id: string;
  title: string;
  status: ClientTaskStatus;
  owner?: string;
  dueDate?: string;
  highlight?: string;
  notes?: string;
}

export interface ClientResourceLink {
  id: string;
  label: string;
  url: string;
  type: 'doc' | 'design' | 'repo' | 'prototype' | 'analytics' | 'ticket' | 'storage';
  description?: string;
}

export interface ClientUpdate {
  id: string;
  title: string;
  date: string;
  author: string;
  summary: string;
  type?: 'win' | 'risk' | 'note' | 'decision';
  impact?: string;
}

export interface ClientInvoice {
  id: string;
  projectId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'due' | 'overdue';
  issuedOn: string;
  dueOn: string;
  description?: string;
  downloadUrl?: string;
}

export interface ClientProject {
  id: string;
  projectId: string;
  clientName: string;
  name: string;
  summary: string;
  status: 'On Track' | 'At Risk' | 'Behind';
  health: ProjectHealth;
  progress: number;
  budgetUsed: number;
  startDate: string;
  endDate: string;
  nextMilestone: string;
  team: string[];
  resources: ClientResourceLink[];
  tasks: ClientProjectTask[];
  timeline: ClientProjectTimelineItem[];
  updates: ClientUpdate[];
  links?: ClientResourceLink[];
}

export interface ClientUser {
  id: string;
  name: string;
  email: string;
  company?: string;
  role: 'admin' | 'member' | 'viewer';
  allowedProjectIds: string[];
}
