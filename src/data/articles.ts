export interface Article {
  id: string
  title: string
  slug: string
  date: string
  excerpt: string
  tags: string[]
  content: string
}

export const articles: Article[] = [
  {
    id: '1',
    title: '欢迎来到我的个人博客',
    slug: 'welcome-to-my-blog',
    date: '2026-05-19',
    excerpt: '这是第一篇文章，介绍博客目的、架构设计和未来扩展方向。',
    tags: ['介绍', '规划'],
    content: `欢迎来到我的个人博客。

这个项目的目标是搭建一个可维护、可扩展的博客系统。当前版本采用 React + Vite，内容保存在本地数据文件中，方便开发与迭代。

后续可以继续扩展：
- Markdown 内容解析
- 后端 API 数据源
- 搜索与标签过滤
- 静态站点生成
`
  },
  {
    id: '2',
    title: '为什么选用前端静态博客作为起点',
    slug: 'why-start-with-frontend-blog',
    date: '2026-05-19',
    excerpt: '前端静态博客方便快速迭代，代码结构清晰，后续可以平滑接入后端服务。',
    tags: ['架构', '前端'],
    content: `选择前端静态博客作为起点，原因是它具备良好的可维护性和可扩展性：

1. 代码简单，开发门槛低。
2. 易于部署，无需后端环境即可预览。
3. 后续可在同一结构上加后端 API、CMS 或静态导出功能。

这使得项目能够先快速落地，再逐步升级为更复杂系统。`
  }
]
