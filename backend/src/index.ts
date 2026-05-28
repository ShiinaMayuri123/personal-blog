import express from 'express';
import cors from 'cors';
import { getDatabase, closeDatabase } from './db/database.js';
import articlesRouter from './routes/articles.js';
import knowledgeRouter from './routes/knowledge.js';
import learningPathsRouter from './routes/learning-paths.js';
import knowledgeGraphRouter from './routes/knowledge-graph.js';
import searchRouter from './routes/search.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

// Initialize database on startup
async function startServer() {
  try {
    await getDatabase();
    console.log('Database initialized');

    // Routes
    app.use('/api/articles', articlesRouter);
    app.use('/api/knowledge', knowledgeRouter);
    app.use('/api/learning-paths', learningPathsRouter);
    app.use('/api/knowledge-graph', knowledgeGraphRouter);
    app.use('/api/search', searchRouter);

    // Health check
    app.get('/api/health', (_req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // Error handling
    app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      console.error('Unhandled error:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    });

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });

    // Graceful shutdown
    const shutdown = () => {
      console.log('Shutting down...');
      server.close(() => {
        closeDatabase();
        process.exit(0);
      });
      // Force exit after 10 seconds
      setTimeout(() => {
        closeDatabase();
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
