# 第一章：JavaScript 核心进阶

## 1.1 Promise 进阶

### Promise 本质

```javascript
/**
 * Promise 三种状态：
 * pending   → fulfilled / rejected
 * 
 * 关键特性：
 * 1. 状态不可逆
 * 2. 链式调用
 * 3. 错误冒泡
 */
```

### 手写 Promise

```javascript
class MyPromise {
  constructor(executor) {
    this.state = 'pending'
    this.value = undefined
    this.reason = undefined
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []
    
    const resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled'
        this.value = value
        this.onResolvedCallbacks.forEach(fn => fn())
      }
    }
    
    const reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.reason = reason
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }
    
    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }
  
  then(onFulfilled, onRejected) {
    if (this.state === 'fulfilled') {
      onFulfilled(this.value)
    }
    if (this.state === 'rejected') {
      onRejected(this.reason)
    }
    if (this.state === 'pending') {
      this.onResolvedCallbacks.push(() => onFulfilled(this.value))
      this.onRejectedCallbacks.push(() => onRejected(this.reason))
    }
    return this
  }
  
  catch(onRejected) {
    return this.then(null, onRejected)
  }
  
  finally(callback) {
    return this.then(
      value => { callback(); return value },
      reason => { callback(); throw reason }
    )
  }
  
  static resolve(value) {
    return new MyPromise(resolve => resolve(value))
  }
  
  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason))
  }
  
  static all(promises) {
    return new MyPromise((resolve, reject) => {
      let results = []
      let completed = 0
      
      promises.forEach((promise, index) => {
        promise.then(value => {
          results[index] = value
          completed++
          if (completed === promises.length) {
            resolve(results)
          }
        }).catch(reject)
      })
    })
  }
  
  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach(promise => {
        promise.then(resolve).catch(reject)
      })
    })
  }
  
  static allSettled(promises) {
    return new Promise(resolve => {
      let results = []
      let completed = 0
      
      promises.forEach((promise, index) => {
        promise
          .then(value => {
            results[index] = { status: 'fulfilled', value }
          })
          .catch(reason => {
            results[index] = { status: 'rejected', reason }
          })
          .finally(() => {
            completed++
            if (completed === promises.length) {
              resolve(results)
            }
          })
      })
    })
  }
}
```

### Promise 并发控制

```javascript
/**
 * 并发限制：最多同时执行 max 个任务
 */
function concurrencyLimit(tasks, maxConcurrent = 3) {
  return new Promise((resolve, reject) => {
    let results = []
    let executing = new Set()
    let index = 0
    
    function runNext() {
      if (index >= tasks.length) {
        if (executing.size === 0) {
          resolve(results)
        }
        return
      }
      
      const currentIndex = index++
      const task = tasks[currentIndex]
      
      const promise = task()
        .then(result => {
          results[currentIndex] = result
          executing.delete(promise)
          runNext()
        })
        .catch(error => {
          executing.delete(promise)
          reject(error)
        })
      
      executing.add(promise)
      
      if (executing.size >= maxConcurrent) {
        Promise.race(executing).then(runNext)
      } else {
        runNext()
      }
    }
    
    runNext()
  })
}

// 使用示例
const tasks = Array.from({ length: 20 }, (_, i) => () => 
  new Promise(resolve => setTimeout(() => resolve(i), 100))
)

concurrencyLimit(tasks, 5).then(results => {
  console.log(results) // [0, 1, 2, ..., 19]
})
```

### Promise 高级模式

```javascript
/**
 * 超时包装器
 */
function withTimeout(promise, ms) {
  let timeoutId
  
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Timeout')), ms)
  })
  
  return Promise.race([promise, timeout]).finally(() => {
    clearTimeout(timeoutId)
  })
}

// 使用
const result = await withTimeout(fetch('/api/data'), 5000)

/**
 * 重试包装器
 */
async function withRetry(fn, maxAttempts = 3, delayMs = 1000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === maxAttempts) throw error
      await new Promise(r => setTimeout(r, delayMs * attempt))
    }
  }
}

// 使用
const data = await withRetry(() => fetch('/api/data').then(r => r.json()))
```

---

## 1.2 递归进阶

### 递归基础

```javascript
/**
 * 递归三要素：
 * 1. 基准条件（退出条件）
 * 2. 递归调用
 * 3. 状态变化
 */
```

### 尾递归优化

```javascript
// 普通递归（可能栈溢出）
function factorial(n) {
  if (n <= 1) return 1
  return n * factorial(n - 1)
}

// 尾递归（可以优化）
function factorialTail(n, acc = 1) {
  if (n <= 1) return acc
  return factorialTail(n - 1, n * acc)
}

// 但是 JavaScript 引擎通常不优化尾递归
// 手动优化：使用蹦床函数
function trampoline(fn) {
  return function(...args) {
    let result = fn(...args)
    while (typeof result === 'function') {
      result = result()
    }
    return result
  }
}

const factorialTrampoline = trampoline(function f(n, acc = 1) {
  if (n <= 1) return acc
  return () => f(n - 1, n * acc)
})

console.log(factorialTrampoline(100000)) // 不会栈溢出
```

### 递归转迭代

```javascript
// 递归版本
function flatten(arr) {
  return arr.reduce((acc, item) => 
    Array.isArray(item) 
      ? [...acc, ...flatten(item)]
      : [...acc, item]
  , [])
}

// 迭代版本（使用栈）
function flattenIterative(arr) {
  const stack = [...arr]
  const result = []
  
  while (stack.length > 0) {
    const item = stack.pop()
    if (Array.isArray(item)) {
      stack.push(...item)
    } else {
      result.unshift(item)
    }
  }
  
  return result
}

// 测试
const nested = [1, [2, 3], [4, [5, 6]]]
console.log(flatten(nested))           // [1, 2, 3, 4, 5, 6]
console.log(flattenIterative(nested))  // [1, 2, 3, 4, 5, 6]
```

### 递归实用场景

```javascript
// 1. 深拷贝
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime())
  }
  
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags)
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item))
  }
  
  const cloned = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key])
    }
  }
  return cloned
}

// 2. 深度比较
function deepEqual(a, b) {
  if (a === b) return true
  
  if (
    a === null || b === null ||
    typeof a !== 'object' || typeof b !== 'object'
  ) {
    return false
  }
  
  let keysA = Object.keys(a)
  let keysB = Object.keys(b)
  
  if (keysA.length !== keysB.length) return false
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false
    if (!deepEqual(a[key], b[key])) return false
  }
  
  return true
}

// 3. 树形结构遍历
function traverseTree(node, callback) {
  callback(node)
  if (node.children) {
    node.children.forEach(child => traverseTree(child, callback))
  }
}

// 4. 生成目录树
function generateTree(files, prefix = '') {
  let result = ''
  
  files.forEach((file, index) => {
    const isLast = index === files.length - 1
    const connector = isLast ? '└── ' : '├── '
    const childPrefix = isLast ? '    ' : '│   '
    
    result += `${prefix}${connector}${file.name}\n`
    
    if (file.children) {
      result += generateTree(file.children, prefix + childPrefix)
    }
  })
  
  return result
}
```

---

## 1.3 数组高级操作

### 数组扁平化

```javascript
// 方法一：递归
function flattenDeep(arr) {
  return arr.reduce((acc, item) => 
    Array.isArray(item) 
      ? [...acc, ...flattenDeep(item)]
      : [...acc, item]
  , [])
}

// 方法二：迭代
function flattenIterative(arr) {
  let result = []
  let stack = [...arr]
  
  while (stack.length) {
    let item = stack.pop()
    if (Array.isArray(item)) {
      stack.push(...item)
    } else {
      result.unshift(item)
    }
  }
  
  return result
}

// 方法三：使用 flat
let arr = [1, [2, 3], [4, [5, 6]]]
console.log(arr.flat(Infinity)) // [1, 2, 3, 4, 5, 6]
```

### 数组分组

```javascript
// 按条件分组
function groupBy(arr, key) {
  return arr.reduce((groups, item) => {
    const group = typeof key === 'function' ? key(item) : item[key]
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {})
}

// 使用
let people = [
  { name: 'Alice', age: 25, department: 'Engineering' },
  { name: 'Bob', age: 30, department: 'Marketing' },
  { name: 'Charlie', age: 35, department: 'Engineering' }
]

console.log(groupBy(people, 'department'))
// {
//   Engineering: [{ name: 'Alice' }, { name: 'Charlie' }],
//   Marketing: [{ name: 'Bob' }]
// }

// 使用函数分组
let grouped = groupBy([1, 2, 3, 4, 5], n => n % 2 === 0 ? 'even' : 'odd')
// { odd: [1, 3, 5], even: [2, 4] }
```

### 数组去重进阶

```javascript
// 基础去重
const unique = arr => [...new Set(arr)]

// 对象去重
function uniqueBy(arr, key) {
  const seen = new Set()
  return arr.filter(item => {
    const val = typeof key === 'function' ? key(item) : item[key]
    return seen.has(val) ? false : (seen.add(val), true)
  })
}

// 使用
let users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 1, name: 'Alice' }
]

console.log(uniqueBy(users, 'id'))
// [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
```

### 数组分区

```javascript
function partition(arr, predicate) {
  return arr.reduce((result, item) => {
    const index = predicate(item) ? 0 : 1
    result[index].push(item)
    return result
  }, [[], []])
}

// 使用
let numbers = [1, 2, 3, 4, 5, 6]
let [evens, odds] = partition(numbers, n => n % 2 === 0)
console.log(evens) // [2, 4, 6]
console.log(odds)  // [1, 3, 5]
```

### 数组聚合

```javascript
// 按字段聚合
function aggregate(arr, key, aggFn) {
  const groups = {}
  
  arr.forEach(item => {
    const groupKey = typeof key === 'function' ? key(item) : item[key]
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(item)
  })
  
  for (const key in groups) {
    groups[key] = aggFn(groups[key])
  }
  
  return groups
}

// 使用
let sales = [
  { product: 'A', amount: 100 },
  { product: 'B', amount: 200 },
  { product: 'A', amount: 150 }
]

let result = aggregate(sales, 'product', items => 
  items.reduce((sum, item) => sum + item.amount, 0)
)
console.log(result) // { A: 250, B: 200 }
```

### 数组滑动窗口

```javascript
// 滑动窗口最大值
function maxSlidingWindow(nums, k) {
  const result = []
  const deque = [] // 存储索引
  
  for (let i = 0; i < nums.length; i++) {
    // 移除超出窗口的元素
    while (deque.length && deque[0] < i - k + 1) {
      deque.shift()
    }
    
    // 移除比当前元素小的元素
    while (deque.length && nums[deque[deque.length - 1]] < nums[i]) {
      deque.pop()
    }
    
    deque.push(i)
    
    if (i >= k - 1) {
      result.push(nums[deque[0]])
    }
  }
  
  return result
}

// 使用
console.log(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3))
// [3, 3, 5, 5, 6, 7]
```

### 数组压缩

```javascript
// Run-Length Encoding
function rleEncode(arr) {
  let result = []
  let count = 1
  
  for (let i = 1; i <= arr.length; i++) {
    if (i < arr.length && arr[i] === arr[i - 1]) {
      count++
    } else {
      result.push({ value: arr[i - 1], count })
      count = 1
    }
  }
  
  return result
}

// 使用
console.log(rleEncode(['a', 'a', 'b', 'c', 'c', 'c']))
// [{ value: 'a', count: 2 }, { value: 'b', count: 1 }, { value: 'c', count: 3 }]
```

---

## 1.4 字符串高级操作

### 模板字面量增强

```javascript
// 标签模板
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i - 1]
    return result + (value ? `<span style="color:red">${value}</span>` : '') + str
  }, '')
}

const name = 'Alice'
const age = 25
console.log(highlight`Name: ${name}, Age: ${age}`)
// "Name: <span style="color:red">Alice</span>, Age: <span style="color:red">25</span>"

// 安全的 HTML 转义
function escapeHtml(strings, ...values) {
  const escape = str => str.replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]))
  
  return strings.reduce((result, str, i) => {
    const value = values[i - 1]
    return result + (value ? escape(String(value)) : '') + str
  }, '')
}

let userInput = '<script>alert("xss")</script>'
console.log(escapeHtml`User input: ${userInput}`)
// "User input: &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
```

### 字符串解析

```javascript
// 解析 URL 参数
function parseQueryString(str) {
  return Object.fromEntries(
    str.replace(/^\?/, '').split('&').map(pair => {
      const [key, value] = pair.split('=')
      return [decodeURIComponent(key), decodeURIComponent(value || '')]
    })
  )
}

// 解析路径参数
function parsePathParams(pattern, path) {
  const patternParts = pattern.split('/')
  const pathParts = path.split('/')
  const params = {}
  
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      const paramName = patternParts[i].slice(1)
      params[paramName] = pathParts[i]
    }
  }
  
  return params
}

// 使用
console.log(parseQueryString('?name=Alice&age=25'))
// { name: 'Alice', age: '25' }

console.log(parsePathParams('/users/:id/posts/:postId', '/users/123/posts/456'))
// { id: '123', postId: '456' }
```

### 字符串格式化

```javascript
// 千分位格式化
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 货币格式化
function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount)
}

// 日期格式化
function formatDate(date, format = 'YYYY-MM-DD') {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

// 使用
console.log(formatNumber(1234567))  // "1,234,567"
console.log(formatCurrency(99.99))  // "$99.99"
console.log(formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'))
```

### 字符串算法

```javascript
// 最长回文子串
function longestPalindrome(s) {
  if (s.length < 2) return s
  
  let start = 0
  let maxLen = 1
  
  function expand(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      if (right - left + 1 > maxLen) {
        start = left
        maxLen = right - left + 1
      }
      left--
      right++
    }
  }
  
  for (let i = 0; i < s.length; i++) {
    expand(i, i)     // 奇数长度
    expand(i, i + 1) // 偶数长度
  }
  
  return s.substring(start, start + maxLen)
}

// 字符串匹配
function kmpSearch(text, pattern) {
  function buildNext(p) {
    const next = new Array(p.length).fill(0)
    let len = 0
    let i = 1
    
    while (i < p.length) {
      if (p[i] === p[len]) {
        next[i++] = ++len
      } else if (len) {
        len = next[len - 1]
      } else {
        next[i++] = 0
      }
    }
    
    return next
  }
  
  const next = buildNext(pattern)
  let i = 0, j = 0
  
  while (i < text.length) {
    if (text[i] === pattern[j]) {
      i++
      j++
      if (j === pattern.length) {
        return i - j
      }
    } else if (j > 0) {
      j = next[j - 1]
    } else {
      i++
    }
  }
  
  return -1
}

// 使用
console.log(longestPalindrome("babad"))  // "bab" 或 "aba"
console.log(kmpSearch("hello world", "world"))  // 6
```

---

## 1.5 对象高级操作

### 对象扁平化

```javascript
// 深度扁平化
function flattenObject(obj, prefix = '') {
  const result = {}
  
  for (const key in obj) {
    const newKey = prefix ? `${prefix}.${key}` : key
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(result, flattenObject(obj[key], newKey))
    } else {
      result[newKey] = obj[key]
    }
  }
  
  return result
}

// 使用
let nested = {
  a: 1,
  b: {
    c: 2,
    d: {
      e: 3
    }
  }
}

console.log(flattenObject(nested))
// { 'a': 1, 'b.c': 2, 'b.d.e': 3 }
```

### 对象深度合并

```javascript
// 深度合并对象
function deepMerge(target, source) {
  const result = { ...target }
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key])
    } else {
      result[key] = source[key]
    }
  }
  
  return result
}

// 使用
let obj1 = { a: 1, b: { c: 2, d: 3 } }
let obj2 = { b: { c: 4, e: 5 }, f: 6 }

console.log(deepMerge(obj1, obj2))
// { a: 1, b: { c: 4, d: 3, e: 5 }, f: 6 }
```

### 对象代理与监听

```javascript
// 响应式对象
function reactive(obj, callback) {
  return new Proxy(obj, {
    set(target, prop, value) {
      const oldValue = target[prop]
      const result = Reflect.set(target, prop, value)
      
      if (oldValue !== value) {
        callback(prop, value, oldValue)
      }
      
      return result
    },
    get(target, prop) {
      const value = Reflect.get(target, prop)
      
      // 深度响应式
      if (typeof value === 'object' && value !== null) {
        return reactive(value, callback)
      }
      
      return value
    }
  })
}

// 使用
const state = reactive({ count: 0, user: { name: 'Alice' } }, (prop, newVal, oldVal) => {
  console.log(`${prop}: ${oldVal} → ${newVal}`)
})

state.count = 1  // "count: 0 → 1"
state.user.name = 'Bob'  // "name: Alice → Bob"
```

### 对象冻结与不可变

```javascript
// 深度冻结
function deepFreeze(obj) {
  Object.freeze(obj)
  
  Object.getOwnPropertyNames(obj).forEach(prop => {
    if (obj[prop] && typeof obj[prop] === 'object') {
      deepFreeze(obj[prop])
    }
  })
  
  return obj
}

// 深度不可变
function immutable(obj) {
  return Object.freeze(
    Object.keys(obj).reduce((acc, key) => {
      acc[key] = typeof obj[key] === 'object' && obj[key] !== null
        ? immutable(obj[key])
        : obj[key]
      return acc
    }, {})
  )
}

// 使用
const frozen = deepFreeze({ a: 1, b: { c: 2 } })
// frozen.a = 2  // 报错：Cannot assign to read only property
```

### 对象迭代

```javascript
// 安全的深度遍历
function* deepIterate(obj, path = '') {
  for (const key in obj) {
    const currentPath = path ? `${path}.${key}` : key
    const value = obj[key]
    
    if (typeof value === 'object' && value !== null) {
      yield* deepIterate(value, currentPath)
    } else {
      yield { path: currentPath, value }
    }
  }
}

// 使用
let config = {
  database: { host: 'localhost', port: 3306 },
  server: { port: 8080 }
}

for (const { path, value } of deepIterate(config)) {
  console.log(`${path}: ${value}`)
}
// database.host: localhost
// database.port: 3306
// server.port: 8080
```

---

## 要点总结

| 概念 | 要点 |
|------|------|
| **Promise** | 状态不可逆、链式调用、错误冒泡 |
| **递归** | 基准条件、状态变化、转迭代优化 |
| **数组** | 扁平化、分组、去重、滑动窗口 |
| **字符串** | 模板字面量、解析、格式化、算法 |
| **对象** | 扁平化、合并、代理、深度冻结 |

## 常见误区

1. **Promise 错误处理**
   ```javascript
   // ❌ 错误：错误被吞掉
   promise.then(handler)
   
   // ✅ 正确：捕获错误
   promise.then(handler).catch(errorHandler)
   ```

2. **递归栈溢出**
   ```javascript
   // ❌ 大数据量会栈溢出
   function flatten(arr) { ... }
   
   // ✅ 使用迭代或限制深度
   function flatten(arr, maxDepth = 10) { ... }
   ```

3. **数组方法返回值**
   ```javascript
   // ❌ 忘记接收返回值
   arr.map(transform)  // 返回新数组，原数组不变
   
   // ✅ 接收返回值
   const newArr = arr.map(transform)
   ```
