# 第四章：Nginx 反向代理与负载均衡

## 4.1 Nginx 架构

```
┌─────────────────────────────────────────────────────────┐
│                    Nginx 架构                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐                                       │
│  │   Master    │  ← 管理 worker 进程                    │
│  │   Process   │                                       │
│  └──────┬──────┘                                       │
│         │                                               │
│    ┌────┼────┐                                         │
│    ↓    ↓    ↓                                         │
│  ┌───┐┌───┐┌───┐                                       │
│  │W1 ││W2 ││W3 │  ← Worker 进程处理请求                 │
│  └───┘└───┘└───┘                                       │
│                                                         │
│  特点：                                                  │
│  • 事件驱动、异步非阻塞                                  │
│  • 单线程处理多个连接                                    │
│  • 高并发、低内存                                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 4.2 安装与基本配置

### 安装

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install epel-release
sudo yum install nginx

# 启动
sudo systemctl start nginx
sudo systemctl enable nginx

# 验证
curl http://localhost
```

### 目录结构

```bash
/etc/nginx/
├── nginx.conf           # 主配置文件
├── conf.d/              # 额外配置（推荐）
│   └── default.conf
├── sites-available/     # 可用站点
└── sites-enabled/       # 已启用站点
```

### 基本配置

```nginx
# /etc/nginx/nginx.conf
user nginx;
worker_processes auto;  # 自动匹配 CPU 核心数
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;  # 每个 worker 最大连接数
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # 日志格式
    log_format main '$remote_addr - $remote_user [$time_local] '
                    '"$request" $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent"';
    
    access_log /var/log/nginx/access.log main;
    
    # 性能优化
    sendfile on;
    tcp_nopush on;
    keepalive_timeout 65;
    gzip on;
    
    include /etc/nginx/conf.d/*.conf;
}
```

---

## 4.3 反向代理

### 基本反向代理

```nginx
# /etc/nginx/conf.d/app.conf
server {
    listen 80;
    server_name example.com;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        
        # 设置代理头
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

### 多后端代理

```nginx
upstream backend {
    server 192.168.1.10:3000;
    server 192.168.1.11:3000;
    server 192.168.1.12:3000;
}

server {
    listen 80;
    server_name api.example.com;
    
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 4.4 负载均衡策略

```nginx
# 轮询（默认）
upstream backend {
    server 192.168.1.10:3000;
    server 192.168.1.11:3000;
}

# 加权轮询
upstream backend {
    server 192.168.1.10:3000 weight=3;  # 处理更多请求
    server 192.168.1.11:3000 weight=1;
}

# IP Hash（会话保持）
upstream backend {
    ip_hash;
    server 192.168.1.10:3000;
    server 192.168.1.11:3000;
}

# 最少连接
upstream backend {
    least_conn;
    server 192.168.1.10:3000;
    server 192.168.1.11:3000;
}
```

| 策略 | 说明 | 适用场景 |
|------|------|----------|
| **轮询** | 依次分配 | 无状态服务 |
| **加权轮询** | 按权重分配 | 服务器性能不同 |
| **IP Hash** | 同一客户端分配到同一服务器 | 需要会话保持 |
| **最少连接** | 分配到连接数最少的服务器 | 长连接服务 |

---

## 4.5 SSL/TLS 配置

### 使用 Let's Encrypt

```bash
# 安装 certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d example.com -d www.example.com

# 自动续期
sudo certbot renew --dry-run
```

### 手动配置 SSL

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;
    
    # 证书路径
    ssl_certificate /etc/nginx/ssl/example.com.crt;
    ssl_certificate_key /etc/nginx/ssl/example.com.key;
    
    # SSL 优化
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    location / {
        proxy_pass http://backend;
    }
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 4.6 静态资源服务

```nginx
server {
    listen 80;
    server_name static.example.com;
    
    # 静态文件根目录
    root /var/www/static;
    index index.html;
    
    # 缓存控制
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
    }
    
    # gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    gzip_min_length 1024;
}
```

---

## 4.7 性能调优

```nginx
# /etc/nginx/nginx.conf

# worker 进程数（等于 CPU 核心数）
worker_processes auto;

events {
    # 每个 worker 的最大连接数
    worker_connections 10240;
    
    # 使用 epoll（Linux）
    use epoll;
    
    # 多个连接同时接收事件
    multi_accept on;
}

http {
    # 开启高效文件传输
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    
    # 长连接
    keepalive_timeout 65;
    keepalive_requests 1000;
    
    # 缓冲区
    client_body_buffer_size 16k;
    client_header_buffer_size 1k;
    large_client_header_buffers 4 8k;
    
    # 代理缓冲
    proxy_buffer_size 4k;
    proxy_buffers 8 16k;
    proxy_busy_buffers_size 32k;
}
```

---

## 4.8 常见故障排查

### 502 Bad Gateway

```bash
# 现象：浏览器显示 502 Bad Gateway

# 排查步骤：
# 1. 检查后端服务是否运行
systemctl status your-app

# 2. 检查后端端口
ss -tlnp | grep :3000

# 3. 检查 Nginx 错误日志
tail -f /var/log/nginx/error.log

# 4. 检查 upstream 配置
cat /etc/nginx/conf.d/app.conf
```

### 504 Gateway Timeout

```bash
# 现象：请求超时

# 解决方案：
# 增加超时时间
proxy_read_timeout 300s;
proxy_send_timeout 300s;

# 或优化后端响应时间
```

### 403 Forbidden

```bash
# 排查：
# 1. 检查文件权限
ls -la /var/www/

# 2. 检查 Nginx 用户
grep user /etc/nginx/nginx.conf

# 3. 检查目录索引
# 确保有 index.html 或 index.php
```

---

## 要点总结

| 功能 | 配置 | 说明 |
|------|------|------|
| 反向代理 | `proxy_pass` | 将请求转发到后端 |
| 负载均衡 | `upstream` | 多后端分发请求 |
| SSL 配置 | `ssl_certificate` | HTTPS 支持 |
| 静态资源 | `root` + `location` | 直接服务静态文件 |
| 性能优化 | `worker_processes` | 调整 worker 数量 |

## 常见误区

1. **upstream 中的服务器名不要加 http://**
   ```nginx
   # ❌ 错误
   upstream backend {
       server http://192.168.1.10:3000;
   }
   
   # ✅ 正确
   upstream backend {
       server 192.168.1.10:3000;
   }
   ```

2. **proxy_pass 尾部斜杠的区别**
   ```nginx
   # location /api/ → proxy_pass http://backend/
   # 请求 /api/users → http://backend/users
   
   # location /api/ → proxy_pass http://backend
   # 请求 /api/users → http://backend/api/users
   ```

3. **修改配置后要测试和重载**
   ```bash
   sudo nginx -t           # 测试配置
   sudo nginx -s reload    # 重载配置
   ```
