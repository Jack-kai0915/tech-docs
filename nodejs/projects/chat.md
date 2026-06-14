# 实时聊天应用

## 项目简介

使用 Socket.IO 构建实时聊天应用，支持私聊和群聊功能。

## 技术栈

- Express - Web 服务器
- Socket.IO - 实时通信
- MongoDB - 数据持久化
- JWT - 用户认证

## 项目结构

```
chat-app/
├── src/
│   ├── models/
│   │   ├── User.js
│   │   └── Message.js
│   ├── routes/
│   │   └── auth.js
│   ├── socket/
│   │   └── handlers.js
│   └── index.js
├── public/
│   └── index.html
└── package.json
```

## 核心代码

### Socket 处理器

```javascript
// socket/handlers.js
import Message from '../models/Message.js';

export function setupSocketHandlers(io) {
  // 在线用户
  const onlineUsers = new Map();
  
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // 用户上线
    socket.on('user-online', (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit('online-users', Array.from(onlineUsers.keys()));
    });
    
    // 加入房间
    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });
    
    // 发送私聊消息
    socket.on('private-message', async ({ to, message, from }) => {
      // 保存消息
      const newMessage = new Message({
        from,
        to,
        content: message,
        type: 'private'
      });
      await newMessage.save();
      
      // 发送给接收者
      const receiverSocketId = onlineUsers.get(to);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive-message', {
          from,
          message,
          timestamp: new Date()
        });
      }
      
      // 发送回执给发送者
      socket.emit('message-sent', {
        to,
        message,
        timestamp: newMessage.createdAt
      });
    });
    
    // 发送群聊消息
    socket.on('room-message', async ({ roomId, message, from }) => {
      // 保存消息
      const newMessage = new Message({
        from,
        room: roomId,
        content: message,
        type: 'room'
      });
      await newMessage.save();
      
      // 广播给房间
      io.to(roomId).emit('receive-room-message', {
        roomId,
        from,
        message,
        timestamp: new Date()
      });
    });
    
    // 正在输入
    socket.on('typing', ({ to, from }) => {
      const receiverSocketId = onlineUsers.get(to);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user-typing', { from });
      }
    });
    
    // 断开连接
    socket.on('disconnect', () => {
      // 移除在线用户
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      io.emit('online-users', Array.from(onlineUsers.keys()));
      console.log('User disconnected:', socket.id);
    });
  });
}
```

### 前端页面

```html
<!-- public/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chat App</title>
  <script src="/socket.io/socket.io.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; display: flex; height: 100vh; }
    .sidebar { width: 250px; background: #f5f5f5; border-right: 1px solid #ddd; }
    .chat-area { flex: 1; display: flex; flex-direction: column; }
    .messages { flex: 1; overflow-y: auto; padding: 20px; }
    .input-area { padding: 20px; border-top: 1px solid #ddd; }
    .input-area input { width: 80%; padding: 10px; }
    .input-area button { padding: 10px 20px; }
    .message { margin-bottom: 10px; }
    .message.sent { text-align: right; }
    .message .content { 
      display: inline-block; 
      padding: 8px 12px; 
      background: #007bff; 
      color: white; 
      border-radius: 10px; 
    }
    .message.sent .content { background: #28a745; }
    .user-list { list-style: none; }
    .user-list li { padding: 10px; cursor: pointer; }
    .user-list li:hover { background: #e9ecef; }
    .user-list li.active { background: #007bff; color: white; }
  </style>
</head>
<body>
  <div class="sidebar">
    <h3>Online Users</h3>
    <ul class="user-list" id="userList"></ul>
  </div>
  <div class="chat-area">
    <div class="messages" id="messages"></div>
    <div class="input-area">
      <input type="text" id="messageInput" placeholder="Type a message...">
      <button onclick="sendMessage()">Send</button>
    </div>
  </div>

  <script>
    const socket = io();
    let currentUser = 'user1';
    let selectedUser = null;
    
    socket.emit('user-online', currentUser);
    
    socket.on('online-users', (users) => {
      const userList = document.getElementById('userList');
      userList.innerHTML = users
        .filter(u => u !== currentUser)
        .map(u => `<li onclick="selectUser('${u}')">${u}</li>`)
        .join('');
    });
    
    socket.on('receive-message', ({ from, message, timestamp }) => {
      appendMessage(from, message, false);
    });
    
    function selectUser(userId) {
      selectedUser = userId;
      document.querySelectorAll('.user-list li').forEach(li => {
        li.classList.remove('active');
      });
      event.target.classList.add('active');
    }
    
    function sendMessage() {
      const input = document.getElementById('messageInput');
      const message = input.value.trim();
      
      if (message && selectedUser) {
        socket.emit('private-message', {
          to: selectedUser,
          message,
          from: currentUser
        });
        
        appendMessage(currentUser, message, true);
        input.value = '';
      }
    }
    
    function appendMessage(sender, message, isSent) {
      const messages = document.getElementById('messages');
      const div = document.createElement('div');
      div.className = `message ${isSent ? 'sent' : ''}`;
      div.innerHTML = `<div class="content">${message}</div>`;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }
  </script>
</body>
</html>
```

## 启动方式

```bash
npm install
npm run dev
# 访问 http://localhost:3000
```
