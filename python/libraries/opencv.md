# OpenCV 图像处理

## 安装与导入

```bash
pip install opencv-python
```

```python
import cv2
import numpy as np
```

## 图像基础

```python
# 读取图像
img = cv2.imread('image.jpg')

# 显示图像
cv2.imshow('Image', img)
cv2.waitKey(0)
cv2.destroyAllWindows()

# 保存图像
cv2.imwrite('output.jpg', img)

# 获取图像信息
print(img.shape)     # (高度, 宽度, 通道数)
print(img.size)      # 总像素数
print(img.dtype)     # 数据类型
```

## 图像处理

### 颜色转换

```python
# BGR 转灰度
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# BGR 转 HSV
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

# BGR 转 RGB
rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
```

### 图像变换

```python
# 缩放
resized = cv2.resize(img, (300, 200))
resized = cv2.resize(img, None, fx=0.5, fy=0.5)

# 旋转
(h, w) = img.shape[:2]
center = (w // 2, h // 2)
M = cv2.getRotationMatrix2D(center, 45, 1.0)
rotated = cv2.warpAffine(img, M, (w, h))

# 翻转
flipped = cv2.flip(img, 1)  # 水平翻转
flipped = cv2.flip(img, 0)  # 垂直翻转
```

### 图像滤波

```python
# 均值滤波
blurred = cv2.blur(img, (5, 5))

# 高斯滤波
gaussian = cv2.GaussianBlur(img, (5, 5), 0)

# 中值滤波
median = cv2.medianBlur(img, 5)

# 双边滤波
bilateral = cv2.bilateralFilter(img, 9, 75, 75)
```

### 边缘检测

```python
# Canny 边缘检测
edges = cv2.Canny(gray, 50, 150)

# Sobel 边缘检测
sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=5)
sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=5)
```

## 绘图功能

```python
# 画线
cv2.line(img, (0, 0), (100, 100), (0, 255, 0), 2)

# 画矩形
cv2.rectangle(img, (50, 50), (150, 150), (255, 0, 0), 2)

# 画圆
cv2.circle(img, (200, 200), 50, (0, 0, 255), -1)

# 添加文字
cv2.putText(img, 'Hello', (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
```

## 视频处理

```python
# 打开摄像头
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    # 处理帧
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # 显示
    cv2.imshow('Video', gray)
    
    # 按 q 退出
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

# 保存视频
fourcc = cv2.VideoWriter_fourcc(*'XVID')
out = cv2.VideoWriter('output.avi', fourcc, 20.0, (640, 480))

while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    out.write(frame)
    cv2.imshow('Video', frame)

cap.release()
out.release()
```

## 实战示例

```python
# 人脸检测
import cv2

# 加载 Haar 级联分类器
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# 读取图像
img = cv2.imread('photo.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# 检测人脸
faces = face_cascade.detectMultiScale(gray, 1.1, 4)

# 绘制矩形
for (x, y, w, h) in faces:
    cv2.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 2)

# 显示结果
cv2.imshow('Detected Faces', img)
cv2.waitKey(0)
cv2.destroyAllWindows()

# 保存结果
cv2.imwrite('faces_detected.jpg', img)
```
