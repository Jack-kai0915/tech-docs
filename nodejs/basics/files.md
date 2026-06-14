# 文件操作

## 基础文件操作

```javascript
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';

// Promise 化的文件操作
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const appendFile = promisify(fs.appendFile);
const unlink = promisify(fs.unlink);
const rename = promisify(fs.rename);
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const mkdir = promisify(fs.mkdir);
const rmdir = promisify(fs.rmdir);

// 读取文件
async function readJsonFile(filePath) {
  try {
    const data = await readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null; // 文件不存在
    }
    throw error;
  }
}

// 写入文件
async function writeJsonFile(filePath, data) {
  const json = JSON.stringify(data, null, 2);
  await writeFile(filePath, json, 'utf8');
}

// 追加内容
async function appendToFile(filePath, content) {
  await appendFile(filePath, content + '\n', 'utf8');
}
```

## 目录操作

```javascript
// 创建目录
async function ensureDir(dirPath) {
  try {
    await mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

// 读取目录
async function listFiles(dirPath) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  
  return entries.map(entry => ({
    name: entry.name,
    isDirectory: entry.isDirectory(),
    isFile: entry.isFile(),
    path: path.join(dirPath, entry.name)
  }));
}

// 递归读取目录
async function readDirRecursive(dirPath) {
  const results = [];
  const entries = await readdir(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      const subResults = await readDirRecursive(fullPath);
      results.push(...subResults);
    } else {
      results.push(fullPath);
    }
  }
  
  return results;
}

// 复制目录
async function copyDir(src, dest) {
  await mkdir(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}
```

## 文件监控

```javascript
import fs from 'fs';

// 监控文件变化
const watcher = fs.watch('./src', { recursive: true }, (eventType, filename) => {
  console.log(`Event: ${eventType}, File: ${filename}`);
});

// 停止监控
setTimeout(() => {
  watcher.close();
}, 10000);

// 监控文件变化（更精确）
import { watch } from 'chokidar';

const chokidarWatcher = watch('src/**/*.js', {
  ignored: /(^|[\/\\])\../, // 忽略点文件
  persistent: true
});

chokidarWatcher
  .on('add', path => console.log(`File added: ${path}`))
  .on('change', path => console.log(`File changed: ${path}`))
  .on('unlink', path => console.log(`File removed: ${path}`));
```

## 实用工具函数

```javascript
// 文件是否存在
async function fileExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

// 获取文件大小
async function getFileSize(filePath) {
  const stats = await stat(filePath);
  return stats.size;
}

// 格式化文件大小
function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let index = 0;
  let size = bytes;
  
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index++;
  }
  
  return `${size.toFixed(2)} ${units[index]}`;
}

// 安全删除
async function safeDelete(filePath) {
  if (await fileExists(filePath)) {
    await unlink(filePath);
    return true;
  }
  return false;
}

// 批量重命名
async function batchRename(dirPath, pattern, replacement) {
  const files = await readdir(dirPath);
  
  for (const file of files) {
    if (pattern.test(file)) {
      const new_name = file.replace(pattern, replacement);
      const oldPath = path.join(dirPath, file);
      const newPath = path.join(dirPath, new_name);
      await rename(oldPath, newPath);
    }
  }
}
```

## 配置文件处理

```javascript
import fs from 'fs';
import path from 'path';

class Config {
  constructor(configPath) {
    this.configPath = configPath;
    this.config = {};
  }
  
  async load() {
    try {
      const data = await fs.promises.readFile(this.configPath, 'utf8');
      this.config = JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.config = {};
      } else {
        throw error;
      }
    }
    return this;
  }
  
  async save() {
    const data = JSON.stringify(this.config, null, 2);
    await fs.promises.writeFile(this.configPath, data, 'utf8');
  }
  
  get(key, defaultValue) {
    return key.split('.').reduce((obj, k) => obj?.[k], this.config) ?? defaultValue;
  }
  
  set(key, value) {
    const keys = key.split('.');
    let obj = this.config;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) {
        obj[keys[i]] = {};
      }
      obj = obj[keys[i]];
    }
    
    obj[keys[keys.length - 1]] = value;
  }
  
  async update(key, value) {
    this.set(key, value);
    await this.save();
  }
}

// 使用
const config = new Config('./config.json');
await config.load();

const port = config.get('server.port', 3000);
await config.update('server.port', 8080);
```
