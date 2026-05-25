import { KnowledgeItem, CategoryType, DifficultyLevel, KnowledgeStats } from '../types/knowledge'

const ReactHooksAdvanced: KnowledgeItem = {
  id: 'react-hooks-advanced',
  title: 'React Hooks 深度指南',
  slug: 'react-hooks-advanced',
  category: 'frontend',
  difficulty: 'advanced',
  readTime: 15,
  tags: ['React', 'Hooks', 'State Management'],
  relatedIds: ['typescript-advanced', 'system-design-basics'],
  prerequisiteIds: [],
  lastUpdated: '2026-05-24',
  keyTakeaways: [
    '理解 Hooks 的调用规则（Rules of Hooks）',
    '掌握常用 Hooks（useState, useEffect, useContext）',
    '学会创建自定义 Hooks',
    '性能优化技巧（useMemo, useCallback）',
  ],
  content: `# React Hooks 深度指南

## Hooks 基础

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

### Rules of Hooks

1. 只在最顶层调用 Hooks
2. 只在 React 函数式组件或自定义 Hooks 中调用

## 常用 Hooks

### useState

\`\`\`typescript
const [state, setState] = useState(initialValue)
setState(prevState => prevState + 1)
\`\`\`

### useEffect

\`\`\`typescript
useEffect(() => {
  // 副作用操作
  return () => { /* 清理函数 */ }
}, [dependencies])
\`\`\`

### useContext

\`\`\`typescript
const theme = useContext(ThemeContext)
\`\`\`

## 自定义 Hooks

\`\`\`typescript
function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => { setData(data); setLoading(false) })
  }, [url])

  return { data, loading }
}
\`\`\`

## 性能优化

- **useMemo**: 缓存计算结果
- **useCallback**: 缓存函数定义
- **React.memo**: 避免不必要的重新渲染
`,
  sources: [
    { title: 'React 官方 Hooks 文档', url: 'https://react.dev/reference/react/hooks', type: 'official' },
    { title: 'React Hooks 完全指南', url: 'https://overreacted.io/a-complete-guide-to-useeffect/', type: 'article' },
  ],
}

const TypeScriptAdvanced: KnowledgeItem = {
  id: 'typescript-advanced',
  title: 'TypeScript 类型系统进阶',
  slug: 'typescript-advanced',
  category: 'frontend',
  difficulty: 'advanced',
  readTime: 20,
  tags: ['TypeScript', 'Types', 'Generics'],
  relatedIds: ['react-hooks-advanced'],
  prerequisiteIds: [],
  lastUpdated: '2026-05-24',
  keyTakeaways: [
    '泛型的高级用法',
    '条件类型和映射类型',
    '类型体操基础',
    '常用工具类型（Partial, Pick, Omit 等）',
  ],
  content: `# TypeScript 类型系统进阶

## 泛型（Generics）

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg
}

// 泛型约束
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]
}
\`\`\`

## 条件类型

\`\`\`typescript
type IsString<T> = T extends string ? true : false
type Flatten<T> = T extends Array<infer U> ? U : T
\`\`\`

## 映射类型

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

type Getters<T> = {
  [P in keyof T as \`get\${Capitalize<string & P>}\`]: () => T[P]
}
\`\`\`
`,
  sources: [
    { title: 'TypeScript 官方文档', url: 'https://www.typescriptlang.org/docs/', type: 'official' },
  ],
}

const SystemDesignBasics: KnowledgeItem = {
  id: 'system-design-basics',
  title: '系统设计基础：缓存策略',
  slug: 'system-design-basics',
  category: 'architecture',
  difficulty: 'intermediate',
  readTime: 18,
  tags: ['System Design', 'Caching', 'Performance'],
  relatedIds: ['react-hooks-advanced', 'rest-api-design', 'database-design'],
  prerequisiteIds: [],
  lastUpdated: '2026-05-24',
  keyTakeaways: [
    '缓存的三层模型（CDN、应用、数据库）',
    '常见缓存策略（LRU、LFU、FIFO）',
    '缓存穿透、击穿、雪崩问题解决方案',
    '分布式缓存（Redis）的应用',
  ],
  content: `# 系统设计基础：缓存策略

## 缓存的三层模型

1. **CDN 缓存**（边缘节点）
2. **应用缓存**（内存、Redis）
3. **数据库缓存**（查询缓存）

## 常见缓存策略

| 策略 | 说明 | 适用场景 |
|------|------|----------|
| LRU | 最近最少使用 | 通用场景 |
| LFU | 最不经常使用 | 热点数据 |
| FIFO | 先进先出 | 时序数据 |

## 缓存问题

### 缓存穿透
请求的数据在缓存和数据库中都不存在。

**解决方案**: 布隆过滤器、缓存空值

### 缓存击穿
热点 key 过期，大量请求直接打到数据库。

**解决方案**: 互斥锁、永不过期

### 缓存雪崩
大量缓存同时过期。

**解决方案**: 随机过期时间、多级缓存
`,
  sources: [
    { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'article' },
  ],
}

const CSSGridFlexbox: KnowledgeItem = {
  id: 'css-grid-flexbox',
  title: 'CSS Grid & Flexbox 布局实战',
  slug: 'css-grid-flexbox',
  category: 'frontend',
  difficulty: 'beginner',
  readTime: 12,
  tags: ['CSS', 'Layout', 'Grid', 'Flexbox'],
  relatedIds: ['web-performance', 'react-component-patterns'],
  prerequisiteIds: [],
  lastUpdated: '2026-05-24',
  keyTakeaways: [
    'Flexbox 适合一维布局，Grid 适合二维布局',
    '掌握常用的 Grid 模板区域定义',
    '理解 fr 单位和 minmax() 的用法',
    '响应式布局的最佳实践',
  ],
  content: `# CSS Grid & Flexbox 布局实战

## Flexbox 一维布局

\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
\`\`\`

## Grid 二维布局

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 24px;
}

/* 响应式 */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
\`\`\`

## Grid 模板区域

\`\`\`css
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
}
\`\`\`
`,
  sources: [
    { title: 'CSS Grid 完整指南', url: 'https://css-tricks.com/snippets/css/complete-guide-grid/', type: 'article' },
    { title: 'Flexbox 完整指南', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', type: 'article' },
  ],
}

const ReactComponentPatterns: KnowledgeItem = {
  id: 'react-component-patterns',
  title: 'React 组件设计模式',
  slug: 'react-component-patterns',
  category: 'frontend',
  difficulty: 'intermediate',
  readTime: 16,
  tags: ['React', 'Patterns', 'Components'],
  relatedIds: ['react-hooks-advanced', 'state-management', 'typescript-advanced'],
  prerequisiteIds: ['react-hooks-advanced'],
  lastUpdated: '2026-05-24',
  keyTakeaways: [
    'Compound Components 模式',
    'Render Props vs Hooks 的取舍',
    '受控与非受控组件',
    '组件组合优于继承',
  ],
  content: `# React 组件设计模式

## Compound Components

\`\`\`typescript
function Select({ children, value, onChange }) {
  return React.Children.map(children, child =>
    React.cloneElement(child, { selected: value, onSelect: onChange })
  )
}

<Select value={selected} onChange={setSelected}>
  <Option value="a">Option A</Option>
  <Option value="b">Option B</Option>
</Select>
\`\`\`

## Render Props

\`\`\`typescript
function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  return <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}>
    {render(pos)}
  </div>
}
\`\`\`

## 自定义 Hook 模式

\`\`\`typescript
function useToggle(initial = false) {
  const [value, setValue] = useState(initial)
  const toggle = useCallback(() => setValue(v => !v), [])
  return [value, toggle] as const
}
\`\`\`
`,
  sources: [
    { title: 'React Patterns', url: 'https://reactpatterns.com/', type: 'article' },
  ],
}

const WebPerformance: KnowledgeItem = {
  id: 'web-performance',
  title: 'Web 性能优化实战',
  slug: 'web-performance',
  category: 'frontend',
  difficulty: 'intermediate',
  readTime: 14,
  tags: ['Performance', 'Core Web Vitals', 'Optimization'],
  relatedIds: ['css-grid-flexbox', 'nextjs-framework', 'react-hooks-advanced'],
  prerequisiteIds: [],
  lastUpdated: '2026-05-24',
  keyTakeaways: [
    'Core Web Vitals 三大指标（LCP、FID、CLS）',
    '代码分割和懒加载策略',
    '图片优化（WebP、AVIF、懒加载）',
    'Resource Hints（preload、prefetch）',
  ],
  content: `# Web 性能优化实战

## Core Web Vitals

| 指标 | 含义 | 目标 |
|------|------|------|
| LCP | 最大内容绘制 | < 2.5s |
| FID | 首次输入延迟 | < 100ms |
| CLS | 累积布局偏移 | < 0.1 |

## 代码分割

\`\`\`typescript
const HeavyComponent = React.lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<Skeleton />}>
      <HeavyComponent />
    </Suspense>
  )
}
\`\`\`

## 图片优化

\`\`\`html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" loading="lazy" alt="...">
</picture>
\`\`\`
`,
  sources: [
    { title: 'Web.dev 性能指南', url: 'https://web.dev/performance/', type: 'official' },
  ],
}

const StateManagement: KnowledgeItem = {
  id: 'state-management',
  title: '前端状态管理策略',
  slug: 'state-management',
  category: 'frontend',
  difficulty: 'intermediate',
  readTime: 15,
  tags: ['State', 'Zustand', 'Redux', 'Jotai'],
  relatedIds: ['react-component-patterns', 'react-hooks-advanced', 'nextjs-framework'],
  prerequisiteIds: ['react-hooks-advanced'],
  lastUpdated: '2026-05-24',
  keyTakeaways: [
    '服务端状态 vs 客户端状态',
    'Zustand/Jotai 轻量级方案',
    'React Query/TanStack Query 管理异步状态',
    '状态提升和 Context 的适用场景',
  ],
  content: `# 前端状态管理策略

## 状态分类

1. **UI 状态**: 模态框开关、选中项
2. **表单状态**: 输入值、校验错误
3. **服务端状态**: API 数据、缓存
4. **URL 状态**: 路由参数、查询字符串

## Zustand

\`\`\`typescript
import { create } from 'zustand'

const useStore = create((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
}))
\`\`\`

## TanStack Query

\`\`\`typescript
function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
    staleTime: 5 * 60 * 1000,
  })
}
\`\`\`
`,
  sources: [
    { title: 'Zustand 文档', url: 'https://zustand-demo.pmnd.rs/', type: 'official' },
  ],
}

const NextJSFramework: KnowledgeItem = {
  id: 'nextjs-framework',
  title: 'Next.js 全栈框架',
  slug: 'nextjs-framework',
  category: 'frontend',
  difficulty: 'intermediate',
  readTime: 18,
  tags: ['Next.js', 'SSR', 'SSG', 'RSC'],
  relatedIds: ['web-performance', 'state-management', 'react-component-patterns', 'rest-api-design'],
  prerequisiteIds: ['react-hooks-advanced'],
  lastUpdated: '2026-05-24',
  keyTakeaways: [
    'App Router 和 React Server Components',
    'SSR vs SSG vs ISR 的选择',
    'Server Actions 和数据变更',
    'Metadata API 和 SEO 优化',
  ],
  content: `# Next.js 全栈框架

## 渲染策略

| 策略 | 说明 | 适用场景 |
|------|------|----------|
| SSR | 服务端渲染 | 动态内容 |
| SSG | 静态生成 | 博客、文档 |
| ISR | 增量静态再生 | 电商产品页 |
| RSC | React Server Components | 混合场景 |

## App Router

\`\`\`typescript
// app/page.tsx
export default async function Home() {
  const data = await fetch('https://api.example.com/data')
  const items = await data.json()
  return <List items={items} />
}
\`\`\`

## Server Actions

\`\`\`typescript
// app/actions.ts
'use server'
export async function createPost(formData: FormData) {
  const title = formData.get('title')
  await db.posts.create({ data: { title } })
}
\`\`\`
`,
  sources: [
    { title: 'Next.js 官方文档', url: 'https://nextjs.org/docs', type: 'official' },
  ],
}

const FrontendTesting: KnowledgeItem = {
  id: 'frontend-testing',
  title: '前端测试策略与实践',
  slug: 'frontend-testing',
  category: 'frontend',
  difficulty: 'intermediate',
  readTime: 14,
  tags: ['Testing', 'Vitest', 'Playwright', 'TDD'],
  relatedIds: ['react-component-patterns', 'react-hooks-advanced'],
  prerequisiteIds: ['react-hooks-advanced'],
  lastUpdated: '2026-05-24',
  keyTakeaways: [
    '测试金字塔：单元 > 集成 > E2E',
    'Vitest + React Testing Library 组件测试',
    'Playwright E2E 测试',
    'Mock 和 Stub 的使用场景',
  ],
  content: `# 前端测试策略与实践

## 测试金字塔

1. **单元测试** (70%): 工具函数、Hooks
2. **集成测试** (20%): 组件交互
3. **E2E 测试** (10%): 关键用户流程

## Vitest 组件测试

\`\`\`typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Counter } from './Counter'

test('increments count on click', () => {
  render(<Counter />)
  const button = screen.getByRole('button')
  fireEvent.click(button)
  expect(button).toHaveTextContent('Count: 1')
})
\`\`\`

## Playwright E2E

\`\`\`typescript
test('user can login', async ({ page }) => {
  await page.goto('/login')
  await page.fill('#email', 'test@example.com')
  await page.fill('#password', 'password')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')
})
\`\`\`
`,
  sources: [
    { title: 'Testing Library 文档', url: 'https://testing-library.com/', type: 'official' },
  ],
}

const RESTAPIDesign: KnowledgeItem = {
  id: 'rest-api-design',
  title: 'REST API 设计原则',
  slug: 'rest-api-design',
  category: 'architecture',
  difficulty: 'intermediate',
  readTime: 15,
  tags: ['REST', 'API', 'HTTP', 'Design'],
  relatedIds: ['system-design-basics', 'database-design', 'nextjs-framework', 'microservices'],
  prerequisiteIds: [],
  lastUpdated: '2026-05-24',
  keyTakeaways: [
    'RESTful 资源命名规范',
    'HTTP 方法语义（GET/POST/PUT/PATCH/DELETE）',
    '分页、过滤、排序的 URL 设计',
    '错误响应标准化',
  ],
  content: `# REST API 设计原则

## 资源命名

\`\`\`
GET    /api/users          # 获取列表
GET    /api/users/:id      # 获取单个
POST   /api/users          # 创建
PUT    /api/users/:id      # 全量更新
PATCH  /api/users/:id      # 部分更新
DELETE /api/users/:id      # 删除
\`\`\`

## 查询参数

\`\`\`
GET /api/posts?page=2&limit=20&sort=-createdAt&tag=react
\`\`\`

## 错误响应

\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "邮箱格式不正确",
    "details": [
      { "field": "email", "message": "必须是有效邮箱" }
    ]
  }
}
\`\`\`

## 状态码

| 状态码 | 含义 |
|--------|------|
| 200 | 成功 |
| 201 | 已创建 |
| 400 | 请求错误 |
| 401 | 未授权 |
| 404 | 未找到 |
| 500 | 服务器错误 |
`,
  sources: [
    { title: 'RESTful API 设计指南', url: 'https://restfulapi.net/', type: 'article' },
  ],
}

const Microservices: KnowledgeItem = {
  id: 'microservices',
  title: '微服务架构设计',
  slug: 'microservices',
  category: 'architecture',
  difficulty: 'advanced',
  readTime: 20,
  tags: ['Microservices', 'Architecture', 'Distributed'],
  relatedIds: ['rest-api-design', 'event-driven', 'docker-fundamentals', 'system-design-basics'],
  prerequisiteIds: ['rest-api-design'],
  lastUpdated: '2026-05-24',
  keyTakeaways: [
    '服务拆分原则（单一职责、领域驱动）',
    '服务间通信（同步 REST/gRPC vs 异步消息）',
    '数据一致性（Saga 模式）',
    '服务治理（熔断、限流、降级）',
  ],
  content: `# 微服务架构设计

## 服务拆分

按领域边界拆分：
- 用户服务（User Service）
- 订单服务（Order Service）
- 支付服务（Payment Service）

## 通信模式

### 同步（REST/gRPC）
\`\`\`
Client → API Gateway → Service A → Service B
\`\`\`

### 异步（消息队列）
\`\`\`
Service A → Message Broker → Service B
\`\`\`

## Saga 模式

分布式事务解决方案：
1. 订单服务创建订单 → 发布事件
2. 库存服务扣减库存 → 发布事件
3. 支付服务处理支付 → 发布事件
4. 任一步骤失败 → 执行补偿操作

## 服务治理

- **熔断**: Circuit Breaker 防止级联故障
- **限流**: 令牌桶/漏桶算法
- **降级**: 返回缓存数据或默认值
`,
  sources: [
    { title: 'Microservices.io', url: 'https://microservices.io/', type: 'article' },
  ],
}

const EventDriven: KnowledgeItem = {
  id: 'event-driven',
  title: '事件驱动架构',
  slug: 'event-driven',
  category: 'architecture',
  difficulty: 'advanced',
  readTime: 16,
  tags: ['Event-Driven', 'Kafka', 'Message Queue', 'CQRS'],
  relatedIds: ['microservices', 'system-design-basics', 'database-design'],
  prerequisiteIds: ['microservices'],
  lastUpdated: '2026-05-24',
  keyTakeaways: [
    '事件溯源（Event Sourcing）',
    'CQRS 模式',
    '消息队列（Kafka、RabbitMQ）',
    '最终一致性',
  ],
  content: `# 事件驱动架构

## 事件溯源

\`\`\`
OrderCreated → OrderPaid → OrderShipped → OrderDelivered
\`\`\`

每个事件都是不可变的事实记录。

## CQRS

读写分离：
- **Command**: 写入事件存储
- **Query**: 从物化视图读取

## Kafka

\`\`\`
Producer → Topic (Partition) → Consumer Group
\`\`\`

- 高吞吐量
- 消息持久化
- 消费者组并行处理
`,
  sources: [
    { title: 'Event Sourcing 介绍', url: 'https://martinfowler.com/eaaDev/EventSourcing.html', type: 'article' },
  ],
}

const DatabaseDesign: KnowledgeItem = {
  id: 'database-design',
  title: '数据库设计与优化',
  slug: 'database-design',
  category: 'architecture',
  difficulty: 'intermediate',
  readTime: 17,
  tags: ['Database', 'SQL', 'NoSQL', 'Indexing'],
  relatedIds: ['system-design-basics', 'rest-api-design', 'microservices'],
  prerequisiteIds: [],
  lastUpdated: '2026-05-24',
  keyTakeaways: [
    '关系型 vs NoSQL 的选择',
    '范式化与反范式化',
    '索引优化策略',
    '分库分表方案',
  ],
  content: `# 数据库设计与优化

## SQL vs NoSQL

| 特性 | SQL | NoSQL |
|------|-----|-------|
| 模式 | 固定模式 | 灵活模式 |
| 事务 | ACID | BASE |
| 扩展 | 垂直扩展 | 水平扩展 |
| 适用 | 关系复杂 | 高并发读写 |

## 索引优化

\`\`\`sql
-- 复合索引遵循最左前缀
CREATE INDEX idx_user_status ON users(status, created_at);

-- 覆盖索引
SELECT id, name FROM users WHERE status = 'active';
\`\`\`

## 分库分表

- **垂直分库**: 按业务拆分
- **水平分表**: 按用户 ID 取模
`,
  sources: [
    { title: 'Use The Index, Luke', url: 'https://use-the-index-luke.com/', type: 'article' },
  ],
}

const DesignPatterns: KnowledgeItem = {
  id: 'design-patterns',
  title: '常用设计模式',
  slug: 'design-patterns',
  category: 'architecture',
  difficulty: 'intermediate',
  readTime: 16,
  tags: ['Design Patterns', 'SOLID', 'OOP'],
  relatedIds: ['react-component-patterns', 'typescript-advanced', 'system-design-basics'],
  prerequisiteIds: [],
  lastUpdated: '2026-05-24',
  keyTakeaways: [
    '创建型模式（工厂、单例）',
    '结构型模式（适配器、装饰器）',
    '行为型模式（观察者、策略）',
    'SOLID 原则',
  ],
  content: `# 常用设计模式

## 工厂模式

\`\`\`typescript
interface Logger {
  log(message: string): void
}

function createLogger(type: 'console' | 'file'): Logger {
  if (type === 'console') return { log: console.log }
  return { log: (msg) => fs.appendFileSync('log.txt', msg) }
}
\`\`\`

## 观察者模式

\`\`\`typescript
class EventBus {
  private listeners = new Map<string, Function[]>()
  on(event: string, fn: Function) { ... }
  emit(event: string, data: any) { ... }
}
\`\`\`

## 策略模式

\`\`\`typescript
type SortStrategy = <T>(arr: T[]) => T[]

const quickSort: SortStrategy = (arr) => { ... }
const mergeSort: SortStrategy = (arr) => { ... }

function sort<T>(arr: T[], strategy: SortStrategy): T[] {
  return strategy(arr)
}
\`\`\`
`,
  sources: [
    { title: 'Refactoring Guru', url: 'https://refactoring.guru/design-patterns', type: 'article' },
  ],
}

const DockerFundamentals: KnowledgeItem = {
  id: 'docker-fundamentals',
  title: 'Docker 容器化基础',
  slug: 'docker-fundamentals',
  category: 'devops',
  difficulty: 'beginner',
  readTime: 12,
  tags: ['Docker', 'Containers', 'DevOps'],
  relatedIds: ['cicd-pipelines', 'kubernetes-basics', 'cloud-infrastructure'],
  prerequisiteIds: [],
  lastUpdated: '2026-05-24',
  keyTakeaways: [
    'Dockerfile 编写最佳实践',
    '多阶段构建减小镜像体积',
    'Docker Compose 编排多服务',
    '容器网络和数据卷',
  ],
  content: `# Docker 容器化基础

## Dockerfile

\`\`\`dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/index.js"]
\`\`\`

## Docker Compose

\`\`\`yaml
services:
  app:
    build: .
    ports: ["3000:3000"]
    depends_on: [db]
  db:
    image: postgres:16
    volumes: [pgdata:/var/lib/postgresql/data]
volumes:
  pgdata:
\`\`\`
`,
  sources: [
    { title: 'Docker 官方文档', url: 'https://docs.docker.com/', type: 'official' },
  ],
}

const CICDPipelines: KnowledgeItem = {
  id: 'cicd-pipelines',
  title: 'CI/CD 流水线设计',
  slug: 'cicd-pipelines',
  category: 'devops',
  difficulty: 'intermediate',
  readTime: 14,
  tags: ['CI/CD', 'GitHub Actions', 'Automation'],
  relatedIds: ['docker-fundamentals', 'frontend-testing', 'kubernetes-basics'],
  prerequisiteIds: ['docker-fundamentals'],
  lastUpdated: '2026-05-24',
  keyTakeaways: [
    'CI（持续集成）核心实践',
    'CD（持续部署）流水线设计',
    'GitHub Actions 工作流',
    '自动化测试和代码质量检查',
  ],
  content: `# CI/CD 流水线设计

## GitHub Actions

\`\`\`yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - run: npx wrangler deploy
\`\`\`

## 流水线阶段

1. **Lint** → 代码规范检查
2. **Test** → 单元测试 + 集成测试
3. **Build** → 构建产物
4. **Deploy** → 部署到环境
`,
  sources: [
    { title: 'GitHub Actions 文档', url: 'https://docs.github.com/en/actions', type: 'official' },
  ],
}

const KubernetesBasics: KnowledgeItem = {
  id: 'kubernetes-basics',
  title: 'Kubernetes 入门',
  slug: 'kubernetes-basics',
  category: 'devops',
  difficulty: 'advanced',
  readTime: 20,
  tags: ['Kubernetes', 'K8s', 'Orchestration'],
  relatedIds: ['docker-fundamentals', 'cicd-pipelines', 'cloud-infrastructure', 'microservices'],
  prerequisiteIds: ['docker-fundamentals'],
  lastUpdated: '2026-05-24',
  keyTakeaways: [
    'Pod、Service、Deployment 核心概念',
    'kubectl 常用命令',
    '水平扩展和滚动更新',
    'ConfigMap 和 Secret 管理配置',
  ],
  content: `# Kubernetes 入门

## 核心概念

- **Pod**: 最小部署单元
- **Service**: 服务发现和负载均衡
- **Deployment**: 声明式部署管理

## Deployment

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    spec:
      containers:
        - name: web
          image: myapp:latest
          ports: [{ containerPort: 3000 }]
\`\`\`

## Service

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: web
spec:
  selector:
    app: web
  ports:
    - port: 80
      targetPort: 3000
  type: ClusterIP
\`\`\`
`,
  sources: [
    { title: 'Kubernetes 官方文档', url: 'https://kubernetes.io/docs/', type: 'official' },
  ],
}

const CloudInfrastructure: KnowledgeItem = {
  id: 'cloud-infrastructure',
  title: '云基础设施入门',
  slug: 'cloud-infrastructure',
  category: 'devops',
  difficulty: 'intermediate',
  readTime: 15,
  tags: ['Cloud', 'AWS', 'Infrastructure'],
  relatedIds: ['docker-fundamentals', 'kubernetes-basics', 'cicd-pipelines', 'system-design-basics'],
  prerequisiteIds: [],
  lastUpdated: '2026-05-24',
  keyTakeaways: [
    'IaaS vs PaaS vs SaaS',
    'Serverless 架构（Lambda、Cloudflare Workers）',
    '对象存储（S3、R2）',
    'CDN 和边缘计算',
  ],
  content: `# 云基础设施入门

## 服务模型

| 模型 | 说明 | 示例 |
|------|------|------|
| IaaS | 虚拟机/网络 | EC2, VPS |
| PaaS | 应用托管 | Vercel, Railway |
| SaaS | 软件服务 | GitHub, Stripe |

## Serverless

\`\`\`typescript
// Cloudflare Workers
export default {
  async fetch(request: Request): Promise<Response> {
    return new Response('Hello World')
  }
}
\`\`\`

## 边缘计算

- Cloudflare Workers
- Vercel Edge Functions
- Deno Deploy
`,
  sources: [
    { title: 'Cloudflare Workers 文档', url: 'https://developers.cloudflare.com/workers/', type: 'official' },
  ],
}

const TechnicalWriting: KnowledgeItem = {
  id: 'technical-writing',
  title: '技术写作与文档',
  slug: 'technical-writing',
  category: 'career',
  difficulty: 'beginner',
  readTime: 10,
  tags: ['Writing', 'Documentation', 'Communication'],
  relatedIds: ['code-review', 'system-design-interviews'],
  prerequisiteIds: [],
  lastUpdated: '2026-05-24',
  keyTakeaways: [
    '技术文档的结构化写作',
    'README 和 API 文档最佳实践',
    'RFC（征求意见稿）流程',
    '清晰简洁的写作风格',
  ],
  content: `# 技术写作与文档

## README 结构

1. 项目简介（一句话说明）
2. 快速开始（5 分钟跑起来）
3. 详细文档链接
4. 贡献指南

## API 文档

\`\`\`markdown
## POST /api/users

创建新用户

**请求体**
\`\`\`json
{ "name": "string", "email": "string" }
\`\`\`

**响应** 201
\`\`\`json
{ "id": "string", "name": "string" }
\`\`\`
\`\`\`

## 写作原则

- 用主动语态
- 句子简短（< 25 字）
- 用具体例子说明抽象概念
`,
  sources: [
    { title: 'Google 技术写作课程', url: 'https://developers.google.com/tech-writing', type: 'article' },
  ],
}

const CodeReview: KnowledgeItem = {
  id: 'code-review',
  title: '代码审查最佳实践',
  slug: 'code-review',
  category: 'career',
  difficulty: 'intermediate',
  readTime: 12,
  tags: ['Code Review', 'Collaboration', 'Quality'],
  relatedIds: ['technical-writing', 'frontend-testing', 'design-patterns'],
  prerequisiteIds: [],
  lastUpdated: '2026-05-24',
  keyTakeaways: [
    'Code Review 的目的（知识共享 > 找 Bug）',
    '有效的 Review 评论风格',
    'PR 大小和拆分策略',
    '自动化检查减轻 Review 负担',
  ],
  content: `# 代码审查最佳实践

## Review 原则

1. **对事不对人**: 讨论代码，不评价人
2. **提问而非命令**: "这里用 X 会不会更好？"
3. **给出理由**: 说明为什么建议修改
4. **区分严重性**: 必须改 vs 建议改

## 好的 PR

- 标题清晰（feat/fix/refactor）
- 大小适中（< 400 行）
- 包含测试
- 自描述的提交信息

## Review Checklist

- [ ] 逻辑正确性
- [ ] 边界条件处理
- [ ] 错误处理
- [ ] 性能影响
- [ ] 安全问题
- [ ] 测试覆盖
`,
  sources: [
    { title: 'Google Engineering Practices', url: 'https://google.github.io/eng-practices/', type: 'article' },
  ],
}

const SystemDesignInterviews: KnowledgeItem = {
  id: 'system-design-interviews',
  title: '系统设计面试指南',
  slug: 'system-design-interviews',
  category: 'career',
  difficulty: 'advanced',
  readTime: 20,
  tags: ['System Design', 'Interview', 'Architecture'],
  relatedIds: ['system-design-basics', 'microservices', 'database-design', 'rest-api-design'],
  prerequisiteIds: ['system-design-basics'],
  lastUpdated: '2026-05-24',
  keyTakeaways: [
    '需求分析和估算（QPS、存储）',
    '高层架构设计',
    '深入核心组件',
    '扩展性和可靠性讨论',
  ],
  content: `# 系统设计面试指南

## 设计框架（REACT）

1. **R**equirements: 功能/非功能需求
2. **E**stimation: QPS、存储、带宽
3. **A**rchitecture: 高层设计
4. **C**omponent: 深入核心组件
5. **T**rade-offs: 扩展性讨论

## 估算公式

- QPS = 日活 × 每用户请求数 / 86400
- 存储 = 日新增 × 保留天数 × 单条大小
- 带宽 = QPS × 响应大小

## 常见设计题

- 短链服务（URL Shortener）
- 消息系统（Chat）
- 新闻 Feed（Timeline）
- 搜索自动补全
`,
  sources: [
    { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'article' },
  ],
}

const GitAdvanced: KnowledgeItem = {
  id: 'git-advanced',
  title: 'Git 进阶技巧',
  slug: 'git-advanced',
  category: 'tools',
  difficulty: 'intermediate',
  readTime: 12,
  tags: ['Git', 'Version Control', 'CLI'],
  relatedIds: ['cicd-pipelines', 'code-review'],
  prerequisiteIds: [],
  lastUpdated: '2026-05-24',
  keyTakeaways: [
    'Interactive Rebase 整理提交历史',
    'Cherry-pick 选择性合并',
    'Git Bisect 定位 Bug',
    'Reflog 恢复误操作',
  ],
  content: `# Git 进阶技巧

## Interactive Rebase

\`\`\`bash
# 整理最近 3 个提交
git rebase -i HEAD~3
\`\`\`

## Cherry-pick

\`\`\`bash
# 选择性合并某个提交
git cherry-pick abc123
\`\`\`

## Git Bisect

\`\`\`bash
git bisect start
git bisect bad          # 当前版本有 Bug
git bisect good v1.0    # v1.0 没有 Bug
# Git 会自动二分查找定位
\`\`\`

## Reflog

\`\`\`bash
# 查看所有操作历史
git reflog
# 恢复误删的分支
git checkout -b recovered HEAD@{2}
\`\`\`
`,
  sources: [
    { title: 'Pro Git 电子书', url: 'https://git-scm.com/book/', type: 'official' },
  ],
}

const VSCodeProductivity: KnowledgeItem = {
  id: 'vscode-productivity',
  title: 'VS Code 效率指南',
  slug: 'vscode-productivity',
  category: 'tools',
  difficulty: 'beginner',
  readTime: 10,
  tags: ['VS Code', 'Productivity', 'IDE'],
  relatedIds: ['git-advanced', 'linux-command-line'],
  prerequisiteIds: [],
  lastUpdated: '2026-05-24',
  keyTakeaways: [
    '必备快捷键（多光标、命令面板）',
    '实用扩展推荐',
    '调试配置（launch.json）',
    '任务自动化（tasks.json）',
  ],
  content: `# VS Code 效率指南

## 必备快捷键

| 快捷键 | 功能 |
|--------|------|
| Ctrl+Shift+P | 命令面板 |
| Ctrl+P | 快速打开文件 |
| Ctrl+Shift+F | 全局搜索 |
| Alt+Click | 添加光标 |
| Ctrl+D | 选中下一个匹配 |

## 推荐扩展

- **ESLint** - 代码规范
- **Prettier** - 代码格式化
- **GitLens** - Git 增强
- **Error Lens** - 内联错误显示

## 调试配置

\`\`\`json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "program": "\${workspaceFolder}/src/index.ts",
      "runtimeArgs": ["-r", "ts-node/register"]
    }
  ]
}
\`\`\`
`,
  sources: [
    { title: 'VS Code 官方文档', url: 'https://code.visualstudio.com/docs', type: 'official' },
  ],
}

const LinuxCommandLine: KnowledgeItem = {
  id: 'linux-command-line',
  title: 'Linux 命令行实用技巧',
  slug: 'linux-command-line',
  category: 'tools',
  difficulty: 'beginner',
  readTime: 11,
  tags: ['Linux', 'CLI', 'Shell', 'Terminal'],
  relatedIds: ['docker-fundamentals', 'git-advanced', 'vscode-productivity'],
  prerequisiteIds: [],
  lastUpdated: '2026-05-24',
  keyTakeaways: [
    '常用文件操作命令',
    '管道和重定向',
    'grep/sed/awk 文本处理',
    '进程管理和后台任务',
  ],
  content: `# Linux 命令行实用技巧

## 文件操作

\`\`\`bash
find . -name "*.ts" -type f        # 查找文件
grep -r "TODO" --include="*.ts" .  # 搜索内容
du -sh *                           # 目录大小
\`\`\`

## 管道组合

\`\`\`bash
# 找出最大的 5 个文件
find . -type f -exec du -h {} + | sort -rh | head -5

# 统计代码行数
find . -name "*.ts" | xargs wc -l | sort -rn
\`\`\`

## 进程管理

\`\`\`bash
ps aux | grep node    # 查找进程
kill -9 PID           # 强制结束
nohup command &       # 后台运行
\`\`\`
`,
  sources: [
    { title: 'The Linux Command Line', url: 'https://linuxcommand.org/', type: 'article' },
  ],
}

export const knowledgeBase: KnowledgeItem[] = [
  ReactHooksAdvanced,
  TypeScriptAdvanced,
  SystemDesignBasics,
  CSSGridFlexbox,
  ReactComponentPatterns,
  WebPerformance,
  StateManagement,
  NextJSFramework,
  FrontendTesting,
  RESTAPIDesign,
  Microservices,
  EventDriven,
  DatabaseDesign,
  DesignPatterns,
  DockerFundamentals,
  CICDPipelines,
  KubernetesBasics,
  CloudInfrastructure,
  TechnicalWriting,
  CodeReview,
  SystemDesignInterviews,
  GitAdvanced,
  VSCodeProductivity,
  LinuxCommandLine,
]

export const knowledgeMap = new Map(
  knowledgeBase.map(item => [item.id, item])
)

export function getItemsByCategory(category: CategoryType): KnowledgeItem[] {
  return knowledgeBase.filter(item => item.category === category)
}

export function getItemsByDifficulty(difficulty: DifficultyLevel): KnowledgeItem[] {
  return knowledgeBase.filter(item => item.difficulty === difficulty)
}

export function getKnowledgeStats(): KnowledgeStats {
  const stats: KnowledgeStats = {
    totalItems: knowledgeBase.length,
    totalCategories: new Set(knowledgeBase.map(i => i.category)).size,
    avgReadTime: Math.round(
      knowledgeBase.reduce((sum, item) => sum + item.readTime, 0) / knowledgeBase.length
    ),
    avgRelations: parseFloat(
      (knowledgeBase.reduce((sum, item) => sum + item.relatedIds.length, 0) / knowledgeBase.length).toFixed(1)
    ),
    difficultySplit: {} as Record<DifficultyLevel, number>,
    categorySplit: {} as Record<CategoryType, number>,
  }

  ;(['beginner', 'intermediate', 'advanced'] as const).forEach(level => {
    stats.difficultySplit[level] = knowledgeBase.filter(i => i.difficulty === level).length
  })

  ;(['frontend', 'architecture', 'devops', 'career', 'tools'] as const).forEach(cat => {
    stats.categorySplit[cat] = knowledgeBase.filter(i => i.category === cat).length
  })

  return stats
}
