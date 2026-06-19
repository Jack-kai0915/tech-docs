# 第五章：Canvas 图形

## 5.1 Canvas 基础

### 基本设置

```javascript
// 获取 Canvas 元素
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

// 设置尺寸
canvas.width = 800
canvas.height = 600

// 清除画布
ctx.clearRect(0, 0, canvas.width, canvas.height)
```

### 绘制图形

```javascript
// 矩形
ctx.fillStyle = '#3b82f6'
ctx.fillRect(10, 10, 100, 50)  // 填充矩形

ctx.strokeStyle = '#ef4444'
ctx.lineWidth = 2
ctx.strokeRect(150, 10, 100, 50)  // 描边矩形

ctx.clearRect(10, 10, 50, 50)  // 清除区域

// 圆形
ctx.beginPath()
ctx.arc(400, 50, 30, 0, Math.PI * 2)
ctx.fillStyle = '#10b981'
ctx.fill()
ctx.stroke()

// 线条
ctx.beginPath()
ctx.moveTo(10, 100)
ctx.lineTo(200, 100)
ctx.strokeStyle = '#6366f1'
ctx.lineWidth = 3
ctx.stroke()

// 多边形
ctx.beginPath()
ctx.moveTo(100, 200)
ctx.lineTo(150, 150)
ctx.lineTo(200, 200)
ctx.closePath()
ctx.fillStyle = '#f59e0b'
ctx.fill()
ctx.stroke()
```

### 样式设置

```javascript
// 填充样式
ctx.fillStyle = '#3b82f6'           // 纯色
ctx.fillStyle = 'rgba(59,130,246,0.5)'  // 透明度

// 渐变填充
let gradient = ctx.createLinearGradient(0, 0, 200, 0)
gradient.addColorStop(0, '#3b82f6')
gradient.addColorStop(1, '#8b5cf6')
ctx.fillStyle = gradient
ctx.fillRect(0, 0, 200, 100)

// 径向渐变
let radialGradient = ctx.createRadialGradient(100, 100, 10, 100, 100, 50)
radialGradient.addColorStop(0, '#fff')
radialGradient.addColorStop(1, '#3b82f6')
ctx.fillStyle = radialGradient
ctx.fillRect(50, 50, 100, 100)

// 描边样式
ctx.strokeStyle = '#333'
ctx.lineWidth = 2
ctx.lineCap = 'round'      // linecap: butt, round, square
ctx.lineJoin = 'round'     // linejoin: miter, round, bevel
ctx.setLineDash([5, 3])    // 虚线
```

---

## 5.2 Canvas 图片处理

### 绘制图片

```javascript
// 绘制图片
const img = new Image()
img.src = 'photo.jpg'

img.onload = () => {
  // 基本绘制
  ctx.drawImage(img, 0, 0)
  
  // 缩放绘制
  ctx.drawImage(img, 0, 0, 200, 150)
  
  // 裁剪绘制
  ctx.drawImage(img, 50, 50, 100, 100, 0, 0, 200, 200)
}
```

### 图片裁剪

```javascript
function cropImage(image, x, y, width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  
  ctx.drawImage(image, x, y, width, height, 0, 0, width, height)
  
  return canvas.toDataURL()
}
```

### 图片缩放

```javascript
function resizeImage(image, maxWidth, maxHeight) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  let width = image.width
  let height = image.height
  
  if (width > maxWidth) {
    height = (maxWidth / width) * height
    width = maxWidth
  }
  
  if (height > maxHeight) {
    width = (maxHeight / height) * width
    height = maxHeight
  }
  
  canvas.width = width
  canvas.height = height
  ctx.drawImage(image, 0, 0, width, height)
  
  return canvas.toDataURL()
}
```

### 图片滤镜

```javascript
function applyFilter(image, filterType) {
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const ctx = canvas.getContext('2d')
  
  ctx.drawImage(image, 0, 0)
  
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  let data = imageData.data
  
  for (let i = 0; i < data.length; i += 4) {
    switch (filterType) {
      case 'grayscale':
        let avg = (data[i] + data[i + 1] + data[i + 2]) / 3
        data[i] = avg      // R
        data[i + 1] = avg  // G
        data[i + 2] = avg  // B
        break
        
      case 'invert':
        data[i] = 255 - data[i]
        data[i + 1] = 255 - data[i + 1]
        data[i + 2] = 255 - data[i + 2]
        break
        
      case 'sepia':
        let r = data[i], g = data[i + 1], b = data[i + 2]
        data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189)
        data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168)
        data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131)
        break
    }
  }
  
  ctx.putImageData(imageData, 0, 0)
  return canvas.toDataURL()
}
```

### 添加水印

```javascript
function addWatermark(image, text, position = 'bottom-right') {
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const ctx = canvas.getContext('2d')
  
  // 绘制原图
  ctx.drawImage(image, 0, 0)
  
  // 设置水印样式
  ctx.font = '20px Arial'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.textAlign = 'right'
  
  // 计算位置
  let x, y
  switch (position) {
    case 'bottom-right':
      x = canvas.width - 10
      y = canvas.height - 10
      break
    case 'center':
      x = canvas.width / 2
      y = canvas.height / 2
      break
  }
  
  // 绘制水印
  ctx.fillText(text, x, y)
  
  return canvas.toDataURL()
}
```

---

## 5.3 Canvas 动画

### 基础动画

```javascript
// 使用 requestAnimationFrame
let animationId

function animate() {
  // 清除画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // 绘制内容
  drawFrame()
  
  // 继续动画
  animationId = requestAnimationFrame(animate)
}

// 开始动画
animate()

// 停止动画
cancelAnimationFrame(animationId)
```

### 弹跳小球

```javascript
class Ball {
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.vx = (Math.random() - 0.5) * 10
    this.vy = (Math.random() - 0.5) * 10
  }
  
  update(width, height) {
    this.x += this.vx
    this.y += this.vy
    
    // 边界检测
    if (this.x + this.radius > width || this.x - this.radius < 0) {
      this.vx *= -1
    }
    if (this.y + this.radius > height || this.y - this.radius < 0) {
      this.vy *= -1
    }
  }
  
  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.closePath()
  }
}

// 使用
let balls = Array.from({ length: 10 }, () => 
  new Ball(
    Math.random() * canvas.width,
    Math.random() * canvas.height,
    Math.random() * 20 + 10,
    `hsl(${Math.random() * 360}, 70%, 50%)`
  )
)

function animate() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  balls.forEach(ball => {
    ball.update(canvas.width, canvas.height)
    ball.draw(ctx)
  })
  
  requestAnimationFrame(animate)
}

animate()
```

### 粒子系统

```javascript
class Particle {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.vx = (Math.random() - 0.5) * 4
    this.vy = (Math.random() - 0.5) * 4
    this.life = 1
    this.decay = Math.random() * 0.02 + 0.01
    this.size = Math.random() * 3 + 1
    this.color = `hsl(${Math.random() * 60 + 10}, 100%, 50%)`
  }
  
  update() {
    this.x += this.vx
    this.y += this.vy
    this.life -= this.decay
  }
  
  draw(ctx) {
    ctx.globalAlpha = this.life
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }
  
  get isDead() {
    return this.life <= 0
  }
}

class ParticleSystem {
  constructor(x, y) {
    this.particles = []
    this.x = x
    this.y = y
  }
  
  emit(count = 10) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(this.x, this.y))
    }
  }
  
  update() {
    this.particles = this.particles.filter(p => !p.isDead)
    this.particles.forEach(p => p.update())
  }
  
  draw(ctx) {
    this.particles.forEach(p => p.draw(ctx))
  }
}
```

---

## 5.4 Canvas 导出

### 导出为图片

```javascript
// 导出为 PNG
function exportAsPNG(canvas) {
  return canvas.toDataURL('image/png')
}

// 导出为 JPEG
function exportAsJPEG(canvas, quality = 0.9) {
  return canvas.toDataURL('image/jpeg', quality)
}

// 下载图片
function downloadCanvas(canvas, filename = 'canvas.png') {
  const link = document.createElement('a')
  link.download = filename
  link.href = canvas.toDataURL('image/png')
  link.click()
}
```

### 导出为 Blob

```javascript
// 转换为 Blob
async function canvasToBlob(canvas, type = 'image/png', quality = 0.9) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob)
    }, type, quality)
  })
}

// 上传到服务器
async function uploadCanvas(canvas) {
  const blob = await canvasToBlob(canvas, 'image/png')
  const formData = new FormData()
  formData.append('image', blob, 'canvas.png')
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  })
  
  return response.json()
}
```
