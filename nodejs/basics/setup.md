# 环境搭建

## 安装 Node.js

### Windows

```bash
# 下载安装包
# 访问 https://nodejs.org/ 下载 LTS 版本

# 或使用 nvm-windows
# 下载 nvm-windows: https://github.com/coreybutler/nvm-windows
nvm install 18
nvm use 18

# 验证安装
node --version   # v18.x.x 或更高
npm --version    # 9.x.x 或更高
```

### macOS / Linux

```bash
# 使用 nvm 安装
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# 或使用 apt (Ubuntu)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node --version
npm --version
```

## npm 基础

```bash
# 初始化项目
npm init -y

# 安装依赖
npm install express          # 生产依赖
npm install --save-dev nodemon  # 开发依赖

# 全局安装
npm install -g typescript

# 查看已安装包
npm list
npm list --global

# 更新包
npm update

# 卸载包
npm uninstall express
```

## package.json 配置

```json
{
  "name": "my-node-app",
  "version": "1.0.0",
  "description": "My Node.js application",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "build": "tsc",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "typescript": "^5.0.0"
  }
}
```

### 脚本说明

| 脚本 | 说明 |
|------|------|
| `start` | 生产环境启动 |
| `dev` | 开发环境启动（热重载） |
| `build` | 编译 TypeScript |
| `test` | 运行测试 |

## 开发工具推荐

### VSCode 扩展

1. **Node.js Extension Pack** - Node.js 开发套件
2. **ESLint** - 代码检查
3. **Prettier** - 代码格式化
4. **REST Client** - API 测试

### 常用工具

```bash
# nodemon - 自动重启
npm install -g nodemon
nodemon app.js

# ts-node - 直接运行 TypeScript
npm install -g ts-node
ts-node app.ts

# npx - 直接运行包
npx create-react-app my-app
```

## 项目结构

```
my-node-app/
├── src/
│   ├── index.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── utils/
├── tests/
├── package.json
├── .gitignore
└── README.md
```

## 快速开始

```bash
# 创建项目
mkdir my-app && cd my-app
npm init -y

# 安装 Express
npm install express

# 创建 index.js
cat > index.js << 'EOF'
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Hello, Node.js!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
EOF

# 启动服务器
node index.js
```
