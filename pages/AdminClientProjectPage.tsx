import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Navigate, Link } from 'react-router-dom';
import { ArrowUpLeft, ArrowUpRight, Users, Link2, MessageSquare, CreditCard, ShieldCheck, Plus, Trash2, X, CalendarClock, ClipboardCopy } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { ClientProject, ClientProjectTask } from '../types';

const statusBadge: Record<ClientProject['status'], string> = {
  'On Track': 'bg-cyan-500/10 border-cyan-400/40 text-cyan-200',
  'At Risk': 'bg-amber-500/10 border-amber-400/40 text-amber-200',
  Behind: 'bg-rose-500/10 border-rose-400/40 text-rose-200'
};

const healthBadge: Record<ClientProject['health'], string> = {
  green: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200',
  amber: 'bg-amber-500/10 border-amber-500/40 text-amber-200',
  red: 'bg-rose-500/10 border-rose-500/40 text-rose-200'
};

const boardColumns: { key: ClientProjectTask['status']; label: string; accent: string; empty: string }[] = [
  { key: 'todo', label: 'To Do', accent: 'border-slate-600 text-gray-200', empty: 'text-gray-400' },
  { key: 'in_progress', label: 'In Progress', accent: 'border-blue-400/60 text-blue-200', empty: 'text-blue-200/70' },
  { key: 'done', label: 'Done', accent: 'border-emerald-400/60 text-emerald-200', empty: 'text-emerald-200/70' },
  { key: 'cancelled', label: 'Cancelled', accent: 'border-rose-400/60 text-rose-200', empty: 'text-rose-200/70' }
];

const calculateProgressFromTasks = (tasks: ClientProjectTask[] = []) => {
  const actionable = tasks.filter(t => t.status !== 'cancelled');
  if (!actionable.length) return 0;
  const done = actionable.filter(t => t.status === 'done').length;
  return Math.round((done / actionable.length) * 100);
};

const formatCurrency = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount);
  } catch {
    return `$${amount}`;
  }
};

const formatDateLabel = (value?: string | null) => {
  if (!value) return 'Not set';
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const AdminClientProjectPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clientProjects, projects, team, clientInvoices, updateClientProject, deleteClientProject, isAuthenticated } = useData();

  const project = useMemo(() => clientProjects.find(p => p.id === id) || null, [clientProjects, id]);
  const [tasks, setTasks] = useState<ClientProjectTask[]>(project?.tasks || []);
  const [newTask, setNewTask] = useState<{ title: string; owner: string; dueDate: string; status: ClientProjectTask['status']; highlight: string }>({
    title: '',
    owner: '',
    dueDate: '',
    status: 'todo',
    highlight: ''
  });
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ClientProject>>(project || {});
  const [newTimeline, setNewTimeline] = useState({ label: '', date: '', status: 'active', description: '' });
  const [editingTimelineId, setEditingTimelineId] = useState<string | null>(null);
  const [timelineDraft, setTimelineDraft] = useState({ label: '', date: '', status: 'active', description: '' });
  const [newLink, setNewLink] = useState({ label: '', url: '', type: 'doc', description: '' });
  const [newUpdate, setNewUpdate] = useState({ title: '', summary: '', author: '', date: new Date().toISOString().slice(0, 10), type: 'note' as const });
  const [meetingInfo, setMeetingInfo] = useState<{ title: string; date: string; time: string; note: string; meetUrl?: string; status?: string }>({
    title: 'Project Sync',
    date: '',
    time: '',
    note: ''
  });
  const [meetingDateTime, setMeetingDateTime] = useState<string>(() => {
    const nextHour = new Date();
    nextHour.setMinutes(0, 0, 0);
    nextHour.setHours(nextHour.getHours() + 1);
    return nextHour.toISOString().slice(0, 16);
  });
  const [selectedMember, setSelectedMember] = useState<string>('');

  useEffect(() => {
    if (project) {
      setTasks(project.tasks || []);
      setEditForm(project);
    }
  }, [project]);

  useEffect(() => {
    if (meetingDateTime) {
      handleDateTimeChange(meetingDateTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-4">
        <div className="max-w-md text-center space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Client Project</p>
          <h1 className="text-3xl font-bold">Project not found</h1>
          <p className="text-gray-400">Return to the client projects list and try again.</p>
          <Link to="/admin" className="inline-flex items-center px-4 py-2 rounded-lg bg-cindral-blue text-white font-semibold hover:bg-blue-600">
            <ArrowUpLeft className="w-4 h-4 mr-2" /> Back to Admin
          </Link>
        </div>
      </div>
    );
  }

  const linkedProject = projects.find(p => p.id === project.projectId);
  const invoicesForProject = clientInvoices.filter(inv => inv.projectId === project.projectId);
  const progress = calculateProgressFromTasks(tasks);
  const totalTasks = tasks.length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const cancelled = tasks.filter(t => t.status === 'cancelled').length;
  const done = tasks.filter(t => t.status === 'done').length;
  const today = new Date();
  const msDay = 1000 * 60 * 60 * 24;
  const parsedEnd = project.endDate ? new Date(project.endDate) : null;
  const parsedStart = project.startDate ? new Date(project.startDate) : null;
  const endDate = parsedEnd && !isNaN(parsedEnd.getTime()) ? parsedEnd : null;
  const startDate = parsedStart && !isNaN(parsedStart.getTime()) ? parsedStart : null;
  const daysRemaining = endDate ? Math.ceil((endDate.getTime() - today.getTime()) / msDay) : null;
  const derivedStatus: ClientProject['status'] = endDate
    ? progress >= 95
      ? 'On Track'
      : daysRemaining !== null && daysRemaining < 0
        ? 'Behind'
        : daysRemaining !== null && daysRemaining <= 3
          ? 'At Risk'
          : 'On Track'
    : project.status;
  const derivedHealth: ClientProject['health'] =
    derivedStatus === 'Behind'
      ? 'red'
      : derivedStatus === 'At Risk'
        ? 'amber'
        : 'green';

  const persistUpdate = async (payload: Partial<ClientProject>) => {
    setIsSaving(true);
    try {
      await updateClientProject(project.id, payload);
    } catch (err) {
      console.error(err);
      alert('Unable to update project right now.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateTasksInline = async (updater: (prev: ClientProjectTask[]) => ClientProjectTask[]) => {
    const updated = updater(tasks);
    setTasks(updated);
    const nextProgress = calculateProgressFromTasks(updated);
    await persistUpdate({ tasks: updated, progress: nextProgress });
  };

  const handleTaskStatusChange = async (taskId: string, status: ClientProjectTask['status']) => {
    await updateTasksInline(prev => prev.map(task => (task.id === taskId ? { ...task, status } : task)));
  };

  const handleInlineTaskRemoval = async (taskId: string) => {
    await updateTasksInline(prev => prev.filter(task => task.id !== taskId));
  };

  const handleInlineTaskEdit = async (taskId: string, patch: Partial<ClientProjectTask>) => {
    await updateTasksInline(prev => prev.map(task => (task.id === taskId ? { ...task, ...patch } : task)));
  };

  const addInlineTask = async () => {
    if (!newTask.title.trim()) return;
    await updateTasksInline(prev => [...prev, { id: `task_${Date.now()}`, ...newTask }]);
    setNewTask({ title: '', owner: '', dueDate: '', status: 'todo', highlight: '' });
  };

  const toggleMemberAssignment = async (memberId: string) => {
    const current = project.team || [];
    const updatedTeam = current.includes(memberId) ? current.filter(id => id !== memberId) : [...current, memberId];
    await persistUpdate({ team: updatedTeam });
  };

  const addTimelineItem = async () => {
    if (!newTimeline.label.trim() || !newTimeline.date.trim()) return;
    const timeline = [...(project.timeline || []), { id: `tl_${Date.now()}`, ...newTimeline }];
    await persistUpdate({ timeline });
    setNewTimeline({ label: '', date: '', status: 'active', description: '' });
  };

  const removeTimelineItem = async (id: string) => {
    await persistUpdate({ timeline: (project.timeline || []).filter(item => item.id !== id) });
  };

  const startTimelineEdit = (id: string) => {
    const existing = (project.timeline || []).find(item => item.id === id);
    if (!existing) return;
    setEditingTimelineId(id);
    setTimelineDraft({ label: existing.label, date: existing.date, status: existing.status || 'active', description: existing.description || '' });
  };

  const saveTimelineEdit = async () => {
    if (!editingTimelineId) return;
    const timeline = (project.timeline || []).map(item =>
      item.id === editingTimelineId ? { ...item, ...timelineDraft } : item
    );
    await persistUpdate({ timeline });
    setEditingTimelineId(null);
  };

  const cancelTimelineEdit = () => {
    setEditingTimelineId(null);
  };

  const addLinkItem = async () => {
    if (!newLink.label.trim() || !newLink.url.trim()) return;
    const links = [...(project.links || []), { id: `link_${Date.now()}`, ...newLink }];
    await persistUpdate({ links });
    setNewLink({ label: '', url: '', type: 'doc', description: '' });
  };

  const removeLinkItem = async (id: string) => {
    await persistUpdate({ links: (project.links || []).filter(link => link.id !== id) });
  };

  const addUpdateItem = async () => {
    if (!newUpdate.title.trim()) return;
    const updates = [...(project.updates || []), { id: `upd_${Date.now()}`, ...newUpdate }];
    await persistUpdate({ updates });
    setNewUpdate({ title: '', summary: '', author: '', date: new Date().toISOString().slice(0, 10), type: 'note' });
  };

  const removeUpdateItem = async (id: string) => {
    await persistUpdate({ updates: (project.updates || []).filter(update => update.id !== id) });
  };

  const handleDateTimeChange = (value: string) => {
    setMeetingDateTime(value);
    const date = value.slice(0, 10);
    const time = value.slice(11, 16);
    if (date && time) {
      setMeetingInfo(prev => ({ ...prev, date, time }));
    }
  };

  const setupMeeting = async () => {
    if (!meetingInfo.title.trim() || !meetingDateTime) {
      alert('Provide title, date, and time');
      return;
    }
    const note = meetingInfo.note?.trim();
    // Use the official meet launcher so the link is always valid; users must be signed in to Google.
    const url = 'https://meet.google.com/new';
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener');
    }
    setMeetingInfo(prev => ({
      ...prev,
      meetUrl: url,
      status: note
        ? `${note} — Meet link created. Opens a new Meet tab; share to add to calendars.`
        : 'Meet link created. Opens a new Meet tab; share to add to calendars.'
    }));
    await persistUpdate({
      updates: [
        ...(project.updates || []),
        {
          id: `meet_${Date.now()}`,
          title: `Meeting: ${meetingInfo.title}`,
          summary: `Scheduled on ${meetingInfo.date} at ${meetingInfo.time}. Meet: ${url}${note ? ` — Note: ${note}` : ''}`,
          author: 'Admin',
          date: meetingInfo.date,
          type: 'note'
        }
      ],
      links: [
        ...(project.links || []),
        {
          id: `link_meet_${Date.now()}`,
          label: `Meet — ${meetingInfo.title}`,
          url,
          type: 'meeting',
          description: `Scheduled ${meetingInfo.date} ${meetingInfo.time}`
        }
      ]
    });
  };

  const handleEditSave = async () => {
    setIsSaving(true);
    try {
      await updateClientProject(project.id, {
        ...editForm,
        progress,
        tasks
      });
      setEditOpen(false);
    } catch (err) {
      console.error(err);
      alert('Unable to update project.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-2 rounded-lg border border-slate-800 text-gray-200 hover:border-cindral-blue hover:text-white"
            >
              ← Back
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Project Page</p>
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <p className="text-sm text-gray-400">
                Linked case study: {linkedProject ? linkedProject.title : project.projectId || 'Not linked'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs border font-semibold ${healthBadge[derivedHealth]}`}>{derivedHealth} health</span>
            <span className={`px-3 py-1 rounded-full text-xs border font-semibold ${statusBadge[derivedStatus]}`}>{derivedStatus}</span>
            <button onClick={() => setEditOpen(true)} className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm hover:bg-blue-600">Edit</button>
            <button onClick={() => navigate('/admin')} className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm hover:bg-blue-600">Admin</button>
            <button
              onClick={async () => {
                if (confirm('Delete this client project?')) {
                  await deleteClientProject(project.id);
                  navigate('/admin');
                }
              }}
              disabled={isSaving}
              className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-widest">Progress</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-3xl font-bold text-white">{progress}%</p>
              <div className="text-xs text-gray-400">{tasks.filter(t => t.status !== 'cancelled').length} active tasks</div>
            </div>
            <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-600" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
            <p className="text-xs text-gray-500 uppercase tracking-widest">Timeline</p>
            <p className="text-white font-semibold mt-1 text-sm">
              {formatDateLabel(project.startDate)} → {formatDateLabel(project.endDate)}
            </p>
            <p className="text-xs text-gray-400">
              {daysRemaining !== null
                ? daysRemaining >= 0
                  ? `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining`
                  : `${Math.abs(daysRemaining)} day${Math.abs(daysRemaining) === 1 ? '' : 's'} overdue`
                : 'Set an end date to track risk'}
            </p>
            <p className="text-xs text-gray-500">Next: {project.nextMilestone || 'TBD'}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 uppercase tracking-widest">Status</p>
              <span className={`px-2 py-1 rounded-full text-[11px] border font-semibold ${statusBadge[derivedStatus]}`}>{derivedStatus}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-300">
              <span className={`px-2 py-1 rounded-full border ${healthBadge[derivedHealth]}`}>{derivedHealth} health</span>
              {daysRemaining !== null && (
                <span className="px-2 py-1 rounded-full bg-slate-800 border border-slate-700">
                  {daysRemaining >= 0 ? `${daysRemaining}d left` : `${Math.abs(daysRemaining)}d over`}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">Done: {done} · In Progress: {inProgress} · Cancelled: {cancelled}</p>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl shadow-cindral-blue/5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500">Kanban</p>
              <h4 className="text-lg font-semibold text-white">Task board</h4>
              <p className="text-xs text-gray-500">Drag cards to change status. Progress updates instantly.</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="px-2 py-1 rounded-full bg-slate-800 border border-slate-700">{totalTasks} tasks</span>
              <span className="px-2 py-1 rounded-full bg-slate-800 border border-slate-700">{inProgress} in progress</span>
              <span className="px-2 py-1 rounded-full bg-slate-800 border border-slate-700">{cancelled} cancelled</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            <input
              className="col-span-2 bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white"
              placeholder="Task title"
              value={newTask.title}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
            />
            <input
              className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white"
              placeholder="Owner"
              value={newTask.owner}
              onChange={e => setNewTask({ ...newTask, owner: e.target.value })}
            />
            <input
              type="date"
              className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white"
              value={newTask.dueDate}
              onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
            <div className="flex gap-2">
              <select
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white"
                value={newTask.status}
                onChange={e => setNewTask({ ...newTask, status: e.target.value as ClientProjectTask['status'] })}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={addInlineTask}
                disabled={isSaving}
                className="px-3 py-2 rounded-lg bg-cindral-blue text-white text-xs font-semibold hover:bg-blue-600 disabled:opacity-60"
              >
                Add
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {boardColumns.map(column => {
              const columnTasks = tasks.filter(t => t.status === column.key);
              const isDropTarget = draggingTaskId !== null;
              return (
                <div
                  key={column.key}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (!draggingTaskId) return;
                    handleTaskStatusChange(draggingTaskId, column.key);
                    setDraggingTaskId(null);
                  }}
                  className={`bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3 transition-all ${isDropTarget ? 'ring-1 ring-cindral-blue/30' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full border ${column.accent}`}>{column.label}</span>
                    <span className="text-xs text-gray-400">{columnTasks.length}</span>
                  </div>
                  <div className="space-y-3 min-h-[140px]">
                    {!columnTasks.length && <p className={`text-xs ${column.empty}`}>Drop cards here to set to “{column.label}”.</p>}
                    {columnTasks.map(task => (
                      <div
                        key={task.id}
                        draggable={!isSaving}
                        onDragStart={() => setDraggingTaskId(task.id)}
                        onDragEnd={() => setDraggingTaskId(null)}
                        className={`p-3 rounded-lg border border-slate-700 bg-slate-950/60 space-y-2 shadow-sm transition-all ${draggingTaskId === task.id ? 'border-cindral-blue/60 shadow-cindral-blue/10' : ''}`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-semibold text-white">{task.title}</p>
                            <p className="text-xs text-gray-500">{task.owner || 'Unassigned'}</p>
                          </div>
                          <button
                            onClick={() => handleInlineTaskRemoval(task.id)}
                            className="text-xs text-red-400 hover:text-red-300"
                            disabled={isSaving}
                          >
                            Remove
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-gray-400">
                          <span>Due {task.dueDate || 'TBD'}</span>
                          <span className={`px-2 py-1 rounded-full border ${column.accent}`}>{column.label}</span>
                        </div>
                        {task.highlight && <p className="text-xs text-gray-300">{task.highlight}</p>}
                        <div className="flex flex-wrap gap-2 text-[11px]">
                          {column.key !== 'todo' && (
                            <button
                              onClick={() => handleTaskStatusChange(task.id, 'todo')}
                              disabled={isSaving}
                              className="px-2 py-1 rounded-md bg-slate-800 text-gray-200 border border-slate-600"
                            >
                              To Do
                            </button>
                          )}
                          {column.key !== 'in_progress' && (
                            <button
                              onClick={() => handleTaskStatusChange(task.id, 'in_progress')}
                              disabled={isSaving}
                              className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-200 border border-blue-500/30"
                            >
                              In Progress
                            </button>
                          )}
                          {column.key !== 'done' && (
                            <button
                              onClick={() => handleTaskStatusChange(task.id, 'done')}
                              disabled={isSaving}
                              className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-200 border border-emerald-500/30"
                            >
                              Done
                            </button>
                          )}
                          {column.key !== 'cancelled' && (
                            <button
                              onClick={() => handleTaskStatusChange(task.id, 'cancelled')}
                              disabled={isSaving}
                              className="px-2 py-1 rounded-md bg-rose-500/10 text-rose-200 border border-rose-500/30"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            onClick={() => handleInlineTaskEdit(task.id, { highlight: task.highlight || 'Updated' })}
                            disabled={isSaving}
                            className="px-2 py-1 rounded-md border border-slate-700 text-gray-300 hover:border-slate-500"
                          >
                            Note
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500">Meetings</p>
              <h4 className="text-lg font-semibold text-white">Set up a live sync</h4>
              <p className="text-sm text-gray-400">Generate a Google Meet, notify everyone via updates, and drop it into calendars.</p>
            </div>
            <CalendarClock className="w-5 h-5 text-cindral-blue" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
              placeholder="Meeting title"
              value={meetingInfo.title}
              onChange={e => setMeetingInfo({ ...meetingInfo, title: e.target.value })}
            />
            <input
              type="datetime-local"
              className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
              value={meetingDateTime}
              min={new Date().toISOString().slice(0, 16)}
              onChange={e => handleDateTimeChange(e.target.value)}
            />
            <input
              className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
              placeholder="Agenda / note"
              value={meetingInfo.note}
              onChange={e => setMeetingInfo({ ...meetingInfo, note: e.target.value })}
            />
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] text-gray-400">
            <button
              className="px-3 py-1 rounded-lg border border-slate-800 bg-slate-900 hover:border-cindral-blue"
              onClick={() => {
                const now = new Date();
                now.setMinutes(now.getMinutes() + 30);
                const val = now.toISOString().slice(0, 16);
                handleDateTimeChange(val);
              }}
            >
              +30 min
            </button>
            <button
              className="px-3 py-1 rounded-lg border border-slate-800 bg-slate-900 hover:border-cindral-blue"
              onClick={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(10, 0, 0, 0);
                const val = tomorrow.toISOString().slice(0, 16);
                handleDateTimeChange(val);
              }}
            >
              Tomorrow 10:00
            </button>
            <span className="px-2 py-1">Adds a Meet link to updates and links so teams can calendar it.</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-xs text-gray-400">
              We also add the Meet to the Links section for easy access.
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={setupMeeting}
                className="px-4 py-2 rounded-lg bg-cindral-blue text-white text-sm font-semibold hover:bg-blue-600 disabled:opacity-60"
                disabled={isSaving}
              >
                Create Meet & notify
              </button>
              {meetingInfo.meetUrl && (
                <>
                  <a
                    href={meetingInfo.meetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 text-xs text-gray-200 hover:border-cindral-blue"
                  >
                    Launch Meet
                  </a>
                  <button
                    onClick={async () => {
                      if (!meetingInfo.meetUrl) return;
                      try {
                        await navigator.clipboard.writeText(meetingInfo.meetUrl);
                      } catch {
                        alert('Copy failed, please copy manually.');
                      }
                    }}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 text-xs text-gray-200 hover:border-cindral-blue"
                  >
                    <ClipboardCopy className="w-4 h-4" />
                    Copy link
                  </button>
                </>
              )}
            </div>
          </div>
          {meetingInfo.meetUrl && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">{meetingInfo.title}</p>
                <p className="text-xs text-gray-400">Meet launcher: {meetingInfo.meetUrl}</p>
                <p className="text-xs text-gray-500">
                  Scheduled {meetingInfo.date} at {meetingInfo.time}. Added to project updates for calendar invites.
                </p>
                {meetingInfo.status && <p className="text-[11px] text-gray-400 mt-1">{meetingInfo.status}</p>}
              </div>
              <a
                href={meetingInfo.meetUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-lg bg-slate-800 text-white text-xs border border-slate-700 hover:border-cindral-blue"
              >
                Open Meet
              </a>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500">Timeline</p>
                <h4 className="text-lg font-semibold text-white">Milestones</h4>
              </div>
              <span className="text-xs text-gray-400">{project.timeline?.length || 0} checkpoints</span>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <input
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                  placeholder="Milestone label"
                  value={newTimeline.label}
                  onChange={e => setNewTimeline({ ...newTimeline, label: e.target.value })}
                />
                <input
                  type="date"
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                  value={newTimeline.date}
                  onChange={e => setNewTimeline({ ...newTimeline, date: e.target.value })}
                />
                <select
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                  value={newTimeline.status}
                  onChange={e => setNewTimeline({ ...newTimeline, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="complete">Complete</option>
                  <option value="paused">Paused</option>
                </select>
                <input
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                  placeholder="Description / owner"
                  value={newTimeline.description}
                  onChange={e => setNewTimeline({ ...newTimeline, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={addTimelineItem}
                  className="px-3 py-2 rounded-lg bg-cindral-blue text-white text-xs font-semibold hover:bg-blue-600 disabled:opacity-60"
                  disabled={isSaving}
                >
                  Add milestone
                </button>
              </div>
              {(project.timeline || []).map(item => {
                const isEditing = editingTimelineId === item.id;
                return (
                  <div key={item.id} className="flex flex-col gap-3 rounded-lg border border-slate-800 bg-slate-950/50 p-3">
                    {isEditing ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                          <input
                            className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                            value={timelineDraft.label}
                            onChange={e => setTimelineDraft({ ...timelineDraft, label: e.target.value })}
                          />
                          <input
                            type="date"
                            className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                            value={timelineDraft.date}
                            onChange={e => setTimelineDraft({ ...timelineDraft, date: e.target.value })}
                          />
                          <select
                            className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                            value={timelineDraft.status}
                            onChange={e => setTimelineDraft({ ...timelineDraft, status: e.target.value })}
                          >
                            <option value="active">Active</option>
                            <option value="complete">Complete</option>
                            <option value="paused">Paused</option>
                          </select>
                          <input
                            className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                            placeholder="Description"
                            value={timelineDraft.description}
                            onChange={e => setTimelineDraft({ ...timelineDraft, description: e.target.value })}
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={cancelTimelineEdit}
                            className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-gray-300 hover:border-slate-500"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={saveTimelineEdit}
                            className="px-3 py-1.5 rounded-lg bg-cindral-blue text-white text-xs font-semibold hover:bg-blue-600 disabled:opacity-60"
                            disabled={isSaving}
                          >
                            Save
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">{item.label}</p>
                          <p className="text-xs text-gray-500">{item.description || 'No notes yet'}</p>
                        </div>
                        <div className="flex items-center gap-3 sm:text-right">
                          <div className="text-right">
                            <p className="text-xs text-gray-400">{item.date}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${item.status === 'complete' ? 'bg-emerald-500/10 text-emerald-200 border-emerald-500/40' : item.status === 'active' ? 'bg-blue-500/10 text-blue-200 border-blue-500/40' : 'bg-slate-800 text-gray-300 border-slate-700'}`}>
                              {item.status}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => startTimelineEdit(item.id)}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 text-gray-200 text-xs border border-slate-700 hover:border-cindral-blue hover:text-white"
                              disabled={isSaving}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => removeTimelineItem(item.id)}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-500/10 text-rose-200 text-xs border border-rose-500/30 hover:bg-rose-500/20"
                              disabled={isSaving}
                            >
                              <Trash2 className="w-3 h-3" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {!project.timeline?.length && <p className="text-sm text-gray-500">No milestones yet. Add them above to keep the cadence clear.</p>}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500">Updates & Links</p>
                <h4 className="text-lg font-semibold text-white">Pulse</h4>
              </div>
              <Link2 className="w-4 h-4 text-cindral-blue" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-semibold text-white">Project updates</h5>
                <span className="text-xs text-gray-500">{project.updates?.length || 0} notes</span>
              </div>
              <div className="space-y-2">
                {(project.updates || []).map(update => (
                  <div key={update.id} className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{update.title}</p>
                        <p className="text-xs text-gray-500">{update.date} · {update.author || '—'}</p>
                      </div>
                      <button
                        onClick={() => removeUpdateItem(update.id)}
                        className="text-[11px] text-rose-200 px-2 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20"
                        disabled={isSaving}
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-xs text-gray-300 mt-1">{update.summary}</p>
                    <span className="inline-block mt-2 text-[10px] px-2 py-1 rounded-full border border-slate-700 text-gray-400 uppercase tracking-wide">
                      {update.type}
                    </span>
                  </div>
                ))}
                {!project.updates?.length && <p className="text-sm text-gray-500">No updates yet.</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                  placeholder="Title"
                  value={newUpdate.title}
                  onChange={e => setNewUpdate({ ...newUpdate, title: e.target.value })}
                />
                <input
                  type="date"
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                  value={newUpdate.date}
                  onChange={e => setNewUpdate({ ...newUpdate, date: e.target.value })}
                />
                <input
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                  placeholder="Author"
                  value={newUpdate.author}
                  onChange={e => setNewUpdate({ ...newUpdate, author: e.target.value })}
                />
                <select
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                  value={newUpdate.type}
                  onChange={e => setNewUpdate({ ...newUpdate, type: e.target.value as typeof newUpdate.type })}
                >
                  <option value="note">Note</option>
                  <option value="risk">Risk</option>
                  <option value="decision">Decision</option>
                  <option value="celebration">Celebration</option>
                </select>
              </div>
              <textarea
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                rows={3}
                placeholder="Summary / what changed"
                value={newUpdate.summary}
                onChange={e => setNewUpdate({ ...newUpdate, summary: e.target.value })}
              />
              <div className="flex justify-end">
                <button
                  onClick={addUpdateItem}
                  className="px-3 py-2 rounded-lg bg-cindral-blue text-white text-xs font-semibold hover:bg-blue-600 disabled:opacity-60"
                  disabled={isSaving}
                >
                  Post update
                </button>
              </div>
            </div>

            <div className="space-y-3 border-t border-slate-800 pt-4">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-semibold text-white">Links & references</h5>
                <span className="text-xs text-gray-500">{project.links?.length || 0} links</span>
              </div>
              <div className="space-y-2">
                {(project.links || []).map(link => (
                  <div key={link.id} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-sm">
                    <a href={link.url} target="_blank" rel="noreferrer" className="text-cindral-blue hover:text-white">
                      {link.label}
                      <span className="ml-2 text-xs text-gray-500">{link.type}</span>
                    </a>
                    <button
                      onClick={() => removeLinkItem(link.id)}
                      className="text-[11px] text-rose-200 px-2 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20"
                      disabled={isSaving}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {!project.links?.length && <p className="text-sm text-gray-500">Add links to repos, docs, or design files below.</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                  placeholder="Label"
                  value={newLink.label}
                  onChange={e => setNewLink({ ...newLink, label: e.target.value })}
                />
                <input
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                  placeholder="https://"
                  value={newLink.url}
                  onChange={e => setNewLink({ ...newLink, url: e.target.value })}
                />
                <select
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                  value={newLink.type}
                  onChange={e => setNewLink({ ...newLink, type: e.target.value })}
                >
                  <option value="doc">Doc</option>
                  <option value="repo">Repo</option>
                  <option value="design">Design</option>
                  <option value="roadmap">Roadmap</option>
                </select>
                <input
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                  placeholder="Short description"
                  value={newLink.description}
                  onChange={e => setNewLink({ ...newLink, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={addLinkItem}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 disabled:opacity-60 border border-slate-700"
                  disabled={isSaving}
                >
                  Add link
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500">Team & Access</p>
                <h3 className="text-lg font-semibold">Team members</h3>
              </div>
              <Users className="w-5 h-5 text-cindral-blue" />
            </div>
            <div className="flex flex-wrap gap-2">
              {(project.team || []).map(id => {
                const member = team.find(t => t.id === id);
                if (!member) return null;
                return (
                  <span key={member.id} className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-sm text-gray-200">
                    <img src={member.image} alt={member.name} className="w-6 h-6 rounded-full border border-slate-900" />
                    <span>{member.name}</span>
                    <button
                      onClick={() => toggleMemberAssignment(member.id)}
                      className="text-[11px] text-rose-200 hover:text-rose-100"
                      title="Remove from project"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
              {!project.team?.length && <p className="text-sm text-gray-500">No members assigned yet.</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <select
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                value={selectedMember}
                onChange={e => setSelectedMember(e.target.value)}
              >
                <option value="">Select to add</option>
                {team
                  .filter(member => !(project.team || []).includes(member.id))
                  .map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
              </select>
              <button
                onClick={() => {
                  if (!selectedMember) return;
                  toggleMemberAssignment(selectedMember);
                  setSelectedMember('');
                }}
                className="sm:col-span-2 px-3 py-2 rounded-lg bg-cindral-blue text-white text-sm font-semibold hover:bg-blue-600 disabled:opacity-60"
                disabled={isSaving || !selectedMember}
              >
                Add member
              </button>
            </div>
            <div className="border-t border-slate-800 pt-3">
              <p className="text-xs text-gray-500 mb-2">Assign / remove members</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {team.map(member => (
                  <label key={member.id} className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(project.team?.includes(member.id))}
                      onChange={() => toggleMemberAssignment(member.id)}
                      className="rounded border-gray-600 bg-slate-800 text-cindral-blue focus:ring-offset-slate-900"
                      disabled={isSaving}
                    />
                    <span>{member.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500">Billing</p>
                <h3 className="text-lg font-semibold">Invoices & status</h3>
              </div>
              <CreditCard className="w-5 h-5 text-amber-300" />
            </div>
            {invoicesForProject.length === 0 ? (
              <p className="text-sm text-gray-400">No invoices associated with this project yet.</p>
            ) : (
              <div className="space-y-3">
                {invoicesForProject.map(invoice => {
                  const badge =
                    invoice.status === 'paid' ? 'bg-emerald-500/10 text-emerald-200 border-emerald-500/30' :
                    invoice.status === 'overdue' ? 'bg-rose-500/10 text-rose-200 border-rose-500/30' :
                    'bg-amber-500/10 text-amber-200 border-amber-500/30';
                  return (
                    <div key={invoice.id} className="p-3 rounded-xl border border-slate-800 bg-slate-900/70">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">{invoice.description}</p>
                          <p className="text-xs text-gray-400">
                            Issued {invoice.issuedOn} · Due {invoice.dueOn}
                          </p>
                          <p className="text-sm text-gray-200 mt-1">{formatCurrency(invoice.amount, invoice.currency)}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`text-[11px] px-3 py-1 rounded-full border ${badge}`}>
                            {invoice.status === 'paid' ? 'Paid' : invoice.status === 'overdue' ? 'Overdue' : 'Due'}
                          </span>
                          {invoice.downloadUrl && (
                            <a
                              href={invoice.downloadUrl}
                              className="text-xs text-cindral-blue hover:text-cindral-blue/80 inline-flex items-center space-x-1"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <span>Download</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500">Support & Access</p>
              <h3 className="text-lg font-semibold">Keep us close to your workflow</h3>
              <p className="text-sm text-gray-400">Slack Connect, office hours, and weekly digest to reduce back-and-forth.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="text-xs px-3 py-2 rounded-xl border border-slate-700 bg-slate-800/60 inline-flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-300" /><span>SLA: sub-1 business day response</span>
              </span>
              <span className="text-xs px-3 py-2 rounded-xl border border-slate-700 bg-slate-800/60 inline-flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-cindral-blue" /><span>Weekly digest email</span>
              </span>
              <span className="text-xs px-3 py-2 rounded-xl border border-slate-700 bg-slate-800/60 inline-flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-blue-300" /><span>Slack Connect channel</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setEditOpen(false)} />
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
              <div>
                <h3 className="text-2xl font-bold text-white">Edit Project</h3>
                <p className="text-sm text-gray-400 mt-1">Update metadata and overview fields.</p>
              </div>
              <button onClick={() => setEditOpen(false)} className="text-gray-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-y-auto px-6 py-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Display Name</label>
                  <input className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Client Name</label>
                  <input className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" value={editForm.clientName || ''} onChange={e => setEditForm({ ...editForm, clientName: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Linked Project</label>
                <select
                  value={editForm.projectId || ''}
                  onChange={e => setEditForm({ ...editForm, projectId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                >
                  <option value="">Select project</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Status</label>
                  <select
                    value={editForm.status || 'On Track'}
                    onChange={e => setEditForm({ ...editForm, status: e.target.value as ClientProject['status'] })}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
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
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                  >
                    <option value="green">Green</option>
                    <option value="amber">Amber</option>
                    <option value="red">Red</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Next Milestone</label>
                  <input className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" value={editForm.nextMilestone || ''} onChange={e => setEditForm({ ...editForm, nextMilestone: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Budget Used (%)</label>
                  <input className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" value={String(editForm.budgetUsed ?? 0)} onChange={e => setEditForm({ ...editForm, budgetUsed: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Summary</label>
                  <input className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" value={editForm.summary || ''} onChange={e => setEditForm({ ...editForm, summary: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Start Date</label>
                  <input type="date" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" value={editForm.startDate || ''} onChange={e => setEditForm({ ...editForm, startDate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">End Date</label>
                  <input type="date" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" value={editForm.endDate || ''} onChange={e => setEditForm({ ...editForm, endDate: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-5 border-t border-slate-800">
              <button onClick={() => setEditOpen(false)} className="px-4 py-2 rounded-xl border border-slate-700 text-gray-300 hover:bg-slate-800">Cancel</button>
              <button
                onClick={handleEditSave}
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-cindral-blue text-white font-semibold disabled:opacity-60"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClientProjectPage;
