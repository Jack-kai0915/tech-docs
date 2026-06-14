# 变量与数据类型

## 变量

变量是存储数据的容器，不需要声明类型。

```python
# 变量赋值
name = "张三"        # 字符串
age = 25             # 整数
height = 175.5       # 浮点数
is_student = True    # 布尔值

# 同时赋值
x, y, z = 1, 2, 3

# 多变量相同值
a = b = c = 0

# 查看变量类型
print(type(name))    # <class 'str'>
print(type(age))     # <class 'int'>
print(type(height))  # <class 'float'>
```

## 命名规则

```python
# ✅ 正确命名
user_name = "Alice"
_private = 100
MAX_SIZE = 256
count2 = 10

# ❌ 错误命名
# 2count = 10      # 不能以数字开头
# my-name = "Bob"  # 不能包含连字符
# class = "Math"   # 不能使用关键字
```

## 数据类型

### 数字类型

```python
# 整数 int
x = 100
y = -50
big = 10 ** 100    # 支持任意大整数

# 浮点数 float
pi = 3.14159
scientific = 1.5e10  # 科学计数法：1.5 × 10^10

# 复数 complex
z = 3 + 4j
print(z.real)      # 3.0 实部
print(z.imag)      # 4.0 虚部
```

### 布尔类型

```python
isTrue = True
isFalse = False

# 布尔值本质是整数
print(True + True)   # 2
print(False * 10)    # 0

# 真值测试
print(bool(1))       # True
print(bool(0))       # False
print(bool(""))      # False（空字符串）
print(bool("hello")) # True
print(bool([]))      # False（空列表）
print(bool([1, 2]))  # True
```

### 字符串类型

```python
# 字符串定义
s1 = 'Hello'
s2 = "World"
s3 = '''多行
字符串'''
s4 = """另一种
多行字符串"""

# 字符串是不可变的
name = "Python"
# name[0] = "J"  # ❌ TypeError

# 字符串拼接
greeting = "Hello" + " " + "World"  # "Hello World"

# 字符串重复
line = "-" * 20  # "--------------------"

# 字符串长度
print(len("Hello"))  # 5
```

## 类型转换

```python
# int() 转换
print(int("123"))      # 123
print(int(3.9))        # 3（截断，不是四舍五入）
print(int(True))       # 1

# float() 转换
print(float("3.14"))   # 3.14
print(float("100"))    # 100.0

# str() 转换
print(str(123))        # "123"
print(str(3.14))       # "3.14"
print(str(True))       # "True"

# bool() 转换
print(bool(1))         # True
print(bool(0))         # False
print(bool(""))        # False
print(bool("0"))       # True（非空字符串）
```

## 动态类型

```python
# Python 是动态类型语言
x = 10          # x 是整数
print(type(x))  # <class 'int'>

x = "hello"     # x 变成字符串
print(type(x))  # <class 'str'>

x = [1, 2, 3]   # x 变成列表
print(type(x))  # <class 'list'>
```
