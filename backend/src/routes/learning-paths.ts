import { Router, Request, Response } from 'express';
import { getDatabase } from '../db/database.js';
import type { ApiResponse, LearningPath } from '../types.js';

const router = Router();

function safeJsonParse(str: unknown, fallback: string[] = []): string[] {
  if (typeof str !== 'string') return fallback;
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

// GET /api/learning-paths
router.get('/', async (_req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT * FROM learning_paths');
    const rows: Record<string, unknown>[] = [];

    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }
    stmt.free();

    const paths: LearningPath[] = rows.map(row => ({
      id: String(row.id ?? ''),
      title: String(row.title ?? ''),
      slug: String(row.slug ?? ''),
      description: String(row.description ?? ''),
      difficulty: String(row.difficulty ?? 'intermediate') as LearningPath['difficulty'],
      estimatedHours: Number(row.estimated_hours) || 0,
      knowledgeItemIds: safeJsonParse(row.knowledge_item_ids),
    }));

    res.json({ success: true, data: paths });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/learning-paths/:slug
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT * FROM learning_paths WHERE slug = ?');
    stmt.bind([req.params.slug]);

    if (!stmt.step()) {
      stmt.free();
      res.status(404).json({ success: false, error: 'Learning path not found' });
      return;
    }

    const row = stmt.getAsObject();
    stmt.free();

    const path: LearningPath = {
      id: String(row.id ?? ''),
      title: String(row.title ?? ''),
      slug: String(row.slug ?? ''),
      description: String(row.description ?? ''),
      difficulty: String(row.difficulty ?? 'intermediate') as LearningPath['difficulty'],
      estimatedHours: Number(row.estimated_hours) || 0,
      knowledgeItemIds: safeJsonParse(row.knowledge_item_ids),
    };

    res.json({ success: true, data: path });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
