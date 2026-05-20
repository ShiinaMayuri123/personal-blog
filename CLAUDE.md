# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

个人博客 SPA，基于 React + Vite + TypeScript，支持暗色模式。

## 常用命令

```bash
# 开发
npm run dev          # 启动开发服务器
npm run build        # 生产构建
npm run preview      # 预览生产构建

# 代码质量
npm run lint         # ESLint 检查
npm run format       # Prettier 格式化

# 测试
npm run test         # 运行所有测试
npm run test:watch   # 监听模式运行测试
npm run test:coverage # 运行测试并生成覆盖率报告

# 运行单个测试
npx vitest run src/__tests__/Home.test.tsx
```

## 项目架构

```
src/
├── main.tsx              # 入口文件，BrowserRouter + StrictMode
├── App.tsx               # 根组件，路由配置 + ErrorBoundary + ThemeToggle
├── index.css             # 全局样式，CSS 变量支持暗色模式
├── data/
│   └── articles.ts       # 文章数据（Article 接口定义）
├── pages/
│   ├── Home.tsx          # 首页，文章列表
│   └── ArticleDetail.tsx # 文章详情页
├── components/
│   ├── ArticleCard.tsx   # 文章卡片组件
│   ├── ErrorBoundary.tsx # 错误边界组件
│   └── ThemeToggle.tsx   # 主题切换按钮
├── hooks/
│   └── useTheme.ts       # 主题 Hook（支持系统偏好检测）
├── test/
│   └── setup.ts          # 测试设置
└── __tests__/            # 测试文件
```

## 关键设计决策

### 路由结构
- `/` - 首页，显示文章列表
- `/articles/:slug` - 文章详情页

### 数据层
- 文章数据存储在 `src/data/articles.ts` 的静态数组中
- `Article` 接口定义了文章的数据结构

### 主题系统
- 使用 CSS 变量实现暗色模式
- `useTheme` Hook 支持系统偏好检测和 localStorage 持久化
- `[data-theme="dark"]` 选择器切换主题

### 测试策略
- 使用 Vitest + React Testing Library
- 测试文件放在 `src/__tests__/` 目录
- 使用 `MemoryRouter` 测试路由组件

## 代码规范

- TypeScript 严格模式
- ESLint + Prettier 自动格式化
- React Hooks 规则强制执行

## 安全配置

- CSP meta 标签配置
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- ErrorBoundary 全局错误捕获
