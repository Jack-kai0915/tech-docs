# Node.js 能做什么？

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时，让 JavaScript 可以在服务器端运行。以下是 Node.js 的主要应用场景和实战案例。

## 目录

1. [Web 服务器与 API](#web-服务器与-api)
2. [命令行工具 (CLI)](#命令行工具)
3. [实时通信应用](#实时通信应用)
4. [微服务架构](#微服务架构)
5. [消息队列与任务调度](#消息队列与任务调度)
6. [文件处理与转换](#文件处理与转换)
7. [监控与日志系统](#监控与日志系统)
8. [桌面应用开发](#桌面应用开发)
9. [物联网 (IoT)](#物联网)
10. [游戏服务器](#游戏服务器)

---

## Web 服务器与 API

Node.js 最常见的用途是构建 Web 服务器和 RESTful API。

### 教学内容

- HTTP 服务器原理
- 路由系统设计
- 中间件模式
- 数据库集成
- 认证授权

### Demo：完整 REST API

```javascript
// server.js
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// 模拟数据库
const users = [];
const posts = [];

// ========== 用户 API ==========

// 注册
app.post('/api/users/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: '邮箱已存在' });
  }
  
  const user = {
    id: users.length + 1,
    name,
    email,
    password, // 实际项目中应加密
    createdAt: new Date()
  };
  
  users.push(user);
  res.status(201).json({ 
    message: '注册成功',
    user: { id: user.id, name: user.name, email: user.email }
  });
});

// 登录
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: '邮箱或密码错误' });
  }
  
  res.json({ 
    message: '登录成功',
    token: `mock-token-${user.id}` // 实际项目中使用 JWT
  });
});

// 获取用户列表
app.get('/api/users', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const start = (page - 1) * limit;
  
  res.json({
    data: users.slice(start, start + limit).map(u => ({
      id: u.id,
      name: u.name,
      email: u.email
    })),
    total: users.length,
    page: parseInt(page),
    limit: parseInt(limit)
  });
});

// ========== 文章 API ==========

// 创建文章
app.post('/api/posts', (req, res) => {
  const { title, content, authorId } = req.body;
  
  const post = {
    id: posts.length + 1,
    title,
    content,
    authorId,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  posts.push(post);
  res.status(201).json(post);
});

// 获取文章列表
app.get('/api/posts', (req, res) => {
  const { page = 1, limit = 10, authorId } = req.query;
  let filtered = posts;
  
  if (authorId) {
    filtered = posts.filter(p => p.authorId === parseInt(authorId));
  }
  
  const start = (page - 1) * limit;
  res.json({
    data: filtered.slice(start, start + limit),
    total: filtered.length
  });
});

// 获取文章详情
app.get('/api/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).json({ error: '文章不存在' });
  }
  res.json(post);
});

// 更新文章
app.put('/api/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).json({ error: '文章不存在' });
  }
  
  Object.assign(post, req.body, { updatedAt: new Date() });
  res.json(post);
});

// 删除文章
app.delete('/api/posts/:id', (req, res) => {
  const index = posts.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: '文章不存在' });
  }
  
  posts.splice(index, 1);
  res.json({ message: '删除成功' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API 服务器运行在 http://localhost:${PORT}`);
});
```

### 测试命令

```bash
# 注册用户
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"张三","email":"zhangsan@example.com","password":"123456"}'

# 登录
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"zhangsan@example.com","password":"123456"}'

# 创建文章
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello Node.js","content":"这是一篇测试文章","authorId":1}'

# 获取文章列表
curl http://localhost:3000/api/posts
```

---

## 命令行工具

Node.js 可以构建强大的命令行工具，用于自动化任务。

### 教学内容

- process 对象和命令行参数
- 用户交互式输入
- 文件系统操作
- 子进程调用

### Demo：项目脚手架工具

```javascript
#!/usr/bin/env node
// scaffold.js
import { program } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs/promises';
import path from 'path';

program
  .name('scaffold')
  .description('项目脚手架工具')
  .version('1.0.0');

program
  .command('create <project-name>')
  .description('创建新项目')
  .action(async (projectName) => {
    // 交互式问答
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'framework',
        message: '选择框架:',
        choices: ['Express', 'Koa', 'Fastify', 'NestJS']
      },
      {
        type: 'confirm',
        name: 'typescript',
        message: '使用 TypeScript?',
        default: true
      },
      {
        type: 'confirm',
        name: 'eslint',
        message: '配置 ESLint?',
        default: true
      },
      {
        type: 'list',
        name: 'database',
        message: '选择数据库:',
        choices: ['MongoDB', 'MySQL', 'PostgreSQL', 'SQLite', '无']
      }
    ]);

    console.log(`\n正在创建项目 ${projectName}...`);

    // 创建项目目录
    const projectPath = path.join(process.cwd(), projectName);
    await fs.mkdir(projectPath, { recursive: true });

    // 生成 package.json
    const packageJson = {
      name: projectName,
      version: '1.0.0',
      type: 'module',
      scripts: {
        dev: 'nodemon src/index.js',
        start: 'node src/index.js',
        build: answers.typescript ? 'tsc' : 'echo "No build needed"'
      },
      dependencies: {
        [answers.framework.toLowerCase()]: '^4.18.0'
      },
      devDependencies: {
        nodemon: '^3.0.0',
        ...(answers.eslint && { eslint: '^8.0.0' }),
        ...(answers.typescript && { typescript: '^5.0.0' })
      }
    };

    await fs.writeFile(
      path.join(projectPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // 创建 src 目录
    await fs.mkdir(path.join(projectPath, 'src'), { recursive: true });

    // 生成入口文件
    const entryFile = answers.typescript ? 'src/index.ts' : 'src/index.js';
    const entryContent = `import ${answers.framework} from '${answers.framework.toLowerCase()}';

const app = ${answers.framework === 'NestJS' ? 'new (require('@nestjs/core').NestFactory).create(AppModule)' : `new ${answers.framework.toLowerCase()}()`};
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Hello from ${projectName}!' });
});

app.listen(port, () => {
  console.log(\`服务器运行在 http://localhost:\${port}\`);
});
`;

    await fs.writeFile(path.join(projectPath, entryFile), entryContent);

    console.log(`\n✅ 项目创建成功！`);
    console.log(`\n下一步：`);
    console.log(`  cd ${projectName}`);
    console.log(`  npm install`);
    console.log(`  npm run dev`);
  });

program
  .command('add-route <route-name>')
  .description('添加路由文件')
  .option('-m, --methods <methods>', 'HTTP 方法', 'get,post')
  .action(async (routeName, options) => {
    const methods = options.methods.split(',');
    const routeFile = `src/routes/${routeName}.js`;
    
    await fs.mkdir('src/routes', { recursive: true });
    
    const content = `import { Router } from 'express';

const router = Router();

${methods.map(method => `router.${method}('/', (req, res) => {
  res.json({ message: '${routeName} ${method.toUpperCase()}' });
});`).join('\n\n')}

export default router;
`;

    await fs.writeFile(routeFile, content);
    console.log(`✅ 路由文件已创建: ${routeFile}`);
  });

program.parse();
```

### 使用示例

```bash
# 创建新项目
node scaffold create my-api

# 添加路由
node scaffold add-route users -m get,post,put,delete
```

---

## 实时通信应用

Node.js + Socket.IO 是构建实时应用的最佳选择。

### 教学内容

- WebSocket 协议原理
- Socket.IO 事件机制
- 房间和命名空间
- 在线状态管理

### Demo：实时聊天室

```javascript
// chat-server.js
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

// 静态文件
app.use(express.static(join(__dirname, 'public')));

// 存储在线用户和消息历史
const onlineUsers = new Map();
const messageHistory = new Map();
const rooms = new Map();

// Socket.IO 事件处理
io.on('connection', (socket) => {
  console.log('用户连接:', socket.id);

  // 用户上线
  socket.on('user-join', (userData) => {
    const user = {
      id: socket.id,
      name: userData.name,
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`
    };
    
    onlineUsers.set(socket.id, user);
    
    // 广播上线消息
    io.emit('user-joined', {
      user,
      onlineCount: onlineUsers.size
    });
    
    // 发送在线用户列表
    io.emit('online-users', Array.from(onlineUsers.values()));
    
    // 发送消息历史
    socket.emit('message-history', []);
  });

  // 加入房间
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, { users: new Set(), messages: [] });
    }
    
    rooms.get(roomId).users.add(socket.id);
    
    // 通知房间内用户
    io.to(roomId).emit('room-joined', {
      roomId,
      users: Array.from(rooms.get(roomId).users).map(id => onlineUsers.get(id)).filter(Boolean)
    });
    
    console.log(`用户 ${socket.id} 加入房间 ${roomId}`);
  });

  // 发送消息
  socket.on('send-message', (data) => {
    const user = onlineUsers.get(socket.id);
    if (!user) return;

    const message = {
      id: Date.now(),
      userId: socket.id,
      userName: user.name,
      avatar: user.avatar,
      content: data.content,
      room: data.room || 'general',
      timestamp: new Date()
    };

    // 存储消息
    if (!messageHistory.has(message.room)) {
      messageHistory.set(message.room, []);
    }
    messageHistory.get(message.room).push(message);

    // 广播消息
    if (message.room === 'general') {
      io.emit('new-message', message);
    } else {
      io.to(message.room).emit('new-message', message);
    }
  });

  // 私聊消息
  socket.on('private-message', (data) => {
    const sender = onlineUsers.get(socket.id);
    const receiver = onlineUsers.get(data.toUserId);
    
    if (!sender || !receiver) return;

    const message = {
      id: Date.now(),
      from: socket.id,
      fromName: sender.name,
      to: data.toUserId,
      toName: receiver.name,
      content: data.content,
      timestamp: new Date()
    };

    // 发送给接收者
    io.to(data.toUserId).emit('private-message', message);
    // 发送回执给发送者
    socket.emit('message-sent', message);
  });

  // 正在输入
  socket.on('typing', (data) => {
    const user = onlineUsers.get(socket.id);
    if (!user) return;

    if (data.room) {
      socket.to(data.room).emit('user-typing', {
        userId: socket.id,
        userName: user.name,
        room: data.room
      });
    } else if (data.toUserId) {
      io.to(data.toUserId).emit('user-typing', {
        userId: socket.id,
        userName: user.name
      });
    }
  });

  // 断开连接
  socket.on('disconnect', () => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      // 从所有房间移除
      rooms.forEach((room, roomId) => {
        if (room.users.has(socket.id)) {
          room.users.delete(socket.id);
          io.to(roomId).emit('user-left', {
            userId: socket.id,
            userName: user.name
          });
        }
      });

      onlineUsers.delete(socket.id);
      
      io.emit('user-left', {
        userId: socket.id,
        userName: user.name,
        onlineCount: onlineUsers.size
      });
      
      io.emit('online-users', Array.from(onlineUsers.values()));
    }
    
    console.log('用户断开:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`聊天服务器运行在 http://localhost:${PORT}`);
});
```

### 前端页面

```html
<!-- public/index.html -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>实时聊天室</title>
  <script src="/socket.io/socket.io.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; display: flex; height: 100vh; background: #f0f2f5; }
    
    .sidebar { 
      width: 280px; 
      background: #fff; 
      border-right: 1px solid #e0e0e0;
      display: flex;
      flex-direction: column;
    }
    
    .sidebar-header {
      padding: 20px;
      background: #1a73e8;
      color: white;
    }
    
    .user-list { 
      flex: 1;
      overflow-y: auto;
      list-style: none;
    }
    
    .user-list li { 
      padding: 12px 20px; 
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: background 0.2s;
    }
    
    .user-list li:hover { background: #f5f5f5; }
    .user-list li.active { background: #e3f2fd; }
    
    .user-list .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
    }
    
    .chat-area { 
      flex: 1; 
      display: flex; 
      flex-direction: column;
      background: #fff;
    }
    
    .chat-header {
      padding: 15px 20px;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .messages { 
      flex: 1; 
      overflow-y: auto; 
      padding: 20px;
    }
    
    .message { 
      margin-bottom: 15px;
      display: flex;
      gap: 10px;
    }
    
    .message.sent { 
      flex-direction: row-reverse;
    }
    
    .message .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    
    .message .content {
      max-width: 60%;
    }
    
    .message .sender {
      font-size: 12px;
      color: #666;
      margin-bottom: 4px;
    }
    
    .message .bubble {
      padding: 10px 15px;
      border-radius: 18px;
      background: #e3f2fd;
    }
    
    .message.sent .bubble {
      background: #1a73e8;
      color: white;
    }
    
    .message .time {
      font-size: 11px;
      color: #999;
      margin-top: 4px;
    }
    
    .input-area { 
      padding: 15px 20px; 
      border-top: 1px solid #e0e0e0;
      display: flex;
      gap: 10px;
    }
    
    .input-area input { 
      flex: 1;
      padding: 12px 15px;
      border: 1px solid #e0e0e0;
      border-radius: 24px;
      outline: none;
    }
    
    .input-area input:focus {
      border-color: #1a73e8;
    }
    
    .input-area button { 
      padding: 12px 24px;
      background: #1a73e8;
      color: white;
      border: none;
      border-radius: 24px;
      cursor: pointer;
      font-weight: 500;
    }
    
    .input-area button:hover {
      background: #1557b0;
    }
    
    .typing-indicator {
      padding: 5px 20px;
      font-size: 12px;
      color: #666;
      height: 24px;
    }
    
    .online-count {
      font-size: 14px;
      opacity: 0.9;
    }
  </style>
</head>
<body>
  <!-- 登录模态框 -->
  <div id="loginModal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
    <div style="background: white; padding: 30px; border-radius: 12px; width: 300px;">
      <h2 style="margin-bottom: 20px; text-align: center;">加入聊天室</h2>
      <input type="text" id="usernameInput" placeholder="输入你的昵称" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 15px;">
      <button onclick="joinChat()" style="width: 100%; padding: 12px; background: #1a73e8; color: white; border: none; border-radius: 8px; cursor: pointer;">加入</button>
    </div>
  </div>

  <!-- 聊天界面 -->
  <div class="sidebar">
    <div class="sidebar-header">
      <h3>聊天室</h3>
      <div class="online-count">在线: <span id="onlineCount">0</span> 人</div>
    </div>
    <ul class="user-list" id="userList"></ul>
  </div>
  
  <div class="chat-area">
    <div class="chat-header">
      <h3 id="chatTitle">公共聊天室</h3>
    </div>
    <div class="messages" id="messages"></div>
    <div class="typing-indicator" id="typingIndicator"></div>
    <div class="input-area">
      <input type="text" id="messageInput" placeholder="输入消息..." onkeypress="handleKeyPress(event)">
      <button onclick="sendMessage()">发送</button>
    </div>
  </div>

  <script>
    const socket = io();
    let currentUser = null;
    let currentRoom = 'general';
    let typingTimeout = null;

    // 加入聊天
    function joinChat() {
      const name = document.getElementById('usernameInput').value.trim();
      if (!name) return;
      
      currentUser = { name };
      socket.emit('user-join', currentUser);
      document.getElementById('loginModal').style.display = 'none';
    }

    // 接收在线用户列表
    socket.on('online-users', (users) => {
      const userList = document.getElementById('userList');
      userList.innerHTML = users.map(u => `
        <li onclick="selectChat('${u.id}', '${u.name}')">
          <img src="${u.avatar}" class="avatar">
          <span>${u.name}</span>
        </li>
      `).join('');
      
      document.getElementById('onlineCount').textContent = users.length;
    });

    // 接收新消息
    socket.on('new-message', (message) => {
      appendMessage(message);
    });

    // 用户加入
    socket.on('user-joined', (data) => {
      appendSystemMessage(`${data.user.name} 加入了聊天`);
    });

    // 用户离开
    socket.on('user-left', (data) => {
      appendSystemMessage(`${data.userName} 离开了聊天`);
    });

    // 正在输入
    socket.on('user-typing', (data) => {
      const indicator = document.getElementById('typingIndicator');
      indicator.textContent = `${data.userName} 正在输入...`;
      setTimeout(() => { indicator.textContent = ''; }, 3000);
    });

    // 发送消息
    function sendMessage() {
      const input = document.getElementById('messageInput');
      const content = input.value.trim();
      
      if (!content) return;
      
      socket.emit('send-message', {
        content,
        room: currentRoom
      });
      
      input.value = '';
    }

    // 回车发送
    function handleKeyPress(event) {
      if (event.key === 'Enter') {
        sendMessage();
      } else {
        // 发送正在输入状态
        socket.emit('typing', { room: currentRoom });
      }
    }

    // 追加消息
    function appendMessage(message) {
      const messages = document.getElementById('messages');
      const isMine = message.userId === socket.id;
      
      const div = document.createElement('div');
      div.className = `message ${isMine ? 'sent' : ''}`;
      div.innerHTML = `
        <img src="${message.avatar}" class="avatar">
        <div class="content">
          <div class="sender">${message.userName}</div>
          <div class="bubble">${message.content}</div>
          <div class="time">${new Date(message.timestamp).toLocaleTimeString()}</div>
        </div>
      `;
      
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    // 追加系统消息
    function appendSystemMessage(text) {
      const messages = document.getElementById('messages');
      const div = document.createElement('div');
      div.style.cssText = 'text-align: center; color: #999; font-size: 12px; margin: 10px 0;';
      div.textContent = text;
      messages.appendChild(div);
    }

    // 选择聊天对象
    function selectChat(userId, userName) {
      currentRoom = userId;
      document.getElementById('chatTitle').textContent = `与 ${userName} 的对话`;
      document.getElementById('messages').innerHTML = '';
    }
  </script>
</body>
</html>
```

---

## 微服务架构

Node.js 适合构建轻量级微服务。

### 教学内容

- 服务拆分原则
- 服务间通信
- API 网关
- 服务发现

### Demo：微服务示例

```javascript
// gateway.js - API 网关
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

// 路由代理
app.use('/api/users', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true
}));

app.use('/api/products', createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true
}));

app.use('/api/orders', createProxyMiddleware({
  target: 'http://localhost:3003',
  changeOrigin: true
}));

app.listen(3000, () => {
  console.log('API 网关运行在端口 3000');
});
```

```javascript
// user-service.js - 用户服务
import express from 'express';

const app = express();
app.use(express.json());

const users = new Map();

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'user-service' });
});

// 获取用户
app.get('/api/users/:id', (req, res) => {
  const user = users.get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// 创建用户
app.post('/api/users', (req, res) => {
  const user = { id: Date.now().toString(), ...req.body };
  users.set(user.id, user);
  res.status(201).json(user);
});

// 获取用户列表
app.get('/api/users', (req, res) => {
  res.json(Array.from(users.values()));
});

app.listen(3001, () => {
  console.log('User Service 运行在端口 3001');
});
```

```javascript
// product-service.js - 商品服务
import express from 'express';

const app = express();
app.use(express.json());

const products = new Map();

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'product-service' });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.post('/api/products', (req, res) => {
  const product = { id: Date.now().toString(), ...req.body };
  products.set(product.id, product);
  res.status(201).json(product);
});

app.get('/api/products', (req, res) => {
  res.json(Array.from(products.values()));
});

app.listen(3002, () => {
  console.log('Product Service 运行在端口 3002');
});
```

---

## 消息队列与任务调度

Node.js 可以处理异步任务和定时任务。

### 教学内容

- 队列数据结构
- 异步任务处理
- 定时任务调度
- 任务重试机制

### Demo：任务队列系统

```javascript
// task-queue.js
import Queue from 'bull';
import nodemailer from 'nodemailer';

// 创建邮件队列
const emailQueue = new Queue('email', {
  redis: { host: 'localhost', port: 6379 }
});

// 创建数据处理队列
const dataQueue = new Queue('data-processing', {
  redis: { host: 'localhost', port: 6379 }
});

// 邮件发送工作者
emailQueue.process(async (job) => {
  const { to, subject, body } = job.data;
  
  console.log(`正在发送邮件到 ${to}...`);
  
  // 模拟邮件发送
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log(`邮件已发送到 ${to}`);
  return { success: true, to };
});

// 数据处理工作者
dataQueue.process(async (job) => {
  const { type, data } = job.data;
  
  console.log(`处理数据: ${type}`);
  
  // 模拟数据处理
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return { processed: true, count: data.length };
});

// 任务完成事件
emailQueue.on('completed', (job, result) => {
  console.log(`邮件任务 ${job.id} 完成:`, result);
});

emailQueue.on('failed', (job, err) => {
  console.error(`邮件任务 ${job.id} 失败:`, err.message);
});

// API 服务器
import express from 'express';

const app = express();
app.use(express.json());

// 添加邮件任务
app.post('/api/send-email', async (req, res) => {
  const { to, subject, body } = req.body;
  
  const job = await emailQueue.add({ to, subject, body }, {
    attempts: 3,  // 最多重试 3 次
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  });
  
  res.json({ 
    message: '邮件已加入队列',
    jobId: job.id 
  });
});

// 添加数据处理任务
app.post('/api/process-data', async (req, res) => {
  const { type, data } = req.body;
  
  const job = await dataQueue.add({ type, data });
  
  res.json({ 
    message: '数据处理任务已加入队列',
    jobId: job.id 
  });
});

// 查询任务状态
app.get('/api/job/:id', async (req, res) => {
  const job = await emailQueue.getJob(req.params.id);
  
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  
  const state = await job.getState();
  const progress = job.progress();
  
  res.json({ 
    id: job.id,
    state,
    progress,
    data: job.data,
    result: job.returnvalue
  });
});

// 定时任务 - 每天发送报告
emailQueue.add(
  { 
    to: 'admin@example.com',
    subject: '每日报告',
    body: '这是每日报告...'
  },
  { 
    repeat: { cron: '0 9 * * *' }  // 每天早上 9 点
  }
);

app.listen(3000, () => {
  console.log('任务队列 API 运行在端口 3000');
});
```

---

## 文件处理与转换

Node.js 适合处理各种文件格式。

### 教学内容

- 流式处理大文件
- 格式转换（CSV、JSON、Excel）
- 图片处理
- PDF 生成

### Demo：文件转换工具

```javascript
// file-processor.js
import express from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import ExcelJS from 'exceljs';
import sharp from 'sharp';
import fs from 'fs/promises';
import { createReadStream } from 'fs';
import { pipeline } from 'stream/promises';

const app = express();
const upload = multer({ dest: 'uploads/' });

// CSV 转 JSON
app.post('/api/convert/csv-to-json', upload.single('file'), async (req, res) => {
  const results = [];
  
  await new Promise((resolve, reject) => {
    createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', resolve)
      .on('error', reject);
  });
  
  // 清理临时文件
  await fs.unlink(req.file.path);
  
  res.json({
    format: 'json',
    data: results,
    count: results.length
  });
});

// JSON 转 CSV
app.post('/api/convert/json-to-csv', async (req, res) => {
  const { data } = req.body;
  
  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ error: '数据必须是非空数组' });
  }
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))
  ].join('\n');
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=export.csv');
  res.send(csvContent);
});

// JSON 转 Excel
app.post('/api/convert/json-to-excel', async (req, res) => {
  const { data, sheetName = 'Sheet1' } = req.body;
  
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);
  
  if (data.length > 0) {
    // 添加表头
    sheet.columns = Object.keys(data[0]).map(key => ({
      header: key,
      key,
      width: 20
    }));
    
    // 添加数据
    sheet.addRows(data);
    
    // 格式化表头
    sheet.getRow(1).font = { bold: true };
  }
  
  const buffer = await workbook.xlsx.writeBuffer();
  
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=export.xlsx');
  res.send(buffer);
});

// 图片处理
app.post('/api/image/resize', upload.single('image'), async (req, res) => {
  const { width = 800, height = 600, format = 'jpeg' } = req.body;
  
  const outputPath = `uploads/resized-${Date.now()}.${format}`;
  
  await sharp(req.file.path)
    .resize(parseInt(width), parseInt(height))
    .toFormat(format)
    .toFile(outputPath);
  
  // 清理原文件
  await fs.unlink(req.file.path);
  
  // 发送处理后的图片
  res.setHeader('Content-Type', `image/${format}`);
  res.sendFile(outputPath, async () => {
    await fs.unlink(outputPath);
  });
});

// 图片压缩
app.post('/api/image/compress', upload.single('image'), async (req, res) => {
  const { quality = 80 } = req.body;
  
  const outputPath = `uploads/compressed-${Date.now()}.jpg`;
  
  await sharp(req.file.path)
    .jpeg({ quality: parseInt(quality) })
    .toFile(outputPath);
  
  const originalSize = (await fs.stat(req.file.path)).size;
  const compressedSize = (await fs.stat(outputPath)).size;
  
  await fs.unlink(req.file.path);
  
  res.setHeader('Content-Type', 'image/jpeg');
  res.sendFile(outputPath, async () => {
    await fs.unlink(outputPath);
  });
  
  // 返回压缩信息
  res.json({
    originalSize,
    compressedSize,
    ratio: ((1 - compressedSize / originalSize) * 100).toFixed(2) + '%'
  });
});

app.listen(3000, () => {
  console.log('文件处理 API 运行在端口 3000');
});
```

---

## 监控与日志系统

Node.js 可以构建实时监控和日志分析系统。

### Demo：日志收集与分析

```javascript
// logger.js
import winston from 'winston';
import express from 'express';

const app = express();
app.use(express.json());

// 日志存储
const logs = [];

// 创建 logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// 添加日志
app.post('/api/logs', (req, res) => {
  const { level, message, service, metadata } = req.body;
  
  const logEntry = {
    id: Date.now(),
    timestamp: new Date(),
    level,
    message,
    service,
    metadata
  };
  
  logs.push(logEntry);
  logger.log(level, message, { service, ...metadata });
  
  res.status(201).json({ message: '日志已记录' });
});

// 获取日志
app.get('/api/logs', (req, res) => {
  const { level, service, limit = 100 } = req.query;
  
  let filtered = logs;
  
  if (level) {
    filtered = filtered.filter(l => l.level === level);
  }
  
  if (service) {
    filtered = filtered.filter(l => l.service === service);
  }
  
  res.json(filtered.slice(-limit));
});

// 获取日志统计
app.get('/api/logs/stats', (req, res) => {
  const stats = {
    total: logs.length,
    byLevel: {},
    byService: {},
    last24h: 0
  };
  
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  logs.forEach(log => {
    // 按级别统计
    stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;
    
    // 按服务统计
    stats.byService[log.service] = (stats.byService[log.service] || 0) + 1;
    
    // 最近 24 小时
    if (new Date(log.timestamp) > oneDayAgo) {
      stats.last24h++;
    }
  });
  
  res.json(stats);
});

app.listen(3000, () => {
  console.log('日志系统运行在端口 3000');
});
```

---

## 桌面应用开发

使用 Electron + Node.js 开发跨平台桌面应用。

### Demo：简单桌面应用

```javascript
// main.js (Electron 主进程)
import { app, BrowserWindow, ipcMain } from 'electron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  
  mainWindow.loadFile(join(__dirname, 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC 通信示例
ipcMain.handle('get-system-info', () => {
  return {
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.version,
    memory: process.memoryUsage()
  };
});
```

```html
<!-- index.html (渲染进程) -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Node.js 桌面应用</title>
</head>
<body>
  <h1>系统信息</h1>
  <div id="info"></div>
  
  <script>
    const { ipcRenderer } = require('electron');
    
    async function loadInfo() {
      const info = await ipcRenderer.invoke('get-system-info');
      document.getElementById('info').innerHTML = `
        <p>平台: ${info.platform}</p>
        <p>架构: ${info.arch}</p>
        <p>Node.js: ${info.nodeVersion}</p>
        <p>内存使用: ${(info.memory.heapUsed / 1024 / 1024).toFixed(2)} MB</p>
      `;
    }
    
    loadInfo();
  </script>
</body>
</html>
```

---

## 物联网 (IoT)

Node.js 可以控制硬件设备，适合 IoT 开发。

### Demo：智能家居控制

```javascript
// iot-server.js
import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());

// 模拟设备状态
const devices = new Map([
  ['light-1', { id: 'light-1', name: '客厅灯', type: 'light', state: false, brightness: 100 }],
  ['light-2', { id: 'light-2', name: '卧室灯', type: 'light', state: false, brightness: 80 }],
  ['ac-1', { id: 'ac-1', name: '空调', type: 'ac', state: false, temperature: 26 }],
  ['door-1', { id: 'door-1', name: '前门', type: 'door', state: false }]
]);

// 获取所有设备
app.get('/api/devices', (req, res) => {
  res.json(Array.from(devices.values()));
});

// 控制设备
app.put('/api/devices/:id', (req, res) => {
  const device = devices.get(req.params.id);
  if (!device) {
    return res.status(404).json({ error: '设备不存在' });
  }
  
  Object.assign(device, req.body);
  devices.set(device.id, device);
  
  // 广播设备状态变化
  io.emit('device-update', device);
  
  res.json(device);
});

// Socket.IO 实时控制
io.on('connection', (socket) => {
  console.log('客户端连接:', socket.id);
  
  // 发送当前所有设备状态
  socket.emit('devices', Array.from(devices.values()));
  
  // 接收设备控制命令
  socket.on('control-device', (data) => {
    const device = devices.get(data.id);
    if (!device) return;
    
    Object.assign(device, data.updates);
    devices.set(device.id, device);
    
    // 广播给所有客户端
    io.emit('device-update', device);
    
    console.log(`设备 ${device.name} 状态已更新`);
  });
  
  socket.on('disconnect', () => {
    console.log('客户端断开:', socket.id);
  });
});

app.listen(3000, () => {
  console.log('IoT 控制服务器运行在端口 3000');
});
```

---

## 游戏服务器

Node.js + Socket.IO 适合构建多人在线游戏服务器。

### Demo：简单多人游戏

```javascript
// game-server.js
import { Server } from 'socket.io';

const io = new Server(3001, {
  cors: { origin: '*' }
});

// 游戏状态
const gameState = {
  players: new Map(),
  bullets: [],
  gridSize: 1000
};

// 玩家类
class Player {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.x = Math.random() * gameState.gridSize;
    this.y = Math.random() * gameState.gridSize;
    this.health = 100;
    this.score = 0;
    this.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
  }
}

// 子弹类
class Bullet {
  constructor(ownerId, x, y, angle) {
    this.id = Date.now();
    this.ownerId = ownerId;
    this.x = x;
    this.y = y;
    this.dx = Math.cos(angle) * 10;
    this.dy = Math.sin(angle) * 10;
    this.life = 60;
  }
}

io.on('connection', (socket) => {
  console.log('玩家连接:', socket.id);
  
  // 玩家加入
  socket.on('join-game', (playerName) => {
    const player = new Player(socket.id, playerName);
    gameState.players.set(socket.id, player);
    
    // 发送游戏状态给新玩家
    socket.emit('game-state', {
      players: Array.from(gameState.players.values()),
      playerId: socket.id
    });
    
    // 广播新玩家加入
    socket.broadcast.emit('player-joined', player);
    
    console.log(`${playerName} 加入游戏`);
  });
  
  // 玩家移动
  socket.on('move', (data) => {
    const player = gameState.players.get(socket.id);
    if (!player) return;
    
    player.x = Math.max(0, Math.min(gameState.gridSize, player.x + data.dx));
    player.y = Math.max(0, Math.min(gameState.gridSize, player.y + data.dy));
    
    // 广播位置更新
    io.emit('player-moved', {
      id: socket.id,
      x: player.x,
      y: player.y
    });
  });
  
  // 玩家射击
  socket.on('shoot', (data) => {
    const player = gameState.players.get(socket.id);
    if (!player || player.health <= 0) return;
    
    const bullet = new Bullet(socket.id, player.x, player.y, data.angle);
    gameState.bullets.push(bullet);
    
    io.emit('bullet-created', bullet);
  });
  
  // 玩家断开
  socket.on('disconnect', () => {
    const player = gameState.players.get(socket.id);
    if (player) {
      io.emit('player-left', { id: socket.id, name: player.name });
      gameState.players.delete(socket.id);
      console.log(`${player.name} 离开游戏`);
    }
  });
});

// 游戏主循环
setInterval(() => {
  // 更新子弹位置
  gameState.bullets = gameState.bullets.filter(bullet => {
    bullet.x += bullet.dx;
    bullet.y += bullet.dy;
    bullet.life--;
    
    // 检查边界
    if (bullet.x < 0 || bullet.x > gameState.gridSize ||
        bullet.y < 0 || bullet.y > gameState.gridSize ||
        bullet.life <= 0) {
      return false;
    }
    
    // 检查碰撞
    for (const [id, player] of gameState.players) {
      if (id !== bullet.ownerId && player.health > 0) {
        const dist = Math.hypot(player.x - bullet.x, player.y - bullet.y);
        if (dist < 20) {
          player.health -= 10;
          
          // 击杀奖励
          if (player.health <= 0) {
            const killer = gameState.players.get(bullet.ownerId);
            if (killer) killer.score += 100;
            
            io.emit('player-killed', {
              victim: player,
              killer: gameState.players.get(bullet.ownerId)
            });
            
            // 重生
            setTimeout(() => {
              player.health = 100;
              player.x = Math.random() * gameState.gridSize;
              player.y = Math.random() * gameState.gridSize;
              io.emit('player-respawned', player);
            }, 3000);
          }
          
          io.emit('player-hit', {
            id: id,
            health: player.health
          });
          
          return false;
        }
      }
    }
    
    return true;
  });
  
  // 广播子弹状态
  io.emit('bullets-update', gameState.bullets);
  
}, 1000 / 60); // 60 FPS

console.log('游戏服务器运行在端口 3001');
```

---

## 总结

| 应用场景 | 推荐框架/工具 | 难度 | 适用项目 |
|----------|---------------|------|----------|
| Web API | Express, Koa, Fastify | ⭐⭐ | 电商、博客、后台管理 |
| CLI 工具 | Commander, Inquirer | ⭐ | 脚手架、自动化脚本 |
| 实时应用 | Socket.IO | ⭐⭐⭐ | 聊天、协作、游戏 |
| 微服务 | NestJS, gRPC | ⭐⭐⭐⭐ | 大型分布式系统 |
| 任务队列 | Bull, Agenda | ⭐⭐⭐ | 异步处理、定时任务 |
| 文件处理 | Sharp, ExcelJS | ⭐⭐ | 数据转换、图片处理 |
| 监控日志 | Winston, PM2 | ⭐⭐ | 运维监控、日志分析 |
| 桌面应用 | Electron | ⭐⭐⭐ | 跨平台桌面软件 |
| IoT | Johnny-Five | ⭐⭐⭐ | 智能家居、硬件控制 |
| 游戏服务器 | Socket.IO, Colyseus | ⭐⭐⭐⭐ | 多人在线游戏 |

Node.js 的生态非常丰富，几乎可以处理任何后端需求。选择合适的框架和工具，可以大大提高开发效率。
