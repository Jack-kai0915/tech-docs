# 参数与返回值

## 参数类型

### 位置参数

```python
def greet(name, message):
    print(f"{message}, {name}!")

greet("Alice", "Hello")  # Hello, Alice!
```

### 关键字参数

```python
def greet(name, message):
    print(f"{message}, {name}!")

greet(message="Hi", name="Bob")  # Hi, Bob!
```

### 默认参数

```python
def greet(name, message="Hello"):
    print(f"{message}, {name}!")

greet("Alice")          # Hello, Alice!
greet("Bob", "Hi")      # Hi, Bob!

# 注意：默认参数必须在非默认参数后面
# def greet(message="Hello", name):  # ❌ 语法错误
```

### 可变位置参数 *args

```python
def add(*args):
    print(type(args))  # <class 'tuple'>
    return sum(args)

print(add(1, 2, 3))      # 6
print(add(1, 2, 3, 4, 5))  # 15

# 解包参数
numbers = [1, 2, 3]
print(add(*numbers))  # 6
```

### 可变关键字参数 **kwargs

```python
def print_info(**kwargs):
    print(type(kwargs))  # <class 'dict'>
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="Alice", age=25, city="Beijing")
# name: Alice
# age: 25
# city: Beijing

# 解包参数
info = {"name": "Bob", "age": 23}
print_info(**info)
```

### 参数组合

```python
def func(a, b, c=10, *args, **kwargs):
    print(f"a={a}, b={b}, c={c}")
    print(f"args={args}")
    print(f"kwargs={kwargs}")

func(1, 2, 3, 4, 5, x=6, y=7)
# a=1, b=2, c=3
# args=(4, 5)
# kwargs={'x': 6, 'y': 7}

# 仅限关键字参数
def func(a, b, *, keyword_only):
    print(a, b, keyword_only)

func(1, 2, keyword_only=3)  # 1 2 3
# func(1, 2, 3)  # ❌ TypeError
```

## 返回值

### 单个返回值

```python
def square(n):
    return n ** 2

result = square(5)
print(result)  # 25
```

### 多个返回值

```python
def min_max(numbers):
    return min(numbers), max(numbers)

minimum, maximum = min_max([3, 1, 4, 1, 5, 9])
print(f"最小值: {minimum}, 最大值: {maximum}")

# 返回字典
def get_student_info(name, score):
    return {
        "name": name,
        "score": score,
        "grade": "A" if score >= 90 else "B"
    }

student = get_student_info("Alice", 95)
print(student)
```

### 提前返回

```python
def divide(a, b):
    if b == 0:
        return None  # 提前返回
    return a / b

# 多条件返回
def classify_age(age):
    if age < 0:
        return "无效年龄"
    if age < 18:
        return "未成年"
    if age < 60:
        return "成年人"
    return "老年人"
```

### 返回函数

```python
def create_greeting(greeting):
    def greet(name):
        return f"{greeting}, {name}!"
    return greet

hello = create_greeting("Hello")
hi = create_greeting("Hi")

print(hello("Alice"))  # Hello, Alice!
print(hi("Bob"))       # Hi, Bob!
```

## 参数解包

```python
# 列表解包
def add(a, b, c):
    return a + b + c

numbers = [1, 2, 3]
print(add(*numbers))  # 6

# 字典解包
def greet(name, age):
    print(f"{name} is {age}")

info = {"name": "Alice", "age": 25}
greet(**info)  # Alice is 25
```

## 实用技巧

```python
# 参数验证
def set_age(age):
    if not isinstance(age, int):
        raise TypeError("年龄必须是整数")
    if age < 0 or age > 150:
        raise ValueError("年龄必须在0-150之间")
    return age

# 可选参数模式
def connect(host, port=80, timeout=30, retries=3):
    print(f"连接到 {host}:{port}")
    print(f"超时: {timeout}, 重试: {retries}")

connect("example.com")
connect("example.com", 443, timeout=60)

# 参数工厂
def create_validator(min_val=None, max_val=None):
    def validate(value):
        if min_val is not None and value < min_val:
            return False
        if max_val is not None and value > max_val:
            return False
        return True
    return validate

is_positive = create_validator(min_val=0)
print(is_positive(5))   # True
print(is_positive(-1))  # False

age_validator = create_validator(min_val=0, max_val=150)
print(age_validator(25))   # True
print(age_validator(200))  # False
```
