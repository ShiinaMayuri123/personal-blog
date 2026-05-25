import { GraphNode, GraphEdge, KnowledgeGraphData } from '../types/knowledge'
import { knowledgeBase } from './knowledge'

export class KnowledgeGraph {
  private nodes: Map<string, GraphNode>
  private edges: Map<string, GraphEdge[]>

  constructor() {
    this.nodes = new Map()
    this.edges = new Map()
    this.buildGraph()
  }

  private buildGraph() {
    knowledgeBase.forEach(item => {
      this.nodes.set(item.id, {
        id: item.id,
        title: item.title,
        category: item.category,
        difficulty: item.difficulty,
      })
    })

    knowledgeBase.forEach(item => {
      if (!this.edges.has(item.id)) {
        this.edges.set(item.id, [])
      }

      item.relatedIds.forEach(relatedId => {
        this.edges.get(item.id)!.push({
          source: item.id,
          target: relatedId,
          type: 'related',
          bidirectional: true,
        })
      })

      item.prerequisiteIds?.forEach(prereqId => {
        this.edges.get(item.id)!.push({
          source: prereqId,
          target: item.id,
          type: 'prerequisite',
        })
      })
    })
  }

  getRelated(itemId: string): GraphNode[] {
    const edges = this.edges.get(itemId) || []
    return edges
      .map(edge => this.nodes.get(edge.target))
      .filter(Boolean) as GraphNode[]
  }

  getBacklinks(itemId: string): GraphNode[] {
    const backlinks: GraphNode[] = []
    this.edges.forEach(edges => {
      edges.forEach(edge => {
        if (edge.target === itemId && edge.bidirectional) {
          const node = this.nodes.get(edge.source)
          if (node) backlinks.push(node)
        }
      })
    })
    return backlinks
  }

  getPrerequisites(itemId: string): GraphNode[] {
    const edges = this.edges.get(itemId) || []
    const prereqIds = edges
      .filter(edge => edge.type === 'prerequisite')
      .map(edge => edge.target)
    return prereqIds
      .map(id => this.nodes.get(id))
      .filter(Boolean) as GraphNode[]
  }

  getAdvanced(itemId: string): GraphNode[] {
    const advanced: GraphNode[] = []
    this.edges.forEach(edges => {
      edges.forEach(edge => {
        if (edge.target === itemId && edge.type === 'prerequisite') {
          const node = this.nodes.get(edge.source)
          if (node) advanced.push(node)
        }
      })
    })
    return advanced
  }

  getVisualizationData(): KnowledgeGraphData {
    const nodes = Array.from(this.nodes.values())
    const edges = Array.from(this.edges.values()).flat()
    return { nodes, edges }
  }

  getConnectedNodes(itemId: string, depth: number = 2): GraphNode[] {
    const visited = new Set<string>()
    const queue: [string, number][] = [[itemId, 0]]
    const result: GraphNode[] = []

    while (queue.length > 0) {
      const [currentId, currentDepth] = queue.shift()!
      if (visited.has(currentId)) continue
      visited.add(currentId)

      if (currentDepth > 0) {
        const node = this.nodes.get(currentId)
        if (node) result.push(node)
      }

      if (currentDepth < depth) {
        const edges = this.edges.get(currentId) || []
        edges.forEach(edge => {
          if (!visited.has(edge.target)) {
            queue.push([edge.target, currentDepth + 1])
          }
        })
      }
    }

    return result
  }

  getAllNodes(): GraphNode[] {
    return Array.from(this.nodes.values())
  }

  getAllEdges(): GraphEdge[] {
    return Array.from(this.edges.values()).flat()
  }
}

export const knowledgeGraph = new KnowledgeGraph()
