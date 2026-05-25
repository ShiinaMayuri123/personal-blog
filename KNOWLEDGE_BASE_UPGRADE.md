# 个人博客升级为知识库系统 - 完整实现指南

## 项目概述

将 `personal-blog` 从简单的文章博客升级为**系统化知识库系统**，具备：
- 📚 多层级知识组织（分类、难度、标签）
- 🔗 知识图谱（双向链接、反向引用）
- 🎯 学习路径（结构化学习计划）
- 📖 Markdown 支持（完整内容编辑）
- 🔍 全文搜索（快速查询）
- 📊 知识统计仪表板

---

## 阶段一：数据层重构

### 文件结构变更

```
src/
├── data/
│   ├── knowledge/
│   │   ├── frontend/
│   │   │   ├── react-hooks.md
│   │   │   ├── typescript-advanced.md
│   │   │   └── css-system.md
│   │   ├── architecture/
│   │   │   ├── system-design.md
│   │   │   └── design-patterns.md
│   │   └── devops/
│   │       └── deployment.md
│   ├── articles.ts              # 旧数据（保留）
│   ├── knowledge.ts             # 新知识库数据结构
│   ├── knowledge-graph.ts       # 知识关系图
│   └── learning-paths.ts        # 学习路径定义
├── types/
│   └── knowledge.ts             # TypeScript 类型定义
├── utils/
│   ├── markdown.ts              # Markdown 解析工具
│   └── search.ts                # 全文搜索工具
├── hooks/
│   ├── useKnowledgeGraph.ts     # 知识图谱 Hook
│   └── useSearch.ts             # 搜索 Hook
├── components/
│   ├── KnowledgeCard.tsx        # 知识点卡片
│   ├── KnowledgeGraph.tsx       # 可视化知识图谱
│   ├── RelatedItems.tsx         # 相关知识展示
│   └── Markdown Renderer.tsx    # Markdown 渲染器
├── pages/
│   ├── Home.tsx                 # 改造后首页
│   ├── KnowledgeDetail.tsx      # 知识点详情页
│   ├── KnowledgeMap.tsx         # 知识图谱可视化页
│   └── LearningPaths.tsx        # 学习路径页
└── App.tsx                      # 更新路由
```

---

## 阶段二：类型定义

### `src/types/knowledge.ts`

```typescript
/**
 * 知识库的核心类型定义
 */

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'
export type CategoryType = 'frontend' | 'architecture' | 'devops' | 'career' | 'tools'
export type RelationType = 'related' | 'prerequisite' | 'advanced' | 'alternative'

/**
 * 知识点数据结构
 */
export interface KnowledgeItem {
  // 基础信息
  id: string
  title: string
  slug: string
  category: CategoryType
  
  // 内容
  content: string // Markdown 格式
  excerpt?: string
  
  // 元数据
  difficulty: DifficultyLevel
  readTime: number // 预计阅读时间（分钟）
  tags: string[]
  lastUpdated: string // ISO 日期格式
  
  // 关系
  relatedIds: string[] // 相关知识点 ID
  prerequisiteIds?: string[] // 前置知识 ID
  
  // 扩展
  sources?: Reference[]
  keyTakeaways?: string[] // 核心要点
}

/**
 * 参考资源
 */
export interface Reference {
  title: string
  url: string
  type?: 'official' | 'article' | 'video' | 'tool'
}

/**
 * 知识图谱节点
 */
export interface GraphNode {
  id: string
  title: string
  category: CategoryType
  difficulty: DifficultyLevel
  tag?: string
}

/**
 * 知识图谱边（关系）
 */
export interface GraphEdge {
  source: string
  target: string
  type: RelationType
  bidirectional?: boolean
}

/**
 * 知识图谱
 */
export interface KnowledgeGraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

/**
 * 学习路径
 */
export interface LearningPath {
  id: string
  name: string
  description: string
  difficulty: DifficultyLevel
  estimatedHours: number
  itemIds: string[] // 按顺序排列的知识点
  goals: string[]
  prerequisites?: string[] // 前置路径
}

/**
 * 搜索结果
 */
export interface SearchResult {
  id: string
  title: string
  slug: string
  category: CategoryType
  difficulty: DifficultyLevel
  excerpt: string
  score: number // 匹配度 0-1
}

/**
 * 知识库统计
 */
export interface KnowledgeStats {
  totalItems: number
  totalCategories: number
  avgReadTime: number
  avgRelations: number
  difficultySplit: Record<DifficultyLevel, number>
  categorySplit: Record<CategoryType, number>
}
```

---

## 阶段三：数据文件

### `src/data/knowledge.ts`

```typescript
/**
 * 知识库核心数据
 * 包含所有知识点的定义
 */

import { KnowledgeItem, CategoryType } from '../types/knowledge'

/**
 * React Hooks 深度指南
 */
const ReactHooksAdvanced: KnowledgeItem = {
  id: 'react-hooks-advanced',
  title: 'React Hooks 深度指南',
  slug: 'react-hooks-advanced',
  category: 'frontend',
  difficulty: 'advanced',
  readTime: 15,
  tags: ['React', 'Hooks', 'State Management'],
  relatedIds: ['usestate-internals', 'custom-hooks', 'performance-optimization'],
  prerequisiteIds: ['react-basics'],
  lastUpdated: '2026-05-24',
  keyTakeaways: [
    '理解 Hooks 的调用规则（Rules of Hooks）',
    '掌握常用 Hooks（useState, useEffect, useContext）',
    '学会创建自定义 Hooks',
    '性能优化技巧（useMemo, useCallback）',
  ],
  content: `# React Hooks 深度指南

## 📚 目录
1. [Hooks 基础](#hooks-基础)
2. [常用 Hooks 详解](#常用-hooks-详解)
3. [自定义 Hooks](#自定义-hooks)
4. [性能优化](#性能优化)
5. [常见错误](#常见错误)

## Hooks 基础

### 什么是 Hooks？

Hooks 是 React 16.8 引入的新特性，允许你在函数式组件中使用 state 和其他 React 特性。

\`\`\`typescript
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
\`\`\`

### Hooks 的调用规则（Rules of Hooks）

1. **只在最顶层调用 Hooks**
   - 不要在循环、条件或嵌套函数中调用
   - 这样确保 Hooks 的执行顺序一致

2. **只在 React 函数式组件或自定义 Hooks 中调用**
   - 不要在普通 JavaScript 函数中调用

\`\`\`typescript
// ❌ 错误：在条件中使用
function Bad() {
  const [count, setCount] = useState(0)
  if (count > 0) {
    const [name, setName] = useState('') // 错误！
  }
}

// ✅ 正确
function Good() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')
}
\`\`\`

## 常用 Hooks 详解

### useState

管理组件的局部状态。

\`\`\`typescript
const [state, setState] = useState(initialValue)

// 使用函数初始化（延迟初始化）
const [state, setState] = useState(() => expensiveComputation())

// 更新状态时使用函数形式（保证基于最新状态）
setState(prevState => prevState + 1)
\`\`\`

**何时使用：**
- 管理表单数据
- 切换 UI 状态（展开/收起）
- 计数器、动画状态

### useEffect

执行副作用操作（API 请求、订阅、定时器等）。

\`\`\`typescript
// 在每次渲染后运行
useEffect(() => {
  console.log('组件更新了')
})

// 仅在挂载和卸载时运行（依赖数组为空）
useEffect(() => {
  console.log('组件挂载了')
  return () => console.log('组件卸载了')
}, [])

// 当 dependencies 改变时运行
useEffect(() => {
  console.log('userId 改变了')
}, [userId])
\`\`\`

**常见模式：**
\`\`\`typescript
// 数据获取
useEffect(() => {
  let isMounted = true
  
  fetch('/api/data')
    .then(res => res.json())
    .then(data => {
      if (isMounted) setData(data)
    })
  
  return () => { isMounted = false }
}, [])

// 订阅管理
useEffect(() => {
  const subscription = observable.subscribe(value => setValue(value))
  return () => subscription.unsubscribe()
}, [])
\`\`\`

### useContext

读取 React Context 的值，避免 props drilling。

\`\`\`typescript
const theme = useContext(ThemeContext)

// 使用
<div style={{ background: theme.background }}>
  {theme.isDark ? '🌙' : '☀️'}
</div>
\`\`\`

## 自定义 Hooks

将可复用的逻辑提取为自定义 Hook。

\`\`\`typescript
// ✅ 自定义 Hook：表单处理
function useForm(initialValues) {
  const [values, setValues] = useState(initialValues)
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
  }
  
  const reset = () => setValues(initialValues)
  
  return { values, handleChange, reset }
}

// 使用
function LoginForm() {
  const { values, handleChange, reset } = useForm({
    email: '',
    password: '',
  })
  
  return (
    <form onSubmit={() => { /* ... */ reset() }}>
      <input
        name="email"
        value={values.email}
        onChange={handleChange}
      />
    </form>
  )
}
\`\`\`

\`\`\`typescript
// ✅ 自定义 Hook：异步数据获取
function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err)
        setLoading(false)
      })
  }, [url])
  
  return { data, loading, error }
}

// 使用
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(\`/api/users/\${userId}\`)
  
  if (loading) return <p>加载中...</p>
  if (error) return <p>出错了</p>
  return <div>{user.name}</div>
}
\`\`\`

## 性能优化

### useMemo

缓存计算结果，避免不必要的重新计算。

\`\`\`typescript
const memoizedValue = useMemo(() => {
  return expensiveComputation(a, b)
}, [a, b])

// 例：过滤列表（只在 items 或 filter 改变时重新计算）
const filteredItems = useMemo(
  () => items.filter(item => item.includes(filter)),
  [items, filter]
)
\`\`\`

**何时使用：**
- 复杂计算（排序、过滤大数组）
- 传递给 React.memo 组件的对象

### useCallback

缓存函数定义，避免子组件不必要的重新渲染。

\`\`\`typescript
const memoizedCallback = useCallback(
  (a, b) => doSomething(a, b),
  [a, b]
)

// 例：避免子组件重新渲染
function Parent() {
  const [count, setCount] = useState(0)
  
  const handleClick = useCallback(() => {
    console.log('clicked')
  }, [])
  
  return <Child onClick={handleClick} />
}
\`\`\`

## 常见错误

| 错误 | 原因 | 修复 |
|-----|------|------|
| Hook 调用顺序改变 | 在条件中使用 Hook | 将条件逻辑移到 Hook 外 |
| 依赖数组不完整 | 忘记添加依赖 | 使用 ESLint 插件检查 |
| 内存泄漏 | 忘记清理副作用 | 在 useEffect 返回清理函数 |
| 无限循环 | 依赖数组指向 Hook | 确保依赖是原始值 |

---

## 总结检查清单

- [ ] 理解 Hooks 的调用规则
- [ ] 掌握 useState、useEffect、useContext
- [ ] 能编写自定义 Hooks
- [ ] 知道何时使用 useMemo 和 useCallback
- [ ] 熟悉常见错误和修复方式

## 延伸阅读

- [React Hooks 官方文档](https://react.dev/reference/react/hooks)
- [Hooks FAQ](https://react.dev/reference/react/hooks#faq)
- [Custom Hooks 深度指南](https://react.dev/learn/reusing-logic-with-custom-hooks)
`,
  sources: [
    {
      title: 'React 官方 Hooks 文档',
      url: 'https://react.dev/reference/react/hooks',
      type: 'official',
    },
    {
      title: 'React Hooks 完全指南',
      url: 'https://overreacted.io/a-complete-guide-to-useeffect/',
      type: 'article',
    },
    {
      title: 'Epic React by Kent C. Dodds',
      url: 'https://epicreact.dev',
      type: 'video',
    },
  ],
}

/**
 * TypeScript 类型系统进阶
 */
const TypeScriptAdvanced: KnowledgeItem = {
  id: 'typescript-advanced',
  title: 'TypeScript 类型系统进阶',
  slug: 'typescript-advanced',
  category: 'frontend',
  difficulty: 'advanced',
  readTime: 20,
  tags: ['TypeScript', 'Types', 'Generics'],
  relatedIds: ['react-typescript', 'type-guards'],
  lastUpdated: '2026-05-24',
  keyTakeaways: [
    '泛型的高级用法',
    '条件类型和映射类型',
    '类型体操基础',
    '常用工具类型（Partial, Pick, Omit 等）',
  ],
  content: `# TypeScript 类型系统进阶

## 📚 核心主题

### 泛型（Generics）

泛型允许你创建可重用的组件，这些组件可以处理多种类型。

\`\`\`typescript
// 基础泛型
function identity<T>(arg: T): T {
  return arg
}

const result = identity<string>('hello') // result: string

// 泛型约束
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]
}

getProperty({ name: 'John' }, 'name') // ✅
getProperty({ name: 'John' }, 'age')  // ❌ 类型错误
\`\`\`

### 条件类型（Conditional Types）

根据条件选择不同的类型。

\`\`\`typescript
type IsString<T> = T extends string ? true : false

type A = IsString<'hello'> // true
type B = IsString<42>       // false

// 分布式条件类型
type Flatten<T> = T extends Array<infer U> ? U : T

type Str = Flatten<string[]> // string
type Num = Flatten<number>   // number
\`\`\`

### 映射类型（Mapped Types）

基于现有类型创建新类型。

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

type Getters<T> = {
  [P in keyof T as \`get\${Capitalize<string & P>}\`]: () => T[P]
}
\`\`\`

---

## 详细内容...
`,
  sources: [
    {
      title: 'TypeScript 官方文档',
      url: 'https://www.typescriptlang.org/docs/',
      type: 'official',
    },
  ],
}

/**
 * 系统设计基础
 */
const SystemDesignBasics: KnowledgeItem = {
  id: 'system-design-basics',
  title: '系统设计基础：缓存策略',
  slug: 'system-design-basics',
  category: 'architecture',
  difficulty: 'intermediate',
  readTime: 18,
  tags: ['System Design', 'Caching', 'Performance'],
  relatedIds: ['database-optimization', 'performance-patterns'],
  lastUpdated: '2026-05-24',
  keyTakeaways: [
    '缓存的三层模型（CDN、应用、数据库）',
    '常见缓存策略（LRU、LFU、FIFO）',
    '缓存穿透、击穿、雪崩问题解决方案',
    '分布式缓存（Redis）的应用',
  ],
  content: `# 系统设计基础：缓存策略

缓存是现代系统的核心优化技术...

## 缓存的三层模型

1. **CDN 缓存**（边缘节点）
2. **应用缓存**（内存、Redis）
3. **数据库缓存**（查询缓存）

...（详细内容）
`,
  sources: [
    {
      title: 'System Design Primer',
      url: 'https://github.com/donnemartin/system-design-primer',
      type: 'article',
    },
  ],
}

/**
 * 知识库主数组
 */
export const knowledgeBase: KnowledgeItem[] = [
  ReactHooksAdvanced,
  TypeScriptAdvanced,
  SystemDesignBasics,
  // 后续添加更多...
]

/**
 * 快速查询：按 ID 创建 Map
 */
export const knowledgeMap = new Map(
  knowledgeBase.map(item => [item.id, item])
)

/**
 * 按分类分组
 */
export function getItemsByCategory(category: CategoryType): KnowledgeItem[] {
  return knowledgeBase.filter(item => item.category === category)
}

/**
 * 按难度分组
 */
export function getItemsByDifficulty(difficulty: DifficultyLevel): KnowledgeItem[] {
  return knowledgeBase.filter(item => item.difficulty === difficulty)
}

/**
 * 获取统计数据
 */
export function getKnowledgeStats(): KnowledgeStats {
  const stats: KnowledgeStats = {
    totalItems: knowledgeBase.length,
    totalCategories: new Set(knowledgeBase.map(i => i.category)).size,
    avgReadTime: Math.round(
      knowledgeBase.reduce((sum, item) => sum + item.readTime, 0) /
        knowledgeBase.length
    ),
    avgRelations: parseFloat(
      (
        knowledgeBase.reduce((sum, item) => sum + item.relatedIds.length, 0) /
        knowledgeBase.length
      ).toFixed(1)
    ),
    difficultySplit: {},
    categorySplit: {},
  }

  // 填充难度分布
  ;(['beginner', 'intermediate', 'advanced'] as const).forEach(level => {
    stats.difficultySplit[level] = knowledgeBase.filter(
      i => i.difficulty === level
    ).length
  })

  // 填充分类分布
  ;(['frontend', 'architecture', 'devops', 'career', 'tools'] as const).forEach(
    cat => {
      stats.categorySplit[cat] = knowledgeBase.filter(i => i.category === cat).length
    }
  )

  return stats
}
```

### `src/data/knowledge-graph.ts`

```typescript
/**
 * 知识图谱实现
 * 管理知识点之间的关系和连接
 */

import { KnowledgeItem, GraphNode, GraphEdge, KnowledgeGraphData } from '../types/knowledge'
import { knowledgeBase } from './knowledge'

export class KnowledgeGraph {
  private nodes: Map<string, GraphNode>
  private edges: Map<string, GraphEdge[]>

  constructor() {
    this.nodes = new Map()
    this.edges = new Map()
    this.buildGraph()
  }

  /**
   * 构建知识图谱
   */
  private buildGraph() {
    // 构建节点
    knowledgeBase.forEach(item => {
      this.nodes.set(item.id, {
        id: item.id,
        title: item.title,
        category: item.category,
        difficulty: item.difficulty,
      })
    })

    // 构建边（关系）
    knowledgeBase.forEach(item => {
      if (!this.edges.has(item.id)) {
        this.edges.set(item.id, [])
      }

      // 添加相关知识
      item.relatedIds.forEach(relatedId => {
        this.edges.get(item.id)!.push({
          source: item.id,
          target: relatedId,
          type: 'related',
          bidirectional: true,
        })
      })

      // 添加前置知识
      item.prerequisiteIds?.forEach(prereqId => {
        this.edges.get(item.id)!.push({
          source: prereqId,
          target: item.id,
          type: 'prerequisite',
        })
      })
    })
  }

  /**
   * 获取某个知识点的所有相关项
   */
  getRelated(itemId: string): GraphNode[] {
    const edges = this.edges.get(itemId) || []
    return edges
      .map(edge => this.nodes.get(edge.target))
      .filter(Boolean) as GraphNode[]
  }

  /**
   * 获取反向链接（有哪些项引用了这个）
   */
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

  /**
   * 获取前置知识
   */
  getPrerequisites(itemId: string): GraphNode[] {
    const edges = this.edges.get(itemId) || []
    const prereqIds = edges
      .filter(edge => edge.type === 'prerequisite')
      .map(edge => edge.target)

    return prereqIds
      .map(id => this.nodes.get(id))
      .filter(Boolean) as GraphNode[]
  }

  /**
   * 获取进阶内容（依赖于此项的知识）
   */
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

  /**
   * 获取可视化数据（D3.js/Three.js）
   */
  getVisualizationData(): KnowledgeGraphData {
    const nodes = Array.from(this.nodes.values())
    const edges = Array.from(this.edges.values()).flat()
    return { nodes, edges }
  }

  /**
   * 广度优先搜索：获取相连的所有知识点（N 层）
   */
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

  /**
   * 获取完整的图数据
   */
  getAllNodes(): GraphNode[] {
    return Array.from(this.nodes.values())
  }

  getAllEdges(): GraphEdge[] {
    return Array.from(this.edges.values()).flat()
  }
}

/**
 * 全局知识图谱实例
 */
export const knowledgeGraph = new KnowledgeGraph()
```

### `src/data/learning-paths.ts`

```typescript
/**
 * 学习路径定义
 * 为用户提供结构化的学习计划
 */

import { LearningPath } from '../types/knowledge'

export const learningPaths: LearningPath[] = [
  {
    id: 'react-mastery',
    name: 'React 完全掌握之路',
    description: '从基础到精通 React，成为高级前端工程师',
    difficulty: 'advanced',
    estimatedHours: 40,
    itemIds: [
      'react-basics',
      'react-hooks-advanced',
      'custom-hooks',
      'performance-optimization',
      'react-patterns',
    ],
    goals: [
      '深入理解 React 的工作原理',
      '写出高效、可维护的 React 代码',
      '掌握性能优化技巧',
    ],
  },
  {
    id: 'typescript-mastery',
    name: 'TypeScript 精通之路',
    description: '从零到精通 TypeScript，掌握类型系统',
    difficulty: 'advanced',
    estimatedHours: 30,
    itemIds: [
      'typescript-basics',
      'typescript-advanced',
      'type-guards',
      'react-typescript',
    ],
    goals: [
      '理解 TypeScript 的类型系统',
      '编写类型安全的代码',
      '掌握高级类型技巧',
    ],
  },
  {
    id: 'fullstack-fundamentals',
    name: '全栈开发基础',
    description: '前后端技术栈全面入门',
    difficulty: 'beginner',
    estimatedHours: 60,
    itemIds: [
      'javascript-basics',
      'frontend-fundamentals',
      'react-basics',
      'nodejs-basics',
      'database-101',
      'api-design',
    ],
    goals: [
      '理解全栈开发的核心概念',
      '完成一个完整的全栈项目',
    ],
  },
  {
    id: 'system-design-foundation',
    name: '系统设计基础',
    description: '学习构建可扩展系统的核心原理',
    difficulty: 'intermediate',
    estimatedHours: 35,
    itemIds: [
      'system-design-basics',
      'scalability-patterns',
      'database-optimization',
      'caching-strategies',
      'load-balancing',
    ],
    goals: [
      '理解系统设计的核心概念',
      '能够设计中等规模系统',
      '掌握常见的性能优化方案',
    ],
  },
]
```

---

## 阶段四：工具和 Hook

### `src/utils/search.ts`

```typescript
/**
 * 全文搜索实现
 * 使用 Fuse.js 进行高效模糊搜索
 */

import Fuse from 'fuse.js'
import { KnowledgeItem, SearchResult } from '../types/knowledge'
import { knowledgeBase } from '../data/knowledge'

class SearchEngine {
  private fuse: Fuse<KnowledgeItem>

  constructor() {
    this.fuse = new Fuse(knowledgeBase, {
      keys: [
        { name: 'title', weight: 0.7 },
        { name: 'tags', weight: 0.5 },
        { name: 'excerpt', weight: 0.3 },
        { name: 'content', weight: 0.1 },
      ],
      threshold: 0.3,
      includeScore: true,
    })
  }

  search(query: string): SearchResult[] {
    if (!query.trim()) return []

    const results = this.fuse.search(query)

    return results.map(result => ({
      id: result.item.id,
      title: result.item.title,
      slug: result.item.slug,
      category: result.item.category,
      difficulty: result.item.difficulty,
      excerpt: result.item.excerpt || result.item.content.substring(0, 100),
      score: 1 - (result.score || 0),
    }))
  }
}

export const searchEngine = new SearchEngine()
```

### `src/hooks/useKnowledgeGraph.ts`

```typescript
/**
 * React Hook: 知识图谱
 * 提供对知识图谱的便利访问
 */

import { useMemo } from 'react'
import { knowledgeGraph } from '../data/knowledge-graph'
import { knowledgeMap } from '../data/knowledge'
import { KnowledgeItem, GraphNode } from '../types/knowledge'

export interface UseKnowledgeGraphReturn {
  getRelated: (itemId: string) => KnowledgeItem[]
  getBacklinks: (itemId: string) => KnowledgeItem[]
  getPrerequisites: (itemId: string) => KnowledgeItem[]
  getAdvanced: (itemId: string) => KnowledgeItem[]
}

export function useKnowledgeGraph(): UseKnowledgeGraphReturn {
  return useMemo(
    () => ({
      getRelated: (itemId: string) => {
        const nodes = knowledgeGraph.getRelated(itemId)
        return nodes
          .map(node => knowledgeMap.get(node.id))
          .filter(Boolean) as KnowledgeItem[]
      },

      getBacklinks: (itemId: string) => {
        const nodes = knowledgeGraph.getBacklinks(itemId)
        return nodes
          .map(node => knowledgeMap.get(node.id))
          .filter(Boolean) as KnowledgeItem[]
      },

      getPrerequisites: (itemId: string) => {
        const nodes = knowledgeGraph.getPrerequisites(itemId)
        return nodes
          .map(node => knowledgeMap.get(node.id))
          .filter(Boolean) as KnowledgeItem[]
      },

      getAdvanced: (itemId: string) => {
        const nodes = knowledgeGraph.getAdvanced(itemId)
        return nodes
          .map(node => knowledgeMap.get(node.id))
          .filter(Boolean) as KnowledgeItem[]
      },
    }),
    []
  )
}
```

### `src/hooks/useSearch.ts`

```typescript
/**
 * React Hook: 搜索
 * 提供搜索功能
 */

import { useState, useCallback } from 'react'
import { SearchResult } from '../types/knowledge'
import { searchEngine } from '../utils/search'

export interface UseSearchReturn {
  results: SearchResult[]
  isSearching: boolean
  search: (query: string) => void
  clear: () => void
}

export function useSearch(): UseSearchReturn {
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const search = useCallback((query: string) => {
    setIsSearching(true)
    try {
      const searchResults = searchEngine.search(query)
      setResults(searchResults)
    } finally {
      setIsSearching(false)
    }
  }, [])

  const clear = useCallback(() => {
    setResults([])
  }, [])

  return { results, isSearching, search, clear }
}
```

---

## 阶段五：页面组件

### `src/pages/KnowledgeDetail.tsx`

```typescript
/**
 * 知识点详情页
 * 显示单个知识点的完整内容和相关信息
 */

import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, Calendar, Tag, Clock, Zap } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { knowledgeMap } from '../data/knowledge'
import { useKnowledgeGraph } from '../hooks/useKnowledgeGraph'
import { KnowledgeItem } from '../types/knowledge'

function KnowledgeDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { getRelated, getBacklinks, getPrerequisites, getAdvanced } = useKnowledgeGraph()

  // 查找知识点
  const item = Array.from(knowledgeMap.values()).find(k => k.slug === slug)

  if (!item) {
    return (
      <main className="content-area">
        <motion.div
          className="not-found"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>知识点未找到</h1>
          <p>抱歉，未能找到你要访问的知识点。</p>
          <Link to="/" className="back-link">
            <ArrowLeft size={16} />
            返回首页
          </Link>
        </motion.div>
      </main>
    )
  }

  const related = getRelated(item.id)
  const backlinks = getBacklinks(item.id)
  const prerequisites = getPrerequisites(item.id)
  const advanced = getAdvanced(item.id)

  return (
    <>
      {/* 顶部导航 */}
      <motion.header
        className="article-detail-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="site-hero-inner">
          <div className="site-hero-top">
            <Link to="/" className="site-title">
              📚 知识库
            </Link>
            <nav className="site-nav">
              <motion.button
                className="nav-link"
                onClick={() => navigate(-1)}
                whileHover={{ x: -4 }}
              >
                <ArrowLeft size={15} />
                返回
              </motion.button>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* 主内容 */}
      <motion.article
        className="knowledge-detail"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {/* 标题 */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="knowledge-title"
        >
          {item.title}
        </motion.h1>

        {/* 元数据 */}
        <motion.div
          className="knowledge-meta"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <span className="meta-item">
            <Calendar size={14} />
            {item.lastUpdated}
          </span>
          <span className="meta-item difficulty">
            <Zap size={14} />
            {item.difficulty}
          </span>
          <span className="meta-item">
            <Clock size={14} />
            {item.readTime} 分钟阅读
          </span>
          {item.tags.map(tag => (
            <span key={tag} className="tag">
              <Tag size={11} />
              {tag}
            </span>
          ))}
        </motion.div>

        {/* 核心要点 */}
        {item.keyTakeaways && item.keyTakeaways.length > 0 && (
          <motion.section
            className="key-takeaways"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3>🎯 核心要点</h3>
            <ul>
              {item.keyTakeaways.map((takeaway, idx) => (
                <li key={idx}>{takeaway}</li>
              ))}
            </ul>
          </motion.section>
        )}

        {/* Markdown 内容 */}
        <motion.div
          className="knowledge-content"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.content}</ReactMarkdown>
        </motion.div>

        {/* 前置知识 */}
        {prerequisites.length > 0 && (
          <motion.section className="related-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3>📋 前置知识</h3>
            <p>建议先学习以下内容：</p>
            <div className="related-grid">
              {prerequisites.map(prereq => (
                <Link
                  key={prereq.id}
                  to={`/knowledge/${prereq.slug}`}
                  className="related-card prerequisite"
                >
                  {prereq.title}
                  <span className="difficulty-badge">{prereq.difficulty}</span>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* 相关知识 */}
        {related.length > 0 && (
          <motion.section className="related-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3>🔗 相关知识</h3>
            <div className="related-grid">
              {related.map(rel => (
                <Link
                  key={rel.id}
                  to={`/knowledge/${rel.slug}`}
                  className="related-card"
                >
                  {rel.title}
                  <span className="difficulty-badge">{rel.difficulty}</span>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* 进阶内容 */}
        {advanced.length > 0 && (
          <motion.section className="related-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3>🚀 进阶内容</h3>
            <p>学完本章后可以继续学习：</p>
            <div className="related-grid">
              {advanced.map(adv => (
                <Link
                  key={adv.id}
                  to={`/knowledge/${adv.slug}`}
                  className="related-card advanced"
                >
                  {adv.title}
                  <span className="difficulty-badge">{adv.difficulty}</span>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* 参考资源 */}
        {item.sources && item.sources.length > 0 && (
          <motion.section className="sources" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3>📚 参考资源</h3>
            <ul>
              {item.sources.map((source, idx) => (
                <li key={idx}>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.title}
                  </a>
                  {source.type && <span className="source-type">{source.type}</span>}
                </li>
              ))}
            </ul>
          </motion.section>
        )}

        {/* 反向链接 */}
        {backlinks.length > 0 && (
          <motion.section className="backlinks" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3>👈 谁引用了这个</h3>
            <p>以下内容引用了这个知识点：</p>
            <ul>
              {backlinks.map(link => (
                <li key={link.id}>
                  <Link to={`/knowledge/${link.slug}`}>{link.title}</Link>
                </li>
              ))}
            </ul>
          </motion.section>
        )}
      </motion.article>
    </>
  )
}

export default KnowledgeDetail
```

---

## 阶段六：路由配置

### `src/App.tsx` - 更新部分

```typescript
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import KnowledgeDetail from './pages/KnowledgeDetail'
import KnowledgeMap from './pages/KnowledgeMap'
import LearningPaths from './pages/LearningPaths'
import ArticleDetail from './pages/ArticleDetail'

function App() {
  const location = useLocation()

  return (
    <div className="app-shell">
      <Routes location={location}>
        {/* 首页 */}
        <Route path="/" element={<Home />} />

        {/* 知识库 */}
        <Route path="/knowledge/:slug" element={<KnowledgeDetail />} />

        {/* 知识图谱可视化 */}
        <Route path="/map" element={<KnowledgeMap />} />

        {/* 学习路径 */}
        <Route path="/paths" element={<LearningPaths />} />

        {/* 旧的文章路由（保留兼容性） */}
        <Route path="/articles/:slug" element={<ArticleDetail />} />
      </Routes>
    </div>
  )
}

export default App
```

---

## 实现检查清单

### 第一阶段完成后 ✅
- [ ] 创建所有 TypeScript 类型定义
- [ ] 创建 `knowledge.ts` 知识库数据
- [ ] 创建 `knowledge-graph.ts` 关系图
- [ ] 创建 `learning-paths.ts` 学习路径
- [ ] 安装依赖：`npm install react-markdown remark-gfm fuse.js`

### 第二阶段完成后 ✅
- [ ] 实现搜索引擎 Hook
- [ ] 实现知识图谱 Hook
- [ ] 创建 `KnowledgeDetail.tsx` 详情页
- [ ] 测试 Markdown 渲染
- [ ] 测试链接导航

### 第三阶段完成后 ✅
- [ ] 创建知识库首页（统计、分类）
- [ ] 创建知识图谱可视化页
- [ ] 创建学习路径页
- [ ] 添加搜索功能到命令面板
- [ ] 完善样式和动画

### 优化阶段 ⏳
- [ ] SEO 优化（元标签、结构化数据）
- [ ] 性能优化（代码分割、懒加载）
- [ ] PWA 支持（离线访问）
- [ ] 评论系统（可选）
- [ ] 用户学习进度追踪（localStorage）

---

## 快速开始指令

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 创建第一个知识点
# - 编辑 src/data/knowledge.ts
# - 添加新的 KnowledgeItem
# - 更新 knowledgeBase 数组

# 4. 测试页面
# 访问 http://localhost:5173/knowledge/react-hooks-advanced
```

---

## 预期效果

**从这样：** 😐
- 个人博客（平面列表）
- 简单标签过滤
- 纯文本内容

**变成这样：** 🚀
- **知识库系统**（分类、难度、标签）
- **知识图谱**（相关推荐、双向链接）
- **学习路径**（结构化学习计划）
- **Markdown 支持**（富文本、代码高亮）
- **全文搜索**（快速查询）
- **知识仪表板**（统计和进度）

---

## 参考资源

- [Obsidian 知识库系统](https://obsidian.md/)
- [React 官方文档结构](https://react.dev)
- [Fuse.js 模糊搜索](https://fusejs.io/)
- [Markdown 最佳实践](https://www.markdownguide.org/)
