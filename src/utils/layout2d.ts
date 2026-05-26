import { GraphNode, GraphEdge } from '../types/knowledge'

export interface GraphNode2D extends GraphNode {
  x: number
  y: number
  vx: number
  vy: number
}

export interface ClusterInfo {
  category: string
  x: number
  y: number
}

export function computeTreeNetworkLayout2D(
  nodes: GraphNode[],
  edges: GraphEdge[]
): { nodes: GraphNode2D[]; clusters: ClusterInfo[] } {
  // 1. Initialize nodes
  const nodes2D: GraphNode2D[] = nodes.map(n => ({
    ...n,
    x: Math.random() * 100 - 50,
    y: Math.random() * 100 - 50,
    vx: 0,
    vy: 0
  }))

  // 2. Define cluster centers in a 360-degree circle
  const categories = Array.from(new Set(nodes.map(n => n.category)))
  const categoryCenters = new Map<string, { x: number, y: number }>()
  const radius = Math.max(300, categories.length * 80) // Expand radius with more categories
  
  categories.forEach((cat, idx) => {
    const angle = (idx / categories.length) * Math.PI * 2
    categoryCenters.set(cat, {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    })
  })

  // 3. Force-directed simulation parameters
  const iterations = 400
  const repulsion = 40000     // Node repulsion to prevent overlap
  const springLength = 150    // Ideal edge length
  const springStrength = 0.05 // Edge attraction strength
  const clusterStrength = 0.04 // Force pulling nodes to their category center
  const damping = 0.65        // Velocity damping

  // Run simulation
  for (let i = 0; i < iterations; i++) {
    // a. Repulsion between all nodes
    for (let a = 0; a < nodes2D.length; a++) {
      for (let b = a + 1; b < nodes2D.length; b++) {
        const n1 = nodes2D[a]
        const n2 = nodes2D[b]
        let dx = n1.x - n2.x
        let dy = n1.y - n2.y
        let distSq = dx * dx + dy * dy
        if (distSq === 0) { dx = 1; dy = 1; distSq = 2; }
        
        const force = repulsion / distSq
        const dist = Math.sqrt(distSq)
        const fx = (dx / dist) * force
        const fy = (dy / dist) * force
        
        n1.vx += fx; n1.vy += fy;
        n2.vx -= fx; n2.vy -= fy;
      }
    }

    // b. Attraction along edges
    edges.forEach(edge => {
      const n1 = nodes2D.find(n => n.id === edge.source)
      const n2 = nodes2D.find(n => n.id === edge.target)
      if (!n1 || !n2) return
      
      const dx = n2.x - n1.x
      const dy = n2.y - n1.y
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      
      const force = (dist - springLength) * springStrength
      const fx = (dx / dist) * force
      const fy = (dy / dist) * force
      
      n1.vx += fx; n1.vy += fy;
      n2.vx -= fx; n2.vy -= fy;
    })

    // c. Cluster attraction (pulling nodes to their category group)
    nodes2D.forEach(n => {
      const center = categoryCenters.get(n.category)!
      const dx = center.x - n.x
      const dy = center.y - n.y
      n.vx += dx * clusterStrength
      n.vy += dy * clusterStrength
    })

    // d. Apply forces and damping
    nodes2D.forEach(n => {
      n.x += n.vx
      n.y += n.vy
      n.vx *= damping
      n.vy *= damping
    })
  }

  // 4. Final centering of the whole graph
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  nodes2D.forEach(n => {
    if (n.x < minX) minX = n.x
    if (n.x > maxX) maxX = n.x
    if (n.y < minY) minY = n.y
    if (n.y > maxY) maxY = n.y
  })
  
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2
  
  nodes2D.forEach(n => {
    n.x -= cx
    n.y -= cy
  })

  // Format clusters for UI
  const clusters: ClusterInfo[] = Array.from(categoryCenters.entries()).map(([category, pos]) => ({
    category,
    x: pos.x - cx,
    y: pos.y - cy
  }))

  return { nodes: nodes2D, clusters }
}
