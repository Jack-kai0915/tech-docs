# 网络编程

## HTTP 服务器

```javascript
import http from 'http';

// 创建服务器
const server = http.createServer((req, res) => {
  // 设置响应头
  res.writeHead(200, { 'Content-Type': 'application/json' });
  
  // 路由处理
  if (req.url === '/' && req.method === 'GET') {
    res.end(JSON.stringify({ message: 'Hello, World!' }));
  } else if (req.url === '/api/users' && req.method === 'GET') {
    res.end(JSON.stringify([{ id: 1, name: 'Alice' }]));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
```

## HTTP 客户端

```javascript
import http from 'http';
import https from 'https';

// GET 请求
function httpGet(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: JSON.parse(data)
        });
      });
    }).on('error', reject);
  });
}

// POST 请求
function httpPost(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    
    const client = url.startsWith('https') ? https : http;
    
    const req = client.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: JSON.parse(responseData)
        });
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// 使用 fetch (Node 18+)
async function fetchData() {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  return data;
}
```

## WebSocket

```javascript
import WebSocket from 'ws';

// 创建 WebSocket 服务器
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    
    // 广播消息
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Echo: ${message}`);
      }
    });
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
  
  ws.send('Welcome to WebSocket server!');
});
```

## Socket.IO 实时通信

```javascript
import { Server } from 'socket.io';
import http from 'http';

const server = http.createServer();
const io = new Server(server);

// 连接处理
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // 加入房间
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });
  
  // 发送消息
  socket.on('send-message', ({ roomId, message }) => {
    io.to(roomId).emit('receive-message', {
      userId: socket.id,
      message,
      timestamp: Date.now()
    });
  });
  
  // 断开连接
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Socket.IO server running on port 3000');
});
```

## TCP/UDP 服务器

```javascript
import net from 'net';
import dgram from 'dgram';

// TCP 服务器
const tcpServer = net.createServer((socket) => {
  console.log('Client connected');
  
  socket.on('data', (data) => {
    console.log(`Received: ${data}`);
    socket.write(`Echo: ${data}`);
  });
  
  socket.on('end', () => {
    console.log('Client disconnected');
  });
});

tcpServer.listen(9000, () => {
  console.log('TCP server running on port 9000');
});

// UDP 服务器
const udpServer = dgram.createSocket('udp4');

udpServer.on('message', (msg, rinfo) => {
  console.log(`Server received: ${msg} from ${rinfo.address}:${rinfo.port}`);
  udpServer.send(`Echo: ${msg}`, rinfo.port, rinfo.address);
});

udpServer.bind(9001, () => {
  console.log('UDP server running on port 9001');
});
```
