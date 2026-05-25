import { GraphNode3D, GraphEdge } from '../types/knowledge'

interface LayoutOptions {
  iterations?: number
  repulsion?: number
  attraction?: number
  centering?: number
  damping?: number
}

const DEFAULT_OPTIONS: Required<LayoutOptions> = {
  iterations: 200,
  repulsion: 800,
  attraction: 0.015,
  centering: 0.01,
  damping: 0.9,
}

export function computeForceLayout3D(
  nodes: { id: string; title: string; category: string; difficulty: string }[],
  edges: GraphEdge[],
  options?: LayoutOptions
): GraphNode3D[] {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  const positions = new Map<string, [number, number, number]>()
  const velocities = new Map<string, [number, number, number]>()

  nodes.forEach((node, i) => {
    const phi = Math.acos(-1 + (2 * i) / nodes.length)
    const theta = Math.sqrt(nodes.length * Math.PI) * phi
    const r = 8 + Math.random() * 4
    positions.set(node.id, [
      r * Math.cos(theta) * Math.sin(phi),
      r * Math.sin(theta) * Math.sin(phi),
      r * Math.cos(phi),
    ])
    velocities.set(node.id, [0, 0, 0])
  })

  const getPos = (id: string) => positions.get(id) ?? [0, 0, 0]

  for (let iter = 0; iter < opts.iterations; iter++) {
    const forces = new Map<string, [number, number, number]>()
    nodes.forEach(node => forces.set(node.id, [0, 0, 0]))

    // Repulsion (Coulomb) - all pairs
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i]
        const b = nodes[j]
        const posA = getPos(a.id)
        const posB = getPos(b.id)

        const dx = posA[0] - posB[0]
        const dy = posA[1] - posB[1]
        const dz = posA[2] - posB[2]
        const distSq = dx * dx + dy * dy + dz * dz + 0.01
        const dist = Math.sqrt(distSq)
        const force = opts.repulsion / distSq

        const fx = (dx / dist) * force
        const fy = (dy / dist) * force
        const fz = (dz / dist) * force

        const fA = forces.get(a.id)!
        const fB = forces.get(b.id)!
        fA[0] += fx; fA[1] += fy; fA[2] += fz
        fB[0] -= fx; fB[1] -= fy; fB[2] -= fz
      }
    }

    // Attraction (Hooke) - connected pairs
    edges.forEach(edge => {
      const posA = getPos(edge.source)
      const posB = getPos(edge.target)

      const dx = posB[0] - posA[0]
      const dy = posB[1] - posA[1]
      const dz = posB[2] - posA[2]
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz + 0.01)

      const force = opts.attraction * dist
      const fx = (dx / dist) * force
      const fy = (dy / dist) * force
      const fz = (dz / dist) * force

      const fA = forces.get(edge.source)!
      const fB = forces.get(edge.target)!
      fA[0] += fx; fA[1] += fy; fA[2] += fz
      fB[0] -= fx; fB[1] -= fy; fB[2] -= fz
    })

    // Centering force
    nodes.forEach(node => {
      const pos = getPos(node.id)
      const f = forces.get(node.id)!
      f[0] -= pos[0] * opts.centering
      f[1] -= pos[1] * opts.centering
      f[2] -= pos[2] * opts.centering
    })

    // Update positions with velocity and damping
    const cooling = 1 - iter / opts.iterations
    nodes.forEach(node => {
      const pos = positions.get(node.id)!
      const vel = velocities.get(node.id)!
      const f = forces.get(node.id)!

      vel[0] = (vel[0] + f[0] * cooling) * opts.damping
      vel[1] = (vel[1] + f[1] * cooling) * opts.damping
      vel[2] = (vel[2] + f[2] * cooling) * opts.damping

      pos[0] += vel[0]
      pos[1] += vel[1]
      pos[2] += vel[2]
    })
  }

  return nodes.map(node => ({
    ...node,
    category: node.category as GraphNode3D['category'],
    difficulty: node.difficulty as GraphNode3D['difficulty'],
    position: positions.get(node.id) as [number, number, number],
  }))
}
