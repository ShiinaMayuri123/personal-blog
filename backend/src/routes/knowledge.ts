import { Router, Request, Response } from 'express';
import { getDatabase, saveDatabase } from '../db/database.js';
import type { ApiResponse, KnowledgeItem, CategoryType, DifficultyLevel } from '../types.js';

interface KnowledgeStats {
  totalItems: number;
  totalCategories: number;
  avgReadTime: number;
  avgRelations: number;
  difficultySplit: Record<DifficultyLevel, number>;
  categorySplit: Record<CategoryType, number>;
}

const VALID_CATEGORIES: CategoryType[] = ['frontend', 'architecture', 'devops', 'career', 'tools'];
const VALID_DIFFICULTIES: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];

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

function parseRow(row: Record<string, unknown>): KnowledgeItem {
  return {
    id: String(row.id ?? ''),
    title: String(row.title ?? ''),
    slug: String(row.slug ?? ''),
    category: String(row.category ?? 'frontend') as CategoryType,
    difficulty: String(row.difficulty ?? 'intermediate') as DifficultyLevel,
    readTime: Number(row.read_time) || 0,
    tags: safeJsonParse(row.tags),
    relatedIds: safeJsonParse(row.related_ids),
    prerequisiteIds: safeJsonParse(row.prerequisite_ids),
    lastUpdated: String(row.last_updated ?? ''),
    keyTakeaways: safeJsonParse(row.key_takeaways),
    content: String(row.content ?? ''),
    sources: safeJsonParse(row.sources),
  };
}

function execToRows(result: Array<{ columns: string[]; values: unknown[][] }>): Array<Record<string, unknown>> {
  if (!result.length || !result[0].values.length) return [];
  const columns = result[0].columns;
  return result[0].values.map(row => {
    const obj: Record<string, unknown> = {};
    columns.forEach((col, i) => { obj[col] = row[i]; });
    return obj;
  });
}

// GET /api/knowledge
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const { category, difficulty } = req.query;

    let sql = 'SELECT * FROM knowledge_items WHERE 1=1';
    const params: unknown[] = [];

    if (category && typeof category === 'string') {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (difficulty && typeof difficulty === 'string') {
      sql += ' AND difficulty = ?';
      params.push(difficulty);
    }

    sql += ' ORDER BY last_updated DESC';

    const stmt = db.prepare(sql);
    if (params.length > 0) {
      stmt.bind(params);
    }

    const rows: Array<Record<string, unknown>> = [];
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }
    stmt.free();

    const items = rows.map(parseRow);

    res.json({ success: true, data: items, meta: { total: items.length, page: 1, limit: items.length } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/knowledge/stats
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const result = db.exec('SELECT * FROM knowledge_items');
    const rows = execToRows(result);
    const items = rows.map(parseRow);

    const count = items.length || 1; // Prevent division by zero
    const stats: KnowledgeStats = {
      totalItems: items.length,
      totalCategories: new Set(items.map(i => i.category)).size,
      avgReadTime: Math.round(items.reduce((sum, item) => sum + item.readTime, 0) / count),
      avgRelations: parseFloat((items.reduce((sum, item) => sum + item.relatedIds.length, 0) / count).toFixed(1)),
      difficultySplit: {} as Record<DifficultyLevel, number>,
      categorySplit: {} as Record<CategoryType, number>,
    };

    (['beginner', 'intermediate', 'advanced'] as const).forEach(level => {
      stats.difficultySplit[level] = items.filter(i => i.difficulty === level).length;
    });

    (['frontend', 'architecture', 'devops', 'career', 'tools'] as const).forEach(cat => {
      stats.categorySplit[cat] = items.filter(i => i.category === cat).length;
    });

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/knowledge/:slug
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT * FROM knowledge_items WHERE slug = ?');
    stmt.bind([req.params.slug]);

    if (!stmt.step()) {
      stmt.free();
      res.status(404).json({ success: false, error: 'Knowledge item not found' });
      return;
    }

    const row = stmt.getAsObject();
    stmt.free();

    const item = parseRow(row);
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/knowledge
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, slug, category, difficulty, readTime, tags, relatedIds, prerequisiteIds, keyTakeaways, content, sources } = req.body;

    if (!title || !slug || !category || !difficulty) {
      res.status(400).json({ success: false, error: 'title, slug, category, and difficulty are required' });
      return;
    }

    if (typeof title !== 'string' || typeof slug !== 'string') {
      res.status(400).json({ success: false, error: 'title and slug must be strings' });
      return;
    }

    if (!VALID_CATEGORIES.includes(category)) {
      res.status(400).json({ success: false, error: `category must be one of: ${VALID_CATEGORIES.join(', ')}` });
      return;
    }

    if (!VALID_DIFFICULTIES.includes(difficulty)) {
      res.status(400).json({ success: false, error: `difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}` });
      return;
    }

    if (title.length > 500 || slug.length > 200) {
      res.status(400).json({ success: false, error: 'Input too long' });
      return;
    }

    const validTags = Array.isArray(tags) ? tags.filter((t: unknown) => typeof t === 'string') : [];
    const validRelatedIds = Array.isArray(relatedIds) ? relatedIds.filter((t: unknown) => typeof t === 'string') : [];
    const validPrerequisiteIds = Array.isArray(prerequisiteIds) ? prerequisiteIds.filter((t: unknown) => typeof t === 'string') : [];
    const validKeyTakeaways = Array.isArray(keyTakeaways) ? keyTakeaways.filter((t: unknown) => typeof t === 'string') : [];
    const validSources = Array.isArray(sources) ? sources : [];
    const validReadTime = typeof readTime === 'number' && readTime > 0 ? Math.round(readTime) : 10;
    const validContent = typeof content === 'string' ? content : '';

    const db = await getDatabase();
    const itemId = slug;
    const now = new Date().toISOString().split('T')[0];

    db.run(
      `INSERT INTO knowledge_items (id, title, slug, category, difficulty, read_time, tags, related_ids, prerequisite_ids, last_updated, key_takeaways, content, sources) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [itemId, title, slug, category, difficulty, validReadTime, JSON.stringify(validTags), JSON.stringify(validRelatedIds), JSON.stringify(validPrerequisiteIds), now, JSON.stringify(validKeyTakeaways), validContent, JSON.stringify(validSources)]
    );
    saveDatabase();

    const item: KnowledgeItem = {
      id: itemId, title, slug, category, difficulty, readTime: validReadTime,
      tags: validTags, relatedIds: validRelatedIds, prerequisiteIds: validPrerequisiteIds,
      lastUpdated: now, keyTakeaways: validKeyTakeaways, content: validContent, sources: validSources,
    };
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PUT /api/knowledge/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { title, slug, category, difficulty, readTime, tags, relatedIds, prerequisiteIds, keyTakeaways, content, sources } = req.body;
    const db = await getDatabase();

    // Get existing item
    const stmt = db.prepare('SELECT * FROM knowledge_items WHERE id = ?');
    stmt.bind([req.params.id]);

    if (!stmt.step()) {
      stmt.free();
      res.status(404).json({ success: false, error: 'Knowledge item not found' });
      return;
    }

    const existing = stmt.getAsObject();
    stmt.free();

    // Merge with existing data (prevent undefined overwrite)
    const updatedTitle = typeof title === 'string' ? title : String(existing.title ?? '');
    const updatedSlug = typeof slug === 'string' ? slug : String(existing.slug ?? '');
    const updatedCategory = VALID_CATEGORIES.includes(category) ? category : String(existing.category ?? 'frontend') as CategoryType;
    const updatedDifficulty = VALID_DIFFICULTIES.includes(difficulty) ? difficulty : String(existing.difficulty ?? 'intermediate') as DifficultyLevel;
    const updatedReadTime = typeof readTime === 'number' && readTime > 0 ? Math.round(readTime) : Number(existing.read_time) || 10;
    const updatedContent = typeof content === 'string' ? content : String(existing.content ?? '');
    const updatedTags = Array.isArray(tags) ? tags.filter((t: unknown) => typeof t === 'string') : safeJsonParse(existing.tags);
    const updatedRelatedIds = Array.isArray(relatedIds) ? relatedIds.filter((t: unknown) => typeof t === 'string') : safeJsonParse(existing.related_ids);
    const updatedPrerequisiteIds = Array.isArray(prerequisiteIds) ? prerequisiteIds.filter((t: unknown) => typeof t === 'string') : safeJsonParse(existing.prerequisite_ids);
    const updatedKeyTakeaways = Array.isArray(keyTakeaways) ? keyTakeaways.filter((t: unknown) => typeof t === 'string') : safeJsonParse(existing.key_takeaways);
    const updatedSources = Array.isArray(sources) ? sources : safeJsonParse(existing.sources);

    if (updatedTitle.length > 500 || updatedSlug.length > 200) {
      res.status(400).json({ success: false, error: 'Input too long' });
      return;
    }

    const now = new Date().toISOString().split('T')[0];
    db.run(
      `UPDATE knowledge_items SET title = ?, slug = ?, category = ?, difficulty = ?, read_time = ?, tags = ?, related_ids = ?, prerequisite_ids = ?, last_updated = ?, key_takeaways = ?, content = ?, sources = ?, updated_at = datetime('now') WHERE id = ?`,
      [updatedTitle, updatedSlug, updatedCategory, updatedDifficulty, updatedReadTime, JSON.stringify(updatedTags), JSON.stringify(updatedRelatedIds), JSON.stringify(updatedPrerequisiteIds), now, JSON.stringify(updatedKeyTakeaways), updatedContent, JSON.stringify(updatedSources), req.params.id]
    );
    saveDatabase();

    const item: KnowledgeItem = {
      id: req.params.id, title: updatedTitle, slug: updatedSlug, category: updatedCategory, difficulty: updatedDifficulty, readTime: updatedReadTime,
      tags: updatedTags, relatedIds: updatedRelatedIds, prerequisiteIds: updatedPrerequisiteIds,
      lastUpdated: now, keyTakeaways: updatedKeyTakeaways, content: updatedContent, sources: updatedSources,
    };
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// DELETE /api/knowledge/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();

    const stmt = db.prepare('SELECT * FROM knowledge_items WHERE id = ?');
    stmt.bind([req.params.id]);

    if (!stmt.step()) {
      stmt.free();
      res.status(404).json({ success: false, error: 'Knowledge item not found' });
      return;
    }
    stmt.free();

    db.run('DELETE FROM knowledge_items WHERE id = ?', [req.params.id]);
    saveDatabase();

    res.json({ success: true, data: null });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
