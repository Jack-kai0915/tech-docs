# Express 框架

## 快速开始

```bash
# 创建项目
mkdir my-express-app && cd my-express-app
npm init -y

# 安装依赖
npm install express
npm install --save-dev nodemon
```

```javascript
// index.js
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Express!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 路由系统

```javascript
// 基本路由
app.get('/users', (req, res) => {
  res.json({ users: [] });
});

app.post('/users', (req, res) => {
  const user = req.body;
  res.status(201).json(user);
});

app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  res.json({ id, ...updates });
});

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `User ${id} deleted` });
});

// 路由参数
app.get('/users/:id/posts/:postId', (req, res) => {
  const { id, postId } = req.params;
  res.json({ userId: id, postId });
});

// 查询参数
app.get('/search', (req, res) => {
  const { q, page, limit } = req.query;
  res.json({ query: q, page, limit });
});

// 路由分组
const userRouter = express.Router();
const postRouter = express.Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', getUserById);
userRouter.post('/', createUser);
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);

app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
```

## 中间件

```javascript
// 内置中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 日志中间件
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${Date.now()}`);
  next();
});

// 认证中间件
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// 使用中间件
app.use('/api/protected', authMiddleware);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
```

## 实战示例：REST API

```javascript
import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

// 模拟数据库
let users = [];
let posts = [];

// 认证中间件
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    req.user = jwt.verify(token, 'secret');
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// 用户路由
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const user = { id: users.length + 1, name, email, password };
  users.push(user);
  
  const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1d' });
  res.status(201).json({ token });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1d' });
  res.json({ token });
});

// 帖子路由
app.get('/posts', authenticate, (req, res) => {
  res.json(posts);
});

app.post('/posts', authenticate, (req, res) => {
  const { title, content } = req.body;
  const post = {
    id: posts.length + 1,
    title,
    content,
    authorId: req.user.id,
    createdAt: new Date()
  };
  posts.push(post);
  res.status(201).json(post);
});

app.get('/posts/:id', authenticate, (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

app.put('/posts/:id', authenticate, (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: 'Post not found' });
  if (post.authorId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  Object.assign(post, req.body);
  res.json(post);
});

app.delete('/posts/:id', authenticate, (req, res) => {
  const index = posts.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Post not found' });
  if (posts[index].authorId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  posts.splice(index, 1);
  res.json({ message: 'Post deleted' });
});

app.listen(3000, () => {
  console.log('API server running on port 3000');
});
```
