# 第三章：Docker 容器化运维

## 3.1 Docker 架构

```
┌─────────────────────────────────────────────────────────┐
│                    Docker 架构                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐      ┌─────────────┐                 │
│  │   客户端     │      │   服务器     │                 │
│  │  (CLI/API)  │ ───→ │  (Docker    │                 │
│  │             │      │   Daemon)   │                 │
│  └─────────────┘      └──────┬──────┘                 │
│                              │                         │
│         ┌────────────────────┼────────────────────┐   │
│         ↓                    ↓                    ↓   │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────┐│
│  │   镜像       │      │   容器       │      │  仓库    ││
│  │  (Image)    │      │  (Container)│      │ (Registry)│
│  └─────────────┘      └─────────────┘      └─────────┘│
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 核心概念

| 概念 | 说明 | 类比 |
|------|------|------|
| **镜像 (Image)** | 只读模板，包含运行环境 | 类 |
| **容器 (Container)** | 镜像的运行实例 | 对象 |
| **仓库 (Registry)** | 镜像存储中心 | 应用商店 |
| **Dockerfile** | 构建镜像的脚本 | 构建说明书 |
| **Volume** | 持久化存储 | 外接硬盘 |
| **Network** | 容器网络通信 | 虚拟网络 |

---

## 3.2 安装与配置

### 安装 Docker

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# CentOS/RHEL
yum install -y yum-utils
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum install -y docker-ce docker-ce-cli containerd.io

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker
```

### 配置镜像加速

```bash
# 编辑配置文件
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com",
    "https://registry.docker-cn.com"
  ],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

# 重启 Docker
sudo systemctl daemon-reload
sudo systemctl restart docker
```

---

## 3.3 容器管理命令

### 基本操作

```bash
# 运行容器
docker run -d --name my-nginx -p 80:80 nginx
# -d: 后台运行
# --name: 容器名称
# -p: 端口映射（宿主机:容器）

# 查看运行中的容器
docker ps

# 查看所有容器
docker ps -a

# 停止容器
docker stop my-nginx

# 启动容器
docker start my-nginx

# 重启容器
docker restart my-nginx

# 删除容器
docker rm my-nginx

# 强制删除运行中的容器
docker rm -f my-nginx
```

### 进入容器

```bash
# 进入运行中的容器
docker exec -it my-nginx /bin/bash
# -i: 交互模式
# -t: 分配终端

# 查看容器日志
docker logs my-nginx
docker logs -f my-nginx  # 实时跟踪

# 查看容器详情
docker inspect my-nginx

# 查看容器资源使用
docker stats my-nginx
```

---

## 3.4 镜像管理命令

```bash
# 搜索镜像
docker search nginx

# 拉取镜像
docker pull nginx:latest
docker pull nginx:1.24

# 查看本地镜像
docker images

# 构建镜像
docker build -t my-app:v1 .

# 标记镜像
docker tag my-app:v1 registry.example.com/my-app:v1

# 推送镜像
docker push registry.example.com/my-app:v1

# 删除镜像
docker rmi my-app:v1

# 清理未使用的镜像
docker image prune -a
```

---

## 3.5 Dockerfile 编写

### 基础示例

```dockerfile
# 基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制依赖文件（利用缓存层）
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 复制源代码
COPY . .

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "server.js"]
```

### 多阶段构建

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 生产阶段
FROM node:18-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### 最佳实践

```dockerfile
# ✅ 使用具体版本标签
FROM node:18.17.0-alpine

# ✅ 使用多阶段构建
# ✅ 合并 RUN 指令减少层数
RUN apt-get update && apt-get install -y \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# ✅ 使用 .dockerignore
# node_modules
# .git
# *.log

# ❌ 不要在镜像中存储密钥
# ENV DB_PASSWORD=secret
```

---

## 3.6 Docker Compose

### 基本配置

```yaml
# docker-compose.yml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
    depends_on:
      - db
    volumes:
      - ./data:/app/data
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    restart: unless-stopped

volumes:
  postgres_data:
```

### 常用命令

```bash
# 启动所有服务
docker-compose up -d

# 停止所有服务
docker-compose down

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f web

# 进入容器
docker-compose exec web sh

# 重新构建
docker-compose build --no-cache

# 扩展服务
docker-compose up -d --scale web=3
```

---

## 3.7 容器资源限制

```bash
# 限制 CPU
docker run --cpus="1.5" my-app  # 最多使用 1.5 个 CPU
docker run --cpu-shares=512 my-app  # CPU 份额

# 限制内存
docker run --memory="512m" my-app  # 最大内存 512MB
docker run --memory-swap="1g" my-app  # 内存+swap 总量

# 限制磁盘 IO
docker run --device-read-bps /dev/sda:10mb my-app
docker run --device-write-bps /dev/sda:10mb my-app

# 查看资源使用
docker stats
docker stats --no-stream
```

---

## 3.8 网络管理

```bash
# 查看网络
docker network ls

# 创建自定义网络
docker network create my-network

# 运行容器到指定网络
docker run -d --name web --network my-network nginx
docker run -d --name app --network my-network my-app

# 容器间通信（使用容器名称）
# 在 app 容器中可以访问 web:80

# 查看网络详情
docker network inspect my-network
```

### 网络模式

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| **bridge** | 默认模式，容器有独立网络 | 大多数场景 |
| **host** | 共享宿主机网络 | 需要高性能网络 |
| **none** | 无网络 | 安全隔离 |
| **overlay** | 跨主机网络 | Docker Swarm |

---

## 3.9 故障排查

### 容器启动失败

```bash
# 查看容器日志
docker logs container-name

# 查看容器详情
docker inspect container-name

# 进入容器调试
docker exec -it container-name sh

# 常见原因：
# 1. 镜像拉取失败 → 检查网络/镜像名
# 2. 端口冲突 → 检查端口占用
# 3. 权限不足 → 检查文件权限
# 4. 命令错误 → 检查 Dockerfile CMD
```

### 容器网络不通

```bash
# 检查容器网络配置
docker inspect container-name | grep Network

# 测试容器间连通性
docker exec -it container1 ping container2

# 检查 DNS 解析
docker exec -it container1 nslookup container2

# 检查网络模式
docker network inspect bridge
```

### 容器性能差

```bash
# 查看资源使用
docker stats

# 查看容器进程
docker top container-name

# 检查日志大小
docker inspect container-name | grep -A 5 LogConfig

# 清理日志
truncate -s 0 /var/lib/docker/containers/*/\*-json.log
```

---

## 要点总结

| 概念 | 命令 | 说明 |
|------|------|------|
| 运行容器 | `docker run -d -p 80:80 nginx` | 创建并启动容器 |
| 查看容器 | `docker ps` | 列出运行中的容器 |
| 进入容器 | `docker exec -it name sh` | 进入容器调试 |
| 构建镜像 | `docker build -t name .` | 从 Dockerfile 构建 |
| 数据持久化 | `-v host:container` | 挂载数据卷 |
| 网络管理 | `docker network create` | 创建自定义网络 |

## 常见误区

1. **容器 ≠ 虚拟机**
   ```bash
   # 容器是进程隔离，不是硬件虚拟化
   # 容器删除后数据会丢失（除非使用 Volume）
   ```

2. **不要在容器中存储数据**
   ```bash
   # ✅ 使用 Volume
   docker run -v /data:/app/data my-app
   
   # ❌ 直接写入容器
   docker run my-app  # 数据会丢失
   ```

3. **注意镜像大小**
   ```bash
   # 使用 alpine 版本减小镜像
   FROM node:18-alpine  # 约 50MB
   FROM node:18         # 约 300MB
   ```
