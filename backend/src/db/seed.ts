import { getDatabase, saveDatabase, closeDatabase } from './database.js';

async function seed(): Promise<void> {
  const db = await getDatabase();

  // Seed articles
  const articles = [
    {
      id: '1',
      title: '欢迎来到我的个人博客',
      slug: 'welcome-to-my-blog',
      date: '2026-05-19',
      excerpt: '这是第一篇文章，介绍博客目的、架构设计和未来扩展方向。',
      tags: ['介绍', '规划'],
      content: `欢迎来到我的个人博客。\n\n这个项目的目标是搭建一个可维护、可扩展的博客系统。当前版本采用 React + Vite，内容保存在本地数据文件中，方便开发与迭代。\n\n后续可以继续扩展：\n- Markdown 内容解析\n- 后端 API 数据源\n- 搜索与标签过滤\n- 静态站点生成\n`,
    },
    {
      id: '2',
      title: '为什么选用前端静态博客作为起点',
      slug: 'why-start-with-frontend-blog',
      date: '2026-05-19',
      excerpt: '前端静态博客方便快速迭代，代码结构清晰，后续可以平滑接入后端服务。',
      tags: ['架构', '前端'],
      content: `选择前端静态博客作为起点，原因是它具备良好的可维护性和可扩展性：\n\n1. 代码简单，开发门槛低。\n2. 易于部署，无需后端环境即可预览。\n3. 后续可在同一结构上加后端 API、CMS 或静态导出功能。\n\n这使得项目能够先快速落地，再逐步升级为更复杂系统。`,
    },
  ];

  for (const article of articles) {
    db.run(
      `INSERT OR REPLACE INTO articles (id, title, slug, date, excerpt, tags, content) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [article.id, article.title, article.slug, article.date, article.excerpt, JSON.stringify(article.tags), article.content]
    );
  }

  // Seed knowledge items
  const knowledgeItems = [
    {
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
      keyTakeaways: ['理解 Hooks 的调用规则', '掌握常用 Hooks', '学会创建自定义 Hooks', '性能优化技巧'],
      content: `# React Hooks 深度指南\n\n## Hooks 基础\n\nHooks 是 React 16.8 引入的新特性...`,
      sources: [{ title: 'React 官方文档', url: 'https://react.dev', type: 'official' }],
    },
    {
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
      keyTakeaways: ['泛型的高级用法', '条件类型和映射类型', '类型体操基础'],
      content: `# TypeScript 类型系统进阶\n\n## 泛型...`,
      sources: [{ title: 'TypeScript 文档', url: 'https://www.typescriptlang.org', type: 'official' }],
    },
    {
      id: 'system-design-basics',
      title: '系统设计基础：缓存策略',
      slug: 'system-design-basics',
      category: 'architecture',
      difficulty: 'intermediate',
      readTime: 18,
      tags: ['System Design', 'Caching', 'Performance'],
      relatedIds: ['rest-api-design', 'database-design'],
      prerequisiteIds: [],
      lastUpdated: '2026-05-24',
      keyTakeaways: ['缓存的三层模型', '常见缓存策略', '缓存穿透、击穿、雪崩问题'],
      content: `# 系统设计基础：缓存策略\n\n## 缓存的三层模型...`,
      sources: [{ title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'article' }],
    },
    {
      id: 'rest-api-design',
      title: 'REST API 设计原则',
      slug: 'rest-api-design',
      category: 'architecture',
      difficulty: 'intermediate',
      readTime: 15,
      tags: ['REST', 'API', 'HTTP'],
      relatedIds: ['system-design-basics'],
      prerequisiteIds: [],
      lastUpdated: '2026-05-24',
      keyTakeaways: ['RESTful 资源命名规范', 'HTTP 方法语义', '错误响应标准化'],
      content: `# REST API 设计原则\n\n## 资源命名...`,
      sources: [{ title: 'RESTful API 设计指南', url: 'https://restfulapi.net', type: 'article' }],
    },
    {
      id: 'docker-fundamentals',
      title: 'Docker 容器化基础',
      slug: 'docker-fundamentals',
      category: 'devops',
      difficulty: 'beginner',
      readTime: 12,
      tags: ['Docker', 'Containers', 'DevOps'],
      relatedIds: ['cicd-pipelines'],
      prerequisiteIds: [],
      lastUpdated: '2026-05-24',
      keyTakeaways: ['Dockerfile 编写最佳实践', '多阶段构建', 'Docker Compose'],
      content: `# Docker 容器化基础\n\n## Dockerfile...`,
      sources: [{ title: 'Docker 文档', url: 'https://docs.docker.com', type: 'official' }],
    },
  ];

  for (const item of knowledgeItems) {
    db.run(
      `INSERT OR REPLACE INTO knowledge_items (id, title, slug, category, difficulty, read_time, tags, related_ids, prerequisite_ids, last_updated, key_takeaways, content, sources) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [item.id, item.title, item.slug, item.category, item.difficulty, item.readTime, JSON.stringify(item.tags), JSON.stringify(item.relatedIds), JSON.stringify(item.prerequisiteIds), item.lastUpdated, JSON.stringify(item.keyTakeaways), item.content, JSON.stringify(item.sources)]
    );
  }

  // Seed knowledge graph
  const graphNodes = [
    { id: 'react-hooks-advanced', label: 'React Hooks', category: 'frontend', x: 100, y: 200 },
    { id: 'typescript-advanced', label: 'TypeScript', category: 'frontend', x: 300, y: 100 },
    { id: 'system-design-basics', label: '系统设计', category: 'architecture', x: 500, y: 200 },
    { id: 'rest-api-design', label: 'REST API', category: 'architecture', x: 400, y: 350 },
    { id: 'docker-fundamentals', label: 'Docker', category: 'devops', x: 600, y: 350 },
  ];

  const graphEdges = [
    { id: 'e1', source: 'react-hooks-advanced', target: 'typescript-advanced', type: 'related' },
    { id: 'e2', source: 'system-design-basics', target: 'rest-api-design', type: 'related' },
    { id: 'e3', source: 'system-design-basics', target: 'docker-fundamentals', type: 'related' },
  ];

  for (const node of graphNodes) {
    db.run(
      `INSERT OR REPLACE INTO knowledge_graph_nodes (id, label, category, x, y) VALUES (?, ?, ?, ?, ?)`,
      [node.id, node.label, node.category, node.x, node.y]
    );
  }

  for (const edge of graphEdges) {
    db.run(
      `INSERT OR REPLACE INTO knowledge_graph_edges (id, source, target, type) VALUES (?, ?, ?, ?)`,
      [edge.id, edge.source, edge.target, edge.type]
    );
  }

  saveDatabase();
  console.log('Database seeded successfully!');
  closeDatabase();
}

seed().catch(console.error);
