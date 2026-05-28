import { Router, Request, Response } from 'express';
import { getDatabase, saveDatabase } from '../db/database.js';
import type { ApiResponse, Article } from '../types.js';

const router = Router();

function safeJsonParse(str: unknown, fallback: unknown[] = []): unknown[] {
  if (typeof str !== 'string') return fallback;
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

// GET /api/articles
router.get('/', async (_req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const result = db.exec('SELECT * FROM articles ORDER BY date DESC');

    if (!result.length || !result[0].values.length) {
      res.json({ success: true, data: [], meta: { total: 0, page: 1, limit: 0 } });
      return;
    }

    const columns = result[0].columns;
    const articles: Article[] = result[0].values.map(row => {
      const obj: Record<string, unknown> = {};
      columns.forEach((col, i) => { obj[col] = row[i]; });
      return {
        id: String(obj.id ?? ''),
        title: String(obj.title ?? ''),
        slug: String(obj.slug ?? ''),
        date: String(obj.date ?? ''),
        excerpt: String(obj.excerpt ?? ''),
        tags: safeJsonParse(obj.tags),
        content: String(obj.content ?? ''),
      };
    });

    res.json({ success: true, data: articles, meta: { total: articles.length, page: 1, limit: articles.length } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/articles/:slug
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT * FROM articles WHERE slug = ?');
    stmt.bind([req.params.slug]);

    if (!stmt.step()) {
      stmt.free();
      res.status(404).json({ success: false, error: 'Article not found' });
      return;
    }

    const row = stmt.getAsObject();
    stmt.free();

    const article: Article = {
      id: String(row.id ?? ''),
      title: String(row.title ?? ''),
      slug: String(row.slug ?? ''),
      date: String(row.date ?? ''),
      excerpt: String(row.excerpt ?? ''),
      tags: safeJsonParse(row.tags),
      content: String(row.content ?? ''),
    };

    res.json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/articles
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, slug, date, excerpt, tags, content } = req.body;

    if (!title || !slug || !content) {
      res.status(400).json({ success: false, error: 'title, slug, and content are required' });
      return;
    }

    if (typeof title !== 'string' || typeof slug !== 'string' || typeof content !== 'string') {
      res.status(400).json({ success: false, error: 'title, slug, and content must be strings' });
      return;
    }

    if (title.length > 500 || slug.length > 200 || content.length > 100000) {
      res.status(400).json({ success: false, error: 'Input too long' });
      return;
    }

    const validTags = Array.isArray(tags) ? tags.filter((t: unknown) => typeof t === 'string') : [];
    const articleDate = date && typeof date === 'string' ? date : new Date().toISOString().split('T')[0];
    const articleExcerpt = excerpt && typeof excerpt === 'string' ? excerpt : '';
    const articleId = Date.now().toString();

    const db = await getDatabase();
    db.run(
      `INSERT INTO articles (id, title, slug, date, excerpt, tags, content) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [articleId, title, slug, articleDate, articleExcerpt, JSON.stringify(validTags), content]
    );
    saveDatabase();

    const article: Article = { id: articleId, title, slug, date: articleDate, excerpt: articleExcerpt, tags: validTags, content };
    res.status(201).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PUT /api/articles/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { title, slug, date, excerpt, tags, content } = req.body;
    const db = await getDatabase();

    // Get existing article
    const stmt = db.prepare('SELECT * FROM articles WHERE id = ?');
    stmt.bind([req.params.id]);

    if (!stmt.step()) {
      stmt.free();
      res.status(404).json({ success: false, error: 'Article not found' });
      return;
    }

    const existing = stmt.getAsObject();
    stmt.free();

    // Merge with existing data (prevent undefined overwrite)
    const updatedTitle = typeof title === 'string' ? title : String(existing.title ?? '');
    const updatedSlug = typeof slug === 'string' ? slug : String(existing.slug ?? '');
    const updatedDate = typeof date === 'string' ? date : String(existing.date ?? '');
    const updatedExcerpt = typeof excerpt === 'string' ? excerpt : String(existing.excerpt ?? '');
    const updatedContent = typeof content === 'string' ? content : String(existing.content ?? '');
    const updatedTags = Array.isArray(tags) ? tags.filter((t: unknown) => typeof t === 'string') : safeJsonParse(existing.tags);

    if (updatedTitle.length > 500 || updatedSlug.length > 200 || updatedContent.length > 100000) {
      res.status(400).json({ success: false, error: 'Input too long' });
      return;
    }

    db.run(
      `UPDATE articles SET title = ?, slug = ?, date = ?, excerpt = ?, tags = ?, content = ?, updated_at = datetime('now') WHERE id = ?`,
      [updatedTitle, updatedSlug, updatedDate, updatedExcerpt, JSON.stringify(updatedTags), updatedContent, req.params.id]
    );
    saveDatabase();

    const article: Article = { id: req.params.id, title: updatedTitle, slug: updatedSlug, date: updatedDate, excerpt: updatedExcerpt, tags: updatedTags, content: updatedContent };
    res.json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// DELETE /api/articles/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();

    const stmt = db.prepare('SELECT * FROM articles WHERE id = ?');
    stmt.bind([req.params.id]);

    if (!stmt.step()) {
      stmt.free();
      res.status(404).json({ success: false, error: 'Article not found' });
      return;
    }
    stmt.free();

    db.run('DELETE FROM articles WHERE id = ?', [req.params.id]);
    saveDatabase();

    res.json({ success: true, data: null });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
