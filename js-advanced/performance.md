# 第八章：性能优化

## 8.1 requestAnimationFrame

### 基础用法

```javascript
// 基本动画循环
let animationId

function animate() {
  // 更新状态
  update()
  
  // 渲染
  render()
  
  // 继续动画
  animationId = requestAnimationFrame(animate)
}

// 开始动画
animate()

// 停止动画
cancelAnimationFrame(animationId)
```

### 性能优化

```javascript
// 帧率控制
class FrameRateLimiter {
  constructor(targetFPS = 60) {
    this.targetFPS = targetFPS
    this.frameInterval = 1000 / targetFPS
    this.lastFrameTime = 0
  }
  
  shouldRender(currentTime) {
    if (currentTime - this.lastFrameTime >= this.frameInterval) {
      this.lastFrameTime = currentTime
      return true
    }
    return false
  }
}

// 使用
const limiter = new FrameRateLimiter(30)  // 30 FPS

function animate(currentTime) {
  if (limiter.shouldRender(currentTime)) {
    render()
  }
  requestAnimationFrame(animate)
}

requestAnimationFrame(animate)
```

### 平滑动画

```javascript
class SmoothAnimator {
  constructor(element) {
    this.element = element
    this.currentX = 0
    this.targetX = 0
    this.velocity = 0
    this.friction = 0.8
  }
  
  moveTo(targetX) {
    this.targetX = targetX
    this.animate()
  }
  
  animate() {
    const dx = this.targetX - this.currentX
    this.velocity += dx * 0.1
    this.velocity *= this.friction
    this.currentX += this.velocity
    
    this.element.style.transform = `translateX(${this.currentX}px)`
    
    if (Math.abs(this.velocity) > 0.1 || Math.abs(dx) > 0.1) {
      requestAnimationFrame(() => this.animate())
    }
  }
}

// 使用
const element = document.getElementById('box')
const animator = new SmoothAnimator(element)
animator.moveTo(200)
```

### 性能监控

```javascript
class PerformanceMonitor {
  constructor() {
    this.fps = 0
    this.frames = 0
    this.lastTime = performance.now()
  }
  
  update() {
    this.frames++
    const currentTime = performance.now()
    
    if (currentTime - this.lastTime >= 1000) {
      this.fps = Math.round(this.frames * 1000 / (currentTime - this.lastTime))
      this.frames = 0
      this.lastTime = currentTime
    }
    
    return this.fps
  }
}

// 使用
const monitor = new PerformanceMonitor()

function animate() {
  const fps = monitor.update()
  console.log(`FPS: ${fps}`)
  
  requestAnimationFrame(animate)
}

requestAnimationFrame(animate)
```

---

## 8.2 内存管理

### 内存泄漏检测

```javascript
// 监控内存使用
function logMemoryUsage() {
  if (performance.memory) {
    console.log({
      usedJSHeapSize: (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + ' MB',
      totalJSHeapSize: (performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2) + ' MB',
      jsHeapSizeLimit: (performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2) + ' MB'
    })
  }
}

// 定期检查
setInterval(logMemoryUsage, 5000)
```

### 常见内存泄漏

```javascript
// 1. 未清理的事件监听器
class Component {
  constructor() {
    this.handleClick = this.handleClick.bind(this)
    document.addEventListener('click', this.handleClick)
  }
  
  handleClick() {
    console.log('clicked')
  }
  
  // ❌ 忘记清理
  // destroy() {
  //   document.removeEventListener('click', this.handleClick)
  // }
  
  // ✅ 正确清理
  destroy() {
    document.removeEventListener('click', this.handleClick)
  }
}

// 2. 未清理的定时器
class Timer {
  constructor() {
    this.intervalId = setInterval(() => {
      console.log('tick')
    }, 1000)
  }
  
  destroy() {
    clearInterval(this.intervalId)  // ✅ 清理定时器
  }
}

// 3. 闭包引用
function createClosure() {
  let largeData = new Array(1000000).fill('x')
  
  return function() {
    // ❌ 闭包引用了 largeData
    // console.log(largeData.length)
    
    // ✅ 如果不需要 largeData，不要在闭包中引用
    return 'done'
  }
}

// 4. DOM 引用
class DOMComponent {
  constructor() {
    this.element = document.getElementById('app')
    this.data = new Array(1000000).fill('x')
  }
  
  destroy() {
    this.element = null  // ✅ 释放 DOM 引用
    this.data = null     // ✅ 释放数据引用
  }
}

// 5. 事件监听器未移除
function setupEventListeners() {
  const button = document.getElementById('button')
  
  // ✅ 保存引用以便移除
  const handler = () => console.log('clicked')
  button.addEventListener('click', handler)
  
  return () => {
    button.removeEventListener('click', handler)
  }
}

const cleanup = setupEventListeners()
// 需要时调用 cleanup()
```

### WeakRef 和 FinalizationRegistry

```javascript
// WeakRef（ES2021）
class Cache {
  constructor() {
    this.cache = new Map()
  }
  
  get(key) {
    let ref = this.cache.get(key)
    if (ref) {
      return ref.deref()
    }
    return undefined
  }
  
  set(key, value) {
    this.cache.set(key, new WeakRef(value))
  }
}

// FinalizationRegistry（ES2021）
const registry = new FinalizationRegistry((heldValue) => {
  console.log('对象被回收:', heldValue)
})

class ExpensiveObject {
  constructor(id) {
    this.id = id
    this.data = new Array(1000000).fill('x')
    registry.register(this, id)
  }
}

// 使用
let obj = new ExpensiveObject(1)
obj = null  // 当 GC 回收时，会调用回调
```

### 性能优化技巧

```javascript
// 1. 对象池
class ObjectPool {
  constructor(createFn, resetFn, initialSize = 10) {
    this.createFn = createFn
    this.resetFn = resetFn
    this.pool = []
    
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(createFn())
    }
  }
  
  acquire() {
    if (this.pool.length > 0) {
      return this.pool.pop()
    }
    return this.createFn()
  }
  
  release(obj) {
    this.resetFn(obj)
    this.pool.push(obj)
  }
}

// 2. 虚拟列表
class VirtualList {
  constructor(container, items, itemHeight, renderItem) {
    this.container = container
    this.items = items
    this.itemHeight = itemHeight
    this.renderItem = renderItem
    
    this.visibleItems = []
    this.scrollTop = 0
    
    this.init()
  }
  
  init() {
    this.container.style.overflow = 'auto'
    this.container.style.position = 'relative'
    
    this.container.addEventListener('scroll', () => {
      this.scrollTop = this.container.scrollTop
      this.render()
    })
    
    this.render()
  }
  
  render() {
    const startIndex = Math.floor(this.scrollTop / this.itemHeight)
    const endIndex = Math.min(
      startIndex + Math.ceil(this.container.clientHeight / this.itemHeight) + 1,
      this.items.length
    )
    
    this.container.innerHTML = ''
    
    for (let i = startIndex; i < endIndex; i++) {
      const item = this.items[i]
      const element = this.renderItem(item, i)
      element.style.position = 'absolute'
      element.style.top = `${i * this.itemHeight}px`
      this.container.appendChild(element)
    }
  }
}

// 3. 防抖和节流
function debounce(fn, delay) {
  let timeoutId
  return function(...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
}

function throttle(fn, limit) {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// 4. 事件委托
document.getElementById('list').addEventListener('click', (e) => {
  if (e.target.matches('.list-item')) {
    console.log('Clicked:', e.target.textContent)
  }
})

// 5. 文档片段
function renderList(items) {
  const fragment = document.createDocumentFragment()
  
  items.forEach(item => {
    const li = document.createElement('li')
    li.textContent = item
    fragment.appendChild(li)
  })
  
  document.getElementById('list').appendChild(fragment)
}
```

### Web Vitals

```javascript
// LCP - Largest Contentful Paint
new PerformanceObserver((entryList) => {
  const entries = entryList.getEntries()
  const lastEntry = entries[entries.length - 1]
  console.log('LCP:', lastEntry.startTime)
}).observe({ entryTypes: ['largest-contentful-paint'] })

// FID - First Input Delay
new PerformanceObserver((entryList) => {
  const entries = entryList.getEntries()
  entries.forEach(entry => {
    console.log('FID:', entry.processingStart - entry.startTime)
  })
}).observe({ entryTypes: ['first-input'] })

// CLS - Cumulative Layout Shift
let clsValue = 0
new PerformanceObserver((entryList) => {
  const entries = entryList.getEntries()
  entries.forEach(entry => {
    if (!entry.hadRecentInput) {
      clsValue += entry.value
    }
  })
  console.log('CLS:', clsValue)
}).observe({ entryTypes: ['layout-shift'] })
```
