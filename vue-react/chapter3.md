# 第三章：状态管理

## 3.1 本地状态

### Vue3：ref / reactive

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue'

// ref：基本类型和对象都适用
const count = ref(0)
const name = ref('张三')
const user = ref({ age: 25 })

// 访问/修改需要 .value（模板中不需要）
function increment() {
  count.value++
}

// reactive：只适用于对象
const state = reactive({
  count: 0,
  name: '张三',
  items: [1, 2, 3]
})

// 访问/修改直接操作
function reactiveIncrement() {
  state.count++
}
</script>

<template>
  <!-- ref 在模板中自动解包 -->
  <p>{{ count }}</p>
  <p>{{ state.count }}</p>
</template>
```

### React：useState

```tsx
import { useState } from 'react'

function Counter() {
  // useState 返回 [值, setter]
  const [count, setCount] = useState(0)
  const [name, setName] = useState('张三')
  const [user, setUser] = useState({ age: 25 })

  // 修改必须通过 setter
  function increment() {
    setCount(count + 1)  // 基本类型直接传值
    
    // 对象需要展开或传入新对象
    setUser({ ...user, age: user.age + 1 })
  }

  return (
    <>
      <p>{count}</p>
      <button onClick={increment}>+1</button>
    </>
  )
}
```

### 对比

| 特性 | Vue3 | React |
|------|------|-------|
| 创建 | `ref()` / `reactive()` | `useState()` |
| 访问 | `xxx.value`（JS中） | 直接使用 |
| 修改 | 直接赋值 `count.value++` | `setCount(newValue)` |
| 对象更新 | 自动深度响应 | 需要展开/新建对象 |
| 模板/JSX | 自动解包，无需 `.value` | 直接使用 |

```vue
<!-- Vue3 对象更新 -->
<script setup>
const user = ref({ name: '张三', age: 25 })

// 方式一：整体替换
user.value = { name: '李四', age: 30 }

// 方式二：响应式修改
user.value.age = 26
</script>
```

```tsx
// React 对象更新
const [user, setUser] = useState({ name: '张三', age: 25 })

// 方式一：整体替换
setUser({ name: '李四', age: 30 })

// 方式二：展开修改
setUser({ ...user, age: 26 })

// 方式三：函数式更新
setUser(prev => ({ ...prev, age: prev.age + 1 }))
```

---

## 3.2 计算属性 vs useMemo

### Vue3：computed

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const firstName = ref('张')
const lastName = ref('三')

// 计算属性：自动缓存，依赖变化时自动更新
const fullName = computed(() => {
  console.log('fullName 计算了')  // 只在依赖变化时执行
  return firstName.value + lastName.value
})

// 可写的计算属性
const fullNameWritable = computed({
  get: () => firstName.value + lastName.value,
  set: (newValue: string) => {
    firstName.value = newValue[0]
    lastName.value = newValue.slice(1)
  }
})

// 使用
console.log(fullName.value)  // "张三"
</script>

<template>
  <p>{{ fullName }}</p>
  <input v-model="firstName" />
</template>
```

### React：useMemo

```tsx
import { useState, useMemo } from 'react'

function NameForm() {
  const [firstName, setFirstName] = useState('张')
  const [lastName, setLastName] = useState('三')

  // useMemo：手动缓存，依赖变化时重新计算
  const fullName = useMemo(() => {
    console.log('fullName 计算了')  // 只在依赖变化时执行
    return firstName + lastName
  }, [firstName, lastName])  // 必须声明依赖

  return (
    <>
      <p>{fullName}</p>
      <input 
        value={firstName} 
        onChange={e => setFirstName(e.target.value)} 
      />
    </>
  )
}
```

### 对比

| 特性 | Vue3 computed | React useMemo |
|------|---------------|---------------|
| 语法 | `computed(() => value)` | `useMemo(() => value, [deps])` |
| 依赖追踪 | 自动 | 手动声明 |
| 可写性 | 支持 `get/set` | 只读 |
| 缓存 | 自动缓存 | 需要声明依赖 |

---

## 3.3 监听器 vs useEffect

### Vue3：watch / watchEffect

```vue
<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'

const count = ref(0)
const name = ref('张三')

// watch：监听特定数据
watch(count, (newVal, oldVal) => {
  console.log(`count: ${oldVal} → ${newVal}`)
})

// watch：监听多个数据
watch([count, name], ([newCount, newName], [oldCount, oldName]) => {
  console.log(`count: ${oldCount} → ${newCount}`)
  console.log(`name: ${oldName} → ${newName}`)
})

// watch：监听对象属性
watch(
  () => user.value.age,
  (newAge) => {
    console.log('年龄变化:', newAge)
  }
)

// watchEffect：自动追踪依赖
watchEffect(() => {
  console.log(`count: ${count.value}, name: ${name.value}`)
  // 自动追踪用到的响应式数据
})

// 深度监听
watch(
  user,
  (newUser) => {
    console.log('user 变化:', newUser)
  },
  { deep: true }
)
</script>
```

### React：useEffect

```tsx
import { useState, useEffect } from 'react'

function Component() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('张三')

  // 相当于 watch
  useEffect(() => {
    console.log(`count 变化: ${count}`)
  }, [count])  // 依赖数组

  // 相当于 watchEffect
  useEffect(() => {
    console.log(`count: ${count}, name: ${name}`)
    // 自动追踪用到的状态
  })  // 没有依赖数组 = 每次渲染都执行

  // 相当于 mounted
  useEffect(() => {
    console.log('组件挂载')
    
    // 返回清理函数 = unmounted
    return () => {
      console.log('组件卸载')
    }
  }, [])  // 空依赖 = 只执行一次

  // 相当于 deep watch
  useEffect(() => {
    console.log('user 变化:', user)
  }, [user])  // React 不支持自动深度比较
}
```

### 对比

| 特性 | Vue3 watch | React useEffect |
|------|------------|-----------------|
| 语法 | `watch(source, callback)` | `useEffect(callback, deps)` |
| 依赖追踪 | 自动/手动 | 必须手动声明 |
| 旧值访问 | 支持 `(newVal, oldVal)` | 不支持 |
| 深度监听 | `{ deep: true }` | 需要自己比较 |
| 清理 | `onUnmounted` | 返回清理函数 |

---

## 3.4 全局状态

### Vue3：Pinia

```typescript
// stores/counter.ts
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  // 状态
  state: () => ({
    count: 0,
    name: '计数器'
  }),
  
  // 计算属性
  getters: {
    doubleCount: (state) => state.count * 2,
    doubleCountPlusOne: (state) => state.count * 2 + 1
  },
  
  // 方法
  actions: {
    increment() {
      this.count++
    },
    async fetchCount() {
      const res = await fetch('/api/count')
      this.count = await res.json()
    }
  }
})
```

```vue
<!-- 使用 Pinia -->
<script setup>
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()

// 访问状态
console.log(counter.count)
console.log(counter.doubleCount)

// 修改状态
counter.increment()
counter.$patch({ count: counter.count + 1 })
</script>

<template>
  <p>{{ counter.count }}</p>
  <p>双倍: {{ counter.doubleCount }}</p>
  <button @click="counter.increment">+1</button>
</template>
```

### React：Zustand

```typescript
// stores/counter.ts
import { create } from 'zustand'

interface CounterState {
  count: number
  name: string
  increment: () => void
  decrement: () => void
  reset: () => void
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  name: '计数器',
  
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 })
}))
```

```tsx
// 使用 Zustand
function Counter() {
  const { count, increment, decrement, reset } = useCounterStore()

  return (
    <>
      <p>{count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
      <button onClick={reset}>重置</button>
    </>
  )
}
```

### 全局状态对比

| 特性 | Pinia (Vue3) | Zustand (React) |
|------|--------------|-----------------|
| 定义 | `defineStore()` | `create()` |
| 状态 | `state` | 直接在回调中 |
| getters | `getters` | `useMemo` 或直接计算 |
| actions | `actions` | 直接定义在 store 中 |
| 使用 | `store.xxx` | 解构 `{ xxx }` |

---

## 要点总结

| 概念 | Vue3 | React |
|------|------|-------|
| 本地状态 | `ref()` / `reactive()` | `useState()` |
| 计算属性 | `computed()` | `useMemo()` |
| 监听器 | `watch()` / `watchEffect()` | `useEffect()` |
| 全局状态 | Pinia | Zustand / Redux |

## 常见误区

1. **Vue3 ref 在 JS 中必须用 .value**
   ```vue
   <script setup>
   const count = ref(0)
   
   // 正确
   count.value++
   console.log(count.value)
   
   // 错误
   count++  // ❌
   </script>
   ```

2. **React setState 是批量的**
   ```tsx
   function handleClick() {
     setCount(count + 1)
     setName('李四')
     // 两次更新会批量处理，只触发一次重渲染
   }
   ```

3. **Vue3 reactive 解构丢失响应性**
   ```vue
   <script setup>
   const state = reactive({ count: 0 })
   
   // 错误：解构后是普通值
   const { count } = state
   count++  // 不会触发更新
   
   // 正确：使用 toRefs
   const { count } = toRefs(state)
   count.value++
   </script>
   ```
