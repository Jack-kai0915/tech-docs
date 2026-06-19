# 第六章：Web Worker

## 6.1 Web Worker 基础

### 创建 Worker

```javascript
// 主线程
const worker = new Worker('worker.js')

// 发送消息
worker.postMessage({ type: 'calculate', data: [1, 2, 3, 4, 5] })

// 接收消息
worker.onmessage = (event) => {
  console.log('收到结果:', event.data)
}

// 错误处理
worker.onerror = (error) => {
  console.error('Worker 错误:', error)
}
```

### Worker 脚本

```javascript
// worker.js
self.onmessage = (event) => {
  const { type, data } = event.data
  
  switch (type) {
    case 'calculate':
      let result = data.reduce((a, b) => a + b, 0)
      self.postMessage({ type: 'result', data: result })
      break
      
    case 'process':
      // 模拟耗时操作
      let processed = data.map(item => item * 2)
      self.postMessage({ type: 'result', data: processed })
      break
  }
}

// 关闭 Worker
self.close()
```

### 转移数据所有权

```javascript
// 主线程
let buffer = new ArrayBuffer(1024 * 1024)  // 1MB
worker.postMessage(buffer, [buffer])  // 转移所有权
console.log(buffer.byteLength)  // 0（已转移）

// Worker 脚本
self.onmessage = (event) => {
  let buffer = event.data
  console.log(buffer.byteLength)  // 1048576
}
```

---

## 6.2 Worker 线程池

```javascript
class WorkerPool {
  constructor(workerScript, poolSize = 4) {
    this.workerScript = workerScript
    this.poolSize = poolSize
    this.workers = []
    this.taskQueue = []
    
    this.init()
  }
  
  init() {
    for (let i = 0; i < this.poolSize; i++) {
      this.workers.push({
        worker: new Worker(this.workerScript),
        busy: false
      })
    }
  }
  
  async execute(data) {
    return new Promise((resolve, reject) => {
      const task = { data, resolve, reject }
      
      const idleWorker = this.workers.find(w => !w.busy)
      
      if (idleWorker) {
        this.runTask(idleWorker, task)
      } else {
        this.taskQueue.push(task)
      }
    })
  }
  
  runTask(workerInfo, task) {
    workerInfo.busy = true
    
    workerInfo.worker.onmessage = (event) => {
      task.resolve(event.data)
      workerInfo.busy = false
      
      // 执行队列中的下一个任务
      if (this.taskQueue.length > 0) {
        const nextTask = this.taskQueue.shift()
        this.runTask(workerInfo, nextTask)
      }
    }
    
    workerInfo.worker.onerror = (error) => {
      task.reject(error)
      workerInfo.busy = false
    }
    
    workerInfo.worker.postMessage(task.data)
  }
  
  terminate() {
    this.workers.forEach(w => w.worker.terminate())
    this.workers = []
    this.taskQueue = []
  }
}

// 使用
const pool = new WorkerPool('worker.js', 4)

async function processItems(items) {
  const results = await Promise.all(
    items.map(item => pool.execute({ type: 'process', data: item }))
  )
  return results
}
```

---

## 6.3 通信模式

### 消息传递

```javascript
// 主线程
class WorkerManager {
  constructor(workerScript) {
    this.worker = new Worker(workerScript)
    this.callbacks = new Map()
    this.idCounter = 0
    
    this.worker.onmessage = (event) => {
      const { id, result, error } = event.data
      const callback = this.callbacks.get(id)
      
      if (callback) {
        if (error) {
          callback.reject(new Error(error))
        } else {
          callback.resolve(result)
        }
        this.callbacks.delete(id)
      }
    }
  }
  
  call(method, ...args) {
    return new Promise((resolve, reject) => {
      const id = this.idCounter++
      this.callbacks.set(id, { resolve, reject })
      
      this.worker.postMessage({ id, method, args })
    })
  }
  
  terminate() {
    this.worker.terminate()
  }
}

// Worker 脚本
self.onmessage = async (event) => {
  const { id, method, args } = event.data
  
  try {
    let result
    switch (method) {
      case 'add':
        result = args[0] + args[1]
        break
      case 'multiply':
        result = args[0] * args[1]
        break
      default:
        throw new Error(`Unknown method: ${method}`)
    }
    
    self.postMessage({ id, result })
  } catch (error) {
    self.postMessage({ id, error: error.message })
  }
}

// 使用
const manager = new WorkerManager('worker.js')
let sum = await manager.call('add', 5, 3)
console.log(sum)  // 8
```

### 共享内存

```javascript
// 主线程
let sharedArray = new SharedArrayBuffer(1024)
let view = new Int32Array(sharedArray)

worker.postMessage(sharedArray)

// Worker 脚本
self.onmessage = (event) => {
  let view = new Int32Array(event.data)
  
  // 原子操作
  Atomics.add(view, 0, 1)      // 加 1
  Atomics.sub(view, 0, 1)      // 减 1
  Atomics.load(view, 0)        // 读取
  Atomics.store(view, 0, 100)  // 存储
  
  // 等待和通知
  Atomics.wait(view, 0, 0)     // 等待值变化
  Atomics.notify(view, 0, 1)   // 通知等待的线程
}
```

---

## 实际应用场景

```javascript
// 1. 图片处理 Worker
// main.js
const imageWorker = new Worker('image-worker.js')

function processImage(imageData) {
  return new Promise((resolve) => {
    imageWorker.onmessage = (e) => resolve(e.data)
    imageWorker.postMessage(imageData)
  })
}

// image-worker.js
self.onmessage = (event) => {
  let imageData = event.data
  let data = imageData.data
  
  // 灰度处理
  for (let i = 0; i < data.length; i += 4) {
    let avg = (data[i] + data[i + 1] + data[i + 2]) / 3
    data[i] = avg
    data[i + 1] = avg
    data[i + 2] = avg
  }
  
  self.postMessage(imageData)
}

// 2. 数据计算 Worker
const calcWorker = new Worker('calc-worker.js')

async function fibonacci(n) {
  return new Promise((resolve) => {
    calcWorker.onmessage = (e) => resolve(e.data)
    calcWorker.postMessage({ type: 'fibonacci', n })
  })
}

// calc-worker.js
self.onmessage = (event) => {
  const { type, n } = event.data
  
  if (type === 'fibonacci') {
    function fib(n) {
      if (n <= 1) return n
      return fib(n - 1) + fib(n - 2)
    }
    self.postMessage(fib(n))
  }
}
```
