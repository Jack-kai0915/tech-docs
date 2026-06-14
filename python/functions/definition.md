# 函数定义

## 基础函数

```python
# 定义函数
def greet():
    print("Hello, World!")

# 调用函数
greet()  # 输出：Hello, World!

# 带参数的函数
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")  # 输出：Hello, Alice!

# 多个参数
def add(a, b):
    return a + b

result = add(3, 5)
print(result)  # 8
```

## 返回值

```python
# 单个返回值
def square(n):
    return n ** 2

# 多个返回值（返回元组）
def min_max(numbers):
    return min(numbers), max(numbers)

minimum, maximum = min_max([3, 1, 4, 1, 5, 9])
print(f"最小值: {minimum}, 最大值: {maximum}")

# 提前返回
def divide(a, b):
    if b == 0:
        return None  # 提前返回
    return a / b

# 无返回值（返回 None）
def print_info(name):
    print(f"Name: {name}")
    # 隐式返回 None

result = print_info("Alice")
print(result)  # None
```

## 文档字符串

```python
def calculate_bmi(weight, height):
    """
    计算BMI指数
    
    参数:
        weight (float): 体重（kg）
        height (float): 身高（m）
    
    返回:
        float: BMI指数
    
    示例:
        >>> calculate_bmi(70, 1.75)
        22.857142857142858
    """
    return weight / (height ** 2)

# 查看文档
print(calculate_bmi.__doc__)
help(calculate_bmi)
```

## 作用域

```python
# 局部变量
def func():
    x = 10  # 局部变量
    print(x)

func()  # 10
# print(x)  # ❌ NameError

# 全局变量
count = 0

def increment():
    global count  # 声明使用全局变量
    count += 1

increment()
print(count)  # 1

# nonlocal（嵌套函数）
def outer():
    x = 10
    def inner():
        nonlocal x
        x += 1
    inner()
    print(x)  # 11
```

## 递归函数

```python
# 阶乘
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))  # 120

# 斐波那契数列
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# 优化版本（带记忆化）
def fibonacci_memo(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci_memo(n-1) + fibonacci_memo(n-2)
    return memo[n]
```

## 函数作为参数

```python
def apply(func, x, y):
    return func(x, y)

def add(a, b):
    return a + b

def multiply(a, b):
    return a * b

print(apply(add, 3, 5))       # 8
print(apply(multiply, 3, 5))  # 15

# map() 函数
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x**2, numbers))
print(squared)  # [1, 4, 9, 16, 25]

# filter() 函数
numbers = [1, 2, 3, 4, 5, 6]
even = list(filter(lambda x: x % 2 == 0, numbers))
print(even)  # [2, 4, 6]
```

## 高阶函数

```python
# 函数返回函数
def create_multiplier(n):
    def multiplier(x):
        return x * n
    return multiplier

double = create_multiplier(2)
triple = create_multiplier(3)

print(double(5))  # 10
print(triple(5))  # 15

# 闭包
def counter():
    count = 0
    def increment():
        nonlocal count
        count += 1
        return count
    return increment

c = counter()
print(c())  # 1
print(c())  # 2
print(c())  # 3
```

## 实用技巧

```python
# 函数缓存（Python 3.9+）
from functools import lru_cache

@lru_cache(maxsize=128)
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# 类型提示
def greet(name: str) -> str:
    return f"Hello, {name}!"

# 断言
def divide(a, b):
    assert b != 0, "除数不能为零"
    return a / b

# 函数组合
def compose(*funcs):
    def composed(x):
        result = x
        for func in reversed(funcs):
            result = func(result)
        return result
    return composed

add_one = lambda x: x + 1
double = lambda x: x * 2
square = lambda x: x ** 2

transform = compose(square, double, add_one)
print(transform(3))  # (3+1)*2)^2 = 64
```
