# 关键帧动画

## 什么是关键帧动画

关键帧动画（@keyframes）可以创建复杂的多步骤动画。

### 基本语法

```css
/* 定义动画 */
@keyframes slide-in {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 使用动画 */
.element {
  animation: slide-in 0.5s ease;
}
```

---

## animation 属性详解

### animation-name

```css
/* 指定动画名称 */
.element {
  animation-name: slide-in;
}
```

### animation-duration

```css
/* 动画时长 */
.element {
  animation-duration: 1s;     /* 秒 */
  animation-duration: 500ms;  /* 毫秒 */
}
```

### animation-timing-function

```css
/* 速度曲线 */
.element {
  animation-timing-function: ease;
  animation-timing-function: ease-in-out;
  animation-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* 弹性效果 */
}
```

### animation-delay

```css
/* 延迟开始 */
.element {
  animation-delay: 0.5s;
}
```

### animation-iteration-count

```css
/* 迭代次数 */
.element {
  animation-iteration-count: 1;        /* 执行 1 次（默认） */
  animation-iteration-count: 3;        /* 执行 3 次 */
  animation-iteration-count: infinite; /* 无限循环 */
}
```

### animation-direction

```css
/* 动画方向 */
.element {
  animation-direction: normal;      /* 正向（默认） */
  animation-direction: reverse;     /* 反向 */
  animation-direction: alternate;   /* 交替（奇数正向，偶数反向） */
  animation-direction: alternate-reverse; /* 交替反向 */
}
```

**图解：**

```
normal:
→ → → → → → → →

reverse:
← ← ← ← ← ← ← ←

alternate:
→ → → → ← ← ← ←

alternate-reverse:
← ← ← ← → → → →
```

### animation-fill-mode

```css
/* 填充模式 */
.element {
  animation-fill-mode: none;       /* 动画前后无影响 */
  animation-fill-mode: forwards;   /* 保持结束状态 */
  animation-fill-mode: backwards;  /* 应用开始状态 */
  animation-fill-mode: both;       /* 同时应用开始和结束状态 */
}
```

**图解：**

```
none:
动画前 [元素] 动画后 [元素]

forwards:
动画前 [元素] 动画后 [结束状态]

backwards:
动画前 [开始状态] 动画后 [元素]

both:
动画前 [开始状态] 动画后 [结束状态]
```

### animation-play-state

```css
/* 播放状态 */
.element {
  animation-play-state: running;  /* 运行（默认） */
  animation-play-state: paused;   /* 暂停 */
}

/* 悬停暂停 */
.element:hover {
  animation-play-state: paused;
}
```

### animation 简写

```css
/* animation: name duration timing-function delay iteration-count direction fill-mode */
.element {
  animation: slide-in 0.5s ease 0.1s 1 normal forwards;
}

/* 简写 */
.element {
  animation: slide-in 0.5s ease;
}
```

---

## 关键帧语法

### 基本语法

```css
@keyframes animation-name {
  from {
    /* 开始状态 */
  }
  to {
    /* 结束状态 */
  }
}
```

### 百分比语法

```css
@keyframes animation-name {
  0% {
    /* 开始状态 */
  }
  50% {
    /* 中间状态 */
  }
  100% {
    /* 结束状态 */
  }
}
```

### 多关键帧

```css
@keyframes complex-animation {
  0% {
    transform: translateX(0) rotate(0deg);
    opacity: 1;
  }
  25% {
    transform: translateX(100px) rotate(90deg);
    opacity: 0.8;
  }
  50% {
    transform: translateX(50px) rotate(180deg);
    opacity: 0.5;
  }
  75% {
    transform: translateX(100px) rotate(270deg);
    opacity: 0.8;
  }
  100% {
    transform: translateX(0) rotate(360deg);
    opacity: 1;
  }
}
```

---

## 实战示例

### 1. 弹跳动画

```css
@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -30px, 0);
  }
  70% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}

.bounce {
  animation: bounce 1s infinite;
}
```

**效果：**

```
    ○        ○
   ╱ ╲      ╱ ╲
  ╱   ╲    ╱   ╲
 ─     ───      ───
     落下   弹起
```

### 2. 脉冲动画

```css
@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}

.pulse-button {
  animation: pulse 2s infinite;
}
```

**效果：**

```
    ┌─────┐       ┌───────┐
    │     │   →   │       │  ← 圆圈扩散
    │  ●  │       │  ●   │
    │     │       │       │
    └─────┘       └───────┘
```

### 3. 摇晃动画

```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.shake {
  animation: shake 0.5s ease-in-out;
}
```

**效果：**

```
  ←─ → ←─ → ←─ →
  左 右 左 右 左 右
```

### 4. 渐入动画

```css
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fade-in-up 0.5s ease forwards;
  opacity: 0;
}

/* 交错动画 */
.item:nth-child(1) { animation-delay: 0.1s; }
.item:nth-child(2) { animation-delay: 0.2s; }
.item:nth-child(3) { animation-delay: 0.3s; }
.item:nth-child(4) { animation-delay: 0.4s; }
```

**效果：**

```
时间线:
0.1s: ┌─ Item 1 淡入上移 ─┐
0.2s: │ ┌─ Item 2 淡入上移 ─┐
0.3s: │ │ ┌─ Item 3 淡入上移 ─┐
0.4s: │ │ │ ┌─ Item 4 淡入上移 ─┐
```

### 5. 旋转动画

```css
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: rotate 1s linear infinite;
}
```

**效果：**

```
    ╱╲
   ╱  ╲
  ╱    ╲
  │    │
  ╲    ╱
   ╲  ╱
    ╲╱
  旋转 →
```

### 6. 文字打字机效果

```css
@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes blink-caret {
  from, to { border-color: transparent; }
  50% { border-color: #333; }
}

.typewriter {
  font-family: monospace;
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid #333;
  animation: 
    typing 3s steps(40, end),
    blink-caret 0.75s step-end infinite;
}
```

**效果：**

```
时间线:
0s:   █
1s:   Hello █
2s:   Hello World █
3s:   Hello World! █
      ↑ 光标闪烁
```

### 7. 加载动画集合

```css
/* 旋转加载 */
.loader-rotate {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: rotate 1s linear infinite;
}

/* 跳动加载 */
.loader-bounce {
  width: 40px;
  height: 40px;
  background: #3498db;
  border-radius: 50%;
  animation: bounce 1s ease infinite;
}

/* 脉冲加载 */
.loader-pulse {
  width: 40px;
  height: 40px;
  background: #3498db;
  border-radius: 50%;
  animation: pulse 1s ease infinite;
}

/* 波浪加载 */
@keyframes wave {
  0%, 40%, 100% { transform: scaleY(0.4); }
  20% { transform: scaleY(1); }
}

.loader-wave {
  display: flex;
  gap: 4px;
}

.loader-wave span {
  width: 8px;
  height: 40px;
  background: #3498db;
  animation: wave 1.2s ease-in-out infinite;
}

.loader-wave span:nth-child(1) { animation-delay: 0s; }
.loader-wave span:nth-child(2) { animation-delay: 0.1s; }
.loader-wave span:nth-child(3) { animation-delay: 0.2s; }
.loader-wave span:nth-child(4) { animation-delay: 0.3s; }
.loader-wave span:nth-child(5) { animation-delay: 0.4s; }
```

**效果：**

```
旋转:      跳动:      波浪:
  ╱╲         ○        │││││
 ╱  ╲        │        │││││
╱    ╲       ↓        │││││
                振幅
```

---

## 动画最佳实践

```css
/* 1. 使用 transform 和 opacity */
@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(-100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 2. 使用 will-change 提示浏览器 */
.animated {
  will-change: transform, opacity;
  animation: slide-in 0.5s ease;
}

/* 3. 使用 prefers-reduced-motion 媒体查询 */
@media (prefers-reduced-motion: reduce) {
  .animated {
    animation: none;
  }
}

/* 4. 避免动画闪烁 */
.animated {
  backface-visibility: hidden;
  transform: translateZ(0);
}
```
