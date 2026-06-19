# 第七章：现代浏览器 API

## 7.1 Intersection Observer

### 基本用法

```javascript
// 创建观察器
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log('元素进入视口:', entry.target)
    } else {
      console.log('元素离开视口:', entry.target)
    }
  })
}, {
  threshold: 0.1,  // 10% 可见时触发
  rootMargin: '0px'  // 视口边距
})

// 观察元素
document.querySelectorAll('.lazy-load').forEach(el => {
  observer.observe(el)
})

// 停止观察
observer.unobserve(element)
observer.disconnect()
```

### 图片懒加载

```javascript
// 方式一：使用 loading 属性（推荐）
<img src="image.jpg" loading="lazy" alt="Lazy loaded image">

// 方式二：使用 Intersection Observer
const lazyImages = document.querySelectorAll('img[data-src]')

const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src
      img.removeAttribute('data-src')
      imageObserver.unobserve(img)
    }
  })
})

lazyImages.forEach(img => imageObserver.observe(img))
```

### 无限滚动

```javascript
function createInfiniteScroll(container, loadMore) {
  const observer = new IntersectionObserver(async (entries) => {
    if (entries[0].isIntersecting) {
      await loadMore()
    }
  }, {
    rootMargin: '200px'  // 提前 200px 加载
  })
  
  observer.observe(container)
  
  return () => observer.disconnect()
}

// 使用
const sentinel = document.getElementById('sentinel')
createInfiniteScroll(sentinel, async () => {
  const newData = await fetchNextPage()
  appendData(newData)
})
```

### 动画触发

```javascript
const animatedElements = document.querySelectorAll('.animate-on-scroll')

const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated')
    } else {
      entry.target.classList.remove('animated')
    }
  })
}, {
  threshold: 0.5
})

animatedElements.forEach(el => animationObserver.observe(el))
```

---

## 7.2 Mutation Observer

### 基本用法

```javascript
// 创建观察器
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    console.log('变化类型:', mutation.type)
    console.log('目标节点:', mutation.target)
    
    if (mutation.type === 'childList') {
      console.log('新增节点:', mutation.addedNodes)
      console.log('删除节点:', mutation.removedNodes)
    }
    
    if (mutation.type === 'attributes') {
      console.log('属性名:', mutation.attributeName)
    }
  })
})

// 开始观察
observer.observe(document.body, {
  childList: true,      // 观察子节点
  attributes: true,     // 观察属性
  characterData: true,  // 观察文本内容
  subtree: true         // 观察所有后代
})

// 停止观察
observer.disconnect()
```

### 动态内容监听

```javascript
function watchForElements(selector, callback) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) {  // Element node
          if (node.matches?.(selector)) {
            callback(node)
          }
          node.querySelectorAll?.(selector).forEach(el => {
            callback(el)
          })
        }
      })
    })
  })
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
  
  return observer
}

// 使用
watchForElements('.dynamic-content', (el) => {
  console.log('新元素:', el)
  // 初始化新元素
})
```

### 虚拟滚动

```javascript
class VirtualScroller {
  constructor(container, items, itemHeight, renderItem) {
    this.container = container
    this.items = items
    this.itemHeight = itemHeight
    this.renderItem = renderItem
    
    this.visibleCount = Math.ceil(container.clientHeight / itemHeight)
    this.scrollTop = 0
    
    this.init()
  }
  
  init() {
    // 设置容器高度
    this.container.style.height = `${this.items.length * this.itemHeight}px`
    this.container.style.position = 'relative'
    
    // 监听滚动
    this.container.addEventListener('scroll', () => {
      this.scrollTop = this.container.scrollTop
      this.render()
    })
    
    // 初始渲染
    this.render()
  }
  
  render() {
    const startIndex = Math.floor(this.scrollTop / this.itemHeight)
    const endIndex = Math.min(startIndex + this.visibleCount + 1, this.items.length)
    
    // 清空容器
    this.container.innerHTML = ''
    
    // 渲染可见项
    for (let i = startIndex; i < endIndex; i++) {
      const item = this.items[i]
      const element = this.renderItem(item, i)
      element.style.position = 'absolute'
      element.style.top = `${i * this.itemHeight}px`
      element.style.height = `${this.itemHeight}px`
      this.container.appendChild(element)
    }
  }
}
```

---

## 7.3 Clipboard API

### 复制文本

```javascript
// 复制文本
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    console.log('复制成功')
  } catch (error) {
    console.error('复制失败:', error)
  }
}

// 复制富文本
async function copyRichText(html, text) {
  const blob = new Blob([html], { type: 'text/html' })
  const textBlob = new Blob([text], { type: 'text/plain' })
  
  const data = [new ClipboardItem({
    'text/html': blob,
    'text/plain': textBlob
  })]
  
  await navigator.clipboard.write(data)
}
```

### 粘贴内容

```javascript
// 读取剪贴板
async function readClipboard() {
  try {
    const text = await navigator.clipboard.readText()
    console.log('粘贴内容:', text)
  } catch (error) {
    console.error('读取失败:', error)
  }
}

// 读取多种格式
async function readClipboardMultiple() {
  try {
    const items = await navigator.clipboard.read()
    
    for (const item of items) {
      for (const type of item.types) {
        const blob = await item.getType(type)
        const text = await blob.text()
        console.log(`${type}: ${text}`)
      }
    }
  } catch (error) {
    console.error('读取失败:', error)
  }
}
```

### 粘贴事件

```javascript
// 监听粘贴事件
document.addEventListener('paste', async (event) => {
  // 获取文本
  const text = event.clipboardData.getData('text/plain')
  
  // 获取 HTML
  const html = event.clipboardData.getData('text/html')
  
  // 获取文件
  const files = event.clipboardData.files
  
  console.log('粘贴文本:', text)
  console.log('粘贴文件:', files)
})

// 自定义粘贴行为
document.addEventListener('paste', (event) => {
  event.preventDefault()  // 阻止默认行为
  
  const text = event.clipboardData.getData('text/plain')
  document.execCommand('insertText', false, text)
})
```

### 复制按钮

```javascript
class CopyButton {
  constructor(button, text) {
    this.button = button
    this.text = text
    this.init()
  }
  
  init() {
    this.button.addEventListener('click', () => this.copy())
  }
  
  async copy() {
    try {
      await navigator.clipboard.writeText(this.text)
      this.showSuccess()
    } catch (error) {
      this.fallbackCopy()
    }
  }
  
  fallbackCopy() {
    const textarea = document.createElement('textarea')
    textarea.value = this.text
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    this.showSuccess()
  }
  
  showSuccess() {
    const originalText = this.button.textContent
    this.button.textContent = '已复制!'
    setTimeout(() => {
      this.button.textContent = originalText
    }, 2000)
  }
}

// 使用
const copyBtn = document.getElementById('copy-btn')
new CopyButton(copyBtn, '要复制的文本')
```

---

## 7.4 其他实用 API

### Performance API

```javascript
// 测量性能
const start = performance.now()
// ... 执行代码
const end = performance.now()
console.log(`执行时间: ${end - start}ms`)

// 使用 PerformanceObserver
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(`${entry.name}: ${entry.duration}ms`)
  }
})

observer.observe({ entryTypes: ['measure'] })

performance.mark('start')
// ... 执行代码
performance.mark('end')
performance.measure('执行时间', 'start', 'end')
```

### BroadcastChannel

```javascript
// 标签页间通信
const channel = new BroadcastChannel('my-channel')

// 发送消息
channel.postMessage({ type: 'update', data: 'hello' })

// 接收消息
channel.onmessage = (event) => {
  console.log('收到消息:', event.data)
}

// 关闭通道
channel.close()
```

### History API

```javascript
// 推送新状态
history.pushState({ page: 1 }, 'Page 1', '/page1')

// 替换当前状态
history.replaceState({ page: 2 }, 'Page 2', '/page2')

// 监听状态变化
window.addEventListener('popstate', (event) => {
  console.log('状态变化:', event.state)
})

// 简单的 SPA 路由
class Router {
  constructor() {
    this.routes = {}
    
    window.addEventListener('popstate', () => {
      this.resolve()
    })
  }
  
  addRoute(path, handler) {
    this.routes[path] = handler
  }
  
  navigate(path) {
    history.pushState(null, '', path)
    this.resolve()
  }
  
  resolve() {
    const path = window.location.pathname
    const handler = this.routes[path]
    
    if (handler) {
      handler()
    }
  }
}
```

### Fullscreen API

```javascript
// 进入全屏
document.documentElement.requestFullscreen()

// 退出全屏
document.exitFullscreen()

// 检查是否全屏
console.log(document.fullscreenElement !== null)

// 监听全屏变化
document.addEventListener('fullscreenchange', () => {
  console.log('全屏状态:', document.fullscreenElement !== null)
})

// 带样式的全屏
element.requestFullscreen({
  navigationUI: 'hide'  // 隐藏导航 UI
})
```

### Drag and Drop

```javascript
// 拖拽元素
const draggable = document.getElementById('draggable')
draggable.draggable = true

draggable.addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('text/plain', e.target.id)
  e.dataTransfer.effectAllowed = 'move'
})

// 放置区域
const dropZone = document.getElementById('drop-zone')

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault()
  e.dataTransfer.dropEffect = 'move'
  dropZone.classList.add('dragover')
})

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover')
})

dropZone.addEventListener('drop', (e) => {
  e.preventDefault()
  dropZone.classList.remove('dragover')
  
  const id = e.dataTransfer.getData('text/plain')
  const element = document.getElementById(id)
  dropZone.appendChild(element)
})
```
