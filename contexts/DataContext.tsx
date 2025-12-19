import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  ContactSubmission,
  ContactSubmissionStatus,
  Division,
  Project,
  TeamMember,
  ClientProject,
  ClientInvoice,
  ClientUser,
  Initiative
} from '../types';
import dbData from '../server/data/db.json';

type ContactFormInput = {
  firstName: string;
  lastName?: string;
  email: string;
  subject?: string;
  message: string;
};

interface DataContextType {
  divisions: Division[];
  projects: Project[];
  team: TeamMember[];
  clientProjects: ClientProject[];
  clientInvoices: ClientInvoice[];
  clientUsers: ClientUser[];
  initiatives: Initiative[];
  contactSubmissions: ContactSubmission[];
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  refreshData: () => Promise<void>;
  submitContactForm: (payload: ContactFormInput) => Promise<void>;
  updateDivision: (id: string, data: Partial<Division>) => Promise<void>;
  addDivision: (division: Partial<Division>) => Promise<void>;
  deleteDivision: (id: string) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  addProject: (project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addTeamMember: (member: Partial<TeamMember>) => Promise<void>;
  updateTeamMember: (id: string, data: Partial<TeamMember>) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;
  addClientProject: (data: Partial<ClientProject>) => Promise<void>;
  updateClientProject: (id: string, data: Partial<ClientProject>) => Promise<void>;
  deleteClientProject: (id: string) => Promise<void>;
  addClientInvoice: (data: Partial<ClientInvoice>) => Promise<void>;
  updateClientInvoice: (id: string, data: Partial<ClientInvoice>) => Promise<void>;
  deleteClientInvoice: (id: string) => Promise<void>;
  addClientUser: (data: Partial<ClientUser>) => Promise<void>;
  updateClientUser: (id: string, data: Partial<ClientUser>) => Promise<void>;
  deleteClientUser: (id: string) => Promise<void>;
  addInitiative: (data: Partial<Initiative>) => Promise<void>;
  updateInitiative: (id: string, data: Partial<Initiative>) => Promise<void>;
  deleteInitiative: (id: string) => Promise<void>;
  updateSubmissionStatus: (id: string, status: ContactSubmissionStatus) => Promise<void>;
  deleteContactSubmission: (id: string) => Promise<void>;
  importData: (data: any) => Promise<void>;
  resetData: () => Promise<void>;
}

const TOKEN_STORAGE_KEY = 'cindral_admin_token';

// Helper to generate IDs roughly like nanoid
const generateId = () => Math.random().toString(36).substring(2, 9);

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [clientProjects, setClientProjects] = useState<ClientProject[]>([]);
  const [clientInvoices, setClientInvoices] = useState<ClientInvoice[]>([]);
  const [clientUsers, setClientUsers] = useState<ClientUser[]>([]);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem(TOKEN_STORAGE_KEY));

  const loadBaseData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      setDivisions(dbData.divisions as Division[]);
      setProjects(dbData.projects as Project[]);
      setTeam(dbData.team as TeamMember[]);
      setClientProjects(dbData.clientProjects as unknown as ClientProject[]);
      setClientInvoices(dbData.clientInvoices as unknown as ClientInvoice[]);
      setClientUsers(dbData.clientUsers as unknown as ClientUser[]);
      setInitiatives(dbData.initiatives as Initiative[]);
      // Contact submissions are empty initially in static mode as they aren't persistable
      setContactSubmissions((dbData.contactSubmissions || []) as unknown as ContactSubmission[]);
    } catch (error) {
      console.error('Failed to load site data', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBaseData();
  }, [loadBaseData]);

  const refreshData = async () => {
    // In static mode, refresh essentially resets to initial JSON state
    // but here we might want to keep local edits? 
    // For now, let's just re-load base which resets changes, 
    // effectively simulating "unsaved" changes being lost on refresh.
    await loadBaseData();
  };

  const login = async (password: string) => {
    // Mock login - accept any non-empty password
    if (password) {
      localStorage.setItem(TOKEN_STORAGE_KEY, 'mock-token');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setIsAuthenticated(false);
  };

  const submitContactForm = async (payload: ContactFormInput) => {
    console.log('Contact Form Submitted (Static Mode):', payload);
    const newSubmission = {
      id: generateId(),
      ...payload,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    // Update local state to show it in admin panel temporarily
    setContactSubmissions(prev => [newSubmission as unknown as ContactSubmission, ...prev]);
  };

  // --- CRUD Operations (Local State Only) ---

  const addDivision = async (division: Partial<Division>) => {
    const newDiv = { ...division, id: generateId() } as Division;
    setDivisions(prev => [...prev, newDiv]);
  };

  const updateDivision = async (id: string, data: Partial<Division>) => {
    setDivisions(prev => prev.map(item => (item.id === id ? { ...item, ...data } : item)));
  };

  const deleteDivision = async (id: string) => {
    setDivisions(prev => prev.filter(item => item.id !== id));
  };

  const addProject = async (project: Partial<Project>) => {
    const newProject = { ...project, id: generateId() } as Project;
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = async (id: string, data: Partial<Project>) => {
    setProjects(prev => prev.map(item => (item.id === id ? { ...item, ...data } : item)));
  };

  const deleteProject = async (id: string) => {
    setProjects(prev => prev.filter(item => item.id !== id));
  };

  const addTeamMember = async (member: Partial<TeamMember>) => {
    const newMember = { ...member, id: generateId() } as TeamMember;
    setTeam(prev => [...prev, newMember]);
  };

  const updateTeamMember = async (id: string, data: Partial<TeamMember>) => {
    setTeam(prev => prev.map(item => (item.id === id ? { ...item, ...data } : item)));
  };

  const deleteTeamMember = async (id: string) => {
    setTeam(prev => prev.filter(item => item.id !== id));
  };

  const addClientProject = async (project: Partial<ClientProject>) => {
    const newProject = { ...project, id: generateId() } as ClientProject;
    setClientProjects(prev => [...prev, newProject]);
  };

  const updateClientProject = async (id: string, data: Partial<ClientProject>) => {
    setClientProjects(prev => prev.map(item => (item.id === id ? { ...item, ...data } : item)));
  };

  const deleteClientProject = async (id: string) => {
    setClientProjects(prev => prev.filter(item => item.id !== id));
  };

  const addClientInvoice = async (invoice: Partial<ClientInvoice>) => {
    const newInv = { ...invoice, id: generateId() } as ClientInvoice;
    setClientInvoices(prev => [...prev, newInv]);
  };

  const updateClientInvoice = async (id: string, data: Partial<ClientInvoice>) => {
    setClientInvoices(prev => prev.map(item => (item.id === id ? { ...item, ...data } : item)));
  };

  const deleteClientInvoice = async (id: string) => {
    setClientInvoices(prev => prev.filter(item => item.id !== id));
  };

  const addClientUser = async (user: Partial<ClientUser>) => {
    const newUser = { ...user, id: generateId() } as ClientUser;
    setClientUsers(prev => [...prev, newUser]);
  };

  const updateClientUser = async (id: string, data: Partial<ClientUser>) => {
    setClientUsers(prev => prev.map(item => (item.id === id ? { ...item, ...data } : item)));
  };

  const deleteClientUser = async (id: string) => {
    setClientUsers(prev => prev.filter(item => item.id !== id));
  };

  const addInitiative = async (init: Partial<Initiative>) => {
    const newInit = { ...init, id: generateId() } as Initiative;
    setInitiatives(prev => [...prev, newInit]);
  };

  const updateInitiative = async (id: string, data: Partial<Initiative>) => {
    setInitiatives(prev => prev.map(item => (item.id === id ? { ...item, ...data } : item)));
  };

  const deleteInitiative = async (id: string) => {
    setInitiatives(prev => prev.filter(item => item.id !== id));
  };

  const updateSubmissionStatus = async (id: string, status: ContactSubmissionStatus) => {
    setContactSubmissions(prev => prev.map(item => (item.id === id ? { ...item, status } : item)));
  };

  const deleteContactSubmission = async (id: string) => {
    setContactSubmissions(prev => prev.filter(item => item.id !== id));
  };

  const importData = async (data: any) => {
    // Only updates local state
    if (data.divisions) setDivisions(data.divisions);
    if (data.projects) setProjects(data.projects);
    if (data.team) setTeam(data.team);
    // ... etc
    console.log('Data locally imported', data);
  };

  const resetData = async () => {
    // Resets to the DB JSON
    loadBaseData();
  };

  const value: DataContextType = {
    divisions,
    projects,
    team,
    clientProjects,
    clientInvoices,
    clientUsers,
    initiatives,
    contactSubmissions,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshData,
    submitContactForm,
    updateDivision,
    addDivision,
    deleteDivision,
    updateProject,
    addProject,
    deleteProject,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    addClientProject,
    updateClientProject,
    deleteClientProject,
    addClientInvoice,
    updateClientInvoice,
    deleteClientInvoice,
    addClientUser,
    updateClientUser,
    deleteClientUser,
    addInitiative,
    updateInitiative,
    deleteInitiative,
    updateSubmissionStatus,
    deleteContactSubmission,
    importData,
    resetData
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
