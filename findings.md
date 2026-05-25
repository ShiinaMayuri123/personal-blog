# 研究发现

## R3F + TypeScript 类型问题
- @react-three/fiber 的全局 JSX 命名空间增强在 "jsx": "react-jsx" 模式下不生效
- 原因：react-jsx 使用 react/jsx-runtime 的导出 JSX 命名空间，而非全局 JSX
- 解决：创建 src/types/three-jsx.d.ts，扩展 react/jsx-runtime 模块的 JSX 命名空间
- 关键代码：`declare module 'react/jsx-runtime' { namespace JSX { interface IntrinsicElements extends ThreeElements {} } }`

## R3F 版本兼容
- @react-three/fiber@9 需要 react@>=19，项目使用 react@18.3.1
- 解决：安装 @react-three/fiber@8 + @react-three/drei@9

## GateGuard 频繁拦截
- 每次 Edit/Write 操作都需要先展示事实才能通过
- 事实内容：调用方、无同功能文件、数据结构、用户指令

## Three.js 打包体积
- Three.js 导致 chunk 达 916KB（gzip 249KB）
- 已用 React.lazy 懒加载 3D 组件，首屏不加载 Three.js
