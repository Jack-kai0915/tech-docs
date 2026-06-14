# 异步编程

## 回调函数

```javascript
// 基本回调
function fetchData(callback) {
  setTimeout(() => {
    callback(null, { data: 'hello' });
  }, 1000);
}

fetchData((err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});

// 回调地狱示例
getUser(userId, (err, user) => {
  if (err) return handleError(err);
  getOrders(user.id, (err, orders) => {
    if (err) return handleError(err);
    getOrderDetails(orders[0].id, (err, details) => {
      if (err) return handleError(err);
      console.log(details);
    });
  });
});
```

## Promise

```javascript
// 创建 Promise
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ data: 'hello' });
    }, 1000);
  });
}

// 使用 Promise
fetchData()
  .then(data => console.log(data))
  .catch(err => console.error(err))
  .finally(() => console.log('Done'));

// Promise 链
getUser(userId)
  .then(user => getOrders(user.id))
  .then(orders => getOrderDetails(orders[0].id))
  .then(details => console.log(details))
  .catch(err => console.error(err));

// 并发执行
Promise.all([
  fetch('/api/users'),
  fetch('/api/posts'),
  fetch('/api/comments')
])
  .then(([users, posts, comments]) => {
    console.log(users, posts, comments);
  });

// 竞速执行
Promise.race([
  fetch('/api/fast'),
  fetch('/api/slow')
])
  .then(result => console.log(result));

// 全部完成（不论成功失败）
Promise.allSettled([
  Promise.resolve(1),
  Promise.reject(2),
  Promise.resolve(3)
])
  .then(results => {
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        console.log('Success:', result.value);
      } else {
        console.log('Failed:', result.reason);
      }
    });
  });
```

## async/await

```javascript
// 基本用法
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// 顺序执行
async function processSequentially() {
  const user = await getUser(userId);
  const orders = await getOrders(user.id);
  const details = await getOrderDetails(orders[0].id);
  return details;
}

// 并行执行
async function processParallel() {
  const [users, posts, comments] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchComments()
  ]);
  return { users, posts, comments };
}

// 循环中的异步
async function processItems(items) {
  // 顺序执行
  for (const item of items) {
    await processItem(item);
  }
  
  // 或并行执行
  await Promise.all(items.map(item => processItem(item)));
}
```

## 流处理

```javascript
import fs from 'fs';
import { Transform, pipeline } from 'stream';
import { promisify } from 'util';

const pipelineAsync = promisify(pipeline);

// 读取流
const readStream = fs.createReadStream('input.txt', {
  encoding: 'utf8',
  highWaterMark: 1024
});

// 写入流
const writeStream = fs.createWriteStream('output.txt');

// 转换流
class UpperCaseTransform extends Transform {
  _transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
}

// 管道流
async function processFile() {
  await pipelineAsync(
    fs.createReadStream('input.txt'),
    new UpperCaseTransform(),
    fs.createWriteStream('output.txt')
  );
  console.log('File processed');
}

// 处理大文件
async function processLargeFile() {
  const stream = fs.createReadStream('large-file.csv');
  
  for await (const chunk of stream) {
    // 处理每个块
    processChunk(chunk);
  }
}
```

## 实用模式

```javascript
// 延迟执行
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 重试机制
async function retry(fn, maxAttempts = 3, delayMs = 1000) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxAttempts - 1) {
        throw error;
      }
      await delay(delayMs * (i + 1));
    }
  }
}

// 超时控制
async function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), ms);
  });
  
  return Promise.race([promise, timeout]);
}

// 并发限制
async function concurrencyLimit(tasks, limit) {
  const results = [];
  const executing = new Set();
  
  for (const task of tasks) {
    const p = task().then(result => {
      executing.delete(p);
      return result;
    });
    
    executing.add(p);
    results.push(p);
    
    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }
  
  return Promise.all(results);
}

// 使用
const tasks = items.map(item => () => processItem(item));
const results = await concurrencyLimit(tasks, 5);
```
