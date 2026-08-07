import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { analyzeIncidentWithAI } from './services/aiAnalyzer.service';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

export interface Monitor {
  id: string;
  name: string;
  protocol: string;
  target: string;
  status: string;
  latencyMs: number;
  statusCode?: number;
  sslDaysRemaining?: number;
  uptimePercent: number;
  intervalSeconds: number;
  lastChecked: string;
  errorMessage?: string;
}

// In-Memory Database Store for Monitored Assets & Users
const mockMonitors: Monitor[] = [
  {
    id: 'mon-101',
    name: 'Production API Gateway',
    protocol: 'HTTP',
    target: 'https://api.altix.io/health',
    status: 'UP',
    latencyMs: 34,
    statusCode: 200,
    uptimePercent: 99.98,
    intervalSeconds: 15,
    lastChecked: new Date().toISOString(),
  },
  {
    id: 'mon-102',
    name: 'Stripe Webhook Receiver',
    protocol: 'HTTP',
    target: 'https://payments.altix.io/webhooks',
    status: 'UP',
    latencyMs: 82,
    statusCode: 200,
    uptimePercent: 100.0,
    intervalSeconds: 30,
    lastChecked: new Date().toISOString(),
  },
  {
    id: 'mon-103',
    name: 'Primary SSL Certificate',
    protocol: 'SSL',
    target: 'altix.io',
    status: 'UP',
    latencyMs: 12,
    statusCode: 200,
    sslDaysRemaining: 74,
    uptimePercent: 100.0,
    intervalSeconds: 3600,
    lastChecked: new Date().toISOString(),
  },
  {
    id: 'mon-104',
    name: 'Redis Cache Cluster',
    protocol: 'TCP',
    target: 'redis.internal.altix.io:6379',
    status: 'UP',
    latencyMs: 4,
    statusCode: 200,
    uptimePercent: 99.99,
    intervalSeconds: 10,
    lastChecked: new Date().toISOString(),
  },
  {
    id: 'mon-105',
    name: 'US-East DNS Nameserver',
    protocol: 'DNS',
    target: 'ns1.altix.io',
    status: 'DOWN',
    latencyMs: 0,
    statusCode: 503,
    errorMessage: 'DNS lookup failed: getaddrinfo EAI_AGAIN ns1.altix.io',
    uptimePercent: 98.45,
    intervalSeconds: 60,
    lastChecked: new Date().toISOString(),
  },
];

const mockIncidents = [
  {
    id: 'inc-901',
    monitorId: 'mon-105',
    monitorName: 'US-East DNS Nameserver',
    status: 'OPEN',
    severity: 'HIGH',
    startedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    durationMinutes: 15,
    errorMessage: 'DNS lookup failed: getaddrinfo EAI_AGAIN ns1.altix.io',
    workerRegion: 'us-east-1',
    aiAnalysis: analyzeIncidentWithAI({
      id: 'inc-901',
      monitorName: 'US-East DNS Nameserver',
      protocol: 'DNS',
      errorMessage: 'DNS lookup failed: getaddrinfo EAI_AGAIN ns1.altix.io',
    }),
  },
];

// Registered Users Mock
const registeredUsers = new Map<string, any>([
  ['wesley@altix.io', {
    name: 'Wesley Santos',
    company: 'Acme Cloud Corp',
    email: 'wesley@altix.io',
    password: 'Password123!',
  }]
]);

// WebSocket Server Broadcast Hub
const connectedClients = new Set<WebSocket>();

function broadcastEvent(type: string, data: any) {
  const payload = JSON.stringify({ type, data, timestamp: new Date().toISOString() });
  connectedClients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

// ------------------- AUTH ROUTES -------------------

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Por favor, preencha o e-mail e a senha.' });
  }

  const user = registeredUsers.get(email.toLowerCase());
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'E-mail ou senha inválidos. Por favor, verifique suas credenciais.' });
  }

  return res.json({
    token: `jwt_token_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    user: {
      name: user.name,
      company: user.company,
      email: user.email,
    },
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, company, email, password } = req.body;

  if (!name || !company || !email || !password) {
    return res.status(400).json({ error: 'Todos os campos são de preenchimento obrigatório.' });
  }

  const normalizedEmail = email.toLowerCase();
  if (registeredUsers.has(normalizedEmail)) {
    return res.status(400).json({ error: 'Este e-mail já está cadastrado em nossa plataforma.' });
  }

  const newUser = { name, company, email: normalizedEmail, password };
  registeredUsers.set(normalizedEmail, newUser);

  return res.status(201).json({
    message: 'Conta criada com sucesso!',
    token: `jwt_token_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    user: { name, company, email: normalizedEmail },
  });
});

// ------------------- MONITOR ROUTES -------------------

app.get('/api/monitors', (req, res) => {
  res.json({ monitors: mockMonitors });
});

// Immediate initial health check execution on Monitor creation
app.post('/api/monitors', (req, res) => {
  const { name, protocol, target, intervalSeconds } = req.body;

  if (!name || !target) {
    return res.status(400).json({ error: 'O nome do monitor e a URL/Target são obrigatórios.' });
  }

  // URL / Host Validation
  try {
    if (protocol === 'HTTP' || protocol === 'HTTPS') {
      new URL(target.startsWith('http') ? target : `https://${target}`);
    }
  } catch (err) {
    return res.status(400).json({ error: 'A URL informada é inválida. Exemplo válido: https://api.empresa.com' });
  }

  // Immediate Initial Health Check Execution
  const isTargetSimulatedDown = target.includes('error') || target.includes('down');
  const initialLatency = isTargetSimulatedDown ? 0 : Math.floor(Math.random() * 45) + 12;
  const initialStatus = isTargetSimulatedDown ? 'DOWN' : 'UP';
  const statusCode = isTargetSimulatedDown ? 500 : 200;

  const newMonitor = {
    id: `mon-${Date.now()}`,
    name: name.trim(),
    protocol: protocol || 'HTTP',
    target: target.trim(),
    status: initialStatus,
    latencyMs: initialLatency,
    statusCode,
    uptimePercent: 100.0,
    intervalSeconds: Number(intervalSeconds) || 30,
    lastChecked: new Date().toISOString(),
    errorMessage: isTargetSimulatedDown ? 'Connection refused (HTTP 500)' : undefined,
  };

  mockMonitors.unshift(newMonitor);

  // Broadcast Real-time WebSocket Event immediately
  broadcastEvent('MONITOR_CREATED', newMonitor);

  return res.status(201).json({
    message: 'Monitor criado e verificação inicial executada com sucesso!',
    monitor: newMonitor,
  });
});

// ------------------- INCIDENTS ROUTES -------------------

app.get('/api/incidents', (req, res) => {
  res.json({ incidents: mockIncidents });
});

app.post('/api/incidents/:id/ai-analyze', (req, res) => {
  const inc = mockIncidents.find(i => i.id === req.params.id);
  if (!inc) {
    return res.status(404).json({ error: 'Incidente não encontrado' });
  }
  const analysis = analyzeIncidentWithAI({
    id: inc.id,
    monitorName: inc.monitorName,
    protocol: 'HTTP',
    errorMessage: inc.errorMessage,
  });
  res.json({ analysis });
});

// ------------------- STATUS PAGE ROUTES -------------------

app.get('/api/status-page/public', (req, res) => {
  res.json({
    companyName: 'ALTIX Cloud Infrastructure',
    slogan: 'Monitoramento inteligente. Disponibilidade em tempo real.',
    overallStatus: 'DEGRADED',
    systemUptime90Days: 99.98,
    monitors: mockMonitors,
    activeIncidents: mockIncidents.filter(i => i.status === 'OPEN'),
  });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  connectedClients.add(ws);
  ws.send(JSON.stringify({ type: 'CONNECTED', message: 'Subscribed to ALTIX Sub-second Real-time Event Stream' }));

  ws.on('close', () => {
    connectedClients.delete(ws);
  });
});

// Real-time pulse interval (~1s update)
setInterval(() => {
  if (connectedClients.size === 0 || mockMonitors.length === 0) return;

  const randomMonitor = mockMonitors[Math.floor(Math.random() * mockMonitors.length)];
  if (randomMonitor.status === 'UP') {
    randomMonitor.latencyMs = Math.max(8, Math.floor(randomMonitor.latencyMs + (Math.random() * 8 - 4)));
  }
  randomMonitor.lastChecked = new Date().toISOString();

  broadcastEvent('PULSE_UPDATE', randomMonitor);
}, 1000);

server.listen(port, () => {
  console.log(`⚡ ALTIX API Gateway listening at http://localhost:${port}`);
  console.log(`📡 WebSocket Real-time Stream active at ws://localhost:${port}`);
});
