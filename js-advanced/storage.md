# 第二章：浏览器存储

## 2.1 IndexedDB

### 基本概念

```
IndexedDB 特点：
├── 客户端数据库 → 数据存储在浏览器
├── 异步 API → 不阻塞主线程
├── 大容量 → 通常可用数百 MB
├── 支持索引 → 高效查询
└── 事务性 → 数据一致性保证
```

### 基本操作

```javascript
// 打开/创建数据库
const request = indexedDB.open('MyDatabase', 1)

request.onupgradeneeded = (event) => {
  const db = event.target.result
  
  // 创建对象仓库（类似表）
  if (!db.objectStoreNames.contains('users')) {
    const store = db.createObjectStore('users', { keyPath: 'id' })
    store.createIndex('name', 'name', { unique: false })
    store.createIndex('email', 'email', { unique: true })
  }
}

request.onsuccess = (event) => {
  const db = event.target.result
  console.log('数据库打开成功')
}

request.onerror = (event) => {
  console.error('数据库打开失败:', event.target.error)
}
```

### 封装 IndexedDB

```javascript
class IDB {
  constructor(dbName, version = 1) {
    this.dbName = dbName
    this.version = version
    this.db = null
  }
  
  async open(stores = []) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result
        stores.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true })
          }
        })
      }
      
      request.onsuccess = (event) => {
        this.db = event.target.result
        resolve(this.db)
      }
      
      request.onerror = (event) => reject(event.target.error)
    })
  }
  
  async add(storeName, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.add(data)
      
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }
  
  async get(storeName, id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(id)
      
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }
  
  async getAll(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()
      
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }
  
  async update(storeName, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.put(data)
      
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }
  
  async delete(storeName, id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(id)
      
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
  
  async clear(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.clear()
      
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
  
  // 按索引查询
  async getByIndex(storeName, indexName, value) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const index = store.index(indexName)
      const request = index.getAll(value)
      
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }
}

// 使用示例
const idb = new IDB('MyApp', 1)
await idb.open(['users', 'posts'])

// 添加数据
await idb.add('users', { name: 'Alice', email: 'alice@example.com' })

// 查询
const user = await idb.get('users', 1)
console.log(user)

// 获取所有
const users = await idb.getAll('users')
console.log(users)
```

---

## 2.2 Cache API

### 基本操作

```javascript
// 打开缓存
const cache = await caches.open('my-cache')

// 添加请求到缓存
await cache.add('/api/data')

// 添加响应到缓存
const response = await fetch('/api/data')
await cache.put('/api/data', response)

// 从缓存获取
const cachedResponse = await cache.match('/api/data')

// 删除缓存
await cache.delete('/api/data')

// 获取所有缓存键
const keys = await caches.keys()

// 删除所有缓存
await Promise.all(
  keys.map(key => caches.delete(key))
)
```

### 实用封装

```javascript
class CacheManager {
  constructor(cacheName = 'app-cache') {
    this.cacheName = cacheName
  }
  
  async open() {
    return caches.open(this.cacheName)
  }
  
  async cacheRequest(url, response) {
    const cache = await this.open()
    await cache.put(url, response.clone())
    return response
  }
  
  async getCachedResponse(url) {
    const cache = await this.open()
    return cache.match(url)
  }
  
  async fetchWithCache(url, options = {}) {
    const cachedResponse = await this.getCachedResponse(url)
    
    if (cachedResponse && !options.forceRefresh) {
      return cachedResponse
    }
    
    const response = await fetch(url, options)
    return this.cacheRequest(url, response)
  }
  
  async clear() {
    return caches.delete(this.cacheName)
  }
  
  async getCacheSize() {
    const cache = await this.open()
    const keys = await cache.keys()
    let totalSize = 0
    
    for (const request of keys) {
      const response = await cache.match(request)
      const blob = await response.blob()
      totalSize += blob.size
    }
    
    return totalSize
  }
}

// 使用
const cacheManager = new CacheManager('api-cache')
const data = await cacheManager.fetchWithCache('/api/data')
```

---

## 2.3 Service Worker

### 基本结构

```javascript
// sw.js
const CACHE_NAME = 'v1'
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/scripts/app.js'
]

// 安装事件
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  )
})

// 激活事件
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    })
  )
})

// 请求拦截
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response
        }
        return fetch(event.request)
      })
  )
})
```

### 注册 Service Worker

```javascript
// main.js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('SW registered:', registration)
    })
    .catch(error => {
      console.log('SW registration failed:', error)
    })
}

// 监听更新
navigator.serviceWorker.controller?.addEventListener('updatefound', () => {
  console.log('New SW installing...')
})
```

### 缓存策略

```javascript
// sw.js
const strategies = {
  // 缓存优先
  cacheFirst: async (request) => {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) return cachedResponse
    
    const response = await fetch(request)
    const cache = await caches.open('v1')
    cache.put(request, response.clone())
    return response
  },
  
  // 网络优先
  networkFirst: async (request) => {
    try {
      const response = await fetch(request)
      const cache = await caches.open('v1')
      cache.put(request, response.clone())
      return response
    } catch (error) {
      return caches.match(request)
    }
  },
  
  // 仅网络
  networkOnly: async (request) => {
    return fetch(request)
  },
  
  // 仅缓存
  cacheOnly: async (request) => {
    return caches.match(request)
  }
}

// 根据 URL 选择策略
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  
  // API 请求使用网络优先
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(strategies.networkFirst(event.request))
    return
  }
  
  // 静态资源使用缓存优先
  if (url.pathname.match(/\.(js|css|png|jpg)$/)) {
    event.respondWith(strategies.cacheFirst(event.request))
    return
  }
  
  // 默认使用网络优先
  event.respondWith(strategies.networkFirst(event.request))
})
```

---

## 2.4 存储方案对比

| 特性 | LocalStorage | SessionStorage | IndexedDB | Cache API |
|------|--------------|----------------|-----------|-----------|
| **容量** | 5-10MB | 5-10MB | 数百MB | 数百MB |
| **存储类型** | 字符串 | 字符串 | 任意数据 | 请求/响应 |
| **同步/异步** | 同步 | 同步 | 异步 | 异步 |
| **作用域** | 同源 | 标签页 | 同源 | 同源 |
| **过期时间** | 永久 | 会话结束 | 永久 | 手动管理 |
| **适用场景** | 用户偏好 | 临时数据 | 结构化数据 | 离线缓存 |

### 选择建议

```
需要存储用户偏好 → LocalStorage
需要临时状态 → SessionStorage
需要存储复杂数据 → IndexedDB
需要离线缓存 → Cache API
需要存储大量数据 → IndexedDB
需要支持离线访问 → Service Worker + Cache API
```
