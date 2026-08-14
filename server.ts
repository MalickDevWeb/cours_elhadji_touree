import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { publicRouter } from './src/server/publicRouter';
import { schoolRouter } from './src/server/schoolRouter';
import { uploadRouter } from './src/server/uploadRouter';
import { emailRouter } from './src/server/emailRouter';
import { attendanceRouter } from './src/server/attendanceRouter';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const dbPath = path.join(process.cwd(), 'db.json');

  app.use(express.json({ limit: '10mb' }));
  app.use(express.static(path.join(process.cwd(), 'public')));

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

  // API Endpoints
  app.use('/api/public', publicRouter);
  app.use('/api', uploadRouter);
  app.use('/api', schoolRouter);
  app.use('/api', emailRouter);
  app.use('/api', attendanceRouter);

  app.get('/api/db', (req, res) => {
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

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
