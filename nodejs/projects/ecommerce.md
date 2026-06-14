# 电商平台 API

## 项目简介

使用 Express + MongoDB 构建完整的电商后端 API。

## 技术栈

- Express - Web 框架
- MongoDB - 数据库
- Mongoose - ODM
- JWT - 认证
- bcrypt - 密码加密

## 项目结构

```
ecommerce-api/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   └── orders.js
│   ├── middleware/
│   │   └── auth.js
│   └── index.js
├── package.json
└── .env
```

## 核心代码

### 用户模型

```javascript
// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
```

### 产品路由

```javascript
// routes/products.js
import express from 'express';
import Product from '../models/Product.js';
import { auth, admin } from '../middleware/auth.js';

const router = express.Router();

// 获取所有产品
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, category } = req.query;
  const query = category ? { category } : {};
  
  const products = await Product.find(query)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  const total = await Product.countDocuments(query);
  
  res.json({
    products,
    total,
    pages: Math.ceil(total / limit)
  });
});

// 获取单个产品
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// 创建产品（管理员）
router.post('/', auth, admin, async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
});

// 更新产品
router.put('/:id', auth, admin, async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// 删除产品
router.delete('/:id', auth, admin, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ message: 'Product deleted' });
});

export default router;
```

### 订单路由

```javascript
// routes/orders.js
import express from 'express';
import Order from '../models/Order.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// 创建订单
router.post('/', auth, async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;
  
  // 计算总价
  const total = items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
  
  const order = new Order({
    user: req.user.id,
    items,
    shippingAddress,
    paymentMethod,
    total
  });
  
  await order.save();
  res.status(201).json(order);
});

// 获取用户订单
router.get('/my-orders', auth, async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .sort({ createdAt: -1 });
  res.json(orders);
});

// 获取订单详情
router.get('/:id', auth, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  if (order.user.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json(order);
});

// 更新订单状态
router.put('/:id/status', auth, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  order.status = req.body.status;
  await order.save();
  res.json(order);
});

export default router;
```

## 启动方式

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env

# 启动 MongoDB
mongod

# 启动服务器
npm run dev
```

## API 文档

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/register | 用户注册 |
| POST | /api/auth/login | 用户登录 |
| GET | /api/products | 获取产品列表 |
| GET | /api/products/:id | 获取产品详情 |
| POST | /api/products | 创建产品 |
| PUT | /api/products/:id | 更新产品 |
| DELETE | /api/products/:id | 删除产品 |
| POST | /api/orders | 创建订单 |
| GET | /api/orders/my-orders | 获取我的订单 |
| GET | /api/orders/:id | 获取订单详情 |
