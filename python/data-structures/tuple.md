# 元组 Tuple

## 创建元组

```python
# 空元组
empty_tuple = ()

# 从数据创建
colors = ("red", "green", "blue")
numbers = (1, 2, 3, 4, 5)

# 单元素元组（注意逗号）
single = (42,)  # 这是元组
not_tuple = (42)  # 这是整数

# 从列表创建
from_list = tuple([1, 2, 3])

# 元组推导式
squares = tuple(x**2 for x in range(5))
print(squares)  # (0, 1, 4, 9, 16)
```

## 索引与切片

```python
colors = ("red", "green", "blue", "yellow", "purple")

# 索引
print(colors[0])      # red
print(colors[-1])     # purple

# 切片
print(colors[1:3])    # ('green', 'blue')
print(colors[:3])     # ('red', 'green', 'blue')
print(colors[::2])    # ('red', 'blue', 'purple')
print(colors[::-1])   # ('purple', 'yellow', 'blue', 'green', 'red')

# 元组是不可变的
# colors[0] = "orange"  # ❌ TypeError
```

## 常用方法

```python
numbers = (1, 2, 3, 2, 4, 2, 5)

# 查找
print(numbers.index(2))    # 1（第一次出现的索引）
print(numbers.count(2))    # 3（出现次数）

# 长度
print(len(numbers))  # 7

# 最大值、最小值、求和
print(max(numbers))  # 5
print(min(numbers))  # 1
print(sum(numbers))  # 19
```

## 元组运算

```python
tuple1 = (1, 2, 3)
tuple2 = (4, 5, 6)

# 拼接
combined = tuple1 + tuple2  # (1, 2, 3, 4, 5, 6)

# 重复
repeated = tuple1 * 3  # (1, 2, 3, 1, 2, 3, 1, 2, 3)

# 成员测试
print(2 in tuple1)  # True
```

## 元组解包

```python
# 基础解包
point = (10, 20)
x, y = point
print(f"x={x}, y={y}")  # x=10, y=20

# 交换变量
a, b = 1, 2
a, b = b, a
print(a, b)  # 2 1

# 星号解包
first, *middle, last = (1, 2, 3, 4, 5)
print(first)   # 1
print(middle)  # [2, 3, 4]
print(last)    # 5

# 函数返回多个值
def get_min_max(numbers):
    return min(numbers), max(numbers)

minimum, maximum = get_min_max([3, 1, 4, 1, 5, 9])
print(f"最小值: {minimum}, 最大值: {maximum}")
```

## 元组 vs 列表

```python
# 元组优势
# 1. 不可变，可作为字典的键
locations = {
    (40.7128, -74.0060): "New York",
    (51.5074, -0.1278): "London"
}

# 2. 性能更好（占用内存少）

# 3. 可以作为集合的元素
point_set = {(1, 2), (3, 4), (5, 6)}

# 何时用元组
# - 数据不应被修改（坐标、RGB颜色、数据库记录）
# - 作为字典的键
# - 函数返回多个值

# 何时用列表
# - 数据需要修改
# - 需要添加/删除元素
# - 数据是同类型的集合
```

## 命名元组（Python 3.6+）

```python
from collections import namedtuple

# 定义命名元组
Point = namedtuple('Point', ['x', 'y'])
p = Point(10, 20)
print(p.x, p.y)  # 10 20

# 更多字段
Student = namedtuple('Student', ['name', 'age', 'score'])
alice = Student("Alice", 25, 95)
print(f"{alice.name}的成绩是{alice.score}")

# 转换为字典
student_dict = alice._asdict()
print(student_dict)  # {'name': 'Alice', 'age': 25, 'score': 95}

# 替换字段
new_alice = alice._replace(score=100)
print(new_alice)  # Student(name='Alice', age=25, score=100)
```

## 实用技巧

```python
# 元组列表排序
students = [("Alice", 95), ("Bob", 87), ("Charlie", 92)]

# 按成绩排序
sorted_students = sorted(students, key=lambda x: x[1], reverse=True)
print(sorted_students)  # [('Alice', 95), ('Charlie', 92), ('Bob', 87)]

# 元组用于多键排序
data = [("Alice", 25, 95), ("Bob", 23, 87), ("Charlie", 25, 92)]
sorted_data = sorted(data, key=lambda x: (x[1], -x[2]))
# 先按年龄升序，再按成绩降序

# 元组作为字典键（比用列表快）
grid = {}
grid[(0, 0)] = "start"
grid[(1, 2)] = "wall"
print(grid[(0, 0)])  # start
```
