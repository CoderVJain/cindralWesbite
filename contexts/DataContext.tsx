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
import dbData from '../data/db.json';

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
const DATA_STORAGE_KEY = 'cindral_site_data';

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

  // --- Helper to save current state to LocalStorage ---
  const persistData = useCallback((data: Partial<any>) => {
    try {
      const currentStorage = localStorage.getItem(DATA_STORAGE_KEY);
      const currentData = currentStorage ? JSON.parse(currentStorage) : {};
      const newData = { ...currentData, ...data };
      localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.error("Failed to save to local storage", e);
    }
  }, []);

  const loadBaseData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Check local storage first
      const storedData = localStorage.getItem(DATA_STORAGE_KEY);
      let dataToLoad: any = {};

      if (storedData) {
        dataToLoad = JSON.parse(storedData);
        // Merge with defaults if missing keys (optional, but good for robustness)
        // ideally if storedData exists we use it.
      } else {
        // Fallback to initial db.json and save it
        dataToLoad = {
          divisions: dbData.divisions,
          projects: dbData.projects,
          team: dbData.team,
          clientProjects: dbData.clientProjects,
          clientInvoices: dbData.clientInvoices,
          clientUsers: dbData.clientUsers,
          initiatives: dbData.initiatives,
          contactSubmissions: dbData.contactSubmissions || []
        };
        localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(dataToLoad));
      }

      setDivisions(dataToLoad.divisions || []);
      setProjects(dataToLoad.projects || []);
      setTeam(dataToLoad.team || []);
      setClientProjects(dataToLoad.clientProjects || []);
      setClientInvoices(dataToLoad.clientInvoices || []);
      setClientUsers(dataToLoad.clientUsers || []);
      setInitiatives(dataToLoad.initiatives || []);
      setContactSubmissions(dataToLoad.contactSubmissions || []);

    } catch (error) {
      console.error('Failed to load site data', error);
      // Fallback
      setDivisions(dbData.divisions as Division[]);
      setProjects(dbData.projects as Project[]);
      // ... minimal fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBaseData();
  }, [loadBaseData]);

  const refreshData = async () => {
    await loadBaseData();
  };

  const login = async (password: string) => {
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
    const newSubmission = {
      id: generateId(),
      ...payload,
      lastName: payload.lastName || '',
      status: 'new' as ContactSubmissionStatus,
      createdAt: new Date().toISOString()
    } as ContactSubmission;
    const updatedSubmissions = [newSubmission, ...contactSubmissions];
    setContactSubmissions(updatedSubmissions);
    persistData({ contactSubmissions: updatedSubmissions });
  };

  // --- CRUD Operations with Persistence ---

  // Division
  const addDivision = async (division: Partial<Division>) => {
    const newDiv = { ...division, id: generateId() } as Division;
    const updated = [...divisions, newDiv];
    setDivisions(updated);
    persistData({ divisions: updated });
  };
  const updateDivision = async (id: string, data: Partial<Division>) => {
    const updated = divisions.map(item => (item.id === id ? { ...item, ...data } : item));
    setDivisions(updated);
    persistData({ divisions: updated });
  };
  const deleteDivision = async (id: string) => {
    const updated = divisions.filter(item => item.id !== id);
    setDivisions(updated);
    persistData({ divisions: updated });
  };

  // Project
  const addProject = async (project: Partial<Project>) => {
    const newProject = { ...project, id: generateId() } as Project;
    const updated = [...projects, newProject];
    setProjects(updated);
    persistData({ projects: updated });
  };
  const updateProject = async (id: string, data: Partial<Project>) => {
    const updated = projects.map(item => (item.id === id ? { ...item, ...data } : item));
    setProjects(updated);
    persistData({ projects: updated });
  };
  const deleteProject = async (id: string) => {
    const updated = projects.filter(item => item.id !== id);
    setProjects(updated);
    persistData({ projects: updated });
  };

  // Team
  const addTeamMember = async (member: Partial<TeamMember>) => {
    const newMember = { ...member, id: generateId() } as TeamMember;
    const updated = [...team, newMember];
    setTeam(updated);
    persistData({ team: updated });
  };
  const updateTeamMember = async (id: string, data: Partial<TeamMember>) => {
    const updated = team.map(item => (item.id === id ? { ...item, ...data } : item));
    setTeam(updated);
    persistData({ team: updated });
  };
  const deleteTeamMember = async (id: string) => {
    const updated = team.filter(item => item.id !== id);
    setTeam(updated);
    persistData({ team: updated });
  };

  // Client Project
  const addClientProject = async (project: Partial<ClientProject>) => {
    const newProject = { ...project, id: generateId() } as ClientProject;
    const updated = [...clientProjects, newProject];
    setClientProjects(updated);
    persistData({ clientProjects: updated });
  };
  const updateClientProject = async (id: string, data: Partial<ClientProject>) => {
    const updated = clientProjects.map(item => (item.id === id ? { ...item, ...data } : item));
    setClientProjects(updated);
    persistData({ clientProjects: updated });
  };
  const deleteClientProject = async (id: string) => {
    const updated = clientProjects.filter(item => item.id !== id);
    setClientProjects(updated);
    persistData({ clientProjects: updated });
  };

  // Client Invoice
  const addClientInvoice = async (invoice: Partial<ClientInvoice>) => {
    const newInv = { ...invoice, id: generateId() } as ClientInvoice;
    const updated = [...clientInvoices, newInv];
    setClientInvoices(updated);
    persistData({ clientInvoices: updated });
  };
  const updateClientInvoice = async (id: string, data: Partial<ClientInvoice>) => {
    const updated = clientInvoices.map(item => (item.id === id ? { ...item, ...data } : item));
    setClientInvoices(updated);
    persistData({ clientInvoices: updated });
  };
  const deleteClientInvoice = async (id: string) => {
    const updated = clientInvoices.filter(item => item.id !== id);
    setClientInvoices(updated);
    persistData({ clientInvoices: updated });
  };

  // Client User
  const addClientUser = async (user: Partial<ClientUser>) => {
    const newUser = { ...user, id: generateId() } as ClientUser;
    const updated = [...clientUsers, newUser];
    setClientUsers(updated);
    persistData({ clientUsers: updated });
  };
  const updateClientUser = async (id: string, data: Partial<ClientUser>) => {
    const updated = clientUsers.map(item => (item.id === id ? { ...item, ...data } : item));
    setClientUsers(updated);
    persistData({ clientUsers: updated });
  };
  const deleteClientUser = async (id: string) => {
    const updated = clientUsers.filter(item => item.id !== id);
    setClientUsers(updated);
    persistData({ clientUsers: updated });
  };

  // Initiative
  const addInitiative = async (init: Partial<Initiative>) => {
    const newInit = { ...init, id: generateId() } as Initiative;
    const updated = [...initiatives, newInit];
    setInitiatives(updated);
    persistData({ initiatives: updated });
  };
  const updateInitiative = async (id: string, data: Partial<Initiative>) => {
    const updated = initiatives.map(item => (item.id === id ? { ...item, ...data } : item));
    setInitiatives(updated);
    persistData({ initiatives: updated });
  };
  const deleteInitiative = async (id: string) => {
    const updated = initiatives.filter(item => item.id !== id);
    setInitiatives(updated);
    persistData({ initiatives: updated });
  };

  // Contact Submissions
  const updateSubmissionStatus = async (id: string, status: ContactSubmissionStatus) => {
    const updated = contactSubmissions.map(item => (item.id === id ? { ...item, status } : item));
    setContactSubmissions(updated);
    persistData({ contactSubmissions: updated });
  };
  const deleteContactSubmission = async (id: string) => {
    const updated = contactSubmissions.filter(item => item.id !== id);
    setContactSubmissions(updated);
    persistData({ contactSubmissions: updated });
  };

  const importData = async (data: any) => {
    const newData = {
      divisions: data.divisions || divisions,
      projects: data.projects || projects,
      team: data.team || team,
      clientProjects: data.clientProjects || clientProjects,
      clientInvoices: data.clientInvoices || clientInvoices,
      clientUsers: data.clientUsers || clientUsers,
      initiatives: data.initiatives || initiatives,
      contactSubmissions: data.contactSubmissions || contactSubmissions
    };

    setDivisions(newData.divisions);
    setProjects(newData.projects);
    setTeam(newData.team);
    setClientProjects(newData.clientProjects);
    setClientInvoices(newData.clientInvoices);
    setClientUsers(newData.clientUsers);
    setInitiatives(newData.initiatives);
    setContactSubmissions(newData.contactSubmissions);

    localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(newData));
    console.log('Data imported and saved to localStorage', newData);
  };

  const resetData = async () => {
    localStorage.removeItem(DATA_STORAGE_KEY);
    // Reload to re-initialize from db.json
    window.location.reload();
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
