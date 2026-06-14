# 博客系统

## 项目简介

使用 Express + SQLite 构建轻量级博客平台。

## 技术栈

- Express - Web 框架
- SQLite - 数据库
- better-sqlite3 - SQLite 驱动
- marked - Markdown 渲染

## 核心代码

```javascript
// index.js
import express from 'express';
import Database from 'better-sqlite3';
import { marked } from 'marked';

const app = express();
app.use(express.json());
app.use(express.static('public'));

// 数据库初始化
const db = new Database('blog.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    published BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 获取所有文章
app.get('/api/posts', (req, res) => {
  const posts = db.prepare(`
    SELECT id, title, slug, published, created_at, updated_at
    FROM posts
    WHERE published = 1
    ORDER BY created_at DESC
  `).all();
  res.json(posts);
});

// 获取单篇文章
app.get('/api/posts/:slug', (req, res) => {
  const post = db.prepare(`
    SELECT * FROM posts WHERE slug = ?
  `).get(req.params.slug);
  
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  // 渲染 Markdown
  post.html = marked(post.content);
  res.json(post);
});

// 创建文章
app.post('/api/posts', (req, res) => {
  const { title, content, slug, published } = req.body;
  
  const result = db.prepare(`
    INSERT INTO posts (title, content, slug, published)
    VALUES (?, ?, ?, ?)
  `).run(title, content, slug, published || 0);
  
  res.status(201).json({ id: result.lastInsertRowid });
});

// 更新文章
app.put('/api/posts/:id', (req, res) => {
  const { title, content, slug, published } = req.body;
  
  db.prepare(`
    UPDATE posts 
    SET title = ?, content = ?, slug = ?, published = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(title, content, slug, published, req.params.id);
  
  res.json({ message: 'Post updated' });
});

// 删除文章
app.delete('/api/posts/:id', (req, res) => {
  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  res.json({ message: 'Post deleted' });
});

app.listen(3000, () => {
  console.log('Blog server running on port 3000');
});
```

## 启动方式

```bash
npm install
npm run dev
# 访问 http://localhost:3000
```
