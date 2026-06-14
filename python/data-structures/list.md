# 列表 List

## 创建列表

```python
# 空列表
empty_list = []

# 从数据创建
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", 3.14, True, None]

# 从 range 创建
nums = list(range(10))  # [0, 1, 2, ..., 9]

# 列表推导式
squares = [x**2 for x in range(10)]
```

## 索引与切片

```python
fruits = ["apple", "banana", "cherry", "date", "elderberry"]

# 索引
print(fruits[0])      # apple
print(fruits[-1])     # elderberry

# 切片
print(fruits[1:3])    # ['banana', 'cherry']
print(fruits[:3])     # ['apple', 'banana', 'cherry']
print(fruits[2:])     # ['cherry', 'date', 'elderberry']
print(fruits[::2])    # ['apple', 'cherry', 'elderberry']
print(fruits[::-1])   # ['elderberry', 'date', 'cherry', 'banana', 'apple']

# 列表是可变的
fruits[0] = "avocado"
print(fruits)  # ['avocado', 'banana', 'cherry', 'date', 'elderberry']
```

## 常用方法

```python
fruits = ["apple", "banana"]

# 添加元素
fruits.append("cherry")           # 末尾添加
fruits.insert(1, "blueberry")    # 指定位置插入
fruits.extend(["date", "fig"])   # 扩展列表
print(fruits)  # ['apple', 'blueberry', 'banana', 'cherry', 'date', 'fig']

# 删除元素
fruits.remove("banana")   # 删除指定值
popped = fruits.pop()     # 删除并返回最后一个
popped = fruits.pop(0)    # 删除并返回指定位置
del fruits[0]             # 删除指定位置
fruits.clear()            # 清空列表

# 查找
fruits = ["apple", "banana", "cherry"]
print(fruits.index("banana"))  # 1（返回索引）
print(fruits.count("apple"))   # 1（出现次数）
print("apple" in fruits)       # True

# 排序
numbers = [3, 1, 4, 1, 5, 9, 2, 6]
numbers.sort()            # 原地排序
print(numbers)            # [1, 1, 2, 3, 4, 5, 6, 9]

numbers.sort(reverse=True)  # 降序
print(numbers)              # [9, 6, 5, 4, 3, 2, 1, 1]

sorted_numbers = sorted(numbers)  # 返回新列表
print(sorted_numbers)  # [1, 1, 2, 3, 4, 5, 6, 9]

# 反转
fruits.reverse()
print(fruits)

# 复制
fruits_copy = fruits.copy()
fruits_copy2 = fruits[:]  # 切片复制
```

## 列表运算

```python
list1 = [1, 2, 3]
list2 = [4, 5, 6]

# 拼接
combined = list1 + list2  # [1, 2, 3, 4, 5, 6]

# 重复
repeated = list1 * 3  # [1, 2, 3, 1, 2, 3, 1, 2, 3]

# 长度
print(len(list1))  # 3

# 最大值、最小值、求和
numbers = [3, 1, 4, 1, 5, 9]
print(max(numbers))  # 9
print(min(numbers))  # 1
print(sum(numbers))  # 23
```

## 列表嵌套

```python
# 二维列表（矩阵）
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

# 访问元素
print(matrix[0][1])  # 2

# 遍历
for row in matrix:
    for item in row:
        print(item, end=" ")
    print()

# 展平列表
flattened = [item for row in matrix for item in row]
print(flattened)  # [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

## 实用技巧

```python
# 列表去重
numbers = [1, 2, 2, 3, 3, 3]
unique = list(set(numbers))  # [1, 2, 3]（顺序可能改变）
unique_ordered = list(dict.fromkeys(numbers))  # [1, 2, 3]（保持顺序）

# 列表压缩与解压
coords = [(1, 2), (3, 4), (5, 6)]
x_coords, y_coords = zip(*coords)
print(x_coords)  # (1, 3, 5)
print(y_coords)  # (2, 4, 6)

# 列表过滤
numbers = [1, -2, 3, -4, 5]
positive = [n for n in numbers if n > 0]  # [1, 3, 5]

# 列表映射
names = ["alice", "bob", "charlie"]
upper_names = [name.upper() for name in names]  # ['ALICE', 'BOB', 'CHARLIE']

# 列表展开
nested = [[1, 2], [3, 4], [5, 6]]
flat = [item for sublist in nested for item in sublist]
print(flat)  # [1, 2, 3, 4, 5, 6]
```
