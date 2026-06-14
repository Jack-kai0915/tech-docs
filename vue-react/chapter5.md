# 第五章：路由

## 5.1 路由配置

### Vue3：Vue Router

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/about',
      name: 'About',
      // 懒加载
      component: () => import('../views/About.vue')
    },
    {
      path: '/user/:id',
      name: 'User',
      component: () => import('../views/User.vue')
    },
    {
      path: '/dashboard',
      component: () => import('../views/Dashboard.vue'),
      children: [
        {
          path: 'profile',
          component: () => import('../views/Profile.vue')
        },
        {
          path: 'settings',
          component: () => import('../views/Settings.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue')
    }
  ]
})

export default router
```

```vue
<!-- src/App.vue -->
<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <nav>
    <RouterLink to="/">首页</RouterLink>
    <RouterLink to="/about">关于</RouterLink>
    <RouterLink to="/user/123">用户</RouterLink>
  </nav>
  
  <!-- 路由出口 -->
  <RouterView />
</template>
```

### React：React Router

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom'

// 页面组件
const Home = () => <h1>首页</h1>
const About = () => <h1>关于</h1>
const User = () => <h1>用户</h1>
const NotFound = () => <h1>404</h1>

// 布局组件
function Dashboard() {
  return (
    <div>
      <nav>
        <Link to="profile">个人资料</Link>
        <Link to="settings">设置</Link>
      </nav>
      <Outlet />  {/* 子路由出口 */}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">首页</Link>
        <Link to="/about">关于</Link>
        <Link to="/user/123">用户</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/:id" element={<User />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
```

---

## 5.2 路由参数

### Vue3

```vue
<!-- 获取路由参数 -->
<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 获取参数
const id = route.params.id
const query = route.query

// 编程式导航
function goToUser(id: number) {
  router.push(`/user/${id}`)
  // 或
  router.push({ name: 'User', params: { id } })
}

// 带查询参数
function search(keyword: string) {
  router.push({ path: '/search', query: { q: keyword } })
}
</script>

<template>
  <p>用户ID: {{ route.params.id }}</p>
</template>
```

### React

```tsx
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'

function User() {
  // 获取路由参数
  const { id } = useParams()
  
  // 获取查询参数
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q')
  
  // 编程式导航
  const navigate = useNavigate()
  
  function goToUser(userId: number) {
    navigate(`/user/${userId}`)
  }
  
  function search(keyword: string) {
    setSearchParams({ q: keyword })
  }

  return (
    <p>用户ID: {id}</p>
  )
}
```

---

## 5.3 导航守卫

### Vue3

```typescript
// 全局前置守卫
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

// 路由独享守卫
{
  path: '/admin',
  component: Admin,
  beforeEnter: (to, from, next) => {
    const isAdmin = checkAdmin()
    if (!isAdmin) {
      next('/403')
    } else {
      next()
    }
  }
}

// 组件内守卫
<script setup>
import { onBeforeRouteLeave } from 'vue-router'

onBeforeRouteLeave((to, from) => {
  if (hasUnsavedChanges.value) {
    return window.confirm('有未保存的更改，确定离开吗？')
  }
})
</script>
```

### React

```tsx
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

// 自定义守卫 Hook
function useAuthGuard() {
  const navigate = useNavigate()
  const location = useLocation()
  
  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem('token')
    
    if (location.pathname !== '/login' && !isLoggedIn) {
      navigate('/login')
    }
  }, [location, navigate])
}

// 路由守卫组件
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const isLoggedIn = !!localStorage.getItem('token')
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login')
    }
  }, [isLoggedIn, navigate])
  
  return isLoggedIn ? <>{children}</> : null
}

// 使用
<Routes>
  <Route path="/admin" element={
    <ProtectedRoute>
      <Admin />
    </ProtectedRoute>
  } />
</Routes>
```

---

## 要点总结

| 概念 | Vue Router | React Router |
|------|------------|--------------|
| 创建 | `createRouter()` | `<BrowserRouter>` |
| 配置 | `routes` 数组 | `<Routes>` + `<Route>` |
| 导航 | `<RouterLink>` | `<Link>` |
| 出口 | `<RouterView>` | `<Outlet>` |
| 参数 | `useRoute()` | `useParams()` |
| 导航 | `useRouter()` | `useNavigate()` |
| 守卫 | `beforeEach` | 自定义组件/Hook |

## 常见误区

1. **Vue3 路由懒加载**
   ```typescript
   // 正确：箭头函数
   component: () => import('./views/Home.vue')
   
   // 错误：直接导入（不会懒加载）
   import Home from './views/Home.vue'
   ```

2. **React Router v6 嵌套路由**
   ```tsx
   // React Router v6 使用 Outlet
   function Dashboard() {
     return (
       <div>
         <h1>Dashboard</h1>
         <Outlet />  {/* 子路由渲染在这里 */}
       </div>
     )
   }
   ```

3. **Vue3 路由守卫必须调用 next()**
   ```typescript
   router.beforeEach((to, from, next) => {
     // 必须调用 next()，否则导航会卡住
     if (authorized) {
       next()
     } else {
       next('/login')
     }
   })
   ```
