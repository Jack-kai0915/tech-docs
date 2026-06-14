# 过渡动画

## 什么是过渡

CSS 过渡（Transition）让属性值在一段时间内平滑变化。

### 基本语法

```css
.element {
  transition: property duration timing-function delay;
}

/* 示例 */
.button {
  background: blue;
  transition: background 0.3s ease;
}

.button:hover {
  background: darkblue;
}
```

---

## transition 属性详解

### transition-property

```css
/* 指定过渡的属性 */
.element {
  transition-property: background;        /* 单个属性 */
  transition-property: background, color; /* 多个属性 */
  transition-property: all;               /* 所有属性 */
  transition-property: none;              /* 无过渡 */
}
```

### transition-duration

```css
/* 过渡时长 */
.element {
  transition-duration: 0.3s;    /* 秒 */
  transition-duration: 300ms;   /* 毫秒 */
  transition-duration: 0.5s 1s; /* 属性1 属性2 分别设置 */
}
```

### transition-timing-function

```css
/* 速度曲线 */
.element {
  transition-timing-function: ease;           /* 默认：慢-快-慢 */
  transition-timing-function: ease-in;        /* 慢-快 */
  transition-timing-function: ease-out;       /* 快-慢 */
  transition-timing-function: ease-in-out;    /* 慢-快-慢（更平滑） */
  transition-timing-function: linear;         /* 匀速 */
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); /* 自定义 */
}
```

**速度曲线图解：**

```
ease (默认):
    ┌───────────────
    │        ╱
    │      ╱
    │    ╱
    │  ╱
    │╱
    └───────────────→ 时间

ease-in:
    │        ──────
    │      ╱
    │    ╱
    │  ╱
    │╱
    └───────────────→ 时间

ease-out:
    │╲
    │  ╲
    │    ╲
    │      ╲
    │        ──────
    └───────────────→ 时间

linear:
    │      ──────
    │    ╱
    │  ╱
    │╱
    └───────────────→ 时间
```

### transition-delay

```css
/* 延迟开始 */
.element {
  transition-delay: 0.2s;     /* 延迟 0.2 秒 */
  transition-delay: 100ms;    /* 延迟 100 毫秒 */
}
```

### transition 简写

```css
/* transition: property duration timing-function delay */
.button {
  transition: all 0.3s ease 0.1s;
}

/* 多个过渡 */
.card {
  transition: 
    transform 0.3s ease,
    box-shadow 0.3s ease,
    background 0.5s ease;
}
```

---

## 实战示例

### 1. 按钮悬停效果

```css
.button {
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.button:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.4);
}
```

**效果：**

```
默认状态          悬停状态
┌──────────┐     ┌──────────┐  ↑
│  Button  │ →   │  Button  │  │ 上移 2px
└──────────┘     └──────────┘  ↓
                └── 阴影扩大 ──┘
```

### 2. 卡片悬停效果

```css
.card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}

.card-image {
  transition: transform 0.5s ease;
}

.card:hover .card-image {
  transform: scale(1.05);
}
```

**效果：**

```
默认                悬停
┌──────────┐       ┌──────────┐
│ ┌──────┐ │       │ ┌──────┐ │
│ │image │ │   →   │ │image │ │ 放大
│ └──────┘ │       │ └──────┘ │
│ content  │       │ content  │
└──────────┘       └──────────┘
      ↑ 上移 + 阴影加深
```

### 3. 链接下划线动画

```css
.link {
  position: relative;
  color: #333;
  text-decoration: none;
}

.link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: #3b82f6;
  transition: width 0.3s ease;
}

.link:hover::after {
  width: 100%;
}
```

**效果：**

```
默认:                    悬停:
Learn More               Learn More
                          ──────────
                       下划线从左到右展开
```

### 4. 输入框焦点效果

```css
.input {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

### 5. 菜单展开效果

```css
.menu {
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.3s ease;
}

.menu.active {
  max-height: 500px;
}

.menu-item {
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.menu.active .menu-item {
  opacity: 1;
  transform: translateY(0);
}

/* 交错动画 */
.menu.active .menu-item:nth-child(1) { transition-delay: 0.1s; }
.menu.active .menu-item:nth-child(2) { transition-delay: 0.2s; }
.menu.active .menu-item:nth-child(3) { transition-delay: 0.3s; }
```

**效果：**

```
关闭状态:
┌──────────┐
│ Menu     │  ↑
│ ──────── │  │ 高度为 0
└──────────┘  ↓

展开状态:
┌──────────┐
│ Menu     │
│ ──────── │
│ Item 1   │  ← 交错出现
│ Item 2   │
│ Item 3   │
└──────────┘
```

### 6. 加载动画

```css
.loader {
  width: 40px;
  height: 40px;
  border: 4px solid #e0e0e0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## 过渡最佳实践

```css
/* 1. 使用 transform 和 opacity（性能更好） */
.good {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* 避免过渡 width、height、margin */
.bad {
  transition: width 0.3s ease;  /* 性能差 */
}

/* 2. 使用 will-change 提示浏览器 */
.will-animate {
  will-change: transform, opacity;
  transition: transform 0.3s ease;
}

/* 3. 避免同时过渡太多属性 */
/* 使用简写 */
.element {
  transition: all 0.3s ease;  /* 可能有性能问题 */
}

/* 更好 */
.element {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
```

---

## 性能优化

### 好的属性（GPU 加速）

```css
/* 推荐使用这些属性进行动画 */
transform
opacity
filter
clip-path
```

### 差的属性（会触发重排）

```css
/* 避免使用这些属性进行动画 */
width
height
margin
padding
border
top
left
right
bottom
font-size
```

### 对比

```css
/* 差：触发重排 */
.bad-animation {
  transition: width 0.3s ease;
}

/* 好：GPU 加速 */
.good-animation {
  transition: transform 0.3s ease;
}

/* 使用 transform 实现相同效果 */
.good-animation {
  transform: scaleX(1.5);  /* 替代 width 增加 */
}
```
