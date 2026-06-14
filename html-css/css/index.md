# CSS 基础

## 选择器

### 基础选择器

```css
/* 元素选择器 */
p { color: blue; }

/* 类选择器 */
.highlight { background: yellow; }

/* ID 选择器 */
#header { font-size: 24px; }

/* 通配符选择器 */
* { margin: 0; padding: 0; }
```

### 组合选择器

```css
/* 后代选择器 */
.nav a { color: white; }

/* 子元素选择器 */
.nav > li { list-style: none; }

/* 相邻兄弟选择器 */
h2 + p { margin-top: 0; }

/* 通用兄弟选择器 */
h2 ~ p { color: gray; }

/* 群组选择器 */
h1, h2, h3 { font-family: Arial; }
```

### 伪类选择器

```css
/* 状态伪类 */
a:hover { color: red; }
a:active { color: darkred; }
a:visited { color: purple; }

/* 结构伪类 */
li:first-child { font-weight: bold; }
li:last-child { border-bottom: none; }
li:nth-child(2n) { background: #f5f5f5; }
li:nth-child(3n+1) { color: blue; }

/* 表单伪类 */
input:focus { border-color: blue; }
input:disabled { opacity: 0.5; }
input:checked + label { color: green; }
```

### 伪元素选择器

```css
/* ::before 和 ::after */
.quote::before { content: '"'; font-size: 2em; }
.quote::after { content: '"'; font-size: 2em; }

/* 首行和首字母 */
p::first-line { font-weight: bold; }
p::first-letter { font-size: 2em; }

/* 选中文本 */
::selection { background: yellow; }
```

---

## 盒模型

### 标准盒模型 vs IE 盒模型

```css
/* 标准盒模型（默认） */
.box {
  width: 200px;
  height: 200px;
  padding: 20px;
  border: 5px solid black;
  /* 实际宽度 = 200 + 20*2 + 5*2 = 250px */
}

/* IE 盒模型（推荐） */
.box {
  box-sizing: border-box;
  width: 200px;  /* 实际宽度就是 200px */
  height: 200px;
  padding: 20px;
  border: 5px solid black;
}

/* 全局设置推荐 */
* {
  box-sizing: border-box;
}
```

### 盒模型图解

```
┌─────────────────────────────────────────────────────┐
│                     Margin                          │
│  ┌─────────────────────────────────────────────┐   │
│  │                   Border                     │   │
│  │  ┌─────────────────────────────────────┐   │   │
│  │  │               Padding                │   │   │
│  │  │  ┌─────────────────────────────┐   │   │   │
│  │  │  │           Content           │   │   │   │
│  │  │  │                             │   │   │   │
│  │  │  └─────────────────────────────┘   │   │   │
│  │  └─────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘

margin: 外边距 - 元素与其他元素的距离
border: 边框 - 元素的边界
padding: 内边距 - 内容与边框的距离
content: 内容 - 实际显示的内容
```

---

## 颜色系统

### 颜色表示方法

```css
/* 关键字 */
color: red;
color: transparent;

/* 十六进制 */
color: #ff0000;
color: #f00;        /* 简写 */
color: #ff000080;   /* 带透明度 */

/* RGB */
color: rgb(255, 0, 0);
color: rgb(255, 0, 0, 0.5);  /* 带透明度 */

/* HSL（推荐） */
color: hsl(0, 100%, 50%);      /* 红色 */
color: hsl(120, 100%, 50%);    /* 绿色 */
color: hsl(240, 100%, 50%);    /* 蓝色 */
color: hsl(0, 100%, 50%, 0.5); /* 带透明度 */

/* 颜色系统 */
:root {
  --primary: hsl(210, 100%, 50%);
  --primary-light: hsl(210, 100%, 60%);
  --primary-dark: hsl(210, 100%, 40%);
  --text: hsl(0, 0%, 20%);
  --background: hsl(0, 0%, 98%);
}
```

### 渐变色

```css
/* 线性渐变 */
.gradient-linear {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 径向渐变 */
.gradient-radial {
  background: radial-gradient(circle, #667eea 0%, #764ba2 100%);
}

/* 锥形渐变 */
.gradient-conic {
  background: conic-gradient(from 0deg, #667eea, #764ba2, #667eea);
}

/* 多色渐变 */
.gradient-multi {
  background: linear-gradient(
    45deg,
    #ff6b6b 0%,
    #feca57 25%,
    #48dbfb 50%,
    #ff9ff3 75%,
    #ff6b6b 100%
  );
}
```

---

## 字体排版

```css
/* 字体族 */
body {
  font-family: 
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
}

/* 字体大小 */
h1 { font-size: 2.5rem; }      /* 相对于根元素 */
h2 { font-size: 2rem; }
p { font-size: 1rem; }
.small { font-size: 0.875rem; }

/* 行高 */
p { line-height: 1.6; }        /* 推荐 1.5-1.8 */

/* 字重 */
.light { font-weight: 300; }
.normal { font-weight: 400; }
.bold { font-weight: 700; }

/* 字间距 */
.tight { letter-spacing: -0.02em; }
.normal { letter-spacing: 0; }
.loose { letter-spacing: 0.05em; }

/* 文本装饰 */
.underline { text-decoration: underline; }
.strikethrough { text-decoration: line-through; }
.no-underline { text-decoration: none; }

/* 文本对齐 */
.left { text-align: left; }
.center { text-align: center; }
.right { text-align: right; }
.justify { text-align: justify; }

/* 文本溢出 */
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 多行文本溢出 */
.multi-ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

---

## 背景

```css
/* 背景颜色 */
.bg-color { background-color: #f0f0f0; }

/* 背景图片 */
.bg-image {
  background-image: url('image.jpg');
  background-size: cover;      /* 或 contain */
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed; /* 视差效果 */
}

/* 简写 */
.bg {
  background: #f0f0f0 url('image.jpg') center/cover no-repeat fixed;
}

/* 背景裁剪 */
.bg-clip {
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
```
