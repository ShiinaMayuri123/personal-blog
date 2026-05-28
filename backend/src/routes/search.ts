import { Router, Request, Response } from 'express';
import { getDatabase } from '../db/database.js';
import type { ApiResponse } from '../types.js';

interface SearchResult {
  type: 'article' | 'knowledge';
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  tags: string[];
  relevance: number;
}

const MAX_QUERY_LENGTH = 200;

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

// GET /api/search?q=keyword
router.get('/', async (req: Request, res: Response) => {
  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    res.status(400).json({ success: false, error: 'Query parameter "q" is required' });
    return;
  }

  if (q.length > MAX_QUERY_LENGTH) {
    res.status(400).json({ success: false, error: `Query too long (max ${MAX_QUERY_LENGTH} characters)` });
    return;
  }

  try {
    const db = await getDatabase();
    const searchTerm = `%${q}%`;
    const results: SearchResult[] = [];

    // Search articles
    const articleStmt = db.prepare(`
      SELECT * FROM articles
      WHERE title LIKE ? OR excerpt LIKE ? OR content LIKE ? OR tags LIKE ?
    `);
    articleStmt.bind([searchTerm, searchTerm, searchTerm, searchTerm]);

    while (articleStmt.step()) {
      const row = articleStmt.getAsObject();
      const title = String(row.title ?? '');
      const titleMatch = title.toLowerCase().includes(q.toLowerCase());
      results.push({
        type: 'article',
        id: String(row.id ?? ''),
        title,
        slug: String(row.slug ?? ''),
        excerpt: String(row.excerpt ?? ''),
        tags: safeJsonParse(row.tags),
        relevance: titleMatch ? 2 : 1,
      });
    }
    articleStmt.free();

    // Search knowledge items
    const knowledgeStmt = db.prepare(`
      SELECT * FROM knowledge_items
      WHERE title LIKE ? OR content LIKE ? OR tags LIKE ? OR key_takeaways LIKE ?
    `);
    knowledgeStmt.bind([searchTerm, searchTerm, searchTerm, searchTerm]);

    while (knowledgeStmt.step()) {
      const row = knowledgeStmt.getAsObject();
      const title = String(row.title ?? '');
      const titleMatch = title.toLowerCase().includes(q.toLowerCase());
      results.push({
        type: 'knowledge',
        id: String(row.id ?? ''),
        title,
        slug: String(row.slug ?? ''),
        category: String(row.category ?? ''),
        tags: safeJsonParse(row.tags),
        relevance: titleMatch ? 2 : 1,
      });
    }
    knowledgeStmt.free();

    results.sort((a, b) => b.relevance - a.relevance);

    res.json({
      success: true,
      data: results,
      meta: { total: results.length, page: 1, limit: results.length },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
