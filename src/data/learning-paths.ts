import { LearningPath } from '../types/knowledge'

export const learningPaths: LearningPath[] = [
  {
    id: 'react-mastery',
    name: 'React 完全掌握之路',
    description: '从基础到精通 React，成为高级前端工程师',
    difficulty: 'advanced',
    estimatedHours: 40,
    itemIds: ['react-hooks-advanced'],
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
    itemIds: ['typescript-advanced'],
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
    itemIds: ['react-hooks-advanced', 'system-design-basics'],
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
    itemIds: ['system-design-basics'],
    goals: [
      '理解系统设计的核心概念',
      '能够设计中等规模系统',
      '掌握常见的性能优化方案',
    ],
  },
]
