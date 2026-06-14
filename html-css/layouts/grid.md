# Grid 布局

## 什么是 Grid

CSS Grid 是二维布局系统，可以同时处理行和列。

### 基本概念

```
┌─────────────────────────────────────────────────────────┐
│                    Grid 容器                             │
│  ┌─────────┬─────────┬─────────┐                       │
│  │  Area 1 │  Area 2 │  Area 3 │  ← 行 (Row)           │
│  ├─────────┼─────────┼─────────┤                       │
│  │  Area 4 │  Area 5 │  Area 6 │                       │
│  ├─────────┼─────────┼─────────┤                       │
│  │  Area 7 │  Area 8 │  Area 9 │                       │
│  └─────────┴─────────┴─────────┘                       │
│       ↑                                                 │
│      列 (Column)                                        │
└─────────────────────────────────────────────────────────┘
```

---

## 容器属性

### grid-template-columns / grid-template-rows

```css
/* 固定列宽 */
.container {
  display: grid;
  grid-template-columns: 200px 200px 200px;
}

/* 百分比 */
.container {
  display: grid;
  grid-template-columns: 33.33% 33.33% 33.33%;
}

/* fr 单位（推荐） */
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;  /* 1:2:1 比例 */
}

/* 混合使用 */
.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;  /* 两侧固定，中间自适应 */
}

/* repeat 函数 */
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* 等宽 3 列 */
}

/* 自动填充 */
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}
```

**图解：**

```
fr 单位:
1fr    2fr    1fr
┌──────┬────────────┬──────┐
│      │            │      │
└──────┴────────────┴──────┘
  1/4     2/4      1/4

auto-fill + minmax:
┌─────┬─────┬─────┬─────┐
│     │     │     │     │  ← 自动填充
└─────┴─────┴─────┴─────┘
```

### grid-template-areas

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: 60px 1fr 60px;
  grid-template-areas:
    "header  header  header"
    "sidebar content aside"
    "footer  footer  footer";
  gap: 10px;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.aside   { grid-area: aside; }
.footer  { grid-area: footer; }
```

**图解：**

```
┌────────────────────────────────────┐
│              header                │
├──────┬────────────────────┬───────┤
│      │                    │       │
│sidebar│     content       │ aside │
│      │                    │       │
├──────┴────────────────────┴───────┤
│              footer               │
└────────────────────────────────────┘
```

### gap

```css
/* 统一间距 */
.container { gap: 20px; }

/* 行列不同间距 */
.container { 
  row-gap: 20px; 
  column-gap: 10px; 
}

/* 简写 */
.container { gap: 20px 10px; }  /* 行 列 */
```

### justify-items / align-items

```css
/* 所有项目的水平对齐 */
.container { justify-items: start; }    /* 起点 */
.container { justify-items: end; }      /* 终点 */
.container { justify-items: center; }   /* 居中 */
.container { justify-items: stretch; }  /* 拉伸 */

/* 所有项目的垂直对齐 */
.container { align-items: start; }
.container { align-items: center; }
.container { align-items: stretch; }
```

### justify-content / align-content

```css
/* 整个网格的水平对齐 */
.container { justify-content: start; }
.container { justify-content: center; }
.container { justify-content: space-between; }

/* 整个网格的垂直对齐 */
.container { align-content: start; }
.container { align-content: center; }
.container { align-content: space-between; }
```

---

## 项目属性

### grid-column / grid-row

```css
/* 跨列 */
.item {
  grid-column: 1 / 3;      /* 从第 1 列到第 3 列 */
  grid-column: span 2;     /* 跨 2 列 */
}

/* 跨行 */
.item {
  grid-row: 1 / 3;         /* 从第 1 行到第 3 行 */
  grid-row: span 2;        /* 跨 2 行 */
}

/* 简写 */
.item {
  grid-column: 1 / span 2;
  grid-row: 1 / span 3;
}
```

### grid-area

```css
/* 命名区域 */
.item { grid-area: header; }

/* 数值指定 */
.item {
  grid-area: 1 / 1 / 2 / 3;  /* 行起始 / 列起始 / 行结束 / 列结束 */
}
```

---

## 实战示例

### 1. 经典网格布局

```css
/* 三列等宽 */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* 响应式网格 */
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
```

### 2. 瀑布流布局

```css
/* CSS Grid 瀑布流 */
.masonry {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 10px;
  gap: 16px;
}

.masonry-item {
  grid-row: span var(--span, 5);
  background: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.masonry-item:nth-child(1) { --span: 8; }
.masonry-item:nth-child(2) { --span: 12; }
.masonry-item:nth-child(3) { --span: 6; }
```

**图解：**

```
┌───────┬───────┬───────┐
│       │       │       │
│   1   │       │   3   │
│       │   2   │       │
│       │       │       │
├───────┤       ├───────┤
│       │       │   4   │
│   5   ├───────┤       │
│       │       │       │
└───────┴───────┴───────┘
```

### 3. 圣杯布局（Grid 版）

```css
.layout {
  display: grid;
  grid-template:
    "header  header  header" 60px
    "sidebar content aside" 1fr
    "footer  footer  footer" 60px
    / 200px 1fr 200px;
  min-height: 100vh;
  gap: 10px;
}
```

### 4. 卡片网格（自适应）

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 24px;
}

.card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-content {
  padding: 20px;
}
```

### 5. 仪表盘布局

```css
.dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(150px, auto);
  gap: 20px;
  padding: 20px;
}

.widget {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.widget-large {
  grid-column: span 2;
  grid-row: span 2;
}

.widget-wide {
  grid-column: span 2;
}
```

**图解：**

```
┌───────┬───────┬───────┬───────┐
│       │       │       │       │
│   1   │       │   3   │   4   │
│       │       │       │       │
├───────┴───────┼───────┴───────┤
│               │               │
│       2       │       5       │
│   (large)     │               │
│               │               │
└───────────────┴───────────────┘
```

---

## Grid vs Flexbox

| 特性 | Grid | Flexbox |
|------|------|---------|
| 维度 | 二维（行+列） | 一维（行或列） |
| 适用场景 | 页面整体布局 | 组件内部布局 |
| 对齐方式 | 行列同时对齐 | 沿主轴或交叉轴 |
| 复杂度 | 较高 | 较低 |

### 选择建议

```
页面整体布局 → Grid
组件内部排列 → Flexbox
卡片网格 → Grid（更简单）
导航栏 → Flexbox
响应式网格 → Grid + auto-fill
```

---

## Grid 最佳实践

```css
/* 1. 使用 minmax 防止内容溢出 */
.container {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

/* 2. 使用 gap 代替 margin */
.container {
  gap: 20px;
}

/* 3. 命名区域提高可读性 */
.layout {
  grid-template-areas:
    "header"
    "main"
    "footer";
}

/* 4. 响应式断点 */
@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

/* 5. 使用 auto 自动尺寸 */
.container {
  grid-template-columns: auto 1fr auto;
}
```
