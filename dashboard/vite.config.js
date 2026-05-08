import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const TOEFL_DIR = path.join(os.homedir(), '.toefl');

function readJson(relPath, fallback) {
  const full = path.join(TOEFL_DIR, relPath);
  try {
    if (!fs.existsSync(full)) return fallback;
    const raw = fs.readFileSync(full, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return { error: String(e), ...fallback };
  }
}

function readMarkdown(relPath) {
  const full = path.join(TOEFL_DIR, relPath);
  try {
    if (!fs.existsSync(full)) return null;
    return fs.readFileSync(full, 'utf-8');
  } catch {
    return null;
  }
}

const apiMiddleware = () => ({
  name: 'toefl-api',
  configureServer(server) {
    const routes = {
      '/api/config': () => readJson('config.json', { error: 'not configured. run /toefl first.' }),
      '/api/writing': () => readJson('writing/index.json', { entries: [] }),
      '/api/reading': () => readJson('reading/index.json', { entries: [] }),
      '/api/listening': () => readJson('listening/index.json', { entries: [] }),
      '/api/speaking': () => readJson('speaking/index.json', { entries: [] }),
      '/api/errors': () => readJson('errors/tags.json', { tags: {} }),
      '/api/synonyms': () => readJson('synonyms/library.json', { entries: [] }),
      '/api/vocab': () => readJson('vocab/srs.json', { queue: [] }),
    };

    server.middlewares.use((req, res, next) => {
      const url = req.url.split('?')[0];
      if (routes[url]) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(routes[url]()));
        return;
      }
      if (url.startsWith('/api/entry/')) {
        const rel = decodeURIComponent(url.slice('/api/entry/'.length));
        const safe = rel.replace(/\.\./g, '');
        const content = readMarkdown(safe);
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end(content ?? 'not found');
        return;
      }
      next();
    });
  },
});

export default defineConfig({
  plugins: [react(), apiMiddleware()],
  server: { port: 5173, host: '127.0.0.1' },
});
