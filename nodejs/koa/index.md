# Koa 框架

## 快速开始

```bash
# 安装
npm install koa
```

```javascript
// index.js
import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';

const app = new Koa();
const router = new Router();

// 中间件
app.use(bodyParser());

// 路由
router.get('/', (ctx) => {
  ctx.body = { message: 'Hello, Koa!' };
});

router.get('/users', async (ctx) => {
  ctx.body = { users: [] };
});

router.post('/users', async (ctx) => {
  const user = ctx.request.body;
  ctx.status = 201;
  ctx.body = user;
});

// 使用路由
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Koa server running on port 3000');
});
```

## 中间件机制

```javascript
// Koa 使用洋葱模型
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// 错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = { error: err.message };
    ctx.app.emit('error', err, ctx);
  }
});

// 认证中间件
async function auth(ctx, next) {
  const token = ctx.headers.authorization?.split(' ')[1];
  
  if (!token) {
    ctx.throw(401, 'No token provided');
  }
  
  try {
    ctx.state.user = jwt.verify(token, 'secret');
    await next();
  } catch (err) {
    ctx.throw(401, 'Invalid token');
  }
}
```

## 实战示例：REST API

```javascript
import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import jwt from 'jsonwebtoken';

const app = new Koa();
const router = new Router();

app.use(bodyParser());

// 模拟数据库
let users = [];
let posts = [];

// 认证中间件
const authenticate = async (ctx, next) => {
  const token = ctx.headers.authorization?.split(' ')[1];
  if (!token) ctx.throw(401, 'Unauthorized');
  
  try {
    ctx.state.user = jwt.verify(token, 'secret');
    await next();
  } catch {
    ctx.throw(401, 'Invalid token');
  }
};

// 用户路由
router.post('/register', async (ctx) => {
  const { name, email, password } = ctx.request.body;
  const user = { id: users.length + 1, name, email, password };
  users.push(user);
  
  const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1d' });
  ctx.status = 201;
  ctx.body = { token };
});

router.post('/login', async (ctx) => {
  const { email, password } = ctx.request.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    ctx.throw(401, 'Invalid credentials');
  }
  
  const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1d' });
  ctx.body = { token };
});

// 帖子路由
router.get('/posts', authenticate, async (ctx) => {
  ctx.body = posts;
});

router.post('/posts', authenticate, async (ctx) => {
  const { title, content } = ctx.request.body;
  const post = {
    id: posts.length + 1,
    title,
    content,
    authorId: ctx.state.user.id,
    createdAt: new Date()
  };
  posts.push(post);
  ctx.status = 201;
  ctx.body = post;
});

router.get('/posts/:id', authenticate, async (ctx) => {
  const post = posts.find(p => p.id === parseInt(ctx.params.id));
  if (!post) ctx.throw(404, 'Post not found');
  ctx.body = post;
});

router.put('/posts/:id', authenticate, async (ctx) => {
  const post = posts.find(p => p.id === parseInt(ctx.params.id));
  if (!post) ctx.throw(404, 'Post not found');
  if (post.authorId !== ctx.state.user.id) {
    ctx.throw(403, 'Forbidden');
  }
  
  Object.assign(post, ctx.request.body);
  ctx.body = post;
});

router.del('/posts/:id', authenticate, async (ctx) => {
  const index = posts.findIndex(p => p.id === parseInt(ctx.params.id));
  if (index === -1) ctx.throw(404, 'Post not found');
  if (posts[index].authorId !== ctx.state.user.id) {
    ctx.throw(403, 'Forbidden');
  }
  
  posts.splice(index, 1);
  ctx.body = { message: 'Post deleted' };
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Koa API server running on port 3000');
});
```
