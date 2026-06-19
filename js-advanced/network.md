# 第三章：网络与请求

## 3.1 Fetch API 进阶

### 基本用法

```javascript
// GET 请求
const response = await fetch('https://api.example.com/data')
const data = await response.json()

// POST 请求
const response = await fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'Alice', age: 25 })
})

// 检查响应
if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`)
}
```

### 流式处理

```javascript
// 流式读取大文件
async function streamDownload(url) {
  const response = await fetch(url)
  const reader = response.body.getReader()
  const contentLength = +response.headers.get('Content-Length')
  
  let receivedLength = 0
  let chunks = []
  
  while (true) {
    const { done, value } = await reader.read()
    
    if (done) break
    
    chunks.push(value)
    receivedLength += value.length
    
    console.log(`Received ${receivedLength} of ${contentLength}`)
  }
  
  let allChunks = new Uint8Array(receivedLength)
  let position = 0
  
  for (let chunk of chunks) {
    allChunks.set(chunk, position)
    position += chunk.length
  }
  
  return allChunks
}
```

### 中断请求

```javascript
// 使用 AbortController
const controller = new AbortController()

fetch('/api/data', { signal: controller.signal })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('请求被取消')
    }
  })

// 取消请求
controller.abort()

// 超时取消
function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  
  return fetch(url, { signal: controller.signal })
    .finally(() => clearTimeout(timeoutId))
}
```

### 并发控制

```javascript
// 并发请求限制
async function fetchWithConcurrency(urls, maxConcurrent = 3) {
  const results = new Array(urls.length)
  let index = 0
  
  async function fetchNext() {
    while (index < urls.length) {
      const currentIndex = index++
      try {
        const response = await fetch(urls[currentIndex])
        results[currentIndex] = await response.json()
      } catch (error) {
        results[currentIndex] = { error }
      }
    }
  }
  
  await Promise.all(
    Array.from({ length: Math.min(maxConcurrent, urls.length) }, () => fetchNext())
  )
  
  return results
}

// 使用
const urls = ['/api/1', '/api/2', '/api/3', '/api/4', '/api/5']
const results = await fetchWithConcurrency(urls, 3)
```

---

## 3.2 HTTP/HTTPS 详解

### HTTP 协议基础

```
HTTP 请求结构：
┌─────────────────────────────────────────┐
│ 请求行                                  │
│ GET /api/users HTTP/1.1                 │
├─────────────────────────────────────────┤
│ 请求头                                  │
│ Host: example.com                       │
│ Content-Type: application/json          │
│ Authorization: Bearer token123          │
├─────────────────────────────────────────┤
│ 空行                                    │
├─────────────────────────────────────────┤
│ 请求体（POST/PUT）                      │
│ {"name": "Alice"}                       │
└─────────────────────────────────────────┘

HTTP 响应结构：
┌─────────────────────────────────────────┐
│ 状态行                                  │
│ HTTP/1.1 200 OK                         │
├─────────────────────────────────────────┤
│ 响应头                                  │
│ Content-Type: application/json          │
│ Content-Length: 1234                     │
├─────────────────────────────────────────┤
│ 空行                                    │
├─────────────────────────────────────────┤
│ 响应体                                  │
│ {"id": 1, "name": "Alice"}              │
└─────────────────────────────────────────┘
```

### HTTP 方法对比

| 方法 | 用途 | 幂等性 | 安全性 | 请求体 |
|------|------|--------|--------|--------|
| **GET** | 获取资源 | ✓ | ✓ | ✗ |
| **POST** | 创建资源 | ✗ | ✗ | ✓ |
| **PUT** | 更新资源（全量） | ✓ | ✗ | ✓ |
| **PATCH** | 更新资源（部分） | ✗ | ✗ | ✓ |
| **DELETE** | 删除资源 | ✓ | ✗ | ✓ |
| **HEAD** | 获取响应头 | ✓ | ✓ | ✗ |
| **OPTIONS** | 预检请求 | ✓ | ✓ | ✗ |

### HTTP 状态码详解

```
1xx 信息响应
├── 100 Continue        → 继续发送请求体
├── 101 Switching Protocols → 切换协议（WebSocket）
└── 102 Processing      → 处理中（WebDAV）

2xx 成功
├── 200 OK              → 请求成功
├── 201 Created         → 创建成功
├── 202 Accepted        → 已接受，异步处理
├── 204 No Content      → 成功，无内容
└── 206 Partial Content → 部分内容（断点续传）

3xx 重定向
├── 301 Moved Permanently → 永久重定向
├── 302 Found            → 临时重定向
├── 304 Not Modified     → 缓存有效
└── 307 Temporary Redirect → 临时重定向（保持方法）

4xx 客户端错误
├── 400 Bad Request      → 请求格式错误
├── 401 Unauthorized     → 未认证
├── 403 Forbidden        → 无权限
├── 404 Not Found        → 资源不存在
├── 405 Method Not Allowed → 方法不允许
├── 408 Request Timeout  → 请求超时
├── 409 Conflict         → 资源冲突
├── 413 Payload Too Large → 请求体过大
└── 429 Too Many Requests → 请求过多

5xx 服务端错误
├── 500 Internal Server Error → 服务器内部错误
├── 501 Not Implemented    → 功能未实现
├── 502 Bad Gateway        → 网关错误
├── 503 Service Unavailable → 服务不可用
├── 504 Gateway Timeout    → 网关超时
└── 507 Insufficient Storage → 存储空间不足
```

### HTTP/2 特性

```
HTTP/2 新特性：
├── 多路复用 → 一个连接处理多个请求
├── 头部压缩 → HPACK 算法压缩头部
├── 服务器推送 → 主动推送资源
└── 流优先级 → 控制资源加载顺序
```

### HTTPS 加密流程

```
TLS 握手流程：
┌────────┐                    ┌────────┐
│ Client │                    │ Server │
└────┬───┘                    └────┬───┘
     │                             │
     │──── ClientHello ───────────→│
     │     (支持的加密套件)        │
     │                             │
     │←─── ServerHello ────────────│
     │     (选定的加密套件)        │
     │                             │
     │←─── Certificate ────────────│
     │     (服务器证书)            │
     │                             │
     │←─── ServerHelloDone ────────│
     │                             │
     │──── ClientKeyExchange ─────→│
     │     (预主密钥)              │
     │                             │
     │──── ChangeCipherSpec ──────→│
     │──── Finished ──────────────→│
     │                             │
     │←─── ChangeCipherSpec ───────│
     │←─── Finished ───────────────│
     │                             │
     │════ 加密通信开始 ═══════════│
```

### 安全头部

```javascript
// 常用安全头部
const securityHeaders = {
  // 防止 XSS
  'Content-Security-Policy': "default-src 'self'",
  
  // 防止点击劫持
  'X-Frame-Options': 'DENY',
  
  // 防止 MIME 类型嗅探
  'X-Content-Type-Options': 'nosniff',
  
  // 启用 HSTS
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  
  // 控制 Referrer
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // 权限策略
  'Permissions-Policy': 'camera=(), microphone=()'
}
```

### CORS 详解

```javascript
// 简单请求
fetch('https://api.example.com/data', {
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
})

// 预检请求（复杂请求）
fetch('https://api.example.com/data', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token'
  },
  body: JSON.stringify({ data: 'value' })
})

// 服务器响应头
// Access-Control-Allow-Origin: https://example.com
// Access-Control-Allow-Methods: GET, POST, PUT, DELETE
// Access-Control-Allow-Headers: Content-Type, Authorization
// Access-Control-Max-Age: 86400
```

### HTTP 缓存

```javascript
// 强缓存
// Cache-Control: max-age=3600
// Expires: Thu, 01 Jan 2025 00:00:00 GMT

// 协商缓存
// ETag / If-None-Match
// Last-Modified / If-Modified-Since

// Fetch 缓存控制
fetch('/api/data', {
  cache: 'no-cache',      // 每次都验证
  cache: 'reload',        // 忽略缓存
  cache: 'force-cache',   // 优先使用缓存
  cache: 'only-if-cached' // 只使用缓存
})
```

### HTTP/3 和 QUIC

```
HTTP/3 特性：
├── 基于 QUIC 协议（UDP）
├── 0-RTT 连接建立
├── 多路复用无队头阻塞
├── 连接迁移（网络切换不断开）
└── 内置 TLS 1.3
```
