# Vue3 + TypeScript

## 项目创建

```bash
# 创建 Vue3 + TypeScript 项目
npm create vue@latest my-app

# 选择 TypeScript 支持
# ✔ Add TypeScript? → Yes

# 安装依赖
cd my-app
npm install
npm run dev
```

## 组合式 API + TypeScript

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 响应式状态
const count = ref<number>(0)
const message = ref<string>('Hello Vue3!')
const user = ref<{ name: string; age: number }>({
  name: 'Alice',
  age: 25
})

// 计算属性
const doubleCount = computed<number>(() => count.value * 2)
const greeting = computed<string>(() => `Hello, ${user.value.name}!`)

// 方法
function increment(): void {
  count.value++
}

function updateUser(name: string, age: number): void {
  user.value = { name, age }
}

// 生命周期
onMounted(() => {
  console.log('Component mounted')
})
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <p>{{ greeting }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```

## Props 类型定义

```vue
<script setup lang="ts">
// 定义 Props 类型
interface Props {
  title: string
  count?: number
  items: string[]
  user: {
    name: string
    age: number
  }
}

// 使用 withDefaults 设置默认值
const props = withDefaults(defineProps<Props>(), {
  count: 0
})

// 或使用 defineProps 泛型
const props2 = defineProps<{
  title: string
  count?: number
  items: string[]
}>()
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <p>Count: {{ count }}</p>
    <ul>
      <li v-for="item in items" :key="item">{{ item }}</li>
    </ul>
  </div>
</template>
```

## Emits 类型定义

```vue
<script setup lang="ts">
// 定义 Emits 类型
const emit = defineEmits<{
  (e: 'update', id: number, value: string): void
  (e: 'delete', id: number): void
  (e: 'submit', data: { name: string; email: string }): void
}>()

// 或使用声明语法
const emit2 = defineEmits<{
  update: [id: number, value: string]
  delete: [id: number]
  submit: [data: { name: string; email: string }]
}>()

// 触发事件
function handleUpdate(id: number, value: string): void {
  emit('update', id, value)
}

function handleDelete(id: number): void {
  emit('delete', id)
}
</script>
```

## Ref 和 Reactive 类型

```vue
<script setup lang="ts">
import { ref, reactive, shallowRef, shallowReactive } from 'vue'

// ref 类型推断
const count = ref(0)          // Ref<number>
const message = ref('hello')  // Ref<string>

// 显式指定类型
const user = ref<{ name: string; age: number } | null>(null)

// reactive 类型推断
const state = reactive({
  count: 0,
  message: 'hello'
})

// 显式指定类型
interface State {
  count: number
  message: string
  items: string[]
}

const state2 = reactive<State>({
  count: 0,
  message: 'hello',
  items: []
})

// shallowRef（只跟踪引用，不深度响应）
const shallow = shallowRef({ nested: { value: 1 } })

// shallowReactive
const shallowState = shallowReactive({
  nested: { value: 1 }
})
</script>
```

## Composable 类型

```typescript
// composables/useCounter.ts
import { ref, computed } from 'vue'

interface UseCounterOptions {
  initialValue?: number
  step?: number
}

export function useCounter(options: UseCounterOptions = {}) {
  const { initialValue = 0, step = 1 } = options
  
  const count = ref(initialValue)
  const doubleCount = computed(() => count.value * 2)
  
  function increment(): void {
    count.value += step
  }
  
  function decrement(): void {
    count.value -= step
  }
  
  function reset(): void {
    count.value = initialValue
  }
  
  return {
    count,
    doubleCount,
    increment,
    decrement,
    reset
  }
}

// composables/useFetch.ts
import { ref, watchEffect } from 'vue'

interface UseFetchReturn<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
}

export function useFetch<T>(url: string): UseFetchReturn<T> {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)
  
  watchEffect(async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      data.value = await response.json()
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
    } finally {
      loading.value = false
    }
  })
  
  return { data, loading, error }
}

// 使用
const { data: users, loading, error } = useFetch<User[]>('/api/users')
```

## Pinia 状态管理

```typescript
// stores/user.ts
import { defineStore } from 'pinia'

interface User {
  id: number
  name: string
  email: string
}

interface UserState {
  users: User[]
  currentUser: User | null
  loading: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: [],
    currentUser: null,
    loading: false
  }),
  
  getters: {
    getUserById: (state) => (id: number) => {
      return state.users.find(user => user.id === id)
    },
    
    isLoggedIn: (state) => state.currentUser !== null
  },
  
  actions: {
    async fetchUsers(): Promise<void> {
      this.loading = true
      try {
        const response = await fetch('/api/users')
        this.users = await response.json()
      } finally {
        this.loading = false
      }
    },
    
    async login(email: string, password: string): Promise<void> {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      this.currentUser = await response.json()
    },
    
    logout(): void {
      this.currentUser = null
    }
  }
})

// 使用
const userStore = useUserStore()
await userStore.fetchUsers()
console.log(userStore.getUserById(1))
```

## 路由类型

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/user/:id',
    name: 'User',
    component: () => import('../views/User.vue'),
    props: true
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return { name: 'Login' }
  }
})

// 在组件中使用
// views/User.vue
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 类型安全的路由参数
const userId = Number(route.params.id)

// 导航
function goToUser(id: number): void {
  router.push({ name: 'User', params: { id } })
}
</script>
```

## 完整示例：Todo 应用

```vue
<!-- App.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'

interface Todo {
  id: number
  text: string
  completed: boolean
}

const todos = ref<Todo[]>([])
const newTodo = ref('')
let nextId = 1

const incompleteTodos = computed(() =>
  todos.value.filter(todo => !todo.completed)
)

function addTodo(): void {
  if (newTodo.value.trim()) {
    todos.value.push({
      id: nextId++,
      text: newTodo.value.trim(),
      completed: false
    })
    newTodo.value = ''
  }
}

function toggleTodo(id: number): void {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
  }
}

function removeTodo(id: number): void {
  todos.value = todos.value.filter(t => t.id !== id)
}
</script>

<template>
  <div>
    <h1>Todo App</h1>
    
    <form @submit.prevent="addTodo">
      <input v-model="newTodo" placeholder="Add todo..." />
      <button type="submit">Add</button>
    </form>
    
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <input
          type="checkbox"
          :checked="todo.completed"
          @change="toggleTodo(todo.id)"
        />
        <span :class="{ completed: todo.completed }">
          {{ todo.text }}
        </span>
        <button @click="removeTodo(todo.id)">Remove</button>
      </li>
    </ul>
    
    <p>{{ incompleteTodos.length }} items left</p>
  </div>
</template>

<style scoped>
.completed {
  text-decoration: line-through;
  opacity: 0.5;
}
</style>
```
