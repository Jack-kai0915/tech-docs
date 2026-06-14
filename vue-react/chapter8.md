# 第八章：常见陷阱与避坑指南

## 8.1 Vue3 常见坑

### 1. reactive 解构丢失响应式

**现象**：解构后数据更新，视图不更新

```vue
<script setup>
import { reactive, toRefs } from 'vue'

const state = reactive({ count: 0, name: '张三' })

// ❌ 错误：解构后丢失响应性
const { count, name } = state
count++  // 不会触发更新

// ✅ 正确：使用 toRefs
const { count, name } = toRefs(state)
count.value++  // 触发更新

// ✅ 正确：直接使用 state
state.count++
</script>
```

### 2. ref 忘记 .value

**现象**：在 JS 中访问 ref 忘记 .value

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)

// ❌ 错误：忘记 .value
count++  // NaN
console.log(count)  // Ref 对象

// ✅ 正确：使用 .value
count.value++
console.log(count.value)  // 0

// ✅ 模板中不需要 .value
</script>

<template>
  <p>{{ count }}</p>  <!-- 正确 -->
</template>
```

### 3. watch 立即执行的空值问题

**现象**：`immediate: true` 首次执行时拿到空值

```vue
<script setup>
import { ref, watch } from 'vue'

const data = ref(null)

// ❌ 问题：首次执行时 data 是 null
watch(data, (newVal) => {
  console.log(newVal.name)  // 报错：Cannot read property 'name'
}, { immediate: true })

// ✅ 正确：添加空值检查
watch(data, (newVal) => {
  if (newVal) {
    console.log(newVal.name)
  }
}, { immediate: true })

// ✅ 正确：使用 watchEffect（自动跳过初始 null）
watchEffect(() => {
  if (data.value) {
    console.log(data.value.name)
  }
})
</script>
```

### 4. nextTick 时序问题

**现象**：DOM 更新后操作元素拿不到最新值

```vue
<script setup>
import { ref, nextTick } from 'vue'

const inputRef = ref<HTMLInputElement | null>(null)
const message = ref('Hello')

async function updateMessage() {
  message.value = 'World'
  
  // ❌ 错误：此时 DOM 还没更新
  console.log(inputRef.value?.value)  // "Hello"
  
  // ✅ 正确：等待 DOM 更新
  await nextTick()
  console.log(inputRef.value?.value)  // "World"
}
</script>
```

### 5. v-if 与 v-for 同元素

**现象**：优先级变化导致的 bug

```vue
<!-- ❌ Vue3 不再推荐同用，v-if 优先级更高 -->
<template v-for="item in items" :key="item.id">
  <div v-if="item.visible">{{ item.name }}</div>
</template>

<!-- ✅ 正确：使用 computed 过滤 -->
<script setup>
const visibleItems = computed(() => items.filter(item => item.visible))
</script>

<template>
  <div v-for="item in visibleItems" :key="item.id">
    {{ item.name }}
  </div>
</template>
```

### 6. provide/inject 不是响应式的

**现象**：传值方式不对导致子组件不更新

```vue
<!-- 父组件 -->
<script setup>
import { provide, ref } from 'vue'

const count = ref(0)

// ❌ 错误：直接传值
provide('count', count.value)

// ✅ 正确：传递 ref 本身
provide('count', count)
</script>

<!-- 子组件 -->
<script setup>
import { inject } from 'vue'

// ❌ 错误：接收的是值
const count = inject('count')

// ✅ 正确：接收 ref
const count = inject('count')
console.log(count.value)
</script>
```

---

## 8.2 React 常见坑

### 1. useState 异步更新

**现象**：调用 setState 后立即读取还是旧值

```tsx
function Counter() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setCount(count + 1)
    
    // ❌ 错误：还是旧值
    console.log(count)  // 0
    
    // ✅ 正确：使用函数式更新
    setCount(prev => {
      console.log(prev)  // 0
      return prev + 1
    })
  }

  return <button onClick={handleClick}>{count}</button>
}
```

### 2. useEffect 无限循环

**现象**：依赖数组包含引用类型导致每次都触发

```tsx
function Component({ config }: { config: { url: string } }) {
  // ❌ 问题：config 每次都是新对象
  useEffect(() => {
    fetch(config.url)
  }, [config])  // 无限循环！

  // ✅ 正确：使用具体属性
  useEffect(() => {
    fetch(config.url)
  }, [config.url])

  // ✅ 正确：使用 useMemo 稳定引用
  const stableConfig = useMemo(() => config, [config.url])
}
```

### 3. 闭包陷阱

**现象**：useEffect/setTimeout 里拿到的是旧状态

```tsx
function Counter() {
  const [count, setCount] = useState(0)

  function handleClick() {
    // ❌ 问题：闭包捕获的是旧 count
    setTimeout(() => {
      console.log(count)  // 永远是 0
    }, 3000)
    
    setCount(count + 1)
  }

  // ✅ 正确：使用 ref 或函数式更新
  const countRef = useRef(count)
  countRef.current = count
  
  function handleClick2() {
    setTimeout(() => {
      console.log(countRef.current)  // 最新值
    }, 3000)
    
    setCount(c => c + 1)
  }
}
```

### 4. key 用 index 的坑

**现象**：列表排序/删除后状态错乱

```tsx
// ❌ 问题：使用 index 作为 key
function List({ items }) {
  return items.map((item, index) => (
    <ListItem key={index} item={item} />
    // 当列表顺序变化时，组件状态会错乱
  ))
}

// ✅ 正确：使用唯一标识
function List({ items }) {
  return items.map(item => (
    <ListItem key={item.id} item={item} />
  ))
}
```

### 5. useEffect 清理函数遗漏

**现象**：未清理订阅/定时器导致内存泄漏

```tsx
function Timer() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => c + 1)
    }, 1000)

    // ❌ 遗漏清理函数
    // return () => clearInterval(timer)

    // ✅ 正确：返回清理函数
    return () => clearInterval(timer)
  }, [])

  return <p>{count}</p>
}
```

### 6. useMemo/useCallback 滥用

**现象**：不加思考地包一层反而降低性能

```tsx
// ❌ 问题：简单计算不需要 useMemo
const result = useMemo(() => a + b, [a, b])

// ✅ 正确：只在真正需要时使用
// 1. 计算成本高
const sortedItems = useMemo(() => items.sort(), [items])

// 2. 作为 props 传递给 memo 组件
const handleClick = useCallback(() => {
  doSomething()
}, [])
```

---

## 8.3 框架通用坑

### 1. 列表渲染 key 值选择

```tsx
// ❌ 错误：使用 index
items.map((item, index) => <Item key={index} />)

// ✅ 正确：使用唯一 ID
items.map(item => <Item key={item.id} />)

// ⚠️ 什么时候可以用 index？
// - 列表是静态的，不会增删改
// - 列表项没有状态
// - 列表不会重新排序
```

### 2. 条件渲染的闪烁问题

```tsx
// ❌ 问题：加载状态与空状态的切换
function DataLoader() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  if (loading) return <Loading />
  if (!data) return <Empty />  // 闪烁！
  return <Data data={data} />
}

// ✅ 正确：使用初始状态避免闪烁
function DataLoader() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  return (
    <>
      {loading && <Loading />}
      {!loading && !data && <Empty />}
      {!loading && data && <Data data={data} />}
    </>
  )
}
```

### 3. 组件通信过度复杂

```
什么时候用什么：

Props/Events：父子组件直接通信
├── 简单数据传递
├── 组件配置
└── 回调函数

全局状态（Pinia/Zustand）：
├── 多个不相关组件共享状态
├── 用户登录状态
└── 主题/语言设置

Provide/Inject 或 Context：
├── 深层组件树传递
├── 依赖注入模式
└── 避免 props 逐层传递
```

---

## 避坑最佳实践

### 代码审查清单

**Vue3 必查**：
- [ ] reactive 解构是否使用 toRefs？
- [ ] ref 在 JS 中是否使用 .value？
- [ ] watch 的 immediate 是否处理空值？
- [ ] provide/inject 是否传递 ref？
- [ ] v-if 和 v-for 是否分开？

**React 必查**：
- [ ] useEffect 依赖数组是否完整？
- [ ] useEffect 是否有清理函数？
- [ ] 列表 key 是否使用唯一 ID？
- [ ] setState 后是否立即读取？
- [ ] 是否有闭包陷阱？

### 调试技巧

```vue
<!-- Vue3：使用 Vue DevTools -->
<script setup>
// 在浏览器控制台查看组件状态
// 安装 Vue DevTools 扩展
</script>
```

```tsx
// React：使用 React DevTools
// 安装 React DevTools 扩展
// 使用 console.log 和 React Profiler
```

### 错误边界处理

```tsx
// React：Error Boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false }
  
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>出错了</h1>
    }
    return this.props.children
  }
}
```

```vue
<!-- Vue3：onErrorCaptured -->
<script setup>
import { onErrorCaptured } from 'vue'

onErrorCaptured((err, instance, info) => {
  console.error('捕获到错误:', err)
  return false  // 阻止错误向上传播
})
</script>
```
