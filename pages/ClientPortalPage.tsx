import React, { useMemo, useState, useEffect } from 'react';
import { ArrowUpRight, Calendar, CheckCircle2, Clock3, AlertTriangle, Users, Link2, FileText, CreditCard, MessageSquare, Sparkles, ExternalLink, BarChart3, ShieldCheck } from 'lucide-react';
import { BRAND, CLIENT_PORTAL_PROJECTS, CLIENT_INVOICES } from '../constants';
import { ClientProject, ClientInvoice, ClientProjectTask } from '../types';
import { useData } from '../contexts/DataContext';

const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const healthStyles: Record<ClientProject['health'], string> = {
  green: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40',
  amber: 'bg-amber-500/10 text-amber-300 border-amber-500/40',
  red: 'bg-rose-500/10 text-rose-300 border-rose-500/40'
};

const statusCopy: Record<ClientProject['status'], string> = {
  'On Track': 'Confident',
  'At Risk': 'Needs support',
  'Behind': 'Course correcting'
};

const taskStatusStyles: Record<ClientProjectTask['status'], string> = {
  todo: 'text-gray-300 bg-slate-800 border-slate-700',
  in_progress: 'text-blue-200 bg-blue-500/10 border-blue-500/40',
  done: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/40',
  cancelled: 'text-rose-200 bg-rose-500/10 border-rose-500/40'
};

const taskStatusLabel: Record<ClientProjectTask['status'], string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
  cancelled: 'Cancelled'
};

const currency = (invoice: ClientInvoice) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency }).format(invoice.amount);

const ProgressBar = ({ value }: { value: number }) => (
  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
    <div
      className="h-full rounded-full"
      style={{ width: `${value}%`, background: `linear-gradient(90deg, ${BRAND.colors.primary}, ${BRAND.colors.accent})` }}
    />
  </div>
);

const ClientPortalPage: React.FC = () => {
  const { clientProjects, clientInvoices, team, isLoading } = useData();
  const projectsSource = clientProjects.length ? clientProjects : CLIENT_PORTAL_PROJECTS;
  const invoicesSource = clientInvoices.length ? clientInvoices : CLIENT_INVOICES;
  const teamSource = team.length ? team : [];

  const [activeProjectId, setActiveProjectId] = useState(projectsSource[0]?.id || '');

  useEffect(() => {
    if (projectsSource.length && !projectsSource.find(p => p.id === activeProjectId)) {
      setActiveProjectId(projectsSource[0].id);
    }
  }, [projectsSource, activeProjectId]);

  const activeProject = useMemo(
    () => projectsSource.find(p => p.id === activeProjectId) || projectsSource[0],
    [activeProjectId, projectsSource]
  );

  const invoices = useMemo(
    () => invoicesSource.filter(inv => inv.projectId === activeProject?.projectId),
    [activeProject?.projectId, invoicesSource]
  );

  const totalOpenTasks = projectsSource.reduce((count, project) => {
    return count + (project.tasks || []).filter(t => t.status !== 'done' && t.status !== 'cancelled').length;
  }, 0);

  const upcomingMilestone = useMemo(() => {
    const flattened = projectsSource.flatMap(p => (p.timeline || []).map(item => ({ ...item, project: p.name })));
    const future = flattened.filter(item => item.status !== 'complete');
    return future.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [projectsSource]);

  const dueInvoices = invoicesSource.filter(inv => inv.status !== 'paid').length;

  if (isLoading && !projectsSource.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-gray-300">
        Loading client portal...
      </div>
    );
  }

  if (!projectsSource.length || !activeProject) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-gray-300 px-4">
        <div className="max-w-md text-center space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Client Panel</p>
          <h1 className="text-3xl font-bold text-white">No client projects yet</h1>
          <p className="text-gray-400">Add client projects and invoices from the Admin → Client Projects / Client Billing tabs to populate this view.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen text-white">
      <div className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
        <div className="absolute -left-10 -top-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-10 -bottom-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>Client Dashboard</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight">
                Delivery status, tasks, and billing in one view.
              </h1>
              <p className="text-lg text-gray-400 max-w-2xl">
                Clear timelines, accountable owners, and live progress based on completed tasks.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 min-w-[280px] md:min-w-[320px]">
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                <p className="text-xs uppercase tracking-widest text-gray-500">Projects</p>
                <div className="flex items-baseline space-x-2 mt-2">
                  <span className="text-3xl font-bold">{projectsSource.length}</span>
                  <span className="text-sm text-emerald-300">active</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{totalOpenTasks} open tasks</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                <p className="text-xs uppercase tracking-widest text-gray-500">Billing</p>
                <div className="flex items-baseline space-x-2 mt-2">
                  <span className="text-3xl font-bold">{dueInvoices}</span>
                  <span className="text-sm text-amber-300">awaiting</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Invoices due or in review</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500">Next milestone</p>
                    {upcomingMilestone ? (
                      <>
                        <p className="text-sm text-gray-200 mt-1">{upcomingMilestone.label}</p>
                        <p className="text-xs text-gray-500">{formatDate(upcomingMilestone.date)} · {upcomingMilestone.project}</p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-400 mt-1">No upcoming items</p>
                    )}
                  </div>
                  <Calendar className="w-10 h-10 text-cyan-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500">Projects</p>
                <h2 className="text-xl font-semibold">Select a project</h2>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-500" />
            </div>

            {projectsSource.map(project => {
              const teamMembers = project.team
                .map(id => teamSource.find(t => t.id === id))
                .filter(Boolean)
                .slice(0, 4);

              const isActive = project.id === activeProject.id;

              return (
                <button
                  key={project.id}
                  onClick={() => setActiveProjectId(project.id)}
                  className={`w-full text-left rounded-2xl border transition-all p-4 space-y-3 ${
                    isActive
                      ? 'border-cyan-400/60 bg-slate-800/70 shadow-lg shadow-cyan-500/10'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest">{project.clientName}</p>
                      <h3 className="text-lg font-semibold mt-1">{project.name}</h3>
                      <p className="text-sm text-gray-400">{project.summary}</p>
                    </div>
                    <div className={`text-xs px-3 py-1 rounded-full border ${healthStyles[project.health]}`}>
                      {project.status}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4" />
                      <span>{project.budgetUsed}% budget</span>
                    </div>
                  </div>
                  <ProgressBar value={project.progress} />
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {teamMembers.map(member => (
                        <img
                          key={member!.id}
                          src={member!.image}
                          alt={member!.name}
                          className="w-8 h-8 rounded-full border border-slate-900"
                        />
                      ))}
                      {project.team.length > 4 && (
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-900 flex items-center justify-center text-xs text-gray-400">
                          +{project.team.length - 4}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">Next: {project.nextMilestone}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-cyan-500/5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-widest text-gray-500">Project Overview</p>
                  <h2 className="text-2xl font-bold">{activeProject.name}</h2>
                  <p className="text-gray-400">{activeProject.summary}</p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
                    <div className={`px-3 py-1 rounded-full border ${healthStyles[activeProject.health]}`}>
                      {statusCopy[activeProject.status]}
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{activeProject.team.length} people</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Clock3 className="w-4 h-4" />
                      <span>{activeProject.progress}% done</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(activeProject.startDate)} — {formatDate(activeProject.endDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="min-w-[220px] bg-slate-800/60 rounded-2xl p-4 border border-slate-700">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Progress</span>
                    <span className="text-white font-semibold">{activeProject.progress}%</span>
                  </div>
                  <div className="mt-2">
                    <ProgressBar value={activeProject.progress} />
                  </div>
                  <div className="mt-3 text-xs text-gray-400">
                    Next milestone: <span className="text-gray-200">{activeProject.nextMilestone}</span>
                  </div>
                </div>
              </div>

            <div className="grid md:grid-cols-3 gap-3 mt-6">
                <button className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/50 text-sm">
                  <span>Book a review</span>
                  <ArrowUpRight className="w-4 h-4 text-cyan-300" />
                </button>
                <button className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/50 text-sm">
                  <span>Share feedback</span>
                  <MessageSquare className="w-4 h-4 text-emerald-300" />
                </button>
                <button className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/50 text-sm">
                  <span>Download statement</span>
                  <FileText className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500">Timeline</p>
                    <h3 className="text-lg font-semibold">Milestones</h3>
                  </div>
                  <Clock3 className="w-5 h-5 text-cyan-300" />
                </div>
                <div className="space-y-4">
                  {activeProject.timeline.map(item => {
                    const icon =
                      item.status === 'complete' ? <CheckCircle2 className="w-4 h-4" /> :
                      item.status === 'active' ? <Clock3 className="w-4 h-4" /> :
                      <AlertTriangle className="w-4 h-4" />;
                    const border =
                      item.status === 'complete' ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-200' :
                      item.status === 'active' ? 'border-cyan-500/40 bg-cyan-500/5 text-cyan-200' :
                      'border-slate-700 bg-slate-800/60 text-gray-200';
                    return (
                      <div key={item.id} className={`p-3 rounded-xl border ${border}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center bg-slate-900/60">
                              {icon}
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{item.label}</p>
                              <p className="text-xs text-gray-400">{item.description}</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-300">{formatDate(item.date)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500">Tasks</p>
                    <h3 className="text-lg font-semibold">Work in motion</h3>
                  </div>
                  <BarChart3 className="w-5 h-5 text-emerald-300" />
                </div>
                <div className="space-y-3">
                  {activeProject.tasks.length === 0 && <p className="text-sm text-gray-500">No tasks shared yet.</p>}
                  {activeProject.tasks.map(task => (
                    <div key={task.id} className="p-3 rounded-xl border border-slate-800 bg-slate-900/70">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">{task.title}</p>
                          <p className="text-xs text-gray-400">
                            {task.owner ? `Owner: ${task.owner}` : 'Unassigned'}
                            {task.dueDate && ` · Due ${formatDate(task.dueDate)}`}
                          </p>
                          {task.highlight && <p className="text-xs text-amber-300 mt-1">{task.highlight}</p>}
                        </div>
                        <span className={`text-[11px] px-3 py-1 rounded-full border ${taskStatusStyles[task.status]}`}>
                          {taskStatusLabel[task.status]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500">Resources</p>
                    <h3 className="text-lg font-semibold">Links & docs</h3>
                  </div>
                  <Link2 className="w-5 h-5 text-cyan-300" />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[...(activeProject.resources || []), ...(activeProject.links || [])].map(link => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-3 rounded-xl border border-slate-800 bg-slate-900/70 hover:border-cyan-400/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-300">
                            <ExternalLink className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{link.label}</p>
                            <p className="text-xs text-gray-400 capitalize">{link.type}</p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-300" />
                      </div>
                      {link.description && <p className="text-xs text-gray-400 mt-2">{link.description}</p>}
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500">People</p>
                    <h3 className="text-lg font-semibold">Team</h3>
                  </div>
                  <Users className="w-5 h-5 text-emerald-300" />
                </div>
                <div className="space-y-3">
                  {activeProject.team.map(id => {
                    const member = teamSource.find(t => t.id === id);
                    if (!member) return null;
                    return (
                      <div key={member.id} className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                        <img src={member.image} alt={member.name} className="w-10 h-10 rounded-full border border-slate-800" />
                        <div>
                          <p className="text-sm font-semibold">{member.name}</p>
                          <p className="text-xs text-gray-400">{member.role}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500">Updates</p>
                    <h3 className="text-lg font-semibold">Notes, decisions, risks</h3>
                  </div>
                  <MessageSquare className="w-5 h-5 text-cyan-300" />
                </div>
                <div className="space-y-3">
                  {activeProject.updates.map(update => {
                    const color =
                      update.type === 'risk' ? 'bg-rose-500/10 text-rose-200 border-rose-500/30' :
                      update.type === 'win' ? 'bg-emerald-500/10 text-emerald-200 border-emerald-500/30' :
                      'bg-slate-800/70 text-gray-200 border-slate-700';
                    return (
                      <div key={update.id} className={`p-3 rounded-xl border ${color}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold">{update.title}</p>
                            <p className="text-xs text-gray-300">{update.summary}</p>
                            <p className="text-[11px] text-gray-400 mt-1">
                              {update.author} · {formatDate(update.date)} {update.impact && `· Impact: ${update.impact}`}
                            </p>
                          </div>
                          <span className="text-[11px] uppercase tracking-wide text-gray-400">{update.type || 'note'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500">Billing</p>
                    <h3 className="text-lg font-semibold">Invoices & status</h3>
                  </div>
                  <CreditCard className="w-5 h-5 text-amber-300" />
                </div>
                {invoices.length === 0 ? (
                  <p className="text-sm text-gray-400">No invoices associated with this project yet.</p>
                ) : (
                  <div className="space-y-3">
                    {invoices.map(invoice => {
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
                                Issued {formatDate(invoice.issuedOn)} · Due {formatDate(invoice.dueOn)}
                              </p>
                              <p className="text-sm text-gray-200 mt-1">{currency(invoice)}</p>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <span className={`text-[11px] px-3 py-1 rounded-full border ${badge}`}>
                                {invoice.status === 'paid' ? 'Paid' : invoice.status === 'overdue' ? 'Overdue' : 'Due'}
                              </span>
                              {invoice.downloadUrl && (
                                <a
                                  href={invoice.downloadUrl}
                                  className="text-xs text-cyan-300 hover:text-cyan-200 inline-flex items-center space-x-1"
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

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
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
                    <Sparkles className="w-4 h-4 text-cyan-300" /><span>Weekly digest email</span>
                  </span>
                  <span className="text-xs px-3 py-2 rounded-xl border border-slate-700 bg-slate-800/60 inline-flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-blue-300" /><span>Slack Connect channel</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPortalPage;
