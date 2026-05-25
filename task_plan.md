# 3D 神经网络主页改造 — 任务计划

## 目标
将主页从 2D Bento Grid 改造为 3D 神经网络可视化。每个节点 = 一个知识点，连接 = 知识点关系。

## Phase 1: 安装依赖 + 扩展类型
**Status**: complete

## Phase 2: 扩充知识库数据
**Status**: complete

## Phase 3: 创建 3D 布局算法
**Status**: complete

## Phase 4: 创建 3D 组件
**Status**: complete

## Phase 5: 改造主页
**Status**: complete

## Phase 6: 优化和完善
**Status**: complete
- [x] 6.1 ErrorBoundary 包裹 3D 画布（Home.tsx）
- [x] 6.2 移动端适配（移动端粒子数 400→150）
- [x] 6.3 测试修复（mock NeuralNetworkCanvas，18/18 通过）

## 已知问题
- src/pages/KnowledgeMap.tsx:88 — .slug 不存在于 GraphNode（预存 bug）

## 验证
- [x] npm run build 通过
- [x] npm run test 18/18 通过
- [ ] 浏览器验证 3D 渲染
- [ ] 移动端触摸交互
