# 第二章：组件基础

## 2.1 组件定义与注册

### Vue3：单文件组件 (SFC)

```vue
<!-- src/components/UserCard.vue -->
<script setup lang="ts">
// 导入子组件
import UserAvatar from './UserAvatar.vue'

// 定义 Props
interface Props {
  name: string
  avatar?: string
  role?: 'admin' | 'user' | 'guest'
}

// 设置默认值
const props = withDefaults(defineProps<Props>(), {
  avatar: '/default-avatar.png',
  role: 'user'
})

// 定义 Emits
const emit = defineEmits<{
  (e: 'click', id: string): void
  (e: 'delete'): void
}>()

// 响应式数据
const isActive = ref(false)

// 方法
function handleClick() {
  emit('click', 'user-123')
}
</script>

<template>
  <div class="user-card" :class="{ active: isActive }">
    <UserAvatar :src="avatar" :name="name" />
    <div class="info">
      <h3>{{ name }}</h3>
      <span class="role">{{ role }}</span>
    </div>
    <button @click="handleClick">选择</button>
  </div>
</template>

<style scoped>
.user-card {
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  transition: all 0.3s;
}
.user-card.active {
  border-color: #3b82f6;
  background: #eff6ff;
}
</style>
```

### React：TSX 组件

```tsx
// src/components/UserCard.tsx
import { useState } from 'react'
import UserAvatar from './UserAvatar'
import styles from './UserCard.module.css'

// 定义 Props 类型
interface Props {
  name: string
  avatar?: string
  role?: 'admin' | 'user' | 'guest'
  onClick?: (id: string) => void
  onDelete?: () => void
}

// 函数组件
function UserCard({
  name,
  avatar = '/default-avatar.png',
  role = 'user',
  onClick,
  onDelete
}: Props) {
  const [isActive, setIsActive] = useState(false)

  function handleClick() {
    onClick?.('user-123')
  }

  return (
    <div className={`${styles.userCard} ${isActive ? styles.active : ''}`}>
      <UserAvatar src={avatar} name={name} />
      <div className={styles.info}>
        <h3>{name}</h3>
        <span className={styles.role}>{role}</span>
      </div>
      <button onClick={handleClick}>选择</button>
    </div>
  )
}

export default UserCard
```

### 组件对比

| 特性 | Vue3 SFC | React TSX |
|------|----------|-----------|
| 文件扩展名 | `.vue` | `.tsx` |
| 结构 | `<script>` + `<template>` + `<style>` | 单一函数 |
| 样式隔离 | `<style scoped>` | CSS Modules |
| 类型定义 | `defineProps<T>()` | 函数参数 |
| 事件定义 | `defineEmits()` | Props 回调 |

---

## 2.2 Props 与数据传递

### Vue3 Props

```vue
<!-- 父组件 -->
<script setup>
import ChildComponent from './ChildComponent.vue'

const userData = ref({
  name: '张三',
  age: 25
})
</script>

<template>
  <!-- 传递 props -->
  <ChildComponent 
    :name="userData.name"
    :age="userData.age"
    title="用户信息"
  />
</template>
```

```vue
<!-- 子组件 ChildComponent.vue -->
<script setup lang="ts">
// 方式一：类型声明
interface Props {
  name: string
  age: number
  title?: string
}

const props = defineProps<Props>()

// 方式二：带默认值
const props2 = withDefaults(defineProps<Props>(), {
  title: '默认标题'
})

// 访问 props
console.log(props.name)
</script>

<template>
  <div>
    <h2>{{ title }}</h2>
    <p>{{ name }} - {{ age }}岁</p>
  </div>
</template>
```

### React Props

```tsx
// 父组件
import ChildComponent from './ChildComponent'

function Parent() {
  const userData = {
    name: '张三',
    age: 25
  }

  return (
    <ChildComponent
      name={userData.name}
      age={userData.age}
      title="用户信息"
    />
  )
}
```

```tsx
// 子组件 ChildComponent.tsx
interface Props {
  name: string
  age: number
  title?: string
}

// 解构 + 默认值
function ChildComponent({ 
  name, 
  age, 
  title = '默认标题' 
}: Props) {
  return (
    <div>
      <h2>{title}</h2>
      <p>{name} - {age}岁</p>
    </div>
  )
}

export default ChildComponent
```

### Props 对比

```vue
<!-- Vue3 -->
<ChildComponent 
  :name="name" 
  :count="count"
  @update="handleUpdate"
/>
```

```tsx
// React
<ChildComponent 
  name={name} 
  count={count}
  onUpdate={handleUpdate}
/>
```

| 特性 | Vue3 | React |
|------|------|-------|
| 传递方式 | `:prop="value"` | `prop={value}` |
| 事件传递 | `@event="handler"` | `onEvent={handler}` |
| 默认值 | `withDefaults()` | 解构默认值 |
| 类型检查 | `defineProps<T>()` | TypeScript |

---

## 2.3 事件处理

### Vue3：自定义事件 (emit)

```vue
<!-- 子组件 -->
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'update', value: string): void
  (e: 'delete', id: number): void
  (e: 'submit'): void
}>()

function handleChange(e: Event) {
  const value = (e.target as HTMLInputElement).value
  emit('update', value)
}
</script>

<template>
  <input @input="handleChange" />
  <button @click="emit('submit')">提交</button>
</template>
```

```vue
<!-- 父组件 -->
<script setup>
function handleUpdate(value) {
  console.log('更新:', value)
}

function handleDelete(id) {
  console.log('删除:', id)
}
</script>

<template>
  <ChildComponent 
    @update="handleUpdate"
    @delete="handleDelete"
  />
</template>
```

### React：回调函数

```tsx
// 子组件
interface Props {
  onUpdate: (value: string) => void
  onDelete: (id: number) => void
  onSubmit: () => void
}

function ChildComponent({ onUpdate, onDelete, onSubmit }: Props) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onUpdate(e.target.value)
  }

  return (
    <>
      <input onChange={handleChange} />
      <button onClick={onSubmit}>提交</button>
    </>
  )
}
```

```tsx
// 父组件
function Parent() {
  function handleUpdate(value: string) {
    console.log('更新:', value)
  }

  return (
    <ChildComponent 
      onUpdate={handleUpdate}
      onDelete={(id) => console.log('删除:', id)}
      onSubmit={() => console.log('提交')}
    />
  )
}
```

### 事件对比

| 特性 | Vue3 | React |
|------|------|-------|
| 子传父 | `emit('event', data)` | 调用 props 回调 |
| 事件命名 | `kebab-case` | `camelCase` |
| 事件绑定 | `@click="handler"` | `onClick={handler}` |
| 事件对象 | 自动传递 | 需手动接收 `e` |

---

## 2.4 插槽 vs Children

### Vue3：插槽 (Slots)

```vue
<!-- Card.vue -->
<script setup lang="ts">
defineSlots<{
  default(props: {}): any
  header(props: { title: string }): any
  footer(props: {}): any
}>()
</script>

<template>
  <div class="card">
    <!-- 具名插槽 -->
    <div class="header">
      <slot name="header" title="卡片标题" />
    </div>
    
    <!-- 默认插槽 -->
    <div class="content">
      <slot />
    </div>
    
    <!-- 具名插槽 -->
    <div class="footer">
      <slot name="footer" />
    </div>
  </div>
</template>
```

```vue
<!-- 使用插槽 -->
<Card>
  <!-- 使用具名插槽 -->
  <template #header="{ title }">
    <h2>{{ title }}</h2>
  </template>
  
  <!-- 默认插槽内容 -->
  <p>这是卡片内容</p>
  <p>支持多个元素</p>
  
  <!-- 使用具名插槽 -->
  <template #footer>
    <button>确定</button>
  </template>
</Card>
```

### React：Children + Props

```tsx
// Card.tsx
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  header?: ReactNode
  footer?: ReactNode
}

function Card({ children, header, footer }: Props) {
  return (
    <div className="card">
      <div className="header">{header}</div>
      <div className="content">{children}</div>
      <div className="footer">{footer}</div>
    </div>
  )
}
```

```tsx
// 使用 Children
function App() {
  return (
    <Card
      header={<h2>卡片标题</h2>}
      footer={<button>确定</button>}
    >
      <p>这是卡片内容</p>
      <p>支持多个元素</p>
    </Card>
  )
}
```

### 插槽 vs Children 对比

```vue
<!-- Vue3 插槽 -->
<template>
  <Card>
    <template #header>
      <h2>标题</h2>
    </template>
    
    <p>内容 1</p>
    <p>内容 2</p>
    
    <template #footer>
      <button>确定</button>
    </template>
  </Card>
</template>
```

```tsx
// React Children
<Card
  header={<h2>标题</h2>}
  footer={<button>确定</button>}
>
  <p>内容 1</p>
  <p>内容 2</p>
</Card>
```

| 特性 | Vue3 插槽 | React Children |
|------|-----------|----------------|
| 默认内容 | `<slot />` | `{children}` |
| 具名插槽 | `<slot name="xxx" />` | Props 传递 |
| 作用域插槽 | `<slot :data="xxx" />` | Props 回调 |
| 语法 | `<template #name>` | JSX 表达式 |

---

## 要点总结

| 概念 | Vue3 | React |
|------|------|-------|
| 组件定义 | `<script setup>` | 函数组件 |
| Props | `defineProps<T>()` | 函数参数 |
| 事件 | `emit('event', data)` | Props 回调 |
| 插槽 | `<slot>` + `<template #name>` | `{children}` + Props |
| 样式隔离 | `<style scoped>` | CSS Modules |

## 常见误区

1. **Vue3 事件名必须是 kebab-case**
   ```vue
   <!-- 正确 -->
   emit('update-value', newValue)
   
   <!-- 错误 -->
   emit('updateValue', newValue)
   ```

2. **React 的 children 是隐式传递的**
   ```tsx
   // React 中 children 不需要显式声明在 JSX 中
   <Card>
     <p>这是 children</p>
   </Card>
   
   // 但 props 需要显式传递
   <Card header={<h2>标题</h2>}>
     <p>这是 children</p>
   </Card>
   ```

3. **Vue3 插槽作用域**
   ```vue
   <!-- 子组件可以传递数据给插槽 -->
   <slot :items="items" :count="count" />
   
   <!-- 父组件接收数据 -->
   <template #default="{ items, count }">
     <p>共 {{ count }} 项</p>
   </template>
   ```
