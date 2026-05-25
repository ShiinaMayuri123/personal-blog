# 3D 神经网络 — 基于 NEURAL_NETWORK_ENHANCEMENT.md 全面优化

## 目标
从 UX 和视觉设计出发，让 3D 神经网络从"展示品"变成"活跃的知识生态系统"。

## Step 0: 回退上一轮 postprocessing 改动
**Status**: pending
- NeuralNode.tsx: meshPhysicalMaterial → meshStandardMaterial + lerp 动画
- NeuralConnection.tsx: TubeGeometry → drei Line + 关系类型分样式
- NeuralNetworkScene.tsx: 调整灯光参数

## Step 1: NeuralNode — 多维度信息编码
**Status**: pending
- 核心球 meshStandardMaterial (metalness=0.3, roughness=0.7)
- 外层光晕球 BackSide + 根据 connectionCount 动态 scale
- lerp 平滑缩放动画
- 新增 connectionCount prop

## Step 2: NeuralConnection — 关系类型视觉差异
**Status**: pending
- 4 种关系不同样式（粗细/颜色/透明度/实线虚线）
- 新增 hovered/highlighted prop
- advanced 类型脉冲动画
- highlighted 时 opacity 翻倍，非高亮时降至 0.1

## Step 3: NodeTooltip — 信息卡片升级
**Status**: pending
- 难度星级（⭐/⭐⭐/⭐⭐⭐）
- 分类色标 + 文字
- 阅读时间
- 连接数（入度/出度）
- 新增 connectionCount/relatedCount props

## Step 4: NeuralNetworkScene — 入场动画 + 悬停联动 + 相机
**Status**: pending
- 节点入场动画（staggered scale 0→1，300ms 起步）
- 悬停时关联线 highlighted，非关联线 opacity 降至 0.1
- OrbitControls autoRotate 初始自动旋转
- 保留 fog + Bloom

## Step 5: NeuralNetworkCanvas — 连接数计算 + 加载文案
**Status**: pending
- 遍历 edges 统计每个节点入度出度
- 传递 connectionCounts 给 Scene
- 增强加载文案："正在构建知识网络..."

## Step 6: ParticleField — 大小分级恢复
**Status**: pending
- 恢复 sizes 数组（10% 大/30% 中/60% 小）
- 保留 vertexColors

## 验证
- [ ] npm run build 通过
- [ ] npm run test 通过
- [ ] 浏览器验证全部交互效果
