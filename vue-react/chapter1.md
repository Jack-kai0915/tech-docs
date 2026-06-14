# 第一章：认识框架

## 1.1 设计哲学对比

### Vue3：渐进式框架

```
Vue3 的核心理念：
├── 渐进式采用 → 可以只用核心，逐步引入生态
├── 模板语法   → HTML 兼容的模板，学习成本低
├── 响应式系统 → 基于 Proxy 的细粒度响应式
└── 组合式 API → 灵活的逻辑组织方式
```

**Vue3 哲学**：简单、灵活、渐进

### React：UI 库

```
React 的核心理念：
├── 一切皆组件 → UI = f(state)
├── JSX        → JavaScript + XML 语法
├── 单向数据流 → 数据自上而下流动
└── Hooks      → 函数式组件的增强
```

**React 哲学**：函数式、显式、可组合

### 核心差异

| 特性 | Vue3 | React |
|------|------|-------|
| **定位** | 渐进式框架 | UI 库 |
| **模板** | HTML 模板 | JSX |
| **响应式** | 自动追踪（Proxy） | 手动触发（setState） |
| **学习曲线** | 平缓 | 较陡 |
| **灵活性** | 中等 | 高 |
| **生态系统** | 官方主导 | 社区主导 |

---

## 1.2 响应式 vs 声明式

### Vue3 的响应式系统

```vue
<script setup>
import { ref } from 'vue'

// ref 创建响应式数据
const count = ref(0)

// 直接修改，自动更新视图
function increment() {
  count.value++  // 视图自动更新
}
</script>

<template>
  <!-- 模板中直接使用，无需 .value -->
  <button @click="increment">{{ count }}</button>
</template>
```

**Vue3 响应式原理**：
```
数据变化 → Proxy 拦截 → 通知依赖 → 更新视图
         （自动追踪）   （自动触发）  （自动更新）
```

### React 的声明式 UI

```tsx
import { useState } from 'react'

// useState 创建状态
function Counter() {
  const [count, setCount] = useState(0)

  // 必须通过 setState 触发更新
  function increment() {
    setCount(count + 1)  // 必须调用 setCount
  }

  return (
    <button onClick={increment}>{count}</button>
  )
}
```

**React 更新原理**：
```
调用 setState → 标记组件需要更新 → 重新渲染组件 → 更新视图
  （手动触发）    （调度更新）        （重新执行函数）
```

### 对比

```
Vue3: count.value++        → 自动更新
React: setCount(count + 1) → 手动触发

Vue3 更简单直接，React 更显式可控
```

---

## 1.3 项目初始化

### Vue3 + Vite

```bash
# 创建项目
npm create vue@latest my-vue-app

# 选择配置
✔ 项目名称：my-vue-app
✔ TypeScript：Yes
✔ JSX：No
✔ Vue Router：Yes
✔ Pinia：Yes
✔ ESLint：Yes
✔ Prettier：Yes

# 进入项目
cd my-vue-app
npm install
npm run dev
```

### React + Vite

```bash
# 创建项目
npm create vite@latest my-react-app -- --template react-ts

# 进入项目
cd my-react-app
npm install
npm run dev
```

### 项目结构对比

```
Vue3 项目结构：                React 项目结构：
├── src/                      ├── src/
│   ├── components/           │   ├── components/
│   │   └── HelloWorld.vue    │   │   └── HelloWorld.tsx
│   ├── views/                │   ├── pages/
│   │   └── Home.vue          │   │   └── Home.tsx
│   ├── stores/               │   ├── hooks/
│   │   └── counter.ts        │   ├── context/
│   ├── router/               │   ├── App.tsx
│   │   └── index.ts          │   └── main.tsx
│   ├── App.vue               │
│   └── main.ts               │
├── index.html                ├── index.html
├── package.json              ├── package.json
└── vite.config.ts            └── vite.config.ts
```

---

## 1.4 第一个组件

### Vue3 版本

```vue
<!-- src/components/HelloWorld.vue -->
<script setup lang="ts">
// 定义 Props
interface Props {
  message: string
}

// 使用 defineProps 接收 props
const props = defineProps<Props>()

// 定义响应式数据
const count = ref(0)

// 定义方法
function increment() {
  count.value++
}
</script>

<template>
  <!-- 模板语法 -->
  <div class="hello">
    <h1>{{ message }}</h1>
    <p>计数: {{ count }}</p>
    <button @click="increment">+1</button>
  </div>
</template>

<style scoped>
/* scoped 样式只作用于当前组件 */
.hello {
  padding: 20px;
}
</style>
```

### React 版本

```tsx
// src/components/HelloWorld.tsx
import { useState } from 'react'
import styles from './HelloWorld.module.css'

// 定义 Props 类型
interface Props {
  message: string
}

// 函数组件
function HelloWorld({ message }: Props) {
  // useState 创建状态
  const [count, setCount] = useState(0)

  // 定义方法
  function increment() {
    setCount(count + 1)
  }

  return (
    <div className={styles.hello}>
      <h1>{message}</h1>
      <p>计数: {count}</p>
      <button onClick={increment}>+1</button>
    </div>
  )
}

export default HelloWorld
```

### 使用组件

```vue
<!-- Vue3: App.vue -->
<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <HelloWorld message="Hello Vue3" />
</template>
```

```tsx
// React: App.tsx
import HelloWorld from './components/HelloWorld'

function App() {
  return (
    <HelloWorld message="Hello React" />
  )
}

export default App
```

---

## 要点总结

| 概念 | Vue3 | React |
|------|------|-------|
| 创建项目 | `npm create vue@latest` | `npm create vite@latest --template react-ts` |
| 组件文件 | `.vue` (SFC) | `.tsx` |
| 定义 Props | `defineProps<Props>()` | 函数参数 `{ prop }` |
| 响应式数据 | `ref()` / `reactive()` | `useState()` |
| 模板/JSX | `<template>` | `return JSX` |
| 事件绑定 | `@click="fn"` | `onClick={fn}` |
| 样式 | `<style scoped>` | CSS Modules |

## 常见误区

1. **Vue3 的 ref 在模板中不需要 `.value`**
   ```vue
   <!-- 正确 -->
   <p>{{ count }}</p>
   
   <!-- 错误 -->
   <p>{{ count.value }}</p>
   ```

2. **React 的 setState 是异步的**
   ```tsx
   function increment() {
     setCount(count + 1)
     console.log(count)  // 还是旧值！
   }
   ```

3. **Vue3 的 reactive 解构会丢失响应性**
   ```vue
   <script setup>
   const state = reactive({ count: 0 })
   
   // 错误：解构后丢失响应性
   const { count } = state
   
   // 正确：使用 toRefs
   const { count } = toRefs(state)
   </script>
   ```
