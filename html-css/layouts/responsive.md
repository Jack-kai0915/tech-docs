# 响应式设计

## 什么是响应式设计

响应式设计让网页在不同设备和屏幕尺寸上都能良好显示。

### 核心原则

1. **移动优先**：先设计移动端，再逐步增强
2. **流式布局**：使用百分比和相对单位
3. **弹性图片**：图片能适应容器
4. **媒体查询**：针对不同屏幕尺寸调整样式

---

## 媒体查询

### 基础语法

```css
/* 基础语法 */
@media 媒体类型 and (条件) {
  /* 样式规则 */
}

/* 常用媒体类型 */
@media screen { /* 屏幕 */ }
@media print { /* 打印 */ }
@media all { /* 所有 */ }
```

### 断点设置

```css
/* 移动优先（从小到大） */
/* 默认：移动端 */

/* 平板 */
@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }
}

/* 桌面 */
@media (min-width: 1024px) {
  .container {
    max-width: 960px;
  }
}

/* 大屏 */
@media (min-width: 1280px) {
  .container {
    max-width: 1200px;
  }
}
```

### 常用断点

```css
/* 常用断点参考 */
/* 手机竖屏: < 640px */
/* 手机横屏: 640px - 767px */
/* 平板: 768px - 1023px */
/* 桌面: 1024px - 1279px */
/* 大屏: ≥ 1280px */

/* Tailwind CSS 断点 */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### 暗色模式

```css
/* 暗色模式 */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #1a1a1a;
    --text-color: #ffffff;
  }
}

/* 手动切换 */
.dark {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
}

.light {
  --bg-color: #ffffff;
  --text-color: #1a1a1a;
}
```

---

## 响应式单位

### 相对单位

```css
/* em - 相对于父元素字体大小 */
.parent { font-size: 16px; }
.child { font-size: 1.5em; } /* 24px */

/* rem - 相对于根元素字体大小 */
html { font-size: 16px; }
.element { font-size: 1.5rem; } /* 24px */

/* vw - 视口宽度的百分比 */
.element { width: 50vw; } /* 视口宽度的一半 */

/* vh - 视口高度的百分比 */
.element { height: 100vh; } /* 视口高度 */

/* vmin - 视口较小维度的百分比 */
.element { width: 50vmin; }

/* vmax - 视口较大维度的百分比 */
.element { width: 50vmax; */
```

### clamp() 函数

```css
/* 响应式字体大小 */
h1 {
  font-size: clamp(1.5rem, 4vw, 3rem);
  /* 最小 1.5rem，理想 4vw，最大 3rem */
}

/* 响应式间距 */
.container {
  padding: clamp(1rem, 3vw, 3rem);
}

/* 响应式宽度 */
.element {
  width: clamp(300px, 50%, 600px);
}
```

---

## 响应式布局模式

### 1. 单列布局

```css
/* 移动端单列 */
.container {
  width: 100%;
  padding: 0 16px;
}

/* 桌面端居中 */
@media (min-width: 768px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### 2. 响应式网格

```css
/* 使用 Grid */
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 使用 Flexbox */
.flex-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.flex-item {
  flex: 1 1 300px;
}
```

### 3. 侧边栏布局

```css
/* 移动端：侧边栏隐藏 */
.layout {
  display: flex;
  flex-direction: column;
}

.sidebar {
  display: none;
}

/* 桌面端：显示侧边栏 */
@media (min-width: 1024px) {
  .layout {
    flex-direction: row;
  }
  
  .sidebar {
    display: block;
    width: 250px;
  }
  
  .content {
    flex: 1;
  }
}
```

### 4. 响应式图片

```css
/* 基础响应式图片 */
img {
  max-width: 100%;
  height: auto;
}

/* 响应式背景图片 */
.hero {
  background-image: url('mobile.jpg');
  background-size: cover;
}

@media (min-width: 768px) {
  .hero {
    background-image: url('desktop.jpg');
  }
}

/* 使用 picture 元素 */
/* <picture>
  <source media="(min-width: 768px)" srcset="desktop.jpg">
  <source media="(max-width: 767px)" srcset="mobile.jpg">
  <img src="fallback.jpg" alt="...">
</picture> */
```

---

## 实战示例

### 1. 响应式导航栏

```css
/* 移动端 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.nav-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  flex-direction: column;
  padding: 1rem;
}

.nav-menu.active {
  display: flex;
}

.hamburger {
  display: block;
}

/* 桌面端 */
@media (min-width: 768px) {
  .nav-menu {
    display: flex;
    flex-direction: row;
    position: static;
    background: transparent;
    padding: 0;
  }
  
  .hamburger {
    display: none;
  }
}
```

### 2. 响应式卡片网格

```css
.cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 1rem;
}

@media (min-width: 640px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
    padding: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .cards {
    grid-template-columns: repeat(3, 1fr);
    padding: 2rem;
    gap: 2rem;
  }
}

@media (min-width: 1280px) {
  .cards {
    grid-template-columns: repeat(4, 1fr);
    max-width: 1400px;
    margin: 0 auto;
  }
}
```

### 3. 响应式英雄区

```css
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 4rem);
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  margin-bottom: 2rem;
}

.hero-button {
  padding: clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem);
  font-size: clamp(1rem, 2vw, 1.25rem);
}
```

### 4. 响应式表格

```css
/* 移动端：卡片式表格 */
@media (max-width: 767px) {
  table {
    display: block;
  }
  
  thead {
    display: none;
  }
  
  tr {
    display: block;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  
  td {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem;
    border-bottom: 1px solid #eee;
  }
  
  td::before {
    content: attr(data-label);
    font-weight: bold;
  }
}

/* 桌面端：传统表格 */
@media (min-width: 768px) {
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
}
```

---

## 响应式最佳实践

```css
/* 1. 使用 CSS 变量 */
:root {
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
}

/* 2. 使用 clamp() */
.element {
  padding: clamp(1rem, 3vw, 3rem);
}

/* 3. 移动优先 */
/* 默认写移动端样式 */
.element {
  width: 100%;
}

/* 逐步增强 */
@media (min-width: 768px) {
  .element {
    width: 50%;
  }
}

/* 4. 避免固定宽度 */
/* 不好 */
.bad { width: 960px; }

/* 好 */
.good { max-width: 960px; width: 100%; }

/* 5. 使用相对单位 */
/* 不好 */
.bad { font-size: 16px; }

/* 好 */
.good { font-size: 1rem; }
```

---

## 常见问题

### Q: 何时使用 Flexbox vs Grid？

```
组件内部布局 → Flexbox
页面整体布局 → Grid
一维排列 → Flexbox
二维网格 → Grid
简单对齐 → Flexbox
复杂网格 → Grid
```

### Q: 如何处理图片？

```css
/* 响应式图片 */
img {
  max-width: 100%;
  height: auto;
  object-fit: cover;
}

/* 固定比例 */
.thumbnail {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
}
```

### Q: 如何优化移动端性能？

```css
/* 1. 减少阴影和渐变 */
@media (max-width: 768px) {
  .card {
    box-shadow: none;
  }
}

/* 2. 简化动画 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none;
    transition: none;
  }
}

/* 3. 使用合适的图片格式 */
/* 使用 WebP 和 AVIF */
```
