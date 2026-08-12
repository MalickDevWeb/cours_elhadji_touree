import express from 'express';
import path from 'path';
import fs from 'fs';
import { publicRouter } from '../src/server/publicRouter';
import { schoolRouter } from '../src/server/schoolRouter';
import { uploadRouter } from '../src/server/uploadRouter';
import { emailRouter } from '../src/server/emailRouter';

const app = express();
const dbPath = path.join(process.cwd(), 'db.json');

app.use(express.json({ limit: '10mb' }));

const readDb = () => {
  try {
    if (fs.existsSync(dbPath)) {
      return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    }
  } catch (e) {
    console.error(e);
  }
  return {};
};

const writeDb = (data: any) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

app.use('/api/public', publicRouter);
app.use('/api', uploadRouter);
app.use('/api', schoolRouter);
app.use('/api', emailRouter);

app.get('/api/db', (_req, res) => {
  res.json(readDb());
});

app.post('/api/db', (req, res) => {
  const { key, data } = req.body;
  const db = readDb();
  if (key) {
    db[key] = data;
  } else {
    Object.assign(db, req.body);
  }
  const success = writeDb(db);
  res.json({ success });
});

export default app;
