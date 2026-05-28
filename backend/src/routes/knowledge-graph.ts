import { Router, Request, Response } from 'express';
import { getDatabase } from '../db/database.js';
import type { ApiResponse, KnowledgeGraphNode, KnowledgeGraphEdge } from '../types.js';

interface KnowledgeGraphData {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
}

const router = Router();

// GET /api/knowledge-graph
router.get('/', async (_req: Request, res: Response) => {
  try {
    const db = await getDatabase();

    const nodesStmt = db.prepare('SELECT * FROM knowledge_graph_nodes');
    const nodes: KnowledgeGraphNode[] = [];
    while (nodesStmt.step()) {
      const row = nodesStmt.getAsObject();
      nodes.push({
        id: row.id as string,
        label: row.label as string,
        category: row.category as string,
        x: row.x as number | undefined,
        y: row.y as number | undefined,
      });
    }
    nodesStmt.free();

    const edgesStmt = db.prepare('SELECT * FROM knowledge_graph_edges');
    const edges: KnowledgeGraphEdge[] = [];
    while (edgesStmt.step()) {
      const row = edgesStmt.getAsObject();
      edges.push({
        id: row.id as string,
        source: row.source as string,
        target: row.target as string,
        type: row.type as string,
      });
    }
    edgesStmt.free();

    const graphData: KnowledgeGraphData = { nodes, edges };
    const response: ApiResponse<KnowledgeGraphData> = { success: true, data: graphData };
    res.json(response);
  } catch (error) {
    console.error('Error fetching knowledge graph:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
