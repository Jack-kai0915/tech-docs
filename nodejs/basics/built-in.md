# 内置模块

## fs - 文件系统

```javascript
import fs from 'fs';
import { promisify } from 'util';

// 同步读取
const data = fs.readFileSync('file.txt', 'utf8');

// 异步读取
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// Promise 版本
const readFile = promisify(fs.readFile);
async function main() {
  const data = await readFile('file.txt', 'utf8');
  console.log(data);
}

// 写入文件
fs.writeFileSync('output.txt', 'Hello, World!');
fs.appendFileSync('log.txt', 'New line\n');

// 流式读取
const readStream = fs.createReadStream('large-file.txt', {
  encoding: 'utf8',
  highWaterMark: 1024
});

readStream.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes`);
});

readStream.on('end', () => {
  console.log('Reading complete');
});

// 流式写入
const writeStream = fs.createWriteStream('output.txt');
writeStream.write('First line\n');
writeStream.write('Second line\n');
writeStream.end();
```

## path - 路径处理

```javascript
import path from 'path';

// 路径拼接
const fullPath = path.join('/users', 'docs', 'file.txt');
// /users/docs/file.txt

// 获取目录名
path.dirname('/users/docs/file.txt');  // /users/docs

// 获取文件名
path.basename('/users/docs/file.txt');  // file.txt

// 获取扩展名
path.extname('file.txt');  // .txt

// 解析路径
path.parse('/users/docs/file.txt');
// { root: '/', dir: '/users/docs', base: 'file.txt', ext: '.txt', name: 'file' }

// 相对路径
path.relative('/users', '/users/docs/file.txt');  // docs/file.txt

// 绝对路径
path.resolve('docs', 'file.txt');  // /current/dir/docs/file.txt

// 平台分隔符
path.sep;  // '/' on Unix, '\' on Windows
path.delimiter;  // ':' on Unix, ';' on Windows
```

## http/https - 网络请求

```javascript
import http from 'http';
import https from 'https';

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello, World!' }));
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});

// HTTP 客户端请求
function fetchData(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    }).on('error', reject);
  });
}

// 使用 fetch (Node 18+)
const response = await fetch('https://api.example.com/data');
const data = await response.json();
```

## events - 事件处理

```javascript
import { EventEmitter } from 'events';

// 创建事件发射器
class TaskManager extends EventEmitter {
  constructor() {
    super();
    this.tasks = [];
  }
  
  addTask(task) {
    this.tasks.push(task);
    this.emit('taskAdded', task);
  }
  
  removeTask(taskIndex) {
    const task = this.tasks.splice(taskIndex, 1)[0];
    this.emit('taskRemoved', task);
    return task;
  }
}

// 使用
const manager = new TaskManager();

manager.on('taskAdded', (task) => {
  console.log(`Task added: ${task}`);
});

manager.on('taskRemoved', (task) => {
  console.log(`Task removed: ${task}`);
});

manager.addTask('Learn Node.js');
manager.addTask('Build API');
manager.removeTask(0);
```

## child_process - 子进程

```javascript
import { exec, spawn } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// 执行命令
async function runCommand() {
  const { stdout, stderr } = await execAsync('ls -la');
  console.log(stdout);
}

// 使用 spawn（推荐）
const child = spawn('ls', ['-la']);

child.stdout.on('data', (data) => {
  console.log(`Output: ${data}`);
});

child.stderr.on('data', (data) => {
  console.error(`Error: ${data}`);
});

child.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
});

// 创建子进程
import { fork } from 'child_process';

const childProcess = fork('./worker.js');

childProcess.send({ type: 'task', data: 'process this' });

childProcess.on('message', (msg) => {
  console.log('Message from child:', msg);
});
```

## crypto - 加密

```javascript
import crypto from 'crypto';

// 哈希
const hash = crypto.createHash('sha256')
  .update('Hello, World!')
  .digest('hex');

console.log(hash);

// HMAC
const hmac = crypto.createHmac('sha256', 'secret')
  .update('Hello, World!')
  .digest('hex');

// 加密/解密
function encrypt(text, secret) {
  const cipher = crypto.createCipher('aes-256-cbc', secret);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encrypted, secret) {
  const decipher = crypto.createDecipher('aes-256-cbc', secret);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// 生成随机数
const randomBytes = crypto.randomBytes(16).toString('hex');
```

## stream - 流处理

```javascript
import { Transform, pipeline } from 'stream';
import { promisify } from 'util';

const pipelineAsync = promisify(pipeline);

// 自定义转换流
class UpperCaseTransform extends Transform {
  _transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
}

// 管道流
async function processFile() {
  const readStream = fs.createReadStream('input.txt');
  const transformStream = new UpperCaseTransform();
  const writeStream = fs.createWriteStream('output.txt');
  
  await pipelineAsync(readStream, transformStream, writeStream);
  console.log('File processed');
}

// 处理大文件
function processLargeFile() {
  const readStream = fs.createReadStream('large-file.csv');
  const writeStream = fs.createWriteStream('processed.csv');
  
  readStream
    .pipe(transformChunk)
    .pipe(writeStream);
}
```
