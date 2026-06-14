# NumPy 数组

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
print(arr)          # [1 2 3 4 5]
print(type(arr))    # <class 'numpy.ndarray'>

# 创建二维数组
matrix = np.array([[1, 2, 3], [4, 5, 6]])
print(matrix)
# [[1 2 3]
#  [4 5 6]]

# 全0数组
zeros = np.zeros((3, 4))  # 3行4列
print(zeros)
# [[0. 0. 0. 0.]
#  [0. 0. 0. 0.]
#  [0. 0. 0. 0.]]

# 全1数组
ones = np.ones((2, 3))
print(ones)
# [[1. 1. 1.]
#  [1. 1. 1.]]

# 等差数组
arr = np.arange(0, 10, 2)  # [0 2 4 6 8]

# 均匀分割
arr = np.linspace(0, 1, 5)  # [0.   0.25 0.5  0.75 1.  ]

# 单位矩阵
eye = np.eye(3)
print(eye)
# [[1. 0. 0.]
#  [0. 1. 0.]
#  [0. 0. 1.]]

# 随机数
random_arr = np.random.rand(5)  # 5个0-1之间的随机数
normal_arr = np.random.normal(0, 1, 100)  # 正态分布

# 固定随机种子（可复现）
np.random.seed(42)
```

## 数组属性

```python
arr = np.array([[1, 2, 3], [4, 5, 6]])

print(arr.shape)    # (2, 3) → 2行3列
print(arr.ndim)     # 2 → 二维
print(arr.size)     # 6 → 元素总数
print(arr.dtype)    # int64 → 数据类型
```

## 索引与切片

```python
arr = np.array([[1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]])

# 索引
print(arr[0, 0])    # 1
print(arr[1, 2])    # 6

# 切片
print(arr[0:2, 1:3])
# [[2 3]
#  [5 6]]

# 整行/整列
print(arr[0])       # [1 2 3]
print(arr[:, 0])    # [1 4 7]

# 布尔索引
print(arr[arr > 5])  # [6 7 8 9]
```

## 向量化运算

```python
a = np.array([1, 2, 3, 4])
b = np.array([5, 6, 7, 8])

# 逐元素运算
print(a + b)        # [ 6  8 10 12]
print(a * b)        # [ 5 12 21 32]
print(a ** 2)       # [ 1  4  9 16]

# 广播
print(a * 2)        # [2 4 6 8]
print(a + 10)       # [11 12 13 14]
```

## 聚合函数

```python
arr = np.array([10, 20, 30, 40, 50])

print(arr.sum())    # 150
print(arr.mean())   # 30.0
print(arr.std())    # 14.14
print(arr.max())    # 50
print(arr.min())    # 10
print(arr.argmax()) # 4
print(arr.argmin()) # 0

# 指定轴
matrix = np.array([[1, 2, 3], [4, 5, 6]])
print(matrix.sum(axis=0))   # [5 7 9] 按列求和
print(matrix.sum(axis=1))   # [6 15]  按行求和
```

## 重塑与变形

```python
arr = np.arange(12)

# reshape
print(arr.reshape(3, 4))
# [[ 0  1  2  3]
#  [ 4  5  6  7]
#  [ 8  9 10 11]]

# flatten
matrix = np.array([[1, 2], [3, 4]])
print(matrix.flatten())  # [1 2 3 4]

# 转置
print(matrix.T)
# [[1 3]
#  [2 4]]
```

## 数学函数

```python
x = np.array([0, 1, 2, 3, 4])

print(np.exp(x))    # 指数
print(np.log(x + 1))  # 对数
print(np.sqrt(x))   # 平方根
print(np.sin(x))    # 正弦
print(np.abs(-5))   # 绝对值
```

## 线性代数

```python
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

# 矩阵乘法
print(A @ B)
# [[19 22]
#  [43 50]]

# 逆矩阵
print(np.linalg.inv(A))

# 行列式
print(np.linalg.det(A))

# 特征值
eigenvalues, eigenvectors = np.linalg.eig(A)
```

## 实战示例

```python
# 生成学生成绩
np.random.seed(42)
n_students = 100

math_scores = np.random.normal(75, 15, n_students).clip(0, 100)
english_scores = np.random.normal(70, 12, n_students).clip(0, 100)
python_scores = np.random.normal(80, 18, n_students).clip(0, 100)

# 按列合并
scores = np.column_stack([math_scores, english_scores, python_scores])

# 统计分析
print(f"各科平均分: {scores.mean(axis=0)}")
print(f"各科最高分: {scores.max(axis=0)}")
print(f"各科最低分: {scores.min(axis=0)}")

# 找出Python前5名
top5_python_idx = np.argsort(scores[:, 2])[-5:][::-1]
print(f"Python前5名成绩: {scores[top5_python_idx, 2]}")

# 计算每个学生的平均分
avg_scores = scores.mean(axis=1)
print(f"平均分最高的学生: {avg_scores.max():.1f}")
```
