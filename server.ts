import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const dataFilePath = path.join(process.cwd(), 'aymen_photos_store.json');

// Get saved photos
app.get('/api/photos', (req, res) => {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf-8');
      return res.json(JSON.parse(data));
    }
    return res.json({});
  } catch (err) {
    console.error('Error reading photos:', err);
    return res.json({});
  }
});

// Save photos permanently to disk
app.post('/api/photos', (req, res) => {
  try {
    const data = req.body;
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Photos successfully saved to server disk:', Object.keys(data));
    return res.json({ success: true, message: 'Saved permanently to server' });
  } catch (err) {
    console.error('Failed to write photos:', err);
    return res.status(500).json({ error: 'Failed to write file' });
  }
});

async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
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
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
