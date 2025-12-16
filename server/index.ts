import express from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { DIVISIONS, PROJECTS, TEAM, CLIENT_PORTAL_PROJECTS, CLIENT_INVOICES, INITIATIVES } from '../constants';
import { DivisionType } from '../types';
import type { ContactSubmission, Division, Project, TeamMember, ClientProject, ClientInvoice, ClientUser, Initiative } from '../types';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });
dotenv.config();

type DBShape = {
  divisions: Division[];
  projects: Project[];
  team: TeamMember[];
  contactSubmissions: ContactSubmission[];
  clientProjects: ClientProject[];
  clientInvoices: ClientInvoice[];
  clientUsers: ClientUser[];
  initiatives: Initiative[];
};

const seedData = (): DBShape => ({
  divisions: JSON.parse(JSON.stringify(DIVISIONS)),
  projects: JSON.parse(JSON.stringify(PROJECTS)),
  team: JSON.parse(JSON.stringify(TEAM)),
  contactSubmissions: [],
  clientProjects: JSON.parse(JSON.stringify(CLIENT_PORTAL_PROJECTS)),
  clientInvoices: JSON.parse(JSON.stringify(CLIENT_INVOICES)),
  clientUsers: [],
  initiatives: JSON.parse(JSON.stringify(INITIATIVES))
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');
const PORT = Number(process.env.API_PORT || process.env.PORT || 4000);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const tokens = new Set<string>();

async function ensureDb() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(seedData(), null, 2));
  }
}

async function readDb(): Promise<DBShape> {
  const raw = await fs.readFile(DB_PATH, 'utf-8');
  const parsed = JSON.parse(raw);

  const next: DBShape = {
    divisions: parsed.divisions || [],
    projects: parsed.projects || [],
    team: parsed.team || [],
    contactSubmissions: parsed.contactSubmissions || [],
    clientProjects: Array.isArray(parsed.clientProjects) ? parsed.clientProjects : JSON.parse(JSON.stringify(CLIENT_PORTAL_PROJECTS)),
    clientInvoices: Array.isArray(parsed.clientInvoices) ? parsed.clientInvoices : JSON.parse(JSON.stringify(CLIENT_INVOICES)),
    clientUsers: Array.isArray(parsed.clientUsers) ? parsed.clientUsers : [],
    initiatives: Array.isArray(parsed.initiatives) ? parsed.initiatives : JSON.parse(JSON.stringify(INITIATIVES))
  };

  const needsPersist =
    !Array.isArray(parsed.clientProjects) ||
    !Array.isArray(parsed.clientInvoices) ||
    !Array.isArray(parsed.clientUsers) ||
    !Array.isArray(parsed.initiatives);

  if (needsPersist) {
    await writeDb(next);
  }

  return next;
}

async function writeDb(data: DBShape) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const requireAuth: express.RequestHandler = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const [, token] = auth.split(' ');
  if (!token || !tokens.has(token)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  (req as any).token = token;
  return next();
};

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.post('/api/login', (req, res) => {
  const { password } = req.body || {};
  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid password' });
  }
  const token = nanoid();
  tokens.add(token);
  return res.json({ token });
});

app.post('/api/logout', requireAuth, (req, res) => {
  const token = (req as any).token;
  if (token && tokens.has(token)) {
    tokens.delete(token);
  }
  return res.json({ success: true });
});


// Divisions CRUD
app.get('/api/divisions', async (_req, res) => {
  const data = await readDb();
  return res.json(data.divisions);
});

app.post('/api/divisions', requireAuth, async (req, res) => {
  const payload = req.body as Partial<Division>;
  if (!payload.title) {
    return res.status(400).json({ message: 'Title is required' });
  }
  const data = await readDb();
  const newDivision: Division = {
    id: payload.id || `div_${Date.now()}`,
    type: payload.type ?? data.divisions[0]?.type ?? DivisionType.LABS,
    title: payload.title,
    tagline: payload.tagline || '',
    description: payload.description || '',
    iconName: payload.iconName || 'FlaskConical',
    color: payload.color || 'text-white',
    themeColor: payload.themeColor || '#ffffff',
    bannerImage: payload.bannerImage
  };
  data.divisions.push(newDivision);
  await writeDb(data);
  return res.status(201).json(newDivision);
});

app.put('/api/divisions/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const payload = req.body as Partial<Division>;
  const data = await readDb();
  const index = data.divisions.findIndex(div => div.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Division not found' });
  }
  data.divisions[index] = { ...data.divisions[index], ...payload, id };
  await writeDb(data);
  return res.json(data.divisions[index]);
});

app.delete('/api/divisions/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const data = await readDb();
  data.divisions = data.divisions.filter(div => div.id !== id);
  await writeDb(data);
  return res.status(204).end();
});

// Projects CRUD
app.get('/api/projects', async (_req, res) => {
  const data = await readDb();
  return res.json(data.projects);
});

app.post('/api/projects', requireAuth, async (req, res) => {
  const payload = req.body as Partial<Project>;
  if (!payload.title || !payload.divisionId) {
    return res.status(400).json({ message: 'Title and divisionId are required' });
  }
  const data = await readDb();
  const newProject: Project = {
    id: payload.id || `proj_${Date.now()}`,
    divisionId: payload.divisionId,
    title: payload.title,
    client: payload.client,
    summary: payload.summary || '',
    content: payload.content || '',
    images: Array.isArray(payload.images) ? payload.images : [],
    year: payload.year || new Date().getFullYear().toString()
  };
  data.projects.push(newProject);
  await writeDb(data);
  return res.status(201).json(newProject);
});

app.put('/api/projects/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const payload = req.body as Partial<Project>;
  const data = await readDb();
  const index = data.projects.findIndex(project => project.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Project not found' });
  }
  data.projects[index] = { ...data.projects[index], ...payload, id };
  await writeDb(data);
  return res.json(data.projects[index]);
});

app.delete('/api/projects/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const data = await readDb();
  data.projects = data.projects.filter(project => project.id !== id);
  await writeDb(data);
  return res.status(204).end();
});

// Team CRUD
app.get('/api/team', async (_req, res) => {
  const data = await readDb();
  return res.json(data.team);
});

app.post('/api/team', requireAuth, async (req, res) => {
  const payload = req.body as Partial<TeamMember>;
  if (!payload.name || !payload.role) {
    return res.status(400).json({ message: 'Name and role are required' });
  }
  const data = await readDb();
  const newMember: TeamMember = {
    id: payload.id || `team_${Date.now()}`,
    name: payload.name,
    role: payload.role,
    bio: payload.bio || '',
    image: payload.image || '',
    linkedIn: payload.linkedIn,
    projectIds: Array.isArray(payload.projectIds) ? payload.projectIds : [],
    csrActivities: Array.isArray(payload.csrActivities) ? payload.csrActivities : [],
    skills: Array.isArray(payload.skills) ? payload.skills : [],
    interests: Array.isArray(payload.interests) ? payload.interests : [],
    quote: payload.quote,
    learningStats: payload.learningStats,
    fitnessStats: payload.fitnessStats
  };
  data.team.push(newMember);
  await writeDb(data);
  return res.status(201).json(newMember);
});

app.put('/api/team/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const payload = req.body as Partial<TeamMember>;
  const data = await readDb();
  const index = data.team.findIndex(member => member.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Team member not found' });
  }
  data.team[index] = { ...data.team[index], ...payload, id };
  await writeDb(data);
  return res.json(data.team[index]);
});

app.delete('/api/team/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const data = await readDb();
  data.team = data.team.filter(member => member.id !== id);
  await writeDb(data);
  return res.status(204).end();
});

// Contact submissions
app.post('/api/contact', async (req, res) => {
  const payload = req.body as Partial<ContactSubmission>;
  if (!payload.firstName || !payload.email || !payload.message) {
    return res.status(400).json({ message: 'First name, email, and message are required' });
  }
  const data = await readDb();
  const submission: ContactSubmission = {
    id: `submission_${nanoid(10)}`,
    firstName: payload.firstName,
    lastName: payload.lastName || '',
    email: payload.email,
    subject: payload.subject || 'General Inquiry',
    message: payload.message,
    createdAt: new Date().toISOString(),
    status: 'new'
  };
  data.contactSubmissions = [submission, ...data.contactSubmissions];
  await writeDb(data);
  return res.status(201).json(submission);
});

app.get('/api/contact-submissions', requireAuth, async (_req, res) => {
  const data = await readDb();
  return res.json(data.contactSubmissions);
});

app.put('/api/contact-submissions/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const payload = req.body as Partial<ContactSubmission>;
  const data = await readDb();
  const index = data.contactSubmissions.findIndex(sub => sub.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Submission not found' });
  }
  data.contactSubmissions[index] = { ...data.contactSubmissions[index], ...payload, id };
  await writeDb(data);
  return res.json(data.contactSubmissions[index]);
});

app.delete('/api/contact-submissions/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const data = await readDb();
  data.contactSubmissions = data.contactSubmissions.filter(sub => sub.id !== id);
  await writeDb(data);
  return res.status(204).end();
});

// Client Projects CRUD
const computeProgressFromTasks = (tasks?: ClientProject['tasks']) => {
  if (!tasks || tasks.length === 0) return 0;
  const done = tasks.filter(t => t.status === 'done').length;
  return Math.round((done / tasks.length) * 100);
};

app.get('/api/client-projects', async (_req, res) => {
  const data = await readDb();
  const withProgress = data.clientProjects.map(cp => ({
    ...cp,
    progress: computeProgressFromTasks(cp.tasks) || cp.progress || 0
  }));
  return res.json(withProgress);
});

app.post('/api/client-projects', requireAuth, async (req, res) => {
  const payload = req.body as Partial<ClientProject>;
  if (!payload.name || !payload.projectId) {
    return res.status(400).json({ message: 'Name and projectId are required' });
  }
  const data = await readDb();
  const newClientProject: ClientProject = {
    id: payload.id || `client_proj_${Date.now()}`,
    projectId: payload.projectId,
    clientName: payload.clientName || payload.name,
    name: payload.name,
    summary: payload.summary || '',
    status: payload.status || 'On Track',
    health: payload.health || 'green',
    progress: computeProgressFromTasks(payload.tasks) || 0,
    budgetUsed: payload.budgetUsed ?? 0,
    startDate: payload.startDate || new Date().toISOString(),
    endDate: payload.endDate || new Date().toISOString(),
    nextMilestone: payload.nextMilestone || '',
    team: Array.isArray(payload.team) ? payload.team : [],
    resources: Array.isArray(payload.resources) ? payload.resources : [],
    tasks: Array.isArray(payload.tasks) ? payload.tasks : [],
    timeline: Array.isArray(payload.timeline) ? payload.timeline : [],
    updates: Array.isArray(payload.updates) ? payload.updates : [],
    links: Array.isArray(payload.links) ? payload.links : []
  };
  data.clientProjects.push(newClientProject);
  await writeDb(data);
  return res.status(201).json(newClientProject);
});

app.put('/api/client-projects/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const payload = req.body as Partial<ClientProject>;
  const data = await readDb();
  const index = data.clientProjects.findIndex(cp => cp.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Client project not found' });
  }
  const merged = { ...data.clientProjects[index], ...payload, id };
  merged.progress = computeProgressFromTasks(merged.tasks) || merged.progress || 0;
  data.clientProjects[index] = merged;
  await writeDb(data);
  return res.json(data.clientProjects[index]);
});

app.delete('/api/client-projects/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const data = await readDb();
  data.clientProjects = data.clientProjects.filter(cp => cp.id !== id);
  await writeDb(data);
  return res.status(204).end();
});

// Client Invoices CRUD
app.get('/api/client-invoices', async (_req, res) => {
  const data = await readDb();
  return res.json(data.clientInvoices);
});

app.post('/api/client-invoices', requireAuth, async (req, res) => {
  const payload = req.body as Partial<ClientInvoice>;
  if (!payload.projectId || !payload.amount || !payload.currency || !payload.issuedOn || !payload.dueOn) {
    return res.status(400).json({ message: 'projectId, amount, currency, issuedOn, and dueOn are required' });
  }
  const data = await readDb();
  const invoice: ClientInvoice = {
    id: payload.id || `inv_${nanoid(8)}`,
    projectId: payload.projectId,
    amount: payload.amount,
    currency: payload.currency,
    status: payload.status || 'due',
    issuedOn: payload.issuedOn,
    dueOn: payload.dueOn,
    description: payload.description || '',
    downloadUrl: payload.downloadUrl
  };
  data.clientInvoices.push(invoice);
  await writeDb(data);
  return res.status(201).json(invoice);
});

app.put('/api/client-invoices/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const payload = req.body as Partial<ClientInvoice>;
  const data = await readDb();
  const index = data.clientInvoices.findIndex(inv => inv.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Invoice not found' });
  }
  data.clientInvoices[index] = { ...data.clientInvoices[index], ...payload, id };
  await writeDb(data);
  return res.json(data.clientInvoices[index]);
});

app.delete('/api/client-invoices/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const data = await readDb();
  data.clientInvoices = data.clientInvoices.filter(inv => inv.id !== id);
  await writeDb(data);
  return res.status(204).end();
});

// Client Users CRUD
app.get('/api/client-users', requireAuth, async (_req, res) => {
  const data = await readDb();
  return res.json(data.clientUsers);
});

app.post('/api/client-users', requireAuth, async (req, res) => {
  const payload = req.body as Partial<ClientUser>;
  if (!payload.name || !payload.email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }
  const data = await readDb();
  const user: ClientUser = {
    id: payload.id || `client_${nanoid(8)}`,
    name: payload.name,
    email: payload.email,
    company: payload.company || '',
    role: payload.role || 'viewer',
    allowedProjectIds: Array.isArray(payload.allowedProjectIds) ? payload.allowedProjectIds : []
  };
  data.clientUsers.push(user);
  await writeDb(data);
  return res.status(201).json(user);
});

app.put('/api/client-users/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const payload = req.body as Partial<ClientUser>;
  const data = await readDb();
  const index = data.clientUsers.findIndex(u => u.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Client user not found' });
  }
  data.clientUsers[index] = { ...data.clientUsers[index], ...payload, id };
  await writeDb(data);
  return res.json(data.clientUsers[index]);
});

app.delete('/api/client-users/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const data = await readDb();
  data.clientUsers = data.clientUsers.filter(u => u.id !== id);
  await writeDb(data);
  return res.status(204).end();
});


// Initiatives CRUD
app.get('/api/initiatives', async (_req, res) => {
  const data = await readDb();
  return res.json(data.initiatives);
});

app.post('/api/initiatives', requireAuth, async (req, res) => {
  const payload = req.body as Partial<Initiative>;
  if (!payload.title) {
    return res.status(400).json({ message: 'Title is required' });
  }
  const data = await readDb();
  const newInitiative: Initiative = {
    id: payload.id || `init_${nanoid(8)}`,
    title: payload.title,
    image: payload.image || '',
    description: payload.description || '',
    fullContent: payload.fullContent || '',
    iconName: payload.iconName || 'Heart',
    color: payload.color || 'text-white',
    bgHover: payload.bgHover || '',
    textHover: payload.textHover || '',
    stats: Array.isArray(payload.stats) ? payload.stats : []
  };
  data.initiatives.push(newInitiative);
  await writeDb(data);
  return res.status(201).json(newInitiative);
});

app.put('/api/initiatives/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const payload = req.body as Partial<Initiative>;
  const data = await readDb();
  const index = data.initiatives.findIndex(i => i.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Initiative not found' });
  }
  data.initiatives[index] = { ...data.initiatives[index], ...payload, id };
  await writeDb(data);
  return res.json(data.initiatives[index]);
});

app.delete('/api/initiatives/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const data = await readDb();
  data.initiatives = data.initiatives.filter(i => i.id !== id);
  await writeDb(data);
  return res.status(204).end();
});

// Data management helpers
app.get('/api/data/export', requireAuth, async (_req, res) => {
  const data = await readDb();
  return res.json(data);
});

app.post('/api/data/import', requireAuth, async (req, res) => {
  const payload = req.body as Partial<DBShape>;
  if (!Array.isArray(payload.divisions) || !Array.isArray(payload.projects) || !Array.isArray(payload.team)) {
    return res.status(400).json({ message: 'Invalid data payload' });
  }
  const next: DBShape = {
    divisions: payload.divisions as Division[],
    projects: payload.projects as Project[],
    team: payload.team as TeamMember[],
    contactSubmissions: Array.isArray(payload.contactSubmissions) ? (payload.contactSubmissions as ContactSubmission[]) : [],
    clientProjects: Array.isArray((payload as any).clientProjects) ? ((payload as any).clientProjects as ClientProject[]) : [],
    clientInvoices: Array.isArray((payload as any).clientInvoices) ? ((payload as any).clientInvoices as ClientInvoice[]) : [],
    clientUsers: Array.isArray((payload as any).clientUsers) ? ((payload as any).clientUsers as ClientUser[]) : [],
    initiatives: Array.isArray((payload as any).initiatives) ? ((payload as any).initiatives as Initiative[]) : []
  };
  await writeDb(next);
  return res.json(next);
});

app.post('/api/data/reset', requireAuth, async (_req, res) => {
  const next = seedData();
  await writeDb(next);
  return res.json(next);
});

ensureDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Cindral API running on http://localhost:${PORT}`);
  });
});
