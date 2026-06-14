# NumPy 数值计算

## 安装与导入

```bash
pip install numpy
```

```python
import numpy as np
```

## 创建数组

```python
# 从列表创建
arr = np.array([1, 2, 3, 4, 5])
matrix = np.array([[1, 2, 3], [4, 5, 6]])

# 特殊数组
np.zeros((3, 4))        # 全0数组
np.ones((2, 3))         # 全1数组
np.eye(3)               # 单位矩阵
np.arange(0, 10, 2)    # 等差数组 [0, 2, 4, 6, 8]
np.linspace(0, 1, 5)   # 均匀分割 [0, 0.25, 0.5, 0.75, 1]

# 随机数
np.random.seed(42)      # 固定随机种子
np.random.rand(5)       # 5个0-1随机数
np.random.normal(0, 1, 100)  # 正态分布
np.random.randint(0, 10, 5)  # 随机整数
```

## 数组操作

```python
arr = np.array([1, 2, 3, 4, 5])

# 属性
arr.shape      # 形状
arr.ndim       # 维度
arr.size       # 元素总数
arr.dtype      # 数据类型

# 索引切片
arr[0]         # 第一个元素
arr[1:3]       # 切片
arr[arr > 3]   # 布尔索引

# 重塑
arr.reshape(5, 1)   # 变成5行1列
arr.flatten()       # 展平
arr.T               # 转置
```

## 向量化运算

```python
a = np.array([1, 2, 3, 4])
b = np.array([5, 6, 7, 8])

# 逐元素运算
a + b      # [6, 8, 10, 12]
a * b      # [5, 12, 21, 32]
a ** 2     # [1, 4, 9, 16]

# 广播
a * 2      # [2, 4, 6, 8]
a + 10     # [11, 12, 13, 14]
```

## 聚合函数

```python
arr = np.array([10, 20, 30, 40, 50])

arr.sum()    # 总和 150
arr.mean()   # 平均值 30.0
arr.std()    # 标准差
arr.max()    # 最大值
arr.min()    # 最小值
arr.argmax() # 最大值索引

# 指定轴
matrix.sum(axis=0)   # 按列求和
matrix.sum(axis=1)   # 按行求和
```

## 线性代数

```python
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

# 矩阵乘法
A @ B           # 或 np.dot(A, B)

# 其他线性代数
np.linalg.inv(A)    # 逆矩阵
np.linalg.det(A)    # 行列式
np.linalg.eig(A)    # 特征值
np.linalg.norm(A)   # 范数
```

## 实战示例

```python
# 学生成绩分析
np.random.seed(42)
n_students = 100

math = np.random.normal(75, 15, n_students).clip(0, 100)
english = np.random.normal(70, 12, n_students).clip(0, 100)
python = np.random.normal(80, 18, n_students).clip(0, 100)

# 合并成绩
scores = np.column_stack([math, english, python])

# 统计分析
print(f"各科平均分: {scores.mean(axis=0)}")
print(f"各科最高分: {scores.max(axis=0)}")

# 找出Python前5名
top5_idx = np.argsort(scores[:, 2])[-5:][::-1]
print(f"Python前5名: {scores[top5_idx, 2]}")
```
