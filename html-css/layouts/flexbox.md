# Flexbox 布局

## 什么是 Flexbox

Flexbox 是一种一维布局模型，适合处理行或列中的项目布局。

### 基本概念

```
┌─────────────────────────────────────────────────────────┐
│                    Flex 容器                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │  Item 1 │ │  Item 2 │ │  Item 3 │ │  Item 4 │      │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘      │
│                                                         │
│  主轴 (Main Axis) →                                     │
│  交叉轴 (Cross Axis) ↓                                  │
└─────────────────────────────────────────────────────────┘
```

---

## 容器属性

### flex-direction

```css
/* 水平排列（默认） */
.container {
  display: flex;
  flex-direction: row;           /* → */
}

/* 水平反向 */
.container {
  display: flex;
  flex-direction: row-reverse;   /* ← */
}

/* 垂直排列 */
.container {
  display: flex;
  flex-direction: column;        /* ↓ */
}

/* 垂直反向 */
.container {
  display: flex;
  flex-direction: column-reverse; /* ↑ */
}
```

**图解：**

```
row:               row-reverse:
┌───┬───┬───┐      ┌───┬───┬───┐
│ 1 │ 2 │ 3 │      │ 3 │ 2 │ 1 │
└───┴───┴───┘      └───┴───┴───┘
→                   ←

column:            column-reverse:
┌───┐              ┌───┐
│ 1 │              │ 3 │
├───┤              ├───┤
│ 2 │              │ 2 │
├───┤              ├───┤
│ 3 │              │ 1 │
└───┘              └───┘
↓                   ↑
```

### flex-wrap

```css
/* 不换行（默认） */
.container { flex-wrap: nowrap; }

/* 换行 */
.container { flex-wrap: wrap; }

/* 反向换行 */
.container { flex-wrap: wrap-reverse; }
```

**图解：**

```
nowrap:                    wrap:
┌────────────────────┐     ┌────────────────────┐
│ 1 │ 2 │ 3 │ 4 │ 5 │     │ 1 │ 2 │ 3 │ 4 │   │
└────────────────────┘     ├─────┬─────┬───────┤
                           │ 5 │ 6 │          │
                           └─────┴─────┴───────┘
```

### justify-content

```css
/* 起点对齐（默认） */
.container { justify-content: flex-start; }

/* 终点对齐 */
.container { justify-content: flex-end; }

/* 居中 */
.container { justify-content: center; }

/* 两端对齐，间距相等 */
.container { justify-content: space-between; */

/* 两端对齐，两侧有间距 */
.container { justify-content: space-around; }

/* 所有间距相等 */
.container { justify-content: space-evenly; }
```

**图解：**

```
flex-start:        center:         flex-end:
┌─┬─┬─┐           ┌─┬─┬─┐        ┌─┬─┬─┐
│1│2│3│           │ │1│2│3│ │    │ │ │1│2│3│
└─┴─┴─┘           └─┴─┴─┘        └─┴─┴─┘

space-between:     space-around:   space-evenly:
┌─┐  ┌─┐  ┌─┐    ┌─┐ ┌─┐ ┌─┐   ┌─┐ ┌─┐ ┌─┐
│1│  │2│  │3│    │1│ │2│ │3│   │1│ │2│ │3│
└─┘  └─┘  └─┘    └─┘ └─┘ └─┘   └─┘ └─┘ └─┘
  ↕     ↕           ↕   ↕   ↕     ↕   ↕   ↕
```

### align-items

```css
/* 拉伸填满（默认） */
.container { align-items: stretch; }

/* 起点对齐 */
.container { align-items: flex-start; }

/* 终点对齐 */
.container { align-items: flex-end; }

/* 居中 */
.container { align-items: center; }

/* 基线对齐 */
.container { align-items: baseline; }
```

**图解：**

```
stretch:           flex-start:      center:
┌────────────┐    ┌────────────┐   ┌────────────┐
│ ┌──┐┌──┐   │    │ ┌──┐┌──┐   │   │            │
│ │  ││  │   │    │ │  ││  │   │   │ ┌──┐┌──┐   │
│ │  ││  │   │    │ └──┘└──┘   │   │ │  ││  │   │
│ └──┘└──┘   │    │            │   │ └──┘└──┘   │
└────────────┘    └────────────┘   │            │
                                  └────────────┘
```

### align-content

```css
/* 多行时的对齐方式 */
.container {
  flex-wrap: wrap;
  align-content: flex-start;    /* 起点 */
  align-content: center;        /* 居中 */
  align-content: space-between; /* 两端对齐 */
}
```

---

## 项目属性

### flex-grow

```css
/* 放大比例（默认 0，不放大） */
.item-1 { flex-grow: 1; }
.item-2 { flex-grow: 2; }
.item-3 { flex-grow: 1; }
```

**图解：**

```
flex: 1    flex: 2    flex: 1
┌────────┐┌──────────────┐┌────────┐
│        ││              ││        │
│   1    ││      2       ││   1    │
│        ││              ││        │
└────────┘└──────────────┘└────────┘
```

### flex-shrink

```css
/* 缩小比例（默认 1，会缩小） */
.item-1 { flex-shrink: 0; }  /* 不缩小 */
.item-2 { flex-shrink: 1; }  /* 正常缩小 */
.item-3 { flex-shrink: 2; }  /* 更多缩小 */
```

### flex-basis

```css
/* 初始大小（默认 auto） */
.item { flex-basis: 200px; }
.item { flex-basis: 50%; }
.item { flex-basis: auto; }
```

### flex 简写

```css
/* flex: grow shrink basis */
.item { flex: 1; }           /* flex: 1 1 0% */
.item { flex: 1 0 200px; }   /* 固定宽度，不缩小 */
.item { flex: 0 0 auto; }    /* 等同于 width: auto */
.item { flex: auto; }        /* 等同于 flex: 1 1 auto */
.item { flex: none; }        /* 等同于 flex: 0 0 auto */
```

### align-self

```css
/* 单独设置对齐方式 */
.item { align-self: flex-start; }
.item { align-self: center; }
.item { align-self: flex-end; }
.item { align-self: stretch; }
.item { align-self: auto; }
```

### order

```css
/* 项目顺序（默认 0） */
.item-1 { order: 3; }
.item-2 { order: 1; }
.item-3 { order: 2; }
```

---

## 实战示例

### 1. 水平垂直居中

```css
/* 方法一：Flex 居中（推荐） */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 方法二：绝对定位 */
.center-absolute {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

**图解：**

```
┌────────────────────────────┐
│                            │
│                            │
│         ┌────────┐         │
│         │  居中  │         │
│         └────────┘         │
│                            │
│                            │
└────────────────────────────┘
```

### 2. 圣杯布局

```css
/* 经典圣杯布局 */
.layout {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.header {
  height: 60px;
  background: #333;
}

.main {
  display: flex;
  flex: 1;
}

.sidebar-left {
  width: 200px;
  background: #666;
}

.content {
  flex: 1;
  background: #f5f5f5;
}

.sidebar-right {
  width: 200px;
  background: #666;
}

.footer {
  height: 60px;
  background: #333;
}
```

**图解：**

```
┌────────────────────────────────────┐
│              Header                │
├──────┬────────────────────┬───────┤
│      │                    │       │
│ Left │      Content       │ Right │
│      │                    │       │
├──────┴────────────────────┴───────┤
│              Footer               │
└────────────────────────────────────┘
```

### 3. 导航栏

```css
/* Flex 导航栏 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background: #333;
}

.nav-links {
  display: flex;
  gap: 20px;
  list-style: none;
}

.nav-links a {
  color: white;
  text-decoration: none;
}

/* 响应式：汉堡菜单 */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  .nav-links.active {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background: #333;
  }
}
```

### 4. 卡片网格

```css
/* Flex 卡片网格 */
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  flex: 1 1 300px;  /* 最小 300px，可放大 */
  max-width: calc(33.333% - 20px);
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
```

**图解：**

```
┌─────────┐ ┌─────────┐ ┌─────────┐
│         │ │         │ │         │
│ Card 1  │ │ Card 2  │ │ Card 3  │
│         │ │         │ │         │
└─────────┘ └─────────┘ └─────────┘
┌─────────┐ ┌─────────┐
│         │ │         │
│ Card 4  │ │ Card 5  │
│         │ │         │
└─────────┘ └─────────┘
```

### 5. 等高布局

```css
/* Flex 等高布局 */
.equal-height {
  display: flex;
  gap: 20px;
}

.column {
  flex: 1;
  padding: 20px;
  background: #f5f5f5;
}
```

**图解：**

```
┌─────────┬─────────┬─────────┐
│         │         │         │
│ 内容少  │ 内容多  │ 内容中  │
│         │         │         │
│         │ ████████│         │
│         │ ████████│         │
│         │ ████████│         │
└─────────┴─────────┴─────────┘
     ↑         ↑         ↑
     └───── 等高 ─────────┘
```

---

## Flexbox 最佳实践

```css
/* 1. 使用 gap 代替 margin */
.container {
  display: flex;
  gap: 20px;  /* 比 margin-right 更好 */
}

/* 2. 使用 flex 简写 */
.item {
  flex: 1 1 0;  /* 比单独写更简洁 */
}

/* 3. 避免固定高度 */
.item {
  flex: 1;
  min-height: 100px;  /* 使用 min-height 而非 height */
}

/* 4. 响应式断点 */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}
```
