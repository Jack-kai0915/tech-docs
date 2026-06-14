# 环境搭建

## 安装 Node.js

TypeScript 运行在 Node.js 环境中，首先需要安装 Node.js。

```bash
# 下载并安装 Node.js
# 访问 https://nodejs.org/ 下载 LTS 版本

# 验证安装
node --version   # v18.x.x 或更高
npm --version    # 9.x.x 或更高
```

## 安装 TypeScript

```bash
# 全局安装 TypeScript
npm install -g typescript

# 验证安装
tsc --version    # 版本号

# 或使用 npx 直接运行
npx tsc --version
```

## 初始化项目

```bash
# 创建项目目录
mkdir my-ts-project
cd my-ts-project

# 初始化 package.json
npm init -y

# 安装 TypeScript（推荐本地安装）
npm install -D typescript

# 初始化 tsconfig.json
npx tsc --init
```

## tsconfig.json 配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 配置说明

| 选项 | 说明 |
|------|------|
| `target` | 编译目标 JavaScript 版本 |
| `module` | 模块系统 |
| `strict` | 启用所有严格类型检查 |
| `outDir` | 输出目录 |
| `rootDir` | 源文件目录 |
| `esModuleInterop` | 兼容 CommonJS 模块 |

## 编写第一个 TypeScript 文件

```typescript
// src/index.ts
function greet(name: string): string {
    return `Hello, ${name}!`;
}

const message: string = greet("TypeScript");
console.log(message);  // Hello, TypeScript!
```

## 编译和运行

```bash
# 编译 TypeScript
npx tsc

# 运行编译后的 JavaScript
node dist/index.js

# 或使用 ts-node 直接运行
npm install -D ts-node
npx ts-node src/index.ts
```

## VSCode 配置

推荐安装以下扩展：

1. **TypeScript Hero** - 自动导入
2. **Error Lens** - 内联错误显示
3. **Pretty TypeScript Errors** - 美化错误信息

推荐 `.vscode/settings.json` 配置：

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

## 实用脚本

在 `package.json` 中添加常用命令：

```json
{
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "start": "node dist/index.js",
    "dev:run": "ts-node src/index.ts"
  }
}
```

## 常见问题

### 1. 找不到模块

```typescript
// 安装类型声明
npm install -D @types/node

// 或声明模块
declare module 'some-module';
```

### 2. 严格模式报错

```typescript
// 可能需要调整 tsconfig.json 的 strict 选项
// 或处理可能为 undefined 的值
function greet(name: string | undefined): string {
    return `Hello, ${name ?? 'World'}!`;
}
```
