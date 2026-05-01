import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const reportsDir = path.join(__dirname, '..', 'reports');
const reportsFile = path.join(reportsDir, 'reports.json');
const port = process.env.PORT || 4000;
const host = process.env.HOST || '0.0.0.0';

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use(express.json({ limit: '2mb' }));

async function readReports() {
  try {
    const contents = await fs.readFile(reportsFile, 'utf8');
    return JSON.parse(contents);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'UPES Physics Virtual Lab Simulator API' });
});

app.get('/api/reports', async (req, res) => {
  const reports = await readReports();
  res.json({ reports });
});

app.post('/api/reports', async (req, res) => {
  const reports = await readReports();
  const report = {
    id: `UPES-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...req.body
  };

  await fs.mkdir(reportsDir, { recursive: true });
  reports.unshift(report);
  await fs.writeFile(reportsFile, JSON.stringify(reports.slice(0, 100), null, 2));

  res.status(201).json({ ok: true, report });
});

app.listen(port, host, () => {
  console.log(`UPES Physics Virtual Lab API running on http://${host}:${port}`);
});
