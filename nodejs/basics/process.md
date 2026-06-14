# 进程管理

## process 对象

```javascript
// 获取进程信息
console.log('PID:', process.pid);
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
console.log('Current directory:', process.cwd());
console.log('Memory usage:', process.memoryUsage());

// 环境变量
console.log('Home:', process.env.HOME);
console.log('PATH:', process.env.PATH);

// 命令行参数
console.log('Arguments:', process.argv);

// 退出事件
process.on('exit', (code) => {
  console.log(`Process exiting with code: ${code}`);
});

// 未捕获异常
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// 信号处理
process.on('SIGINT', () => {
  console.log('Received SIGINT. Graceful shutdown...');
  // 清理资源
  process.exit(0);
});
```

## 子进程

```javascript
import { exec, execFile, spawn, fork } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// exec - 执行命令（适合短命令）
async function runCommand() {
  try {
    const { stdout, stderr } = await execAsync('ls -la');
    console.log('Output:', stdout);
  } catch (error) {
    console.error('Error:', error.stderr);
  }
}

// spawn - 生成子进程（适合长时间运行）
function spawnProcess() {
  const child = spawn('node', ['worker.js'], {
    cwd: './',
    env: process.env,
    stdio: 'pipe'
  });
  
  child.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  
  child.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
  
  child.on('close', (code) => {
    console.log(`Child process exited with code ${code}`);
  });
  
  return child;
}

// fork - 生成 Node.js 子进程
function forkProcess() {
  const child = fork('./worker.js');
  
  child.send({ type: 'task', data: 'process this' });
  
  child.on('message', (msg) => {
    console.log('Message from child:', msg);
  });
  
  child.on('exit', (code) => {
    console.log(`Child exited with code ${code}`);
  });
  
  return child;
}
```

## Worker Threads

```javascript
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

if (isMainThread) {
  // 主线程
  function runWorker(workerData) {
    return new Promise((resolve, reject) => {
      const worker = new Worker('./worker.js', { workerData });
      
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }
  
  async function main() {
    const result = await runWorker({ task: 'heavy computation' });
    console.log('Result:', result);
  }
  
  main();
} else {
  // 工作线程
  const result = heavyComputation(workerData);
  parentPort.postMessage(result);
}
```

## PM2 进程管理

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'my-app',
    script: './app.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 8080
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
```

```bash
# 启动应用
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 监控
pm2 monit

# 查看日志
pm2 logs

# 重启
pm2 restart my-app

# 停止
pm2 stop my-app

# 删除
pm2 delete my-app
```

## 集群模式

```javascript
import cluster from 'cluster';
import http from 'http';
import os from 'os';

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  
  // 创建工作进程
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  // 工作进程创建服务器
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Hello from worker ' + process.pid + '\n');
  }).listen(8000);
  
  console.log(`Worker ${process.pid} started`);
}
```
