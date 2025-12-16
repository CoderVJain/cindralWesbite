import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { LayoutDashboard, Users, Layers, Lock, Briefcase, Plus, Trash2, Edit2, X, Save, Database, Download, Mail, MailOpen, Clock3, CheckCircle2, LayoutGrid, List, CreditCard, Link2, UserPlus, ShieldCheck, CheckSquare, MinusSquare, Heart } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Division, Project, TeamMember, DivisionType, ContactSubmissionStatus, ClientProject, ClientInvoice, ClientUser, ClientProjectTask, Initiative } from '../types';

// Admin Login Component
const AdminLogin: React.FC = () => {
  const { login } = useData();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(password);
    if (success) {
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-slate-700 p-4 rounded-full">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white text-center mb-2">Admin Access</h2>
        <p className="text-gray-400 text-center mb-8">Enter password to manage Cindral.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cindral-blue transition-colors"
              placeholder="Password (admin123)"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" className="w-full bg-cindral-blue text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

type ViewMode = 'grid' | 'table';

// Form Helpers
const InputField = ({ label, value, onChange, placeholder }: any) => (
  <div className="mb-4">
    <label className="block text-gray-400 text-sm mb-1">{label}</label>
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white"
      placeholder={placeholder}
    />
  </div>
);

const TextAreaField = ({ label, value, onChange, placeholder, rows = 3 }: any) => (
  <div className="mb-4">
    <label className="block text-gray-400 text-sm mb-1">{label}</label>
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white"
      rows={rows}
      placeholder={placeholder}
    />
  </div>
);

const AdminModal = ({
  title,
  description,
  isOpen,
  onClose,
  children
}: {
  title: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div>
            <h3 className="text-2xl font-bold text-white">{title}</h3>
            {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </div>
  );
};

const ViewToggle = ({ mode, onChange }: { mode: ViewMode; onChange: (mode: ViewMode) => void }) => (
  <div className="inline-flex items-center rounded-xl border border-slate-700 overflow-hidden">
    <button
      onClick={() => onChange('grid')}
      className={`px-3 py-2 flex items-center space-x-1 text-sm font-medium ${mode === 'grid' ? 'bg-slate-700 text-white' : 'text-gray-400 hover:text-white'
        }`}
    >
      <LayoutGrid className="w-4 h-4" />
      <span>Grid</span>
    </button>
    <button
      onClick={() => onChange('table')}
      className={`px-3 py-2 flex items-center space-x-1 text-sm font-medium ${mode === 'table' ? 'bg-slate-700 text-white' : 'text-gray-400 hover:text-white'
        }`}
    >
      <List className="w-4 h-4" />
      <span>Table</span>
    </button>
  </div>
);

// Manage Divisions
const ManageDivisions = () => {
  const { divisions, updateDivision, addDivision, deleteDivision } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Division>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const openModal = (mode: 'create' | 'edit', div?: Division) => {
    if (mode === 'edit' && div) {
      setEditingId(div.id);
      setEditForm(div);
      setIsAdding(false);
    } else {
      setEditForm({
        id: `div_${Date.now()}`,
        title: '',
        tagline: '',
        description: '',
        color: 'text-white',
        themeColor: '#ffffff',
        bannerImage: '',
        iconName: 'FlaskConical',
        type: DivisionType.LABS
      });
      setIsAdding(true);
      setEditingId(null);
    }
    setModalOpen(true);
  };

  const save = async () => {
    if (!editForm.title) {
      alert("Title required");
      return;
    }
    setIsProcessing(true);
    try {
      if (isAdding) {
        await addDivision(editForm);
        setIsAdding(false);
      } else if (editingId) {
        await updateDivision(editingId, editForm);
        setEditingId(null);
      }
      setModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Unable to save division right now.");
    } finally {
      setIsProcessing(false);
    }
  };

  const closeModal = () => {
    setIsAdding(false);
    setEditingId(null);
    setEditForm({});
    setModalOpen(false);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Divisions</h2>
            <p className="text-sm text-gray-500">Manage division hero content, gradients, and callouts.</p>
          </div>
          <div className="flex items-center gap-3">
            <ViewToggle mode={viewMode} onChange={setViewMode} />
            <button onClick={() => openModal('create')} className="bg-cindral-blue px-4 py-2 rounded-lg text-white font-bold flex items-center hover:bg-blue-600 transition-colors">
              <Plus className="w-4 h-4 mr-2" /> Add Division
            </button>
          </div>
        </div>

        {viewMode === 'table' ? (
          <div className="overflow-hidden border border-slate-800 rounded-2xl">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-400">Division</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-400">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-400">Tagline</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-slate-900/40 divide-y divide-slate-800">
                {divisions.map(div => (
                  <tr key={div.id}>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-white">{div.title}</div>
                      <div className="text-xs text-gray-500">{div.id}</div>
                    </td>
                    <td className="px-4 py-4 text-gray-300">{div.type}</td>
                    <td className="px-4 py-4 text-gray-400">{div.tagline}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openModal('edit', div)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs hover:bg-blue-600">Edit</button>
                        <button
                          disabled={isProcessing}
                          onClick={async () => {
                            if (isProcessing) return;
                            if (confirm('Delete?')) {
                              setIsProcessing(true);
                              try {
                                await deleteDivision(div.id);
                              } catch (error) {
                                console.error(error);
                                alert("Failed to delete division");
                              } finally {
                                setIsProcessing(false);
                              }
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {divisions.map(div => (
              <div key={div.id} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-slate-500 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">{div.type}</p>
                    <h3 className={`text-2xl font-bold ${div.color}`}>{div.title}</h3>
                    <p className="text-gray-400 text-sm mt-2">{div.tagline}</p>
                  </div>
                  <span className="text-xs bg-slate-900 px-2 py-1 rounded text-gray-500">{div.id}</span>
                </div>
                {div.bannerImage && (
                  <img src={div.bannerImage} alt="Banner" className="w-full h-36 object-cover rounded-xl mt-4 border border-slate-700" />
                )}
                <div className="flex items-center justify-end gap-2 mt-4">
                  <button onClick={() => openModal('edit', div)} className="px-3 py-2 rounded-lg bg-slate-900 text-white text-xs hover:bg-blue-600 flex items-center">
                    <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                  </button>
                  <button
                    disabled={isProcessing}
                    onClick={async () => {
                      if (isProcessing) return;
                      if (confirm('Delete?')) {
                        setIsProcessing(true);
                        try {
                          await deleteDivision(div.id);
                        } catch (error) {
                          console.error(error);
                          alert("Failed to delete division");
                        } finally {
                          setIsProcessing(false);
                        }
                      }
                    }}
                    className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isAdding ? 'Create Division' : 'Edit Division'}
        description="Update positioning, iconography, and color accents for each division."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Title" value={editForm.title || ''} onChange={(v: string) => setEditForm({ ...editForm, title: v })} />
          <InputField label="Tagline" value={editForm.tagline || ''} onChange={(v: string) => setEditForm({ ...editForm, tagline: v })} />
        </div>
        <TextAreaField label="Description" value={editForm.description || ''} onChange={(v: string) => setEditForm({ ...editForm, description: v })} />
        <InputField label="Banner Image URL" value={editForm.bannerImage || ''} onChange={(v: string) => setEditForm({ ...editForm, bannerImage: v })} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField label="Icon Name (Lucide)" value={editForm.iconName || ''} onChange={(v: string) => setEditForm({ ...editForm, iconName: v })} />
          <InputField label="Text Color Class" value={editForm.color || ''} onChange={(v: string) => setEditForm({ ...editForm, color: v })} />
          <InputField label="Theme Color Hex" value={editForm.themeColor || ''} onChange={(v: string) => setEditForm({ ...editForm, themeColor: v })} />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={closeModal} className="px-4 py-2 rounded-xl border border-slate-700 text-gray-300 hover:bg-slate-800">Cancel</button>
          <button
            onClick={save}
            disabled={isProcessing}
            className="px-5 py-2 rounded-xl bg-cindral-blue text-white font-semibold disabled:opacity-60"
          >
            {isProcessing ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </AdminModal>
    </>
  );
};

// Manage Client Projects (client-facing portal)
const ManageClientProjects = () => {
  const { clientProjects, projects, team, addClientProject, updateClientProject, deleteClientProject } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ClientProject>>({});
  const [resourcesInput, setResourcesInput] = useState('[]');
  const [timelineInput, setTimelineInput] = useState('[]');
  const [updatesInput, setUpdatesInput] = useState('[]');
  const [linksInput, setLinksInput] = useState('[]');
  const [tasks, setTasks] = useState<ClientProjectTask[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const calculateProgressFromTasks = (taskList: ClientProjectTask[] = []) => {
    const actionable = taskList.filter(t => t.status !== 'cancelled');
    if (!actionable.length) return 0;
    const done = actionable.filter(t => t.status === 'done').length;
    return Math.round((done / actionable.length) * 100);
  };

  const openModal = (mode: 'create' | 'edit', cp?: ClientProject) => {
    if (mode === 'edit' && cp) {
      setEditingId(cp.id);
      setEditForm(cp);
      setResourcesInput(JSON.stringify(cp.resources || [], null, 2));
      setTasks(cp.tasks || []);
      setTimelineInput(JSON.stringify(cp.timeline || [], null, 2));
      setUpdatesInput(JSON.stringify(cp.updates || [], null, 2));
      setLinksInput(JSON.stringify(cp.links || [], null, 2));
    } else {
      const defaultProjectId = projects[0]?.id || '';
      const defaults: Partial<ClientProject> = {
        id: `cp_${Date.now()}`,
        projectId: defaultProjectId,
        clientName: '',
        name: '',
        summary: '',
        status: 'On Track',
        health: 'green',
        progress: 0,
        budgetUsed: 0,
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10),
        nextMilestone: '',
        team: [],
        resources: [],
        tasks: [],
        timeline: [],
        updates: [],
        links: []
      };
      setEditingId(null);
      setEditForm(defaults);
      setResourcesInput('[]');
      setTasks([]);
      setTimelineInput('[]');
      setUpdatesInput('[]');
      setLinksInput('[]');
    }
    setModalOpen(true);
  };

  const parseJsonField = (val: string, label: string) => {
    if (!val.trim()) return [];
    try {
      return JSON.parse(val);
    } catch (err) {
      alert(`${label} must be valid JSON array`);
      throw err;
    }
  };

  const save = async () => {
    if (!editForm.name || !editForm.projectId) {
      alert('Name and linked project are required');
      return;
    }
    setIsProcessing(true);
    try {
      const taskProgress = calculateProgressFromTasks(tasks);
      const payload: Partial<ClientProject> = {
        ...editForm,
        budgetUsed: Number(editForm.budgetUsed) || 0,
        resources: parseJsonField(resourcesInput, 'Resources'),
        tasks,
        progress: taskProgress,
        timeline: parseJsonField(timelineInput, 'Timeline'),
        updates: parseJsonField(updatesInput, 'Updates'),
        links: parseJsonField(linksInput, 'Links')
      };
      if (editingId) {
        await updateClientProject(editingId, payload);
      } else {
        await addClientProject(payload);
      }
      setModalOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const toggleTeam = (id: string) => {
    const current = editForm.team || [];
    if (current.includes(id)) {
      setEditForm({ ...editForm, team: current.filter(t => t !== id) });
    } else {
      setEditForm({ ...editForm, team: [...current, id] });
    }
  };

  const updateTask = (id: string, updated: Partial<ClientProjectTask>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updated } : t)));
  };

  const addTask = () => {
    setTasks(prev => [
      ...prev,
      { id: `task_${Date.now()}`, title: 'New Task', status: 'todo', owner: '', dueDate: '', highlight: '' }
    ]);
  };

  const removeTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));

  const healthBadge: Record<ClientProject['health'], string> = {
    green: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200',
    amber: 'bg-amber-500/10 border-amber-500/40 text-amber-200',
    red: 'bg-rose-500/10 border-rose-500/40 text-rose-200'
  };

  const statusBadge: Record<ClientProject['status'], string> = {
    'On Track': 'bg-cyan-500/10 border-cyan-400/40 text-cyan-200',
    'At Risk': 'bg-amber-500/10 border-amber-400/40 text-amber-200',
    Behind: 'bg-rose-500/10 border-rose-400/40 text-rose-200'
  };

  const totalTasks = clientProjects.reduce((sum, p) => sum + (p.tasks?.length || 0), 0);
  const totalCancelled = clientProjects.reduce((sum, p) => sum + (p.tasks || []).filter(t => t.status === 'cancelled').length, 0);
  const avgProgress = clientProjects.length
    ? Math.round(
      clientProjects.reduce((sum, p) => sum + (calculateProgressFromTasks(p.tasks || []) || p.progress || 0), 0) /
      clientProjects.length
    )
    : 0;
  const activeHealth = clientProjects.reduce(
    (acc, p) => {
      acc[p.health] = (acc[p.health] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const statusCounts = clientProjects.reduce(
    (acc, p) => {
      (p.tasks || []).forEach(task => {
        acc[task.status] = (acc[task.status] || 0) + 1;
      });
      return acc;
    },
    { todo: 0, in_progress: 0, done: 0, cancelled: 0 } as Record<ClientProjectTask['status'], number>
  );
  const totalStatusCount = statusCounts.todo + statusCounts.in_progress + statusCounts.done + statusCounts.cancelled;
  const onTrackCount = clientProjects.filter(p => p.status === 'On Track').length;
  const atRiskCount = clientProjects.filter(p => p.status === 'At Risk').length;
  const behindCount = clientProjects.filter(p => p.status === 'Behind').length;
  const avgTasksPerProject = clientProjects.length ? Math.round(totalTasks / clientProjects.length) : 0;
  const completionRate =
    totalStatusCount - statusCounts.cancelled > 0
      ? Math.round((statusCounts.done / (totalStatusCount - statusCounts.cancelled)) * 100)
      : 0;
  const healthTotal = clientProjects.length || 0;
  const greenPct = healthTotal ? Math.round(((activeHealth.green || 0) / healthTotal) * 100) : 0;
  const amberPct = healthTotal ? Math.round(((activeHealth.amber || 0) / healthTotal) * 100) : 0;
  const redPct = healthTotal ? Math.round(((activeHealth.red || 0) / healthTotal) * 100) : 0;

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-1">Client Delivery</p>
            <h2 className="text-2xl font-bold text-white">Client Projects</h2>
            <p className="text-sm text-gray-500">Open a dedicated page per project. Drag-and-drop lives there.</p>
          </div>
          <button onClick={() => openModal('create')} className="bg-cindral-blue px-4 py-2 rounded-lg text-white font-bold flex items-center hover:bg-blue-600 transition-colors">
            <Plus className="w-4 h-4 mr-2" /> Add Client Project
          </button>
        </div>

        <div className="bg-slate-950/85 border border-slate-800/80 rounded-3xl p-6 space-y-6 shadow-xl shadow-slate-900/40">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Snapshot</p>
              <h3 className="text-xl font-semibold text-white">Delivery Pulse</h3>
              <p className="text-xs text-gray-500">Throughput, balance, and risk in one place.</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="px-3 py-1 rounded-full bg-slate-900/70 border border-slate-800 shadow-inner">{clientProjects.length} projects</span>
              <span className="px-3 py-1 rounded-full bg-slate-900/70 border border-slate-800 shadow-inner">{totalTasks} tasks</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 min-h-[126px] flex flex-col gap-1">
              <p className="text-[11px] text-gray-500 uppercase tracking-[0.2em]">Active projects</p>
              <p className="text-3xl font-bold text-white">{clientProjects.length}</p>
              <p className="text-[11px] text-gray-500">Avg tasks/project: {avgTasksPerProject}</p>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 min-h-[126px] flex flex-col gap-1">
              <p className="text-[11px] text-gray-500 uppercase tracking-[0.2em]">Total tasks</p>
              <p className="text-3xl font-bold text-white">{totalTasks}</p>
              <p className="text-[11px] text-amber-300">Cancelled: {totalCancelled}</p>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 min-h-[126px] flex flex-col gap-2">
              <p className="text-[11px] text-gray-500 uppercase tracking-[0.2em]">Avg progress</p>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold text-white">{avgProgress}%</p>
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${avgProgress}%` }}></div>
                </div>
              </div>
              <p className="text-[11px] text-gray-500">Completion rate: {completionRate}%</p>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 min-h-[126px] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-gray-500 uppercase tracking-[0.2em]">Health</p>
                <span className="text-[11px] text-gray-500">{clientProjects.length} projects</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex border border-slate-800">
                <div className="h-full bg-gradient-to-r from-emerald-400 via-amber-300 to-rose-400" style={{ width: `${greenPct + amberPct + redPct}%` }} />
              </div>
              <div className="grid grid-cols-3 gap-3 text-[12px] text-gray-200 pt-2">
                <div className="rounded-xl bg-slate-800/80 border border-slate-700 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="font-semibold">On track</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">Count: {onTrackCount}</p>
                </div>
                <div className="rounded-xl bg-slate-800/80 border border-slate-700 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-300"></span>
                    <span className="font-semibold">At risk</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">Count: {atRiskCount}</p>
                </div>
                <div className="rounded-xl bg-slate-800/80 border border-slate-700 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                    <span className="font-semibold">Behind</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">Count: {behindCount}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white">Status mix</h4>
                <span className="text-[11px] text-gray-500">{totalStatusCount} tasks</span>
              </div>
              {totalStatusCount ? (
                <>
                  <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden flex">
                    <div className="h-full bg-slate-600" style={{ width: `${(statusCounts.todo / totalStatusCount) * 100}%` }}></div>
                    <div className="h-full bg-blue-500" style={{ width: `${(statusCounts.in_progress / totalStatusCount) * 100}%` }}></div>
                    <div className="h-full bg-emerald-500" style={{ width: `${(statusCounts.done / totalStatusCount) * 100}%` }}></div>
                    <div className="h-full bg-rose-500" style={{ width: `${(statusCounts.cancelled / totalStatusCount) * 100}%` }}></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-400">
                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-500"></span>To Do {statusCounts.todo}</span>
                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span>In Progress {statusCounts.in_progress}</span>
                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Done {statusCounts.done}</span>
                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500"></span>Cancelled {statusCounts.cancelled}</span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500">No tasks yet. Add tasks to see flow.</p>
              )}
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white">Progress distribution</h4>
                <span className="text-[11px] text-gray-500">Top projects</span>
              </div>
              {clientProjects.length ? (
                <div className="flex items-end gap-2 h-24">
                  {clientProjects.slice(0, 10).map(cp => {
                    const projProgress = calculateProgressFromTasks(cp.tasks || []) || cp.progress || 0;
                    return (
                      <div key={cp.id} className="flex flex-col items-center flex-1 gap-1">
                        <div
                          className="w-full rounded-t-md bg-gradient-to-t from-cindral-blue to-cyan-400 shadow-sm shadow-cyan-500/20"
                          style={{ height: `${Math.max(6, (projProgress / 100) * 96)}px` }}
                          title={`${cp.name} · ${projProgress}%`}
                        ></div>
                        <span className="text-[10px] text-gray-500 truncate w-full text-center">{projProgress}%</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Create a project to see progress trends.</p>
              )}
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white">Throughput</h4>
                <span className="text-[11px] text-gray-500">Done vs Active</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <span>Completion rate</span>
                  <span className="text-white font-semibold">{completionRate}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${completionRate}%` }}></div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-400 pt-1">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Done {statusCounts.done}</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span>In Progress {statusCounts.in_progress}</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-500"></span>To Do {statusCounts.todo}</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span>Cancelled {statusCounts.cancelled}</span>
                </div>
                <div className="border-t border-slate-800 pt-2 text-[11px] text-gray-400">
                  Avg tasks per project <span className="text-white font-semibold ml-1">{avgTasksPerProject}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="overflow-hidden border border-slate-800 rounded-2xl">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-400">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-400">Client</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-400">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-400">Progress</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-400">Team</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-slate-900/40 divide-y divide-slate-800">
                {clientProjects.map(cp => {
                  const assignedMembers = (cp.team || []).map(id => team.find(t => t.id === id)).filter(Boolean);
                  const actionableTasks = (cp.tasks || []).filter(t => t.status !== 'cancelled');
                  const doneTasks = actionableTasks.filter(t => t.status === 'done').length;
                  const totalActionable = actionableTasks.length;
                  const rowProgress = calculateProgressFromTasks(cp.tasks || []) || cp.progress || 0;
                  return (
                    <tr key={cp.id} className="align-top">
                      <td className="px-4 py-4 text-white font-semibold">
                        <div>{cp.name}</div>
                        <p className="text-xs text-gray-500">{cp.projectId}</p>
                      </td>
                      <td className="px-4 py-4 text-gray-300">{cp.clientName}</td>
                      <td className="px-4 py-4">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${statusBadge[cp.status]}`}>
                          {cp.status}
                        </div>
                        <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full border text-[10px] uppercase tracking-wide ${healthBadge[cp.health]}`}>
                          {cp.health}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-200">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${rowProgress}%` }}></div>
                          </div>
                          <span className="text-xs text-gray-400 w-10 text-right">{rowProgress}%</span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">{totalActionable ? `${doneTasks}/${totalActionable} tasks done` : 'No active tasks'}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex -space-x-2">
                          {assignedMembers.slice(0, 3).map(member => (
                            <img key={member!.id} src={member!.image} alt={member!.name} className="w-8 h-8 rounded-full border border-slate-900" />
                          ))}
                          {assignedMembers.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-900 flex items-center justify-center text-xs text-gray-400">
                              +{assignedMembers.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Link to={`/admin/client-project/${cp.id}`} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-700 text-gray-300 hover:border-cindral-blue hover:text-cindral-blue">
                            Open & Edit
                          </Link>
                          <button
                            disabled={isProcessing}
                            onClick={async () => {
                              if (isProcessing) return;
                              if (confirm('Delete client project?')) {
                                setIsProcessing(true);
                                try {
                                  await deleteClientProject(cp.id);
                                } catch (error) {
                                  console.error(error);
                                  alert('Failed to delete client project');
                                } finally {
                                  setIsProcessing(false);
                                }
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? 'Edit Client Project' : 'Create Client Project'}
        description="Client-facing status, milestones, and resources."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Link to Project</label>
            <select
              value={editForm.projectId || ''}
              onChange={e => setEditForm({ ...editForm, projectId: e.target.value })}
              className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white"
            >
              <option value="">Select project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <InputField label="Client Name" value={editForm.clientName || ''} onChange={(v: string) => setEditForm({ ...editForm, clientName: v })} />
        </div>
        <InputField label="Display Name" value={editForm.name || ''} onChange={(v: string) => setEditForm({ ...editForm, name: v })} />
        <TextAreaField label="Summary" value={editForm.summary || ''} onChange={(v: string) => setEditForm({ ...editForm, summary: v })} rows={3} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Status</label>
            <select
              value={editForm.status || 'On Track'}
              onChange={e => setEditForm({ ...editForm, status: e.target.value as ClientProject['status'] })}
              className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white"
            >
              <option>On Track</option>
              <option>At Risk</option>
              <option>Behind</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Health</label>
            <select
              value={editForm.health || 'green'}
              onChange={e => setEditForm({ ...editForm, health: e.target.value as ClientProject['health'] })}
              className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white"
            >
              <option value="green">Green</option>
              <option value="amber">Amber</option>
              <option value="red">Red</option>
            </select>
          </div>
          <InputField label="Next Milestone" value={editForm.nextMilestone || ''} onChange={(v: string) => setEditForm({ ...editForm, nextMilestone: v })} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Progress (auto from tasks)</label>
            <div className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white">
              {tasks.length ? `${calculateProgressFromTasks(tasks)}%` : 'No tasks yet'}
            </div>
          </div>
          <InputField label="Budget Used (%)" value={String(editForm.budgetUsed ?? 0)} onChange={(v: string) => setEditForm({ ...editForm, budgetUsed: Number(v) })} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Start Date</label>
            <input
              type="date"
              value={editForm.startDate || ''}
              onChange={e => setEditForm({ ...editForm, startDate: e.target.value })}
              className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">End Date</label>
            <input
              type="date"
              value={editForm.endDate || ''}
              onChange={e => setEditForm({ ...editForm, endDate: e.target.value })}
              className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-gray-400 text-sm mb-2">Team</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto bg-slate-900 p-2 rounded border border-slate-600">
            {team.map(member => (
              <label key={member.id} className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.team?.includes(member.id) || false}
                  onChange={() => toggleTeam(member.id)}
                  className="rounded border-gray-600 bg-slate-800 text-cindral-blue focus:ring-offset-slate-900"
                />
                <span>{member.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <TextAreaField label="Resources JSON (array)" value={resourcesInput} onChange={setResourcesInput} rows={4} />
          <TextAreaField label="Links JSON (array)" value={linksInput} onChange={setLinksInput} rows={4} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-semibold">Tasks</h4>
              <button onClick={addTask} className="text-xs px-2 py-1 rounded-lg bg-slate-800 text-white hover:bg-blue-600">Add Task</button>
            </div>
            <div className="space-y-3">
              {tasks.length === 0 && <p className="text-sm text-gray-500">No tasks yet.</p>}
              {tasks.map(task => (
                <div key={task.id} className="p-3 rounded-xl border border-slate-800 bg-slate-900/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <input
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                      value={task.title}
                      onChange={e => updateTask(task.id, { title: e.target.value })}
                    />
                    <button onClick={() => removeTask(task.id)} className="ml-2 text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input
                      className="bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm"
                      placeholder="Owner"
                      value={task.owner || ''}
                      onChange={e => updateTask(task.id, { owner: e.target.value })}
                    />
                    <input
                      className="bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm"
                      placeholder="Due date (YYYY-MM-DD)"
                      value={task.dueDate || ''}
                      onChange={e => updateTask(task.id, { dueDate: e.target.value })}
                    />
                    <select
                      className="bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm"
                      value={task.status}
                      onChange={e => updateTask(task.id, { status: e.target.value as ClientProjectTask['status'] })}
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <textarea
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm"
                    placeholder="Notes / highlight"
                    value={task.highlight || ''}
                    onChange={e => updateTask(task.id, { highlight: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </div>
          <TextAreaField label="Timeline JSON (array)" value={timelineInput} onChange={setTimelineInput} rows={4} />
        </div>
        <TextAreaField label="Updates JSON (array)" value={updatesInput} onChange={setUpdatesInput} rows={4} />
        <p className="text-xs text-gray-500 mb-4">Tasks are structured; other arrays can be pasted in JSON (see client portal schema).</p>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={closeModal} className="px-4 py-2 rounded-xl border border-slate-700 text-gray-300 hover:bg-slate-800">Cancel</button>
          <button
            onClick={save}
            disabled={isProcessing}
            className="px-5 py-2 rounded-xl bg-cindral-blue text-white font-semibold disabled:opacity-60"
          >
            {isProcessing ? 'Saving...' : 'Save Client Project'}
          </button>
        </div>
      </AdminModal>
    </>
  );
};
// Manage Projects
const ManageProjects = () => {
  const { projects, divisions, updateProject, addProject, deleteProject } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Project>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = (mode: 'create' | 'edit', proj?: Project) => {
    if (mode === 'edit' && proj) {
      setEditingId(proj.id);
      setEditForm(proj);
      setIsAdding(false);
    } else {
      setEditForm({
        id: `p${Date.now()}`,
        title: '',
        summary: '',
        content: '',
        year: new Date().getFullYear().toString(),
        images: [],
        divisionId: divisions[0]?.id || ''
      });
      setIsAdding(true);
      setEditingId(null);
    }
    setModalOpen(true);
  };

  const save = async () => {
    if (!editForm.title || !editForm.divisionId) return alert("Title and Division required");
    setIsProcessing(true);
    try {
      if (isAdding) {
        await addProject(editForm);
        setIsAdding(false);
      } else if (editingId) {
        await updateProject(editingId, editForm);
        setEditingId(null);
      }
      setModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Unable to save project.");
    } finally {
      setIsProcessing(false);
    }
  };

  const closeModal = () => {
    setIsAdding(false);
    setEditingId(null);
    setEditForm({});
    setModalOpen(false);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Projects</h2>
            <p className="text-sm text-gray-500">Curate hero case studies, client metadata, and imagery.</p>
          </div>
          <div className="flex items-center gap-3">
            <ViewToggle mode={viewMode} onChange={setViewMode} />
            <button onClick={() => openModal('create')} className="bg-cindral-blue px-4 py-2 rounded-lg text-white font-bold flex items-center hover:bg-blue-600 transition-colors">
              <Plus className="w-4 h-4 mr-2" /> Add Project
            </button>
          </div>
        </div>

        {viewMode === 'table' ? (
          <div className="overflow-hidden border border-slate-800 rounded-2xl">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-400">Project</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-400">Division</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-400">Year</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-400">Summary</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-slate-900/40 divide-y divide-slate-800">
                {projects.map(proj => {
                  const div = divisions.find(d => d.id === proj.divisionId);
                  return (
                    <tr key={proj.id}>
                      <td className="px-4 py-4 text-white font-semibold">{proj.title}</td>
                      <td className="px-4 py-4 text-gray-300">{div?.title || 'Unknown'}</td>
                      <td className="px-4 py-4 text-gray-400">{proj.year}</td>
                      <td className="px-4 py-4 text-gray-400">{proj.summary}</td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => openModal('edit', proj)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs hover:bg-blue-600">Edit</button>
                          <button
                            disabled={isProcessing}
                            onClick={async () => {
                              if (isProcessing) return;
                              if (confirm('Delete?')) {
                                setIsProcessing(true);
                                try {
                                  await deleteProject(proj.id);
                                } catch (error) {
                                  console.error(error);
                                  alert("Failed to delete project");
                                } finally {
                                  setIsProcessing(false);
                                }
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map(proj => {
              const div = divisions.find(d => d.id === proj.divisionId);
              return (
                <div key={proj.id} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-slate-500 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`text-xs uppercase tracking-wide font-semibold ${div?.color || 'text-gray-400'}`}>{div?.title || 'Unknown'}</p>
                      <h3 className="text-xl font-bold text-white mt-1">{proj.title}</h3>
                      {proj.client && <p className="text-xs text-gray-500 mt-1">Client: {proj.client}</p>}
                    </div>
                    <span className="text-sm text-gray-500">{proj.year}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-3 line-clamp-3">{proj.summary}</p>
                  <div className="flex items-center justify-end gap-2 mt-4">
                    <button onClick={() => openModal('edit', proj)} className="px-3 py-2 rounded-lg bg-slate-900 text-white text-xs hover:bg-blue-600 flex items-center">
                      <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                    </button>
                    <button
                      disabled={isProcessing}
                      onClick={async () => {
                        if (isProcessing) return;
                        if (confirm('Delete?')) {
                          setIsProcessing(true);
                          try {
                            await deleteProject(proj.id);
                          } catch (error) {
                            console.error(error);
                            alert("Failed to delete project");
                          } finally {
                            setIsProcessing(false);
                          }
                        }
                      }}
                      className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isAdding ? 'Create Project' : 'Edit Project'}
        description="Craft hero narratives, client context, and multimedia assets."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Title" value={editForm.title || ''} onChange={(v: string) => setEditForm({ ...editForm, title: v })} />
          <div>
            <label className="block text-gray-400 text-sm mb-1">Division</label>
            <select
              value={editForm.divisionId || ''}
              onChange={e => setEditForm({ ...editForm, divisionId: e.target.value })}
              className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white"
            >
              <option value="">Select Division</option>
              {divisions.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Client" value={editForm.client || ''} onChange={(v: string) => setEditForm({ ...editForm, client: v })} />
          <InputField label="Year" value={editForm.year || ''} onChange={(v: string) => setEditForm({ ...editForm, year: v })} />
        </div>
        <TextAreaField label="Summary" value={editForm.summary || ''} onChange={(v: string) => setEditForm({ ...editForm, summary: v })} rows={2} />
        <TextAreaField label="Full Content" value={editForm.content || ''} onChange={(v: string) => setEditForm({ ...editForm, content: v })} rows={5} />
        <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 mt-4">
          <h4 className="text-white font-bold mb-3">Project Imagery</h4>
          <InputField
            label="Banner Image URL"
            value={editForm.images?.[0] || ''}
            onChange={(v: string) => {
              const currentImages = editForm.images || [];
              const updated = [...currentImages];
              if (updated.length === 0) updated.push(v);
              else updated[0] = v;
              setEditForm({ ...editForm, images: updated });
            }}
            placeholder="https://example.com/hero.jpg"
          />
          {editForm.images?.[0] && (
            <div className="mt-3 h-32 rounded-xl overflow-hidden border border-slate-700">
              <img src={editForm.images[0]} alt="Banner Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <TextAreaField
            label="Gallery Images (comma separated)"
            value={editForm.images?.slice(1).join(', ') || ''}
            onChange={(v: string) => {
              const banner = editForm.images?.[0] || '';
              const rest = v.split(',').map(s => s.trim()).filter(Boolean);
              setEditForm({ ...editForm, images: banner ? [banner, ...rest] : rest });
            }}
            rows={3}
          />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={closeModal} className="px-4 py-2 rounded-xl border border-slate-700 text-gray-300 hover:bg-slate-800">Cancel</button>
          <button
            onClick={save}
            disabled={isProcessing}
            className="px-5 py-2 rounded-xl bg-cindral-blue text-white font-semibold disabled:opacity-60"
          >
            {isProcessing ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </AdminModal>
    </>
  );
};
// Manage Client Billing/Invoices
const ManageClientInvoices = () => {
  const { clientInvoices, projects, addClientInvoice, updateClientInvoice, deleteClientInvoice } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ClientInvoice>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = (mode: 'create' | 'edit', invoice?: ClientInvoice) => {
    if (mode === 'edit' && invoice) {
      setEditingId(invoice.id);
      setEditForm(invoice);
    } else {
      setEditingId(null);
      setEditForm({
        id: `inv_${Date.now()}`,
        projectId: projects[0]?.id || '',
        amount: 0,
        currency: 'USD',
        status: 'due',
        issuedOn: new Date().toISOString().slice(0, 10),
        dueOn: new Date().toISOString().slice(0, 10),
        description: '',
        downloadUrl: ''
      });
    }
    setModalOpen(true);
  };

  const save = async () => {
    if (!editForm.projectId || !editForm.amount || !editForm.currency || !editForm.issuedOn || !editForm.dueOn) {
      alert('Project, amount, currency, issued date, and due date are required');
      return;
    }
    setIsProcessing(true);
    try {
      const payload: Partial<ClientInvoice> = {
        ...editForm,
        amount: Number(editForm.amount)
      };
      if (editingId) {
        await updateClientInvoice(editingId, payload);
      } else {
        await addClientInvoice(payload);
      }
      setModalOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Client Billing</h2>
            <p className="text-sm text-gray-500">Invoices surfaced in the client portal.</p>
          </div>
          <button onClick={() => openModal('create')} className="bg-cindral-blue px-4 py-2 rounded-lg text-white font-bold flex items-center hover:bg-blue-600 transition-colors">
            <Plus className="w-4 h-4 mr-2" /> Add Invoice
          </button>
        </div>

        <div className="overflow-hidden border border-slate-800 rounded-2xl">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-400">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-400">Project</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-400">Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-400">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-400">Due</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-slate-900/40 divide-y divide-slate-800">
              {clientInvoices.map(inv => {
                const proj = projects.find(p => p.id === inv.projectId);
                return (
                  <tr key={inv.id}>
                    <td className="px-4 py-4 text-white font-semibold">{inv.id}</td>
                    <td className="px-4 py-4 text-gray-300">{proj?.title || inv.projectId}</td>
                    <td className="px-4 py-4 text-gray-300">{inv.amount} {inv.currency}</td>
                    <td className="px-4 py-4 text-gray-300 capitalize">{inv.status}</td>
                    <td className="px-4 py-4 text-gray-400">{inv.dueOn}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openModal('edit', inv)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs hover:bg-blue-600">Edit</button>
                        <button
                          disabled={isProcessing}
                          onClick={async () => {
                            if (isProcessing) return;
                            if (confirm('Delete invoice?')) {
                              setIsProcessing(true);
                              try {
                                await deleteClientInvoice(inv.id);
                              } catch (error) {
                                console.error(error);
                                alert('Failed to delete invoice');
                              } finally {
                                setIsProcessing(false);
                              }
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? 'Edit Invoice' : 'Create Invoice'}
        description="These invoices power the client portal billing view."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Project</label>
            <select
              value={editForm.projectId || ''}
              onChange={e => setEditForm({ ...editForm, projectId: e.target.value })}
              className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white"
            >
              <option value="">Select project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <InputField label="Description" value={editForm.description || ''} onChange={(v: string) => setEditForm({ ...editForm, description: v })} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField label="Amount" value={String(editForm.amount ?? '')} onChange={(v: string) => setEditForm({ ...editForm, amount: Number(v) })} />
          <InputField label="Currency" value={editForm.currency || 'USD'} onChange={(v: string) => setEditForm({ ...editForm, currency: v })} />
          <div>
            <label className="block text-gray-400 text-sm mb-1">Status</label>
            <select
              value={editForm.status || 'due'}
              onChange={e => setEditForm({ ...editForm, status: e.target.value as ClientInvoice['status'] })}
              className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white"
            >
              <option value="paid">Paid</option>
              <option value="due">Due</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Issued On (YYYY-MM-DD)" value={editForm.issuedOn || ''} onChange={(v: string) => setEditForm({ ...editForm, issuedOn: v })} />
          <InputField label="Due On (YYYY-MM-DD)" value={editForm.dueOn || ''} onChange={(v: string) => setEditForm({ ...editForm, dueOn: v })} />
        </div>
        <InputField label="Download URL" value={editForm.downloadUrl || ''} onChange={(v: string) => setEditForm({ ...editForm, downloadUrl: v })} />
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={closeModal} className="px-4 py-2 rounded-xl border border-slate-700 text-gray-300 hover:bg-slate-800">Cancel</button>
          <button
            onClick={save}
            disabled={isProcessing}
            className="px-5 py-2 rounded-xl bg-cindral-blue text-white font-semibold disabled:opacity-60"
          >
            {isProcessing ? 'Saving...' : 'Save Invoice'}
          </button>
        </div>
      </AdminModal>
    </>
  );
};

// Manage Client Users
const ManageClientUsers = () => {
  const { clientUsers, projects, addClientUser, updateClientUser, deleteClientUser } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ClientUser>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = (mode: 'create' | 'edit', user?: ClientUser) => {
    if (mode === 'edit' && user) {
      setEditingId(user.id);
      setEditForm(user);
    } else {
      setEditingId(null);
      setEditForm({
        id: `client_${Date.now()}`,
        name: '',
        email: '',
        company: '',
        role: 'viewer',
        allowedProjectIds: []
      });
    }
    setModalOpen(true);
  };

  const toggleProject = (projectId: string) => {
    const current = editForm.allowedProjectIds || [];
    if (current.includes(projectId)) {
      setEditForm({ ...editForm, allowedProjectIds: current.filter(id => id !== projectId) });
    } else {
      setEditForm({ ...editForm, allowedProjectIds: [...current, projectId] });
    }
  };

  const save = async () => {
    if (!editForm.name || !editForm.email) {
      alert('Name and email required');
      return;
    }
    setIsProcessing(true);
    try {
      if (editingId) {
        await updateClientUser(editingId, editForm);
      } else {
        await addClientUser(editForm);
      }
      setModalOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Client Users</h2>
            <p className="text-sm text-gray-500">Control who can view project dashboards.</p>
          </div>
          <button onClick={() => openModal('create')} className="bg-cindral-blue px-4 py-2 rounded-lg text-white font-bold flex items-center hover:bg-blue-600 transition-colors">
            <UserPlus className="w-4 h-4 mr-2" /> Add Client User
          </button>
        </div>

        <div className="overflow-hidden border border-slate-800 rounded-2xl">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-400">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-400">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-400">Role</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-400">Access</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-slate-900/40 divide-y divide-slate-800">
              {clientUsers.map(user => (
                <tr key={user.id}>
                  <td className="px-4 py-4 text-white font-semibold">{user.name}</td>
                  <td className="px-4 py-4 text-gray-300">{user.email}</td>
                  <td className="px-4 py-4 text-gray-300 capitalize">{user.role}</td>
                  <td className="px-4 py-4 text-gray-400">{user.allowedProjectIds.length} projects</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openModal('edit', user)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs hover:bg-blue-600">Edit</button>
                      <button
                        disabled={isProcessing}
                        onClick={async () => {
                          if (isProcessing) return;
                          if (confirm('Delete client user?')) {
                            setIsProcessing(true);
                            try {
                              await deleteClientUser(user.id);
                            } catch (error) {
                              console.error(error);
                              alert('Failed to delete user');
                            } finally {
                              setIsProcessing(false);
                            }
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? 'Edit Client User' : 'Create Client User'}
        description="Control project-level access for client stakeholders."
      >
        <InputField label="Full Name" value={editForm.name || ''} onChange={(v: string) => setEditForm({ ...editForm, name: v })} />
        <InputField label="Email" value={editForm.email || ''} onChange={(v: string) => setEditForm({ ...editForm, email: v })} />
        <InputField label="Company" value={editForm.company || ''} onChange={(v: string) => setEditForm({ ...editForm, company: v })} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Role</label>
            <select
              value={editForm.role || 'viewer'}
              onChange={e => setEditForm({ ...editForm, role: e.target.value as ClientUser['role'] })}
              className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white"
            >
              <option value="admin">Admin</option>
              <option value="member">Member</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-gray-400 text-sm mb-2">Allowed Projects</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto bg-slate-900 p-2 rounded border border-slate-600">
            {projects.map(p => (
              <label key={p.id} className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.allowedProjectIds?.includes(p.id) || false}
                  onChange={() => toggleProject(p.id)}
                  className="rounded border-gray-600 bg-slate-800 text-cindral-blue focus:ring-offset-slate-900"
                />
                <span>{p.title}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={closeModal} className="px-4 py-2 rounded-xl border border-slate-700 text-gray-300 hover:bg-slate-800">Cancel</button>
          <button
            onClick={save}
            disabled={isProcessing}
            className="px-5 py-2 rounded-xl bg-cindral-blue text-white font-semibold disabled:opacity-60"
          >
            {isProcessing ? 'Saving...' : 'Save Client User'}
          </button>
        </div>
      </AdminModal>
    </>
  );
};

// Manage Team
const ManageTeam = () => {
  const { team, projects, updateTeamMember, deleteTeamMember, addTeamMember } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<TeamMember>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = (mode: 'create' | 'edit', member?: TeamMember) => {
    if (mode === 'edit' && member) {
      setEditingId(member.id);
      setEditForm(member);
      setIsAdding(false);
    } else {
      setEditForm({
        id: `t${Date.now()}`,
        name: '',
        role: '',
        bio: '',
        image: 'https://i.pravatar.cc/300',
        skills: [],
        interests: [],
        projectIds: [],
        csrActivities: []
      });
      setIsAdding(true);
      setEditingId(null);
    }
    setModalOpen(true);
  };

  const save = async () => {
    if (!editForm.name || !editForm.role) return alert('Name and Role required');
    setIsProcessing(true);
    try {
      if (isAdding) {
        await addTeamMember(editForm);
        setIsAdding(false);
      } else if (editingId) {
        await updateTeamMember(editingId, editForm);
        setEditingId(null);
      }
      setModalOpen(false);
    } catch (error) {
      console.error(error);
      alert('Unable to save team member.');
    } finally {
      setIsProcessing(false);
    }
  };

  const closeModal = () => {
    setIsAdding(false);
    setEditingId(null);
    setEditForm({});
    setModalOpen(false);
  };

  const handleArrayInput = (field: 'skills' | 'interests' | 'csrActivities', val: string) => {
    const arr = val.split(',').map(s => s.trim()).filter(Boolean);
    setEditForm({ ...editForm, [field]: arr });
  };

  const toggleProject = (projId: string) => {
    const current = editForm.projectIds || [];
    if (current.includes(projId)) {
      setEditForm({ ...editForm, projectIds: current.filter(id => id !== projId) });
    } else {
      setEditForm({ ...editForm, projectIds: [...current, projId] });
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Team Members</h2>
            <p className="text-sm text-gray-500">Showcase the people, their roles, and spotlight stats.</p>
          </div>
          <div className="flex items-center gap-3">
            <ViewToggle mode={viewMode} onChange={setViewMode} />
            <button onClick={() => openModal('create')} className="bg-cindral-blue px-4 py-2 rounded-lg text-white font-bold flex items-center hover:bg-blue-600 transition-colors">
              <Plus className="w-4 h-4 mr-2" /> Add Member
            </button>
          </div>
        </div>

        {viewMode === 'table' ? (
          <div className="overflow-hidden border border-slate-800 rounded-2xl">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-400">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-400">Role</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-400">Projects</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-slate-900/40 divide-y divide-slate-800">
                {team.map(member => (
                  <tr key={member.id}>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-white">{member.name}</div>
                      <p className="text-xs text-gray-500">{member.id}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-300">{member.role}</td>
                    <td className="px-4 py-4 text-gray-400">{member.projectIds.length}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openModal('edit', member)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs hover:bg-blue-600">Edit</button>
                        <button
                          disabled={isProcessing}
                          onClick={async () => {
                            if (isProcessing) return;
                            if (confirm('Delete?')) {
                              setIsProcessing(true);
                              try {
                                await deleteTeamMember(member.id);
                              } catch (error) {
                                console.error(error);
                                alert('Failed to delete member');
                              } finally {
                                setIsProcessing(false);
                              }
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {team.map(member => (
              <div key={member.id} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 hover:border-slate-500 transition-colors">
                <div className="flex items-center gap-4">
                  <img src={member.image} alt={member.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-600" />
                  <div>
                    <h4 className="text-white font-semibold">{member.name}</h4>
                    <p className="text-sm text-gray-400">{member.role}</p>
                    <p className="text-xs text-gray-500">{member.projectIds.length} projects</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-3 line-clamp-2">{member.bio}</p>
                <div className="flex items-center justify-end gap-2 mt-4">
                  <button onClick={() => openModal('edit', member)} className="px-3 py-2 rounded-lg bg-slate-900 text-white text-xs hover:bg-blue-600 flex items-center">
                    <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                  </button>
                  <button
                    disabled={isProcessing}
                    onClick={async () => {
                      if (isProcessing) return;
                      if (confirm('Delete?')) {
                        setIsProcessing(true);
                        try {
                          await deleteTeamMember(member.id);
                        } catch (error) {
                          console.error(error);
                          alert('Failed to delete member');
                        } finally {
                          setIsProcessing(false);
                        }
                      }
                    }}
                    className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isAdding ? 'Create Team Member' : 'Edit Team Member'}
        description="Update bios, badges, and highlight stats."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Name" value={editForm.name || ''} onChange={(v: string) => setEditForm({ ...editForm, name: v })} />
          <InputField label="Role" value={editForm.role || ''} onChange={(v: string) => setEditForm({ ...editForm, role: v })} />
        </div>
        <TextAreaField label="Bio" value={editForm.bio || ''} onChange={(v: string) => setEditForm({ ...editForm, bio: v })} rows={3} />
        <InputField label="Image URL" value={editForm.image || ''} onChange={(v: string) => setEditForm({ ...editForm, image: v })} />
        <InputField label="Quote" value={editForm.quote || ''} onChange={(v: string) => setEditForm({ ...editForm, quote: v })} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Skills (Comma separated)</label>
            <input value={editForm.skills?.join(', ') || ''} onChange={e => handleArrayInput('skills', e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Interests (Comma separated)</label>
            <input value={editForm.interests?.join(', ') || ''} onChange={e => handleArrayInput('interests', e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-gray-400 text-sm mb-2">Associated Projects</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto bg-slate-900 p-2 rounded border border-slate-600">
            {projects.map(p => (
              <label key={p.id} className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.projectIds?.includes(p.id) || false}
                  onChange={() => toggleProject(p.id)}
                  className="rounded border-gray-600 bg-slate-800 text-cindral-blue focus:ring-offset-slate-900"
                />
                <span>{p.title}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={closeModal} className="px-4 py-2 rounded-xl border border-slate-700 text-gray-300 hover:bg-slate-800">Cancel</button>
          <button
            onClick={save}
            disabled={isProcessing}
            className="px-5 py-2 rounded-xl bg-cindral-blue text-white font-semibold disabled:opacity-60"
          >
            {isProcessing ? 'Saving...' : 'Save Member'}
          </button>
        </div>
      </AdminModal>
    </>
  );
};
// Manage Contact Submissions
const statusStyles: Record<ContactSubmissionStatus, string> = {
  new: 'bg-cyan-500/10 text-cyan-200 border border-cyan-500/30',
  in_progress: 'bg-amber-500/10 text-amber-200 border border-amber-500/30',
  responded: 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/30'
};

const statusLabel: Record<ContactSubmissionStatus, string> = {
  new: 'New',
  in_progress: 'In Progress',
  responded: 'Responded'
};

const ManageSubmissions = () => {
  const { contactSubmissions, updateSubmissionStatus, deleteContactSubmission } = useData();
  const [selectedId, setSelectedId] = useState<string | null>(contactSubmissions[0]?.id || null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!contactSubmissions.length) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !contactSubmissions.some(sub => sub.id === selectedId)) {
      setSelectedId(contactSubmissions[0].id);
    }
  }, [contactSubmissions, selectedId]);

  const sortedSubmissions = [...contactSubmissions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const selectedSubmission = sortedSubmissions.find(sub => sub.id === selectedId) || sortedSubmissions[0];

  if (!contactSubmissions.length) {
    return (
      <div className="bg-slate-800/60 border border-slate-700 rounded-3xl p-12 text-center">
        <MailOpen className="w-12 h-12 mx-auto text-cindral-blue mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No contact submissions yet</h3>
        <p className="text-gray-400">Messages sent through your contact form will show up here for your team to triage.</p>
      </div>
    );
  }

  const handleStatusUpdate = async (status: ContactSubmissionStatus) => {
    if (!selectedSubmission || isUpdating) return;
    setIsUpdating(true);
    try {
      await updateSubmissionStatus(selectedSubmission.id, status);
    } catch (error) {
      console.error(error);
      alert("Failed to update submission");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-slate-800/70 border border-slate-700 rounded-3xl p-4 max-h-[600px] overflow-y-auto">
        <h3 className="text-white font-semibold mb-4 flex items-center">
          <Mail className="w-4 h-4 mr-2 text-cindral-blue" /> Inbox
        </h3>
        <div className="space-y-3">
          {sortedSubmissions.map((submission) => (
            <button
              key={submission.id}
              onClick={() => setSelectedId(submission.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedSubmission?.id === submission.id ? 'border-cindral-blue bg-slate-900/60' : 'border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/70'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-white font-semibold text-sm">{submission.firstName} {submission.lastName}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${statusStyles[submission.status]}`}>
                  {statusLabel[submission.status]}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-2">{new Date(submission.createdAt).toLocaleString()}</p>
              <p className="text-sm text-gray-300 font-medium line-clamp-1">{submission.subject}</p>
              <p className="text-xs text-gray-500 line-clamp-2">{submission.message}</p>
            </button>
          ))}
        </div>
      </div>

      {selectedSubmission && (
        <div className="lg:col-span-2 bg-slate-800/70 border border-slate-700 rounded-3xl p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">From</p>
              <h3 className="text-2xl font-bold text-white">{selectedSubmission.firstName} {selectedSubmission.lastName}</h3>
              <p className="text-sm text-gray-400">{selectedSubmission.email}</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <button
                disabled={isUpdating}
                onClick={() => handleStatusUpdate('new')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border ${selectedSubmission.status === 'new' ? 'border-cindral-blue text-cindral-blue bg-cindral-blue/10' : 'border-slate-600 text-gray-300 hover:border-slate-500'} disabled:opacity-50`}
              >
                Mark New
              </button>
              <button
                disabled={isUpdating}
                onClick={() => handleStatusUpdate('in_progress')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center ${selectedSubmission.status === 'in_progress' ? 'border-amber-400 text-amber-300 bg-amber-400/10' : 'border-slate-600 text-gray-300 hover:border-slate-500'} disabled:opacity-50`}
              >
                <Clock3 className="w-4 h-4 mr-1" /> In Progress
              </button>
              <button
                disabled={isUpdating}
                onClick={() => handleStatusUpdate('responded')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center ${selectedSubmission.status === 'responded' ? 'border-emerald-400 text-emerald-300 bg-emerald-400/10' : 'border-slate-600 text-gray-300 hover:border-slate-500'} disabled:opacity-50`}
              >
                <CheckCircle2 className="w-4 h-4 mr-1" /> Responded
              </button>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-2xl border border-slate-700 p-5">
            <p className="text-xs text-gray-500 uppercase mb-2">Subject</p>
            <p className="text-lg text-white font-semibold">{selectedSubmission.subject}</p>
          </div>

          <div className="bg-slate-900/60 rounded-2xl border border-slate-700 p-5">
            <p className="text-xs text-gray-500 uppercase mb-2">Message</p>
            <p className="text-gray-100 leading-relaxed whitespace-pre-wrap">{selectedSubmission.message}</p>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Received on {new Date(selectedSubmission.createdAt).toLocaleString()}</span>
            <button
              disabled={isUpdating}
              onClick={async () => {
                if (isUpdating) return;
                if (window.confirm('Delete this submission?')) {
                  setIsUpdating(true);
                  try {
                    await deleteContactSubmission(selectedSubmission.id);
                  } catch (error) {
                    console.error(error);
                    alert("Failed to delete submission");
                  } finally {
                    setIsUpdating(false);
                  }
                }
              }}
              className="flex items-center text-red-400 hover:text-red-300 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 mr-1" /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Manage Data (JSON Import/Export)
const ManageData = () => {
  const { divisions, projects, team, contactSubmissions, clientProjects, clientInvoices, clientUsers, importData, resetData } = useData();
  const [busyAction, setBusyAction] = useState<'import' | 'reset' | null>(null);

  const handleExport = () => {
    const data = { divisions, projects, team, contactSubmissions, clientProjects, clientInvoices, clientUsers };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cindral_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!confirm("This will overwrite current data. Continue?")) return;
        setBusyAction('import');
        try {
          await importData(json);
          alert("Data imported successfully!");
        } catch (error) {
          console.error(error);
          alert("Failed to import data.");
        } finally {
          setBusyAction(null);
        }
      } catch (err) {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white mb-6">Data Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
          <Download className="w-8 h-8 text-blue-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Export Data</h3>
          <p className="text-gray-400 mb-6">Download a JSON backup of Divisions, Projects, Team, and contact submissions.</p>
          <button onClick={handleExport} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold transition-colors w-full">
            Download Backup
          </button>
        </div>

        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
          <Database className="w-8 h-8 text-green-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Import Data</h3>
          <p className="text-gray-400 mb-6">Restore data from a JSON backup file. This overwrites every entry on the server.</p>
          <label className={`block w-full text-center px-4 py-2 rounded-lg font-bold transition-colors ${busyAction === 'import' ? 'bg-slate-600 text-gray-400 cursor-not-allowed opacity-60' : 'bg-slate-700 hover:bg-slate-600 text-white cursor-pointer'}`}>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" disabled={busyAction === 'import'} />
            {busyAction === 'import' ? 'Importing...' : 'Select File to Import'}
          </label>
        </div>
      </div>

      <div className="bg-red-900/20 p-8 rounded-2xl border border-red-900/50 mt-8">
        <h3 className="text-xl font-bold text-red-500 mb-2">Danger Zone</h3>
        <p className="text-gray-400 mb-4">Reset all data to the initial factory settings (Demo Data).</p>
        <button
          disabled={busyAction === 'reset'}
          onClick={async () => {
            if (busyAction === 'reset') return;
            if (confirm("Reset to the original sample data?")) {
              setBusyAction('reset');
              try {
                await resetData();
                alert("Data reset successfully.");
              } catch (error) {
                console.error(error);
                alert("Failed to reset data.");
              } finally {
                setBusyAction(null);
              }
            }
          }}
          className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
        >
          {busyAction === 'reset' ? 'Resetting...' : 'Reset All Data'}
        </button>
      </div>
    </div>
  );
};

// Manage Initiatives
const ManageInitiatives = () => {
  const { initiatives, addInitiative, updateInitiative, deleteInitiative } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Initiative>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const openModal = (mode: 'create' | 'edit', init?: Initiative) => {
    if (mode === 'edit' && init) {
      setEditingId(init.id);
      setEditForm(JSON.parse(JSON.stringify(init))); // Deep copy
      setIsAdding(false);
    } else {
      setEditForm({
        id: `init_${Date.now()}`,
        title: '',
        description: '',
        fullContent: '',
        image: '',
        iconName: 'Heart',
        color: 'text-blue-400',
        bgHover: 'group-hover:bg-blue-500/20',
        textHover: 'group-hover:text-blue-400',
        stats: []
      });
      setIsAdding(true);
      setEditingId(null);
    }
    setModalOpen(true);
  };

  const addStat = () => {
    setEditForm(prev => ({
      ...prev,
      stats: [...(prev.stats || []), { label: '', value: 0 }]
    }));
  };

  const removeStat = (idx: number) => {
    setEditForm(prev => ({
      ...prev,
      stats: (prev.stats || []).filter((_, i) => i !== idx)
    }));
  };

  const updateStat = (idx: number, field: string, value: any) => {
    setEditForm(prev => {
      const newStats = [...(prev.stats || [])];
      newStats[idx] = { ...newStats[idx], [field]: value };
      return { ...prev, stats: newStats };
    });
  };

  const addGalleryImage = () => {
    setEditForm(prev => ({
      ...prev,
      // @ts-ignore
      gallery: [...(prev.gallery || []), '']
    }));
  };

  const updateGalleryImage = (index: number, value: string) => {
    // @ts-ignore
    const newGallery = [...(editForm.gallery || [])];
    newGallery[index] = value;
    setEditForm({ ...editForm, gallery: newGallery });
  };

  const removeGalleryImage = (index: number) => {
    // @ts-ignore
    const newGallery = [...(editForm.gallery || [])];
    newGallery.splice(index, 1);
    setEditForm({ ...editForm, gallery: newGallery });
  };

  const addMilestone = () => {
    setEditForm(prev => ({
      ...prev,
      // @ts-ignore
      milestones: [...(prev.milestones || []), { date: '', title: '', description: '', status: 'upcoming' }]
    }));
  };

  // @ts-ignore
  const updateMilestone = (index: number, field: keyof any, value: any) => {
    // @ts-ignore
    const newMilestones = [...(editForm.milestones || [])];
    // @ts-ignore
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setEditForm({ ...editForm, milestones: newMilestones });
  };

  const removeMilestone = (index: number) => {
    // @ts-ignore
    const newMilestones = [...(editForm.milestones || [])];
    newMilestones.splice(index, 1);
    setEditForm({ ...editForm, milestones: newMilestones });
  };

  const save = async () => {
    if (!editForm.title) {
      alert("Title required");
      return;
    }
    setIsProcessing(true);
    try {
      if (isAdding) {
        await addInitiative(editForm);
        setIsAdding(false);
      } else if (editingId) {
        await updateInitiative(editingId, editForm);
        setEditingId(null);
      }
      setModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Unable to save initiative.");
    } finally {
      setIsProcessing(false);
    }
  };

  const closeModal = () => {
    setIsAdding(false);
    setEditingId(null);
    setEditForm({});
    setModalOpen(false);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">CSR Initiatives</h2>
            <p className="text-sm text-gray-500">Manage social impact cards and their live statistics.</p>
          </div>
          <div className="flex items-center gap-3">
            <ViewToggle mode={viewMode} onChange={setViewMode} />
            <button onClick={() => openModal('create')} className="bg-cindral-blue px-4 py-2 rounded-lg text-white font-bold flex items-center hover:bg-blue-600 transition-colors">
              <Plus className="w-4 h-4 mr-2" /> Add Initiative
            </button>
          </div>
        </div>

        {viewMode === 'table' ? (
          <div className="overflow-hidden border border-slate-800 rounded-2xl bg-slate-900/50 backdrop-blur-sm">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-400">Initiative</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-400">Live Impact</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-400">Status</th>
                  <th className="px-6 py-4 text-right font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {initiatives.map(init => (
                  <tr key={init.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        {init.image && <img src={init.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-800" />}
                        <div>
                          <div className="font-bold text-white text-base">{init.title}</div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">{init.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {(init.stats || []).slice(0, 3).map((s, i) => (
                          <span key={i} className={`text-xs px-2 py-1 rounded border bg-slate-800 border-slate-700 text-slate-400`}>
                            {s.label}: {s.value}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openModal('edit', init)} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          disabled={isProcessing}
                          onClick={async () => {
                            if (isProcessing) return;
                            if (confirm('Are you sure you want to delete this initiative?')) {
                              setIsProcessing(true);
                              try {
                                await deleteInitiative(init.id);
                              } catch (error) {
                                console.error(error);
                              } finally {
                                setIsProcessing(false);
                              }
                            }
                          }}
                          className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initiatives.map((init, idx) => (
              <div key={idx} className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl overflow-hidden border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 flex flex-col h-full">
                {/* Card Header Image */}
                <div className="relative h-48 overflow-hidden bg-slate-950">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 opacity-90" />
                  {init.image ? (
                    <img src={init.image} alt={init.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600">
                      <Heart className="w-12 h-12 opacity-20" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 p-6 z-20">
                    <div className={`w-10 h-10 rounded-xl bg-slate-800/80 backdrop-blur border border-slate-700 flex items-center justify-center mb-3 text-blue-400 shadow-lg`}>
                      <Heart className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors leading-tight">{init.title}</h3>
                  </div>
                  {/* Actions Overlay */}
                  <div className="absolute top-4 right-4 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-[-10px] group-hover:translate-y-0 duration-300">
                    <button onClick={(e) => { e.preventDefault(); openModal('edit', init); }} className="p-2 bg-slate-900/90 backdrop-blur text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg border border-slate-700"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={async (e) => {
                      e.preventDefault();
                      if (confirm('Delete initiative?')) { await deleteInitiative(init.id); }
                    }} className="p-2 bg-slate-900/90 backdrop-blur text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors shadow-lg border border-slate-700"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="p-6 pt-2 flex flex-col flex-grow">
                  <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed mb-6 flex-grow border-b border-slate-800 pb-4">
                    {init.description || "No description provided."}
                  </p>

                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Live Impact</p>
                    {init.stats.slice(0, 3).map((s, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-950/30 p-2.5 rounded-lg border border-slate-800/50">
                        <span className="text-slate-400 text-xs font-medium truncate pr-2">{s.label}</span>
                        <span className="text-white font-mono text-sm font-bold flex items-center">
                          {s.value}
                        </span>
                      </div>
                    ))}
                    {(!init.stats || init.stats.length === 0) && (
                      <div className="text-xs text-slate-600 italic py-2">No stats configured yet.</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isAdding ? 'Create Initiative' : 'Edit Initiative'}
        description="Update CSR content, images, and live impact statistics."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Title" value={editForm.title || ''} onChange={(v: string) => setEditForm({ ...editForm, title: v })} />
          <div className="flex gap-2 items-end">
            <div className="flex-grow">
              <InputField label="Icon Name (Lucide)" value={editForm.iconName || ''} onChange={(v: string) => setEditForm({ ...editForm, iconName: v })} />
            </div>
            <div className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center mb-[2px]">
              {(() => {
                const name = editForm.iconName || '';
                const normalized = name.split(/[-_ ]/).map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join('');
                // @ts-ignore
                const Icon = LucideIcons[normalized] || LucideIcons[name] || LucideIcons.HelpCircle;
                return <Icon className="w-5 h-5 text-blue-400" />;
              })()}
            </div>
          </div>
        </div>
        <TextAreaField label="Short Description" value={editForm.description || ''} onChange={(v: string) => setEditForm({ ...editForm, description: v })} rows={2} />
        <InputField label="Cover Image URL" value={editForm.image || ''} onChange={(v: string) => setEditForm({ ...editForm, image: v })} />
        <TextAreaField label="Full Content (Markdown supported)" value={editForm.fullContent || ''} onChange={(v: string) => setEditForm({ ...editForm, fullContent: v })} rows={6} />

        <div className="border-t border-slate-800 pt-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-white">Impact Stats</h4>
            <button type="button" onClick={addStat} className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded-lg transition-colors border border-slate-600">
              + Add Row
            </button>
          </div>

          <div className="space-y-3">
            {(editForm.stats || []).map((stat, idx) => (
              <div key={idx} className="flex gap-2 items-start bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                <div className="flex-1 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      className="bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm w-full"
                      placeholder="Label (e.g. Trees Planted)"
                      value={stat.label}
                      onChange={(e) => updateStat(idx, 'label', e.target.value)}
                    />
                    <input
                      className="bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm w-full"
                      placeholder="Value (e.g. 5000)"
                      type="number"
                      value={stat.value || ''}
                      onChange={(e) => updateStat(idx, 'value', Number(e.target.value))}
                    />
                  </div>
                </div>
                <button onClick={() => removeStat(idx)} className="text-slate-500 hover:text-red-400 p-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {(!editForm.stats || editForm.stats.length === 0) && (
              <p className="text-center text-sm text-gray-600 py-4">No stats added yet.</p>
            )}
          </div>
        </div>

        {/* Gallery Section */}
        <div className="border-t border-slate-800 pt-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-white">Impact Gallery</h4>
            <button type="button" onClick={addGalleryImage} className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded-lg transition-colors border border-slate-600">
              + Add Image
            </button>
          </div>
          <div className="space-y-3">
            {/* @ts-ignore */}
            {(editForm.gallery || []).map((url, idx) => (
              <div key={idx} className="flex gap-2 items-center bg-slate-800/50 p-2 rounded-xl border border-slate-800">
                <img src={url || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded object-cover bg-slate-900" />
                <input
                  className="flex-grow bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm"
                  placeholder="Image URL"
                  value={url}
                  onChange={(e) => updateGalleryImage(idx, e.target.value)}
                />
                <button onClick={() => removeGalleryImage(idx)} className="text-slate-500 hover:text-red-400 p-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {/* @ts-ignore */}
            {(!editForm.gallery || editForm.gallery.length === 0) && (
              <p className="text-center text-sm text-gray-600 py-2">No gallery images added.</p>
            )}
          </div>
        </div>

        {/* Milestones Section */}
        <div className="border-t border-slate-800 pt-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-white">Milestones</h4>
            <button type="button" onClick={addMilestone} className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded-lg transition-colors border border-slate-600">
              + Add Milestone
            </button>
          </div>
          <div className="space-y-4">
            {/* @ts-ignore */}
            {(editForm.milestones || []).map((milestone, idx) => (
              <div key={idx} className="bg-slate-800/50 p-4 rounded-xl border border-slate-800 relative">
                <button onClick={() => removeMilestone(idx)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400 p-2">
                  <X className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <input
                    className="bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm"
                    placeholder="Date (e.g. March 2025)"
                    value={milestone.date}
                    onChange={(e) => updateMilestone(idx, 'date', e.target.value)}
                  />
                  <select
                    className="bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm"
                    value={milestone.status}
                    onChange={(e) => updateMilestone(idx, 'status', e.target.value)}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <input
                  className="bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm w-full mb-3"
                  placeholder="Title"
                  value={milestone.title}
                  onChange={(e) => updateMilestone(idx, 'title', e.target.value)}
                />
                <textarea
                  className="bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm w-full"
                  placeholder="Description"
                  rows={2}
                  value={milestone.description}
                  onChange={(e) => updateMilestone(idx, 'description', e.target.value)}
                />
              </div>
            ))}
            {/* @ts-ignore */}
            {(!editForm.milestones || editForm.milestones.length === 0) && (
              <p className="text-center text-sm text-gray-600 py-2">No milestones added.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-8 border-t border-slate-800 pt-6">
          <button onClick={closeModal} className="px-4 py-2 rounded-xl border border-slate-700 text-gray-300 hover:bg-slate-800">Cancel</button>
          <button
            onClick={save}
            disabled={isProcessing}
            className="px-5 py-2 rounded-xl bg-cindral-blue text-white font-semibold disabled:opacity-60"
          >
            {isProcessing ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </AdminModal>
    </>
  );
};

// Tab Button Component
const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${active ? 'bg-cindral-blue text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-white hover:bg-slate-800'}`}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </button>
);

// Main Admin Page
const AdminPage: React.FC = () => {
  const { isAuthenticated, logout, divisions, projects, team, contactSubmissions, clientProjects, clientInvoices, clientUsers, initiatives } = useData();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-slate-800/80 backdrop-blur rounded-3xl border border-slate-700 p-6 sticky top-24">
              <div className="mb-8 px-2">
                <h2 className="text-white font-bold text-xl">Admin Panel</h2>
                <p className="text-gray-500 text-sm">Cindral CMS</p>
              </div>

              <div className="space-y-2">
                <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={LayoutDashboard} label="Dashboard" />
                <TabButton active={activeTab === 'divisions'} onClick={() => setActiveTab('divisions')} icon={Layers} label="Divisions" />
                <TabButton active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} icon={Briefcase} label="Projects" />
                <TabButton active={activeTab === 'client-projects'} onClick={() => setActiveTab('client-projects')} icon={Link2} label="Client Projects" />
                <TabButton active={activeTab === 'client-billing'} onClick={() => setActiveTab('client-billing')} icon={CreditCard} label="Client Billing" />
                <TabButton active={activeTab === 'client-users'} onClick={() => setActiveTab('client-users')} icon={ShieldCheck} label="Client Users" />
                <TabButton active={activeTab === 'team'} onClick={() => setActiveTab('team')} icon={Users} label="Team Members" />
                <TabButton active={activeTab === 'contact'} onClick={() => setActiveTab('contact')} icon={Mail} label="Contact Requests" />
                <TabButton active={activeTab === 'initiatives'} onClick={() => setActiveTab('initiatives')} icon={Heart} label="CSR Initiatives" />
                <TabButton active={activeTab === 'data'} onClick={() => setActiveTab('data')} icon={Database} label="Data Management" />
              </div>

              <div className="mt-8 pt-6 border-t border-slate-700">
                <button onClick={logout} className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 text-sm font-medium flex items-center">
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-fade-in-up">
                <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                    <h3 className="text-gray-400 text-sm uppercase mb-2">Total Team</h3>
                    <p className="text-4xl font-bold text-white">{team.length}</p>
                  </div>
                  <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                    <h3 className="text-gray-400 text-sm uppercase mb-2">Projects</h3>
                    <p className="text-4xl font-bold text-white">{projects.length}</p>
                  </div>
                  <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                    <h3 className="text-gray-400 text-sm uppercase mb-2">Client Portal Projects</h3>
                    <p className="text-4xl font-bold text-white">{clientProjects.length}</p>
                  </div>
                  <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                    <h3 className="text-gray-400 text-sm uppercase mb-2">Contact Requests</h3>
                    <p className="text-4xl font-bold text-white">{contactSubmissions.length}</p>
                    <p className="text-xs text-cindral-blue mt-2">{contactSubmissions.filter(sub => sub.status === 'new').length} new</p>
                  </div>
                  <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                    <h3 className="text-gray-400 text-sm uppercase mb-2">Client Users</h3>
                    <p className="text-4xl font-bold text-white">{clientUsers.length}</p>
                  </div>
                </div>
                <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 text-gray-400">
                  <p className="text-lg mb-4">Welcome back.</p>
                  <p>Select a category from the sidebar to create, update, or delete content. Changes are instantly synced with the secure admin API.</p>
                </div>
              </div>
            )}
            {activeTab === 'divisions' && <ManageDivisions />}
            {activeTab === 'projects' && <ManageProjects />}
            {activeTab === 'client-projects' && <ManageClientProjects />}
            {activeTab === 'client-billing' && <ManageClientInvoices />}
            {activeTab === 'client-users' && <ManageClientUsers />}
            {activeTab === 'team' && <ManageTeam />}
            {activeTab === 'initiatives' && <ManageInitiatives />}
            {activeTab === 'contact' && <ManageSubmissions />}
            {activeTab === 'data' && <ManageData />}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminPage;
