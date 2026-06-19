# 第四章：文件与二进制

## 4.1 File API

### 文件读取

```javascript
// 选择文件
const input = document.createElement('input')
input.type = 'file'
input.accept = '.txt,.json,.csv'
input.multiple = true

input.addEventListener('change', (e) => {
  const files = e.target.files
  
  for (const file of files) {
    console.log(file.name, file.size, file.type)
  }
})

// 读取文件内容
function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    
    // 读取为文本
    reader.readAsText(file)
    
    // 其他读取方式
    // reader.readAsDataURL(file)    // Data URL
    // reader.readAsArrayBuffer(file) // ArrayBuffer
    // reader.readAsBinaryString(file) // 二进制字符串
  })
}
```

### 拖拽上传

```javascript
const dropZone = document.getElementById('drop-zone')

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault()
  dropZone.classList.add('dragover')
})

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover')
})

dropZone.addEventListener('drop', async (e) => {
  e.preventDefault()
  dropZone.classList.remove('dragover')
  
  const files = e.dataTransfer.files
  
  for (const file of files) {
    const content = await readFile(file)
    console.log(file.name, content)
  }
})
```

### 分片上传

```javascript
// 分片上传大文件
async function uploadFile(file, chunkSize = 1024 * 1024) {
  const chunks = Math.ceil(file.size / chunkSize)
  const fileId = crypto.randomUUID()
  
  for (let i = 0; i < chunks; i++) {
    const start = i * chunkSize
    const end = Math.min(start + chunkSize, file.size)
    const chunk = file.slice(start, end)
    
    await uploadChunk(fileId, i, chunk, chunks)
  }
  
  // 通知服务器合并
  await mergeChunks(fileId)
}

async function uploadChunk(fileId, chunkIndex, chunk, totalChunks) {
  const formData = new FormData()
  formData.append('fileId', fileId)
  formData.append('chunkIndex', chunkIndex)
  formData.append('totalChunks', totalChunks)
  formData.append('chunk', chunk)
  
  const response = await fetch('/api/upload/chunk', {
    method: 'POST',
    body: formData
  })
  
  return response.json()
}

async function mergeChunks(fileId) {
  const response = await fetch('/api/upload/merge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileId })
  })
  
  return response.json()
}
```

---

## 4.2 Blob

### 创建 Blob

```javascript
// 从字符串创建
const blob1 = new Blob(['Hello, World!'], { type: 'text/plain' })

// 从数组创建
const blob2 = new Blob([new Uint8Array([1, 2, 3])], { type: 'application/octet-stream' })

// 从多个 Blob 创建
const blob3 = new Blob([blob1, blob2], { type: 'text/plain' })

// 从其他类型创建
const jsonBlob = new Blob([JSON.stringify({ key: 'value' })], { type: 'application/json' })
const htmlBlob = new Blob(['<h1>Hello</h1>'], { type: 'text/html' })
```

### Blob 操作

```javascript
// 获取 Blob 信息
console.log(blob1.size)      // 字节大小
console.log(blob1.type)      // MIME 类型

// 切片
const slice = blob1.slice(0, 5)  // "Hello"

// 转换为其他类型
const text = await blob1.text()       // 文本
const arrayBuffer = await blob1.arrayBuffer()  // ArrayBuffer
const dataUrl = await blob1.text()    // 需要手动转换
```

### Blob 应用

```javascript
// 1. 创建下载链接
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 下载文件
let blob = new Blob(['Hello, World!'], { type: 'text/plain' })
downloadBlob(blob, 'hello.txt')

// 2. 图片预览
function previewImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.readAsDataURL(file)
  })
}

// 3. 创建离线页面
const html = `
  <html>
    <body>
      <h1>Offline Page</h1>
      <p>You are currently offline.</p>
    </body>
  </html>
`
const offlineBlob = new Blob([html], { type: 'text/html' })
const offlineUrl = URL.createObjectURL(offlineBlob)
```

---

## 4.3 URL 和 URLSearchParams

### URL 解析

```javascript
// 解析 URL
const url = new URL('https://example.com:8080/path?name=Alice&age=25#section')

console.log(url.protocol)   // "https:"
console.log(url.host)       // "example.com:8080"
console.log(url.hostname)   // "example.com"
console.log(url.port)       // "8080"
console.log(url.pathname)   // "/path"
console.log(url.search)     // "?name=Alice&age=25"
console.log(url.hash)       // "#section"
```

### URLSearchParams

```javascript
// 创建查询参数
const params = new URLSearchParams()
params.append('name', 'Alice')
params.append('age', '25')
params.append('hobbies', 'reading')
params.append('hobbies', 'coding')

console.log(params.toString())  // "name=Alice&age=25&hobbies=reading&hobbies=coding"

// 从字符串解析
const params2 = new URLSearchParams('name=Alice&age=25')
console.log(params2.get('name'))  // "Alice"
console.log(params2.getAll('hobbies'))  // ["reading", "coding"]

// 检查是否存在
console.log(params2.has('name'))  // true

// 删除参数
params2.delete('age')

// 遍历
for (const [key, value] of params2) {
  console.log(`${key}: ${value}`)
}
```

### 实用函数

```javascript
// 解析 URL 参数为对象
function parseQuery(search) {
  return Object.fromEntries(new URLSearchParams(search))
}

// 构建查询字符串
function buildQuery(obj) {
  return new URLSearchParams(obj).toString()
}

// 获取当前页面参数
function getQueryParams() {
  return parseQuery(window.location.search)
}

// 使用
let url = 'https://example.com/search?q=hello&lang=zh&page=1'
let parsed = new URL(url)
console.log(parseQuery(parsed.search))
// { q: 'hello', lang: 'zh', page: '1' }
```

---

## 4.4 Base64

### 编码解码

```javascript
// 字符串编码
const encoded = btoa('Hello, World!')
console.log(encoded)  // "SGVsbG8sIFdvcmxkIQ=="

// 字符串解码
const decoded = atob(encoded)
console.log(decoded)  // "Hello, World!"

// 处理中文
function encodeUTF8(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
    return String.fromCharCode('0x' + p1)
  }))
}

function decodeUTF8(str) {
  return decodeURIComponent(atob(str).split('').map(c => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))
}

// 使用
console.log(encodeUTF8("你好"))  // "5L2g5aW9"
console.log(decodeUTF8("5L2g5aW9"))  // "你好"
```

### Base64 与 Blob

```javascript
// Blob 转 Base64
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// Base64 转 Blob
function base64ToBlob(base64, mimeType = 'application/octet-stream') {
  const byteCharacters = atob(base64.split(',')[1])
  const byteNumbers = new Array(byteCharacters.length)
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  
  let byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: mimeType })
}

// 使用
let blob = new Blob(["Hello"], { type: "text/plain" })
let base64 = await blobToBase64(blob)
console.log(base64)  // "data:text/plain;base64,SGVsbG8="
```

### Data URL

```javascript
// 图片转 Data URL
function imageToDataURL(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.readAsDataURL(file)
  })
}

// Data URL 用于显示图片
let dataUrl = await imageToDataURL(imageFile)
img.src = dataUrl

// Data URL 用于下载
function downloadDataURL(dataUrl, filename) {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  a.click()
}
```

---

## 4.5 ArrayBuffer 和 TypedArray

### ArrayBuffer

```javascript
// 创建 ArrayBuffer
const buffer = new ArrayBuffer(8)  // 8 字节

// 创建视图
const view = new DataView(buffer)
view.setUint8(0, 255)  // 设置字节
console.log(view.getUint8(0))  // 255
```

### TypedArray

```javascript
// 常用 TypedArray
let int8 = new Int8Array([1, 2, 3])        // 8位有符号整数
let uint8 = new Uint8Array([1, 2, 3])      // 8位无符号整数
let int16 = new Int16Array([1, 2, 3])      // 16位有符号整数
let uint16 = new Uint16Array([1, 2, 3])    // 16位无符号整数
let int32 = new Int32Array([1, 2, 3])      // 32位有符号整数
let float32 = new Float32Array([1.5, 2.5]) // 32位浮点数
let float64 = new Float64Array([1.5, 2.5]) // 64位浮点数

// 从 ArrayBuffer 创建
let buffer = new ArrayBuffer(12)
let view1 = new Int32Array(buffer)   // 3 个元素
let view2 = new Uint8Array(buffer)   // 12 个元素

// 常用属性
console.log(view1.length)     // 3
console.log(view1.BYTES_PER_ELEMENT)  // 4
console.log(view1.byteOffset) // 0
console.log(view1.byteLength) // 12
console.log(view1.buffer)     // ArrayBuffer
```

### TypedArray 转换

```javascript
// TypedArray 转普通数组
let typedArray = new Uint8Array([1, 2, 3])
let normalArray = Array.from(typedArray)
let normalArray2 = [...typedArray]

// 普通数组转 TypedArray
let numbers = [1, 2, 3, 4, 5]
let typed = new Uint8Array(numbers)

// ArrayBuffer 转 Blob
function arrayBufferToBlob(buffer, mimeType) {
  return new Blob([buffer], { type: mimeType })
}

// Blob 转 ArrayBuffer
async function blobToArrayBuffer(blob) {
  return blob.arrayBuffer()
}

// ArrayBuffer 转字符串
function arrayBufferToString(buffer) {
  return new TextDecoder().decode(buffer)
}

// 字符串转 ArrayBuffer
function stringToArrayBuffer(str) {
  return new TextEncoder().encode(str).buffer
}
```

### 实际应用

```javascript
// 图片处理
async function processImage(file) {
  // 读取为 ArrayBuffer
  const buffer = await file.arrayBuffer()
  
  // 创建 Uint8Array 视图
  const data = new Uint8Array(buffer)
  
  // 修改像素数据（示例：灰度处理）
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
    data[i] = avg      // R
    data[i + 1] = avg  // G
    data[i + 2] = avg  // B
    // data[i + 3] 是 Alpha 通道
  }
  
  // 创建新的 Blob
  let blob = new Blob([data.buffer], { type: 'image/png' })
  return blob
}

// WebSocket 二进制数据
const ws = new WebSocket('ws://example.com')
ws.binaryType = 'arraybuffer'

ws.onmessage = (event) => {
  if (event.data instanceof ArrayBuffer) {
    let view = new Uint8Array(event.data)
    console.log('Received binary data:', view)
  }
}

// Web Worker 传递
worker.postMessage(data, [data.buffer])  // 转移所有权，避免复制
```
