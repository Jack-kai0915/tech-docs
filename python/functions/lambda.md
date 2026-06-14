# Lambda 表达式

## 基础 Lambda

```python
# 普通函数
def square(x):
    return x ** 2

# 等价的 lambda
square = lambda x: x ** 2
print(square(5))  # 25

# 多个参数
add = lambda a, b: a + b
print(add(3, 5))  # 8

# 带默认参数
greet = lambda name, msg="Hello": f"{msg}, {name}!"
print(greet("Alice"))        # Hello, Alice!
print(greet("Bob", "Hi"))   # Hi, Bob!
```

## Lambda 使用场景

### 排序键

```python
# 按年龄排序
students = [("Alice", 25), ("Bob", 23), ("Charlie", 28)]
sorted_students = sorted(students, key=lambda x: x[1])
print(sorted_students)  # [('Bob', 23), ('Alice', 25), ('Charlie', 28)]

# 按字典值排序
scores = {"Alice": 95, "Bob": 87, "Charlie": 92}
sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
print(sorted_scores)  # [('Alice', 95), ('Charlie', 92), ('Bob', 87)]
```

### map() 和 filter()

```python
numbers = [1, 2, 3, 4, 5]

# map：映射
squared = list(map(lambda x: x**2, numbers))
print(squared)  # [1, 4, 9, 16, 25]

# filter：过滤
even = list(filter(lambda x: x % 2 == 0, numbers))
print(even)  # [2, 4]

# 等价的列表推导式
squared = [x**2 for x in numbers]
even = [x for x in numbers if x % 2 == 0]
```

### 条件表达式

```python
# 成绩评级
score = 85
grade = lambda s: "A" if s >= 90 else "B" if s >= 80 else "C" if s >= 70 else "D"
print(grade(score))  # B

# 数据转换
data = [1, -2, 3, -4, 5]
absolute = list(map(lambda x: abs(x), data))
print(absolute)  # [1, 2, 3, 4, 5]
```

## 高阶 Lambda

```python
# 返回函数的 lambda
def create_multiplier(n):
    return lambda x: x * n

double = create_multiplier(2)
triple = create_multiplier(3)

print(double(5))  # 10
print(triple(5))  # 15

# 函数组合
compose = lambda f, g: lambda x: f(g(x))
add_one = lambda x: x + 1
double = lambda x: x * 2

add_then_double = compose(double, add_one)
print(add_then_double(3))  # (3+1)*2 = 8
```

## Lambda vs Def

```python
# Lambda 适合简单的一行表达式
square = lambda x: x ** 2

# Def 适合复杂的函数
def complex_function(x, y):
    """复杂函数应该用 def"""
    if x > 0:
        result = x ** 2 + y
    else:
        result = x - y
    return result

# Lambda 不能有复杂语句
# lambda x: print(x)  # ❌ 语法错误
# lambda x: if x > 0: return x  # ❌ 语法错误
```

## 实战示例

```python
# 数据处理
students = [
    {"name": "Alice", "score": 95, "age": 25},
    {"name": "Bob", "score": 87, "age": 23},
    {"name": "Charlie", "score": 92, "age": 28}
]

# 按成绩排序
by_score = sorted(students, key=lambda s: s["score"], reverse=True)

# 按多条件排序
by_age_score = sorted(students, key=lambda s: (s["age"], -s["score"]))

# 过滤数据
high_scorers = list(filter(lambda s: s["score"] >= 90, students))

# 映射数据
names = list(map(lambda s: s["name"], students))

# 使用列表推导式（更Pythonic）
by_score = sorted(students, key=lambda s: s["score"], reverse=True)
high_scorers = [s for s in students if s["score"] >= 90]
names = [s["name"] for s in students]

# Pandas 中使用
import pandas as pd
df = pd.DataFrame(students)
df["grade"] = df["score"].apply(lambda x: "A" if x >= 90 else "B")
```
