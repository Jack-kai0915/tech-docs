# CSS 特效实战

本章所有特效都提供可运行的完整代码，可以直接复制到 HTML 文件中查看效果。

## 目录

- [玻璃拟态](#玻璃拟态)
- [渐变效果](#渐变效果)
- [阴影效果](#阴影效果)
- [文字特效](#文字特效)
- [按钮特效](#按钮特效)
- [卡片特效](#卡片特效)
- [加载动画](#加载动画)
- [鼠标跟随](#鼠标跟随)

---

## 玻璃拟态

### 效果演示

<div class="demo-box" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 16px; display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">

<div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); border-radius: 16px; padding: 30px; color: white; min-width: 200px;">
<h4 style="margin:0 0 10px 0;">基础玻璃</h4>
<p style="margin:0; opacity:0.8; font-size:14px;">backdrop-filter: blur(10px)</p>
</div>

<div style="background: rgba(0,0,0,0.2); backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 30px; color: white; min-width: 200px;">
<h4 style="margin:0 0 10px 0;">暗色玻璃</h4>
<p style="margin:0; opacity:0.8; font-size:14px;">深色背景版本</p>
</div>

<div style="background: rgba(255,255,255,0.25); backdrop-filter: blur(20px); border: 2px solid rgba(255,255,255,0.3); border-radius: 16px; padding: 30px; color: white; min-width: 200px; box-shadow: 0 8px 32px rgba(0,0,0,0.2);">
<h4 style="margin:0 0 10px 0;">增强玻璃</h4>
<p style="margin:0; opacity:0.8; font-size:14px;">更强模糊 + 阴影</p>
</div>

</div>

### 完整代码

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>玻璃拟态效果</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      padding: 20px;
    }
    
    .container {
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
      justify-content: center;
    }
    
    /* 基础玻璃卡片 */
    .glass {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      padding: 30px;
      color: white;
      width: 280px;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .glass:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    }
    
    .glass h3 {
      margin-bottom: 12px;
      font-size: 1.2rem;
    }
    
    .glass p {
      opacity: 0.8;
      font-size: 0.9rem;
      line-height: 1.6;
    }
    
    /* 暗色版本 */
    .glass-dark {
      background: rgba(0, 0, 0, 0.25);
      border-color: rgba(255, 255, 255, 0.1);
    }
    
    /* 增强版本 */
    .glass-enhanced {
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(20px);
      border: 2px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="glass">
      <h3>基础玻璃</h3>
      <p>backdrop-filter: blur(10px) 创建毛玻璃效果，配合半透明背景实现。</p>
    </div>
    
    <div class="glass glass-dark">
      <h3>暗色玻璃</h3>
      <p>使用深色背景 rgba(0,0,0,0.25) 创建暗色风格的玻璃效果。</p>
    </div>
    
    <div class="glass glass-enhanced">
      <h3>增强玻璃</h3>
      <p>更强的模糊度和阴影效果，适合需要突出显示的内容。</p>
    </div>
  </div>
</body>
</html>
```

---

## 渐变效果

### 效果演示

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; padding: 20px;">

<div style="height: 120px; border-radius: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>

<div style="height: 120px; border-radius: 12px; background: linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);"></div>

<div style="height: 120px; border-radius: 12px; background: radial-gradient(circle at 30% 70%, #ff6b6b 0%, transparent 50%), radial-gradient(circle at 70% 30%, #48dbfb 0%, transparent 50%), #1a1a2e;"></div>

<div style="height: 120px; border-radius: 12px; background: conic-gradient(from 0deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #ff6b6b);"></div>

<div style="height: 120px; border-radius: 12px; background: repeating-linear-gradient(45deg, #667eea, #667eea 10px, #764ba2 10px, #764ba2 20px);"></div>

<div style="height: 120px; border-radius: 12px; background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8f00ff, #ff0000);"></div>

</div>

### 完整代码

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>渐变效果集合</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      padding: 40px;
      background: #1a1a2e;
      font-family: -apple-system, sans-serif;
    }
    
    h1 {
      color: white;
      text-align: center;
      margin-bottom: 40px;
    }
    
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .card {
      border-radius: 16px;
      padding: 30px;
      color: white;
      min-height: 200px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }
    
    .card h3 {
      margin-bottom: 8px;
      font-size: 1.1rem;
    }
    
    .card p {
      opacity: 0.8;
      font-size: 0.85rem;
    }
    
    /* 渐变效果 */
    .linear { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .multi { background: linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3); }
    .radial { 
      background: 
        radial-gradient(circle at 30% 70%, #ff6b6b 0%, transparent 50%),
        radial-gradient(circle at 70% 30%, #48dbfb 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, #feca57 0%, transparent 60%),
        #1a1a2e;
    }
    .conic { 
      background: conic-gradient(from 0deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #ff6b6b);
    }
    .stripes {
      background: repeating-linear-gradient(45deg, #667eea, #667eea 10px, #764ba2 10px, #764ba2 20px);
    }
    .rainbow {
      background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8f00ff, #ff0000);
    }
    
    /* 动画渐变 */
    .animated-gradient {
      background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
      background-size: 400% 400%;
      animation: gradient-shift 8s ease infinite;
    }
    
    @keyframes gradient-shift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  </style>
</head>
<body>
  <h1>渐变效果集合</h1>
  <div class="grid">
    <div class="card linear">
      <h3>线性渐变</h3>
      <p>linear-gradient(135deg, #667eea, #764ba2)</p>
    </div>
    <div class="card multi">
      <h3>多色渐变</h3>
      <p>linear-gradient(45deg, 多个颜色)</p>
    </div>
    <div class="card radial">
      <h3>径向渐变</h3>
      <p>多层 radial-gradient 叠加</p>
    </div>
    <div class="card conic">
      <h3>锥形渐变</h3>
      <p>conic-gradient 创建环形效果</p>
    </div>
    <div class="card stripes">
      <h3>条纹渐变</h3>
      <p>repeating-linear-gradient</p>
    </div>
    <div class="card rainbow animated-gradient">
      <h3>动画渐变</h3>
      <p>背景动画无限循环</p>
    </div>
  </div>
</body>
</html>
```

---

## 阴影效果

### 效果演示

<div style="display: flex; gap: 30px; justify-content: center; flex-wrap: wrap; padding: 40px; background: #f5f5f5; border-radius: 16px;">

<div style="width: 150px; height: 150px; background: white; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; font-size: 14px; color: #666;">基础阴影</div>

<div style="width: 150px; height: 150px; background: white; border-radius: 16px; box-shadow: 0 10px 40px rgba(102,126,234,0.4); display: flex; align-items: center; justify-content: center; font-size: 14px; color: #666;">彩色阴影</div>

<div style="width: 150px; height: 150px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 16px; box-shadow: 0 20px 60px rgba(102,126,234,0.5); display: flex; align-items: center; justify-content: center; font-size: 14px; color: white;">渐变+阴影</div>

<div style="width: 150px; height: 150px; background: white; border-radius: 16px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; font-size: 14px; color: #666;">内阴影</div>

</div>

### 完整代码

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>阴影效果集合</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      padding: 40px;
      background: #f0f2f5;
      font-family: -apple-system, sans-serif;
    }
    
    h1 { text-align: center; margin-bottom: 40px; color: #333; }
    
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 30px;
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .card {
      background: white;
      border-radius: 16px;
      padding: 30px;
      text-align: center;
      transition: transform 0.3s ease;
    }
    
    .card:hover { transform: translateY(-5px); }
    .card h3 { margin-bottom: 10px; color: #333; }
    .card p { color: #666; font-size: 0.85rem; font-family: monospace; }
    
    /* 阴影效果 */
    .shadow-basic {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .shadow-colored {
      box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
    }
    
    .shadow-gradient {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      box-shadow: 0 20px 60px rgba(102, 126, 234, 0.5);
    }
    
    .shadow-inset {
      box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .shadow-multiple {
      box-shadow: 
        0 2px 4px rgba(0, 0, 0, 0.05),
        0 4px 8px rgba(0, 0, 0, 0.05),
        0 8px 16px rgba(0, 0, 0, 0.05),
        0 16px 32px rgba(0, 0, 0, 0.05);
    }
    
    .shadow-neon {
      box-shadow: 
        0 0 5px #667eea,
        0 0 10px #667eea,
        0 0 20px #667eea,
        0 0 40px #764ba2;
    }
  </style>
</head>
<body>
  <h1>阴影效果集合</h1>
  <div class="grid">
    <div class="card shadow-basic">
      <h3>基础阴影</h3>
      <p>box-shadow: 0 4px 6px rgba(0,0,0,0.1)</p>
    </div>
    <div class="card shadow-colored">
      <h3>彩色阴影</h3>
      <p>box-shadow: 0 10px 40px rgba(102,126,234,0.4)</p>
    </div>
    <div class="card shadow-gradient">
      <h3>渐变+阴影</h3>
      <p>渐变背景 + 彩色阴影</p>
    </div>
    <div class="card shadow-inset">
      <h3>内阴影</h3>
      <p>box-shadow: inset 0 2px 10px</p>
    </div>
    <div class="card shadow-multiple">
      <h3>多层阴影</h3>
      <p>多层阴影叠加更自然</p>
    </div>
    <div class="card shadow-neon">
      <h3>霓虹阴影</h3>
      <p>多层发光效果</p>
    </div>
  </div>
</body>
</html>
```

---

## 文字特效

### 效果演示

<div style="padding: 40px; background: #1a1a2e; border-radius: 16px; text-align: center;">

<div style="font-size: 2.5rem; font-weight: bold; margin-bottom: 20px; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">渐变文字效果</div>

<div style="font-size: 2rem; font-weight: bold; margin-bottom: 20px; color: #fff; text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px #ff00de, 0 0 30px #ff00de, 0 0 40px #ff00de;">霓虹灯文字</div>

<div style="font-size: 2.5rem; font-weight: bold; margin-bottom: 20px; color: #3b82f6; text-shadow: 1px 1px 0 #2563eb, 2px 2px 0 #1d4ed8, 3px 3px 0 #1e40af, 4px 4px 0 #1e3a8a, 5px 5px 10px rgba(0,0,0,0.3);">3D 立体文字</div>

<div style="font-family: monospace; font-size: 1.5rem; overflow: hidden; border-right: 3px solid #00ff00; white-space: nowrap; width: 0; animation: typing 3s steps(20) forwards, blink-caret 0.75s step-end infinite; display: inline-block; color: #00ff00;">Hello, CSS Animation!</div>

</div>

<style>
@keyframes typing {
  from { width: 0; }
  to { width: 320px; }
}
@keyframes blink-caret {
  from, to { border-color: transparent; }
  50% { border-color: #00ff00; }
}
</style>

### 完整代码

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>文字特效集合</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      padding: 40px;
      background: #1a1a2e;
      font-family: -apple-system, sans-serif;
    }
    
    .container {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 40px;
    }
    
    .effect-box {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 40px;
      text-align: center;
    }
    
    .label {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.85rem;
      margin-bottom: 16px;
    }
    
    /* 渐变文字 */
    .gradient-text {
      font-size: 3rem;
      font-weight: bold;
      background: linear-gradient(135deg, #667eea, #764ba2, #ff6b6b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    /* 霓虹灯文字 */
    .neon-text {
      font-size: 2.5rem;
      font-weight: bold;
      color: #fff;
      text-shadow: 
        0 0 5px #fff,
        0 0 10px #fff,
        0 0 20px #ff00de,
        0 0 30px #ff00de,
        0 0 40px #ff00de,
        0 0 55px #ff00de;
      animation: neon-pulse 2s ease-in-out infinite alternate;
    }
    
    @keyframes neon-pulse {
      from { text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px #ff00de, 0 0 30px #ff00de; }
      to { text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 40px #ff00de, 0 0 60px #ff00de, 0 0 80px #ff00de; }
    }
    
    /* 3D 文字 */
    .text-3d {
      font-size: 3rem;
      font-weight: bold;
      color: #3b82f6;
      text-shadow: 
        1px 1px 0 #2563eb,
        2px 2px 0 #1d4ed8,
        3px 3px 0 #1e40af,
        4px 4px 0 #1e3a8a,
        5px 5px 0 #172554,
        6px 6px 10px rgba(0, 0, 0, 0.3);
    }
    
    /* 打字机效果 */
    .typewriter {
      font-family: 'Courier New', monospace;
      font-size: 1.5rem;
      color: #00ff00;
      border-right: 3px solid #00ff00;
      white-space: nowrap;
      overflow: hidden;
      width: 0;
      animation: 
        typing 3s steps(25) forwards,
        blink-caret 0.75s step-end infinite;
    }
    
    @keyframes typing {
      to { width: 100%; }
    }
    
    @keyframes blink-caret {
      from, to { border-color: transparent; }
      50% { border-color: #00ff00; }
    }
    
    /* 浮动文字 */
    .float-text {
      font-size: 2rem;
      font-weight: bold;
      color: #48dbfb;
      animation: float 3s ease-in-out infinite;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    
    /* 渐变动画文字 */
    .animated-gradient-text {
      font-size: 2.5rem;
      font-weight: bold;
      background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #ff6b6b);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradient-text 3s linear infinite;
    }
    
    @keyframes gradient-text {
      to { background-position: 200% center; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="effect-box">
      <div class="label">渐变文字</div>
      <div class="gradient-text">Hello Gradient</div>
    </div>
    
    <div class="effect-box">
      <div class="label">霓虹灯文字（带呼吸动画）</div>
      <div class="neon-text">NEON GLOW</div>
    </div>
    
    <div class="effect-box">
      <div class="label">3D 立体文字</div>
      <div class="text-3d">3D Text</div>
    </div>
    
    <div class="effect-box">
      <div class="label">打字机效果</div>
      <div class="typewriter">Hello, CSS Animation!</div>
    </div>
    
    <div class="effect-box">
      <div class="label">浮动文字</div>
      <div class="float-text">Floating Text</div>
    </div>
    
    <div class="effect-box">
      <div class="label">渐变动画文字</div>
      <div class="animated-gradient-text">Animated Gradient</div>
    </div>
  </div>
</body>
</html>
```

---

## 按钮特效

### 效果演示

<div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; padding: 40px; background: #f5f5f5; border-radius: 16px;">

<button style="padding: 14px 28px; font-size: 16px; font-weight: 600; border: 2px solid #3b82f6; background: transparent; color: #3b82f6; border-radius: 8px; cursor: pointer; position: relative; overflow: hidden; transition: all 0.3s ease;">发光按钮</button>

<button style="padding: 14px 28px; font-size: 16px; font-weight: 600; border: none; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;">渐变按钮</button>

<button style="padding: 14px 28px; font-size: 16px; font-weight: 600; border: 2px solid #333; background: #333; color: white; border-radius: 50px; cursor: pointer; transition: all 0.3s ease;">胶囊按钮</button>

<button style="padding: 14px 28px; font-size: 16px; font-weight: 600; border: none; background: #10b981; color: white; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 0 #059669;">3D 按钮</button>

</div>

### 完整代码

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>按钮特效集合</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      padding: 40px;
      background: #f0f2f5;
      font-family: -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 40px;
    }
    
    h1 { color: #333; }
    
    .button-group {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      justify-content: center;
    }
    
    .label {
      text-align: center;
      color: #666;
      font-size: 0.9rem;
      margin-top: 8px;
    }
    
    /* 1. 发光按钮 */
    .glow-btn {
      padding: 14px 28px;
      font-size: 16px;
      font-weight: 600;
      border: 2px solid #3b82f6;
      background: transparent;
      color: #3b82f6;
      border-radius: 8px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    
    .glow-btn::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 300%;
      height: 300%;
      background: radial-gradient(circle, #3b82f6 0%, transparent 70%);
      transform: translate(-50%, -50%) scale(0);
      opacity: 0;
      transition: transform 0.5s, opacity 0.5s;
    }
    
    .glow-btn:hover {
      color: white;
      border-color: transparent;
    }
    
    .glow-btn:hover::before {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    
    .glow-btn span {
      position: relative;
      z-index: 1;
    }
    
    /* 2. 渐变按钮 */
    .gradient-btn {
      padding: 14px 28px;
      font-size: 16px;
      font-weight: 600;
      border: none;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }
    
    .gradient-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
    }
    
    .gradient-btn:active {
      transform: translateY(-1px);
    }
    
    /* 3. 胶囊按钮 */
    .pill-btn {
      padding: 14px 28px;
      font-size: 16px;
      font-weight: 600;
      border: 2px solid #333;
      background: #333;
      color: white;
      border-radius: 50px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    
    .pill-btn::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      transition: width 0.4s, height 0.4s;
    }
    
    .pill-btn:hover::after {
      width: 300px;
      height: 300px;
    }
    
    /* 4. 3D 按钮 */
    .btn-3d {
      padding: 14px 28px;
      font-size: 16px;
      font-weight: 600;
      border: none;
      background: #10b981;
      color: white;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 6px 0 #059669;
      transition: all 0.1s ease;
      position: relative;
      top: 0;
    }
    
    .btn-3d:hover {
      top: 3px;
      box-shadow: 0 3px 0 #059669;
    }
    
    .btn-3d:active {
      top: 6px;
      box-shadow: 0 0 0 #059669;
    }
    
    /* 5. 边框动画按钮 */
    .border-btn {
      padding: 14px 28px;
      font-size: 16px;
      font-weight: 600;
      border: none;
      background: transparent;
      color: #667eea;
      cursor: pointer;
      position: relative;
      transition: color 0.3s;
    }
    
    .border-btn::before,
    .border-btn::after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      background: #667eea;
      transition: all 0.3s ease;
    }
    
    .border-btn::before { top: 0; left: 0; }
    .border-btn::after { bottom: 0; right: 0; }
    
    .border-btn:hover::before,
    .border-btn:hover::after {
      width: 100%;
    }
    
    .border-btn:hover { color: #764ba2; }
    
    /* 6. 加载按钮 */
    .loading-btn {
      padding: 14px 28px;
      font-size: 16px;
      font-weight: 600;
      border: none;
      background: #f59e0b;
      color: white;
      border-radius: 8px;
      cursor: pointer;
      min-width: 140px;
      transition: all 0.3s ease;
    }
    
    .loading-btn.loading {
      pointer-events: none;
    }
    
    .loading-btn.loading::after {
      content: '';
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-left: 8px;
      vertical-align: middle;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <h1>按钮特效集合</h1>
  
  <div class="button-group">
    <div>
      <button class="glow-btn"><span>发光按钮</span></button>
      <div class="label">悬停查看发光效果</div>
    </div>
    <div>
      <button class="gradient-btn">渐变按钮</button>
      <div class="label">悬停上浮 + 阴影增强</div>
    </div>
    <div>
      <button class="pill-btn">胶囊按钮</button>
      <div class="label">点击涟漪效果</div>
    </div>
    <div>
      <button class="btn-3d">3D 按钮</button>
      <div class="label">按压 3D 效果</div>
    </div>
    <div>
      <button class="border-btn">边框动画</button>
      <div class="label">边框展开动画</div>
    </div>
    <div>
      <button class="loading-btn" onclick="this.classList.toggle('loading')">加载状态</button>
      <div class="label">点击切换加载状态</div>
    </div>
  </div>
</body>
</html>
```

---

## 加载动画

### 效果演示

<div style="display: flex; gap: 40px; justify-content: center; align-items: center; flex-wrap: wrap; padding: 40px; background: #1a1a2e; border-radius: 16px;">

<div style="text-align: center; color: white;">
<div style="width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.2); border-top-color: #667eea; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 10px;"></div>
<span style="font-size: 12px; opacity: 0.7;">旋转</span>
</div>

<div style="text-align: center; color: white;">
<div style="display: flex; gap: 4px; justify-content: center; margin-bottom: 10px;">
<div style="width: 8px; height: 30px; background: #667eea; animation: wave 1s ease-in-out infinite 0s;"></div>
<div style="width: 8px; height: 30px; background: #764ba2; animation: wave 1s ease-in-out infinite 0.1s;"></div>
<div style="width: 8px; height: 30px; background: #ff6b6b; animation: wave 1s ease-in-out infinite 0.2s;"></div>
<div style="width: 8px; height: 30px; background: #feca57; animation: wave 1s ease-in-out infinite 0.3s;"></div>
<div style="width: 8px; height: 30px; background: #48dbfb; animation: wave 1s ease-in-out infinite 0.4s;"></div>
</div>
<span style="font-size: 12px; opacity: 0.7;">波浪</span>
</div>

<div style="text-align: center; color: white;">
<div style="width: 40px; height: 40px; background: #667eea; border-radius: 50%; animation: pulse 1s ease-in-out infinite; margin: 0 auto 10px;"></div>
<span style="font-size: 12px; opacity: 0.7;">脉冲</span>
</div>

<div style="text-align: center; color: white;">
<div style="width: 40px; height: 40px; position: relative; margin: 0 auto 10px;">
<div style="position: absolute; width: 100%; height: 100%; border: 3px solid transparent; border-top-color: #667eea; border-radius: 50%; animation: spin 1s linear infinite;"></div>
<div style="position: absolute; width: 70%; height: 70%; top: 15%; left: 15%; border: 3px solid transparent; border-top-color: #ff6b6b; border-radius: 50%; animation: spin 0.8s linear infinite reverse;"></div>
</div>
<span style="font-size: 12px; opacity: 0.7;">双环</span>
</div>

<div style="text-align: center; color: white;">
<div style="display: flex; gap: 4px; margin-bottom: 10px;">
<div style="width: 10px; height: 10px; background: #667eea; border-radius: 50%; animation: bounce 0.6s ease-in-out infinite 0s;"></div>
<div style="width: 10px; height: 10px; background: #764ba2; border-radius: 50%; animation: bounce 0.6s ease-in-out infinite 0.1s;"></div>
<div style="width: 10px; height: 10px; background: #ff6b6b; border-radius: 50%; animation: bounce 0.6s ease-in-out infinite 0.2s;"></div>
</div>
<span style="font-size: 12px; opacity: 0.7;">弹跳</span>
</div>

</div>

<style>
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes wave {
  0%, 40%, 100% { transform: scaleY(0.4); }
  20% { transform: scaleY(1); }
}
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>

### 完整代码

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>加载动画集合</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      padding: 40px;
      background: #1a1a2e;
      font-family: -apple-system, sans-serif;
    }
    
    h1 { color: white; text-align: center; margin-bottom: 40px; }
    
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 40px;
      max-width: 900px;
      margin: 0 auto;
    }
    
    .item {
      text-align: center;
    }
    
    .item .name {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.85rem;
      margin-top: 16px;
    }
    
    .item .code {
      color: rgba(255, 255, 255, 0.4);
      font-size: 0.7rem;
      font-family: monospace;
      margin-top: 4px;
    }
    
    .loader-wrapper {
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
    }
    
    /* 1. 旋转加载 */
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(255, 255, 255, 0.1);
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    /* 2. 波浪加载 */
    .wave {
      display: flex;
      gap: 4px;
      align-items: center;
      height: 40px;
    }
    
    .wave span {
      width: 6px;
      height: 100%;
      background: linear-gradient(to top, #667eea, #764ba2);
      animation: wave 1s ease-in-out infinite;
    }
    
    .wave span:nth-child(1) { animation-delay: 0s; }
    .wave span:nth-child(2) { animation-delay: 0.1s; }
    .wave span:nth-child(3) { animation-delay: 0.2s; }
    .wave span:nth-child(4) { animation-delay: 0.3s; }
    .wave span:nth-child(5) { animation-delay: 0.4s; }
    
    /* 3. 脉冲加载 */
    .pulse-loader {
      width: 40px;
      height: 40px;
      background: #667eea;
      border-radius: 50%;
      animation: pulse 1s ease-in-out infinite;
    }
    
    /* 4. 双环加载 */
    .dual-ring {
      width: 40px;
      height: 40px;
      position: relative;
    }
    
    .dual-ring::before,
    .dual-ring::after {
      content: '';
      position: absolute;
      border-radius: 50%;
      border: 3px solid transparent;
    }
    
    .dual-ring::before {
      width: 100%;
      height: 100%;
      border-top-color: #667eea;
      animation: spin 1s linear infinite;
    }
    
    .dual-ring::after {
      width: 60%;
      height: 60%;
      top: 20%;
      left: 20%;
      border-top-color: #ff6b6b;
      animation: spin 0.8s linear infinite reverse;
    }
    
    /* 5. 弹跳点 */
    .bounce-dots {
      display: flex;
      gap: 6px;
    }
    
    .bounce-dots span {
      width: 10px;
      height: 10px;
      background: #667eea;
      border-radius: 50%;
      animation: bounce 0.6s ease-in-out infinite;
    }
    
    .bounce-dots span:nth-child(1) { animation-delay: 0s; background: #667eea; }
    .bounce-dots span:nth-child(2) { animation-delay: 0.1s; background: #764ba2; }
    .bounce-dots span:nth-child(3) { animation-delay: 0.2s; background: #ff6b6b; }
    
    /* 6. 旋转方块 */
    .rotating-squares {
      width: 40px;
      height: 40px;
      position: relative;
      animation: spin 2s linear infinite;
    }
    
    .rotating-squares div {
      position: absolute;
      width: 16px;
      height: 16px;
      background: #667eea;
      border-radius: 2px;
      animation: squares 1.5s ease-in-out infinite;
    }
    
    .rotating-squares div:nth-child(1) { top: 0; left: 0; animation-delay: 0s; }
    .rotating-squares div:nth-child(2) { top: 0; right: 0; animation-delay: 0.2s; }
    .rotating-squares div:nth-child(3) { bottom: 0; right: 0; animation-delay: 0.4s; }
    .rotating-squares div:nth-child(4) { bottom: 0; left: 0; animation-delay: 0.6s; }
    
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes wave {
      0%, 40%, 100% { transform: scaleY(0.4); }
      20% { transform: scaleY(1); }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.7; }
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    @keyframes squares {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(0.5); }
    }
  </style>
</head>
<body>
  <h1>加载动画集合</h1>
  <div class="grid">
    <div class="item">
      <div class="loader-wrapper"><div class="spinner"></div></div>
      <div class="name">旋转加载</div>
      <div class="code">border + rotate</div>
    </div>
    <div class="item">
      <div class="loader-wrapper">
        <div class="wave">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
      </div>
      <div class="name">波浪加载</div>
      <div class="code">scaleY + delay</div>
    </div>
    <div class="item">
      <div class="loader-wrapper"><div class="pulse-loader"></div></div>
      <div class="name">脉冲加载</div>
      <div class="code">scale + opacity</div>
    </div>
    <div class="item">
      <div class="loader-wrapper"><div class="dual-ring"></div></div>
      <div class="name">双环加载</div>
      <div class="code">双层旋转</div>
    </div>
    <div class="item">
      <div class="loader-wrapper">
        <div class="bounce-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
      <div class="name">弹跳点</div>
      <div class="code">translateY + delay</div>
    </div>
    <div class="item">
      <div class="loader-wrapper">
        <div class="rotating-squares">
          <div></div><div></div><div></div><div></div>
        </div>
      </div>
      <div class="name">旋转方块</div>
      <div class="code">scale + spin</div>
    </div>
  </div>
</body>
</html>
```

---

## 卡片特效

### 效果演示

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; padding: 40px; background: #f0f2f5; border-radius: 16px;">

<div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.3s, box-shadow 0.3s;">
<div style="height: 150px; background: linear-gradient(135deg, #667eea, #764ba2);"></div>
<div style="padding: 20px;">
<h4 style="margin: 0 0 8px 0;">悬停上浮</h4>
<p style="margin: 0; color: #666; font-size: 14px;">鼠标悬停卡片上浮并增强阴影</p>
</div>
</div>

<div style="background: white; border-radius: 16px; overflow: hidden; position: relative;">
<div style="height: 150px; background: url('https://picsum.photos/400/200') center/cover; transition: transform 0.5s;"></div>
<div style="padding: 20px;">
<h4 style="margin: 0 0 8px 0;">图片缩放</h4>
<p style="margin: 0; color: #666; font-size: 14px;">悬停时图片缓慢放大</p>
</div>
</div>

<div style="background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 16px; padding: 30px; color: white; position: relative; overflow: hidden;">
<div style="position: absolute; top: -50%; right: -50%; width: 100%; height: 100%; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
<h4 style="margin: 0 0 8px 0; position: relative;">渐变卡片</h4>
<p style="margin: 0; opacity: 0.9; font-size: 14px; position: relative;">渐变背景 + 装饰圆形</p>
</div>

</div>

---

## 鼠标跟随

### 完整代码

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>鼠标跟随效果</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      min-height: 100vh;
      background: #1a1a2e;
      overflow: hidden;
      cursor: none;
    }
    
    .cursor {
      width: 20px;
      height: 20px;
      border: 2px solid #667eea;
      border-radius: 50%;
      position: fixed;
      pointer-events: none;
      transition: transform 0.1s ease;
      z-index: 9999;
    }
    
    .cursor-dot {
      width: 8px;
      height: 8px;
      background: #ff6b6b;
      border-radius: 50%;
      position: fixed;
      pointer-events: none;
      z-index: 10000;
    }
    
    .cursor.hover {
      transform: scale(2);
      border-color: #ff6b6b;
    }
    
    .trail {
      position: fixed;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      pointer-events: none;
      opacity: 0.5;
      animation: fade-out 1s forwards;
    }
    
    @keyframes fade-out {
      to { opacity: 0; transform: scale(0); }
    }
    
    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      color: white;
      font-family: -apple-system, sans-serif;
    }
    
    h1 {
      font-size: 3rem;
      margin-bottom: 20px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    p { opacity: 0.6; margin-bottom: 40px; }
    
    .boxes {
      display: flex;
      gap: 20px;
    }
    
    .box {
      width: 100px;
      height: 100px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      cursor: pointer;
    }
    
    .box:hover {
      background: rgba(102, 126, 234, 0.3);
      border-color: #667eea;
      transform: scale(1.1);
    }
  </style>
</head>
<body>
  <div class="cursor" id="cursor"></div>
  <div class="cursor-dot" id="cursor-dot"></div>
  
  <div class="content">
    <h1>鼠标跟随效果</h1>
    <p>移动鼠标查看效果，悬停在方块上</p>
    <div class="boxes">
      <div class="box hover-target">Box 1</div>
      <div class="box hover-target">Box 2</div>
      <div class="box hover-target">Box 3</div>
    </div>
  </div>
  
  <script>
    const cursor = document.getElementById('cursor');
    const cursorDot = document.getElementById('cursor-dot');
    const hoverTargets = document.querySelectorAll('.hover-target');
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    // 鼠标移动
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // 小圆点直接跟随
      cursorDot.style.left = mouseX - 4 + 'px';
      cursorDot.style.top = mouseY - 4 + 'px';
      
      // 创建拖尾效果
      createTrail(e.clientX, e.clientY);
    });
    
    // 平滑跟随动画
    function animate() {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      
      cursor.style.left = cursorX - 10 + 'px';
      cursor.style.top = cursorY - 10 + 'px';
      
      requestAnimationFrame(animate);
    }
    animate();
    
    // 悬停效果
    hoverTargets.forEach(target => {
      target.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      target.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
    
    // 拖尾效果
    function createTrail(x, y) {
      const trail = document.createElement('div');
      trail.className = 'trail';
      trail.style.left = x - 5 + 'px';
      trail.style.top = y - 5 + 'px';
      trail.style.background = `hsl(${Math.random() * 60 + 220}, 70%, 60%)`;
      document.body.appendChild(trail);
      
      setTimeout(() => trail.remove(), 1000);
    }
  </script>
</body>
</html>
```

---

## 实战项目：个人主页

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>个人主页 - CSS 特效实战</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0f0f1a;
      color: white;
      min-height: 100vh;
    }
    
    /* 玻璃导航栏 */
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      padding: 16px 40px;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 1000;
    }
    
    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .nav-links {
      display: flex;
      gap: 30px;
      list-style: none;
    }
    
    .nav-links a {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      position: relative;
      transition: color 0.3s;
    }
    
    .nav-links a::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      transition: width 0.3s;
    }
    
    .nav-links a:hover {
      color: white;
    }
    
    .nav-links a:hover::after {
      width: 100%;
    }
    
    /* 英雄区 */
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 100px 20px;
      position: relative;
      overflow: hidden;
    }
    
    .hero::before {
      content: '';
      position: absolute;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: pulse 4s ease-in-out infinite;
    }
    
    @keyframes pulse {
      0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
      50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
    }
    
    .hero-content {
      position: relative;
      z-index: 1;
    }
    
    .hero h1 {
      font-size: clamp(2.5rem, 6vw, 4rem);
      margin-bottom: 20px;
      animation: fadeInUp 1s ease;
    }
    
    .hero h1 span {
      background: linear-gradient(135deg, #667eea, #764ba2, #ff6b6b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .hero p {
      font-size: 1.2rem;
      opacity: 0.7;
      margin-bottom: 40px;
      animation: fadeInUp 1s ease 0.2s backwards;
    }
    
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    /* CTA 按钮 */
    .cta-button {
      display: inline-block;
      padding: 16px 40px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      text-decoration: none;
      border-radius: 50px;
      font-weight: 600;
      font-size: 1.1rem;
      transition: all 0.3s ease;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
      animation: fadeInUp 1s ease 0.4s backwards;
    }
    
    .cta-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5);
    }
    
    /* 卡片网格 */
    .section {
      padding: 100px 40px;
    }
    
    .section-title {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 60px;
    }
    
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 40px;
      transition: all 0.3s ease;
    }
    
    .card:hover {
      transform: translateY(-10px);
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(102, 126, 234, 0.5);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }
    
    .card-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      margin-bottom: 20px;
    }
    
    .card h3 {
      font-size: 1.3rem;
      margin-bottom: 12px;
    }
    
    .card p {
      color: rgba(255, 255, 255, 0.6);
      line-height: 1.6;
    }
    
    /* 技能条 */
    .skills {
      max-width: 600px;
      margin: 0 auto;
    }
    
    .skill-item {
      margin-bottom: 30px;
    }
    
    .skill-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    
    .skill-bar {
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
    }
    
    .skill-progress {
      height: 100%;
      background: linear-gradient(90deg, #667eea, #764ba2);
      border-radius: 4px;
      animation: progress 1.5s ease forwards;
      width: 0;
    }
    
    @keyframes progress {
      to { width: var(--progress); }
    }
    
    /* 页脚 */
    .footer {
      text-align: center;
      padding: 40px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.5);
    }
    
    .social-links {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .social-links a {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      text-decoration: none;
      transition: all 0.3s ease;
    }
    
    .social-links a:hover {
      background: linear-gradient(135deg, #667eea, #764ba2);
      transform: translateY(-3px);
    }
  </style>
</head>
<body>
  <nav class="navbar">
    <div class="logo">Portfolio</div>
    <ul class="nav-links">
      <li><a href="#">首页</a></li>
      <li><a href="#">关于</a></li>
      <li><a href="#">项目</a></li>
      <li><a href="#">技能</a></li>
      <li><a href="#">联系</a></li>
    </ul>
  </nav>
  
  <section class="hero">
    <div class="hero-content">
      <h1>你好，我是 <span>前端开发者</span></h1>
      <p>专注于创建美观、高性能的 Web 应用</p>
      <a href="#projects" class="cta-button">查看作品</a>
    </div>
  </section>
  
  <section class="section" id="projects">
    <h2 class="section-title">技能专长</h2>
    <div class="card-grid">
      <div class="card">
        <div class="card-icon">🎨</div>
        <h3>UI 设计</h3>
        <p>精通响应式设计、动画效果和用户交互体验</p>
      </div>
      <div class="card">
        <div class="card-icon">⚡</div>
        <h3>性能优化</h3>
        <p>优化加载速度、渲染性能和用户体验</p>
      </div>
      <div class="card">
        <div class="card-icon">🔧</div>
        <h3>框架开发</h3>
        <p>熟练使用 React、Vue 等现代前端框架</p>
      </div>
    </div>
  </section>
  
  <section class="section">
    <h2 class="section-title">技能水平</h2>
    <div class="skills">
      <div class="skill-item">
        <div class="skill-header">
          <span>HTML / CSS</span>
          <span>95%</span>
        </div>
        <div class="skill-bar">
          <div class="skill-progress" style="--progress: 95%"></div>
        </div>
      </div>
      <div class="skill-item">
        <div class="skill-header">
          <span>JavaScript</span>
          <span>90%</span>
        </div>
        <div class="skill-bar">
          <div class="skill-progress" style="--progress: 90%"></div>
        </div>
      </div>
      <div class="skill-item">
        <div class="skill-header">
          <span>React / Vue</span>
          <span>85%</span>
        </div>
        <div class="skill-bar">
          <div class="skill-progress" style="--progress: 85%"></div>
        </div>
      </div>
    </div>
  </section>
  
  <footer class="footer">
    <div class="social-links">
      <a href="#">G</a>
      <a href="#">T</a>
      <a href="#">L</a>
    </div>
    <p>© 2024 Portfolio. All rights reserved.</p>
  </footer>
</body>
</html>
```
