# 装饰器

## 基础装饰器

```python
# 装饰器是一个函数，它接受一个函数并返回一个函数
def my_decorator(func):
    def wrapper():
        print("函数执行前")
        func()
        print("函数执行后")
    return wrapper

@my_decorator
def say_hello():
    print("Hello!")

say_hello()
# 输出：
# 函数执行前
# Hello!
# 函数执行后
```

## 带参数的装饰器

```python
def decorator_with_args(func):
    def wrapper(*args, **kwargs):
        print(f"调用函数: {func.__name__}")
        print(f"参数: {args}, {kwargs}")
        result = func(*args, **kwargs)
        print(f"结果: {result}")
        return result
    return wrapper

@decorator_with_args
def add(a, b):
    return a + b

add(3, 5)
# 输出：
# 调用函数: add
# 参数: (3, 5), {}
# 结果: 8
```

## 保留原函数信息

```python
from functools import wraps

def my_decorator(func):
    @wraps(func)  # 保留原函数的元信息
    def wrapper(*args, **kwargs):
        """wrapper 函数的文档"""
        return func(*args, **kwargs)
    return wrapper

@my_decorator
def greet(name):
    """问候函数"""
    print(f"Hello, {name}!")

print(greet.__name__)  # greet（而不是 wrapper）
print(greet.__doc__)   # 问候函数
```

## 常用装饰器

### @property

```python
class Circle:
    def __init__(self, radius):
        self._radius = radius
    
    @property
    def radius(self):
        """获取半径"""
        return self._radius
    
    @radius.setter
    def radius(self, value):
        """设置半径"""
        if value < 0:
            raise ValueError("半径不能为负数")
        self._radius = value
    
    @property
    def area(self):
        """计算面积"""
        return 3.14159 * self._radius ** 2

c = Circle(5)
print(c.radius)    # 5
print(c.area)      # 78.53975
c.radius = 10
print(c.area)      # 314.159
```

### @staticmethod 和 @classmethod

```python
class MathUtils:
    @staticmethod
    def add(a, b):
        """静态方法：不需要实例"""
        return a + b
    
    @classmethod
    def class_name(cls):
        """类方法：访问类信息"""
        return cls.__name__

print(MathUtils.add(3, 5))    # 8
print(MathUtils.class_name())  # MathUtils
```

### @functools.lru_cache

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# 第一次调用会计算
print(fibonacci(100))  # 快速计算

# 第二次调用使用缓存
print(fibonacci(100))  # 更快
```

## 装饰器工厂

```python
def retry(max_attempts=3, delay=1):
    """重试装饰器"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    print(f"尝试 {attempt + 1} 失败: {e}")
                    import time
                    time.sleep(delay)
        return wrapper
    return decorator

@retry(max_attempts=3, delay=2)
def unstable_function():
    import random
    if random.random() < 0.7:
        raise ValueError("随机失败")
    return "成功"

# 使用
result = unstable_function()
```

## 类装饰器

```python
# 使用类作为装饰器
class CountCalls:
    def __init__(self, func):
        self.func = func
        self.num_calls = 0
    
    def __call__(self, *args, **kwargs):
        self.num_calls += 1
        print(f"调用次数: {self.num_calls}")
        return self.func(*args, **kwargs)

@CountCalls
def say_hello():
    print("Hello!")

say_hello()  # 调用次数: 1, Hello!
say_hello()  # 调用次数: 2, Hello!
```

## 实战示例

```python
# 计时装饰器
import time
from functools import wraps

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} 执行时间: {end - start:.4f}秒")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)
    return "完成"

# 日志装饰器
import logging

def log_calls(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        logging.info(f"调用 {func.__name__}，参数: {args}, {kwargs}")
        result = func(*args, **kwargs)
        logging.info(f"{func.__name__} 返回: {result}")
        return result
    return wrapper

# 权限检查装饰器
def require_permission(permission):
    def decorator(func):
        @wraps(func)
        def wrapper(user, *args, **kwargs):
            if permission not in user.get("permissions", []):
                raise PermissionError(f"需要 {permission} 权限")
            return func(user, *args, **kwargs)
        return wrapper
    return decorator

@require_permission("admin")
def delete_user(user, user_id):
    print(f"删除用户 {user_id}")

# 使用
admin_user = {"name": "Admin", "permissions": ["admin", "read"]}
delete_user(admin_user, 123)  # 成功
```
