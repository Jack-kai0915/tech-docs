# 第四章：生命周期与副作用

## 4.1 生命周期钩子对比

### 对比表

| Vue3 | React (Hooks) | 说明 |
|------|---------------|------|
| `onBeforeMount` | - | 挂载前 |
| `onMounted` | `useEffect(() => {}, [])` | 挂载后 |
| `onBeforeUpdate` | - | 更新前 |
| `onUpdated` | `useEffect(() => {})` | 更新后 |
| `onBeforeUnmount` | - | 卸载前 |
| `onUnmounted` | 返回清理函数 | 卸载后 |
| `onErrorCaptured` | Error Boundary | 错误捕获 |

---

## 4.2 Vue3 生命周期

```vue
<script setup lang="ts">
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onErrorCaptured
} from 'vue'

const count = ref(0)

// 组件挂载前
onBeforeMount(() => {
  console.log('组件即将挂载')
})

// 组件挂载后（常用）
onMounted(() => {
  console.log('组件已挂载')
  // 可以访问 DOM
  // 可以发起请求
  // 可以设置定时器
})

// 组件更新前
onBeforeUpdate(() => {
  console.log('组件即将更新')
})

// 组件更新后
onUpdated(() => {
  console.log('组件已更新')
})

// 组件卸载前
onBeforeUnmount(() => {
  console.log('组件即将卸载')
  // 清理定时器
  // 取消订阅
})

// 组件卸载后
onUnmounted(() => {
  console.log('组件已卸载')
})

// 错误捕获
onErrorCaptured((err, instance, info) => {
  console.error('捕获到错误:', err)
  return false  // 返回 false 阻止错误向上传播
})
</script>
```

---

## 4.3 React 生命周期（Hooks）

```tsx
import { useState, useEffect, useCallback } from 'react'

function LifecycleDemo() {
  const [count, setCount] = useState(0)

  // 组件挂载 + 更新（最常用）
  useEffect(() => {
    console.log('组件已挂载或更新')
    
    // 清理函数 = 组件卸载时执行
    return () => {
      console.log('组件即将卸载或更新前')
    }
  })

  // 仅挂载时执行（相当于 mounted）
  useEffect(() => {
    console.log('组件已挂载')
    
    return () => {
      console.log('组件已卸载')
    }
  }, [])  // 空依赖 = 只执行一次

  // 监听特定依赖
  useEffect(() => {
    console.log('count 变化:', count)
  }, [count])

  // 错误边界需要使用 class 组件
  // 或使用第三方库如 react-error-boundary

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}
```

---

## 4.4 副作用处理最佳实践

### 定时器清理

```vue
<!-- Vue3 -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const count = ref(0)
let timer: number | null = null

onMounted(() => {
  // 设置定时器
  timer = window.setInterval(() => {
    count.value++
  }, 1000)
})

onUnmounted(() => {
  // 清理定时器
  if (timer) {
    clearInterval(timer)
  }
})
</script>
```

```tsx
// React
import { useState, useEffect } from 'react'

function Timer() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // 设置定时器
    const timer = setInterval(() => {
      setCount(c => c + 1)
    }, 1000)

    // 清理定时器
    return () => clearInterval(timer)
  }, [])

  return <p>{count}</p>
}
```

### 事件监听

```vue
<!-- Vue3 -->
<script setup>
import { onMounted, onUnmounted } from 'vue'

function handleResize() {
  console.log('窗口大小变化')
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
```

```tsx
// React
import { useEffect } from 'react'

function ResizeHandler() {
  useEffect(() => {
    const handleResize = () => {
      console.log('窗口大小变化')
    }

    window.addEventListener('resize', handleResize)

    // 清理
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return null
}
```

### 数据请求

```vue
<!-- Vue3 -->
<script setup>
import { ref, onMounted } from 'vue'

const data = ref(null)
const loading = ref(true)
const error = ref(null)

async function fetchData() {
  try {
    const response = await fetch('/api/data')
    data.value = await response.json()
  } catch (e) {
    error.value = e
  } finally {
    loading.value = false
  }
}

// 挂载时请求
onMounted(fetchData)
</script>
```

```tsx
// React
import { useState, useEffect } from 'react'

function DataLoader() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/data')
        const json = await response.json()
        setData(json)
      } catch (e) {
        setError(e)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <p>加载中...</p>
  if (error) return <p>出错了</p>
  return <div>{JSON.stringify(data)}</div>
}
```

---

## 要点总结

| 概念 | Vue3 | React |
|------|------|-------|
| 挂载后 | `onMounted` | `useEffect(() => {}, [])` |
| 更新后 | `onUpdated` | `useEffect(() => {})` |
| 卸载时 | `onUnmounted` | `useEffect(() => { return cleanup })` |
| 错误捕获 | `onErrorCaptured` | Error Boundary |
| 清理方式 | 单独的钩子函数 | 返回清理函数 |

## 常见误区

1. **React useEffect 依赖数组**
   ```tsx
   // 错误：遗漏依赖
   useEffect(() => {
     console.log(count)
   }, [])  // ❌ count 是依赖
   
   // 正确
   useEffect(() => {
     console.log(count)
   }, [count])
   ```

2. **Vue3 生命周期顺序**
   ```vue
   <script setup>
   // 父组件
   onMounted(() => {
     console.log('父组件挂载')  // 先执行
   })
   </script>
   
   <!-- 子组件 -->
   <script setup>
   onMounted(() => {
     console.log('子组件挂载')  // 后执行
   })
   </script>
   ```

3. **React 函数组件每次渲染都执行**
   ```tsx
   function Component() {
     console.log('每次渲染都会执行')  // 组件函数本身
     
     useEffect(() => {
       console.log('副作用')
     }, [])
   }
   ```
