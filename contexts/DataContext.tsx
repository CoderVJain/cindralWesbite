import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  ContactSubmission,
  ContactSubmissionStatus,
  Division,
  Project,
  TeamMember,
  ClientProject,
  ClientInvoice,
  ClientUser
} from '../types';

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
  updateSubmissionStatus: (id: string, status: ContactSubmissionStatus) => Promise<void>;
  deleteContactSubmission: (id: string) => Promise<void>;
  importData: (data: any) => Promise<void>;
  resetData: () => Promise<void>;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const TOKEN_STORAGE_KEY = 'cindral_admin_token';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [clientProjects, setClientProjects] = useState<ClientProject[]>([]);
  const [clientInvoices, setClientInvoices] = useState<ClientInvoice[]>([]);
  const [clientUsers, setClientUsers] = useState<ClientUser[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY));

  const clearAuth = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setAuthToken(null);
    setContactSubmissions([]);
  }, []);

  const fetchAPI = useCallback(
    async (
      path: string,
      options: RequestInit = {},
      opts: { skipAuth?: boolean; tokenOverride?: string } = {}
    ) => {
      const headers = new Headers(options.headers as HeadersInit);
      const hasBody = options.body !== undefined && !(options.body instanceof FormData);
      if (hasBody && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }
      const tokenToUse = opts.tokenOverride ?? authToken;
      if (!opts.skipAuth && tokenToUse) {
        headers.set('Authorization', `Bearer ${tokenToUse}`);
      }

      const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers
      });

      if (response.status === 401) {
        clearAuth();
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        let message = 'Request failed';
        try {
          const body = await response.json();
          message = body?.message || message;
        } catch {
          // ignore
        }
        throw new Error(message);
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return null;
      }
      return response.json();
    },
    [authToken, clearAuth]
  );

  const loadBaseData = useCallback(async () => {
    setIsLoading(true);
    try {
      const clientUsersPromise = authToken ? fetchAPI('/api/client-users') : Promise.resolve([]);
      const [fetchedDivisions, fetchedProjects, fetchedTeam, fetchedClientProjects, fetchedClientInvoices, fetchedClientUsers] = await Promise.all([
        fetchAPI('/api/divisions'),
        fetchAPI('/api/projects'),
        fetchAPI('/api/team'),
        fetchAPI('/api/client-projects'),
        fetchAPI('/api/client-invoices'),
        clientUsersPromise
      ]);
      setDivisions(fetchedDivisions || []);
      setProjects(fetchedProjects || []);
      setTeam(fetchedTeam || []);
      setClientProjects(fetchedClientProjects || []);
      setClientInvoices(fetchedClientInvoices || []);
      setClientUsers(fetchedClientUsers || []);
    } catch (error) {
      console.error('Failed to load site data', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAPI, authToken]);

  const fetchContactSubmissions = useCallback(
    async (tokenOverride?: string) => {
      const token = tokenOverride ?? authToken;
      if (!token) return;
      try {
        const data = await fetchAPI('/api/contact-submissions', {}, { tokenOverride: token });
        setContactSubmissions(data || []);
      } catch (error) {
        console.error('Failed to load contact submissions', error);
      }
    },
    [authToken, fetchAPI]
  );

  useEffect(() => {
    loadBaseData();
  }, [loadBaseData]);

  useEffect(() => {
    if (authToken) {
      fetchContactSubmissions();
    }
  }, [authToken, fetchContactSubmissions]);

  const refreshData = useCallback(async () => {
    await loadBaseData();
    if (authToken) {
      await fetchContactSubmissions();
    }
  }, [authToken, fetchContactSubmissions, loadBaseData]);

  const login = async (password: string) => {
    try {
      const result = await fetchAPI(
        '/api/login',
        {
          method: 'POST',
          body: JSON.stringify({ password })
        },
        { skipAuth: true }
      );

      if (result?.token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, result.token);
        setAuthToken(result.token);
        await fetchContactSubmissions(result.token);
        return true;
      }
    } catch (error) {
      console.error('Login failed', error);
    }
    return false;
  };

  const logout = () => {
    if (authToken) {
      fetchAPI('/api/logout', { method: 'POST' }).catch(() => undefined);
    }
    clearAuth();
  };

  const submitContactForm = async (payload: ContactFormInput) => {
    await fetchAPI(
      '/api/contact',
      {
        method: 'POST',
        body: JSON.stringify(payload)
      },
      { skipAuth: true }
    );
    if (authToken) {
      await fetchContactSubmissions();
    }
  };

  const addDivision = async (division: Partial<Division>) => {
    const created = await fetchAPI('/api/divisions', {
      method: 'POST',
      body: JSON.stringify(division)
    });
    setDivisions(prev => [...prev, created]);
  };

  const updateDivision = async (id: string, data: Partial<Division>) => {
    const updated = await fetchAPI(`/api/divisions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    setDivisions(prev => prev.map(div => (div.id === id ? updated : div)));
  };

  const deleteDivision = async (id: string) => {
    await fetchAPI(`/api/divisions/${id}`, { method: 'DELETE' });
    setDivisions(prev => prev.filter(div => div.id !== id));
  };

  const addProject = async (project: Partial<Project>) => {
    const created = await fetchAPI('/api/projects', {
      method: 'POST',
      body: JSON.stringify(project)
    });
    setProjects(prev => [...prev, created]);
  };

  const updateProject = async (id: string, data: Partial<Project>) => {
    const updated = await fetchAPI(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    setProjects(prev => prev.map(project => (project.id === id ? updated : project)));
  };

  const deleteProject = async (id: string) => {
    await fetchAPI(`/api/projects/${id}`, { method: 'DELETE' });
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  const addTeamMember = async (member: Partial<TeamMember>) => {
    const created = await fetchAPI('/api/team', {
      method: 'POST',
      body: JSON.stringify(member)
    });
    setTeam(prev => [...prev, created]);
  };

  const updateTeamMember = async (id: string, data: Partial<TeamMember>) => {
    const updated = await fetchAPI(`/api/team/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    setTeam(prev => prev.map(member => (member.id === id ? updated : member)));
  };

  const deleteTeamMember = async (id: string) => {
    await fetchAPI(`/api/team/${id}`, { method: 'DELETE' });
    setTeam(prev => prev.filter(member => member.id !== id));
  };

  const addClientProject = async (project: Partial<ClientProject>) => {
    const created = await fetchAPI('/api/client-projects', {
      method: 'POST',
      body: JSON.stringify(project)
    });
    setClientProjects(prev => [...prev, created]);
  };

  const updateClientProject = async (id: string, data: Partial<ClientProject>) => {
    const updated = await fetchAPI(`/api/client-projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    setClientProjects(prev => prev.map(project => (project.id === id ? updated : project)));
  };

  const deleteClientProject = async (id: string) => {
    await fetchAPI(`/api/client-projects/${id}`, { method: 'DELETE' });
    setClientProjects(prev => prev.filter(project => project.id !== id));
  };

  const addClientInvoice = async (invoice: Partial<ClientInvoice>) => {
    const created = await fetchAPI('/api/client-invoices', {
      method: 'POST',
      body: JSON.stringify(invoice)
    });
    setClientInvoices(prev => [...prev, created]);
  };

  const updateClientInvoice = async (id: string, data: Partial<ClientInvoice>) => {
    const updated = await fetchAPI(`/api/client-invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    setClientInvoices(prev => prev.map(inv => (inv.id === id ? updated : inv)));
  };

  const deleteClientInvoice = async (id: string) => {
    await fetchAPI(`/api/client-invoices/${id}`, { method: 'DELETE' });
    setClientInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  const addClientUser = async (user: Partial<ClientUser>) => {
    const created = await fetchAPI('/api/client-users', {
      method: 'POST',
      body: JSON.stringify(user)
    });
    setClientUsers(prev => [...prev, created]);
  };

  const updateClientUser = async (id: string, data: Partial<ClientUser>) => {
    const updated = await fetchAPI(`/api/client-users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    setClientUsers(prev => prev.map(u => (u.id === id ? updated : u)));
  };

  const deleteClientUser = async (id: string) => {
    await fetchAPI(`/api/client-users/${id}`, { method: 'DELETE' });
    setClientUsers(prev => prev.filter(u => u.id !== id));
  };

  const updateSubmissionStatus = async (id: string, status: ContactSubmissionStatus) => {
    const updated = await fetchAPI(`/api/contact-submissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    setContactSubmissions(prev => prev.map(sub => (sub.id === id ? updated : sub)));
  };

  const deleteContactSubmission = async (id: string) => {
    await fetchAPI(`/api/contact-submissions/${id}`, { method: 'DELETE' });
    setContactSubmissions(prev => prev.filter(sub => sub.id !== id));
  };

  const importData = async (data: any) => {
    await fetchAPI('/api/data/import', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    await refreshData();
  };

  const resetData = async () => {
    await fetchAPI('/api/data/reset', { method: 'POST' });
    await refreshData();
  };

  const value: DataContextType = {
    divisions,
    projects,
    team,
    clientProjects,
    clientInvoices,
    clientUsers,
    contactSubmissions,
    isLoading,
    isAuthenticated: Boolean(authToken),
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
