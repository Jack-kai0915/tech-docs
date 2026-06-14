# 模块系统

## ES Modules (推荐)

```javascript
// 导出
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export default class Calculator { ... }

// 导入
import Calculator from './calculator.js';
import { PI, add } from './math.js';
import * as MathUtils from './math.js';

// 动态导入
const module = await import('./module.js');
```

## CommonJS

```javascript
// 导出
module.exports = { add, subtract };
exports.add = function(a, b) { return a + b; };

// 导入
const { add, subtract } = require('./math.js');
const Calculator = require('./calculator');
```

## npm 包管理

```bash
# 初始化
npm init -y

# 安装依赖
npm install express
npm install --save-dev nodemon
npm install --save-optional optional-package

# 锁定版本
npm ci

# 查看过期包
npm outdated

# 安全审计
npm audit
npm audit fix
```

## 工作空间 (Monorepo)

```json
// package.json (根目录)
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}
```

```json
// packages/app/package.json
{
  "name": "@myorg/app",
  "dependencies": {
    "@myorg/shared": "*"
  }
}
```

```bash
# 添加工作空间依赖
npm install @myorg/shared --workspace=app

# 运行脚本
npm run build --workspaces
```
