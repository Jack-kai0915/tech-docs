# 字符串操作

## 字符串基础

```python
# 字符串定义
s1 = 'Hello'
s2 = "World"
s3 = '''多行
字符串'''
s4 = """另一种
多行字符串"""

# 转义字符
print("Hello\tWorld")   # Hello	World（制表符）
print("Hello\nWorld")   # Hello
                        # World（换行）
print("Hello\\World")   # Hello\World（反斜杠）
print("Hello\"World")   # Hello"World（引号）

# 原始字符串（不转义）
print(r"C:\new\test")   # C:\new\test
```

## 字符串索引与切片

```python
s = "Hello, World!"

# 索引（从0开始）
print(s[0])     # H
print(s[-1])    # !（最后一个字符）

# 切片 [start:end:step]
print(s[0:5])   # Hello（索引0到4）
print(s[7:12])  # World
print(s[:5])    # Hello（从头开始）
print(s[7:])    # World!（到结尾）
print(s[::2])   # Hlo ol!（每隔一个）
print(s[::-1])  # !dlroW ,olleH（反转）
```

## 常用方法

```python
s = "  Hello, World!  "

# 大小写转换
print(s.upper())        # "  HELLO, WORLD!  "
print(s.lower())        # "  hello, world!  "
print(s.title())        # "  Hello, World!  "
print(s.capitalize())   # "  hello, world!  "
print(s.swapcase())     # "  hELLO, wORLD!  "

# 去除空白
print(s.strip())        # "Hello, World!"
print(s.lstrip())       # "Hello, World!  "
print(s.rstrip())       # "  Hello, World!"
print(s.strip(" !"))    # "Hello, World"

# 查找与替换
text = "Hello, World!"
print(text.find("World"))     # 7（返回索引）
print(text.find("Python"))    # -1（未找到）
print(text.count("l"))        # 3
print(text.replace("World", "Python"))  # "Hello, Python!"
print(text.startswith("Hello"))  # True
print(text.endswith("!"))        # True

# 分割与连接
csv = "apple,banana,cherry"
print(csv.split(","))    # ['apple', 'banana', 'cherry']

words = ["Hello", "World"]
print(" ".join(words))   # "Hello World"
print("-".join(words))   # "Hello-World"

# 判断方法
print("hello".isalpha())     # True（全是字母）
print("123".isdigit())       # True（全是数字）
print("hello123".isalnum())  # True（字母或数字）
print("  ".isspace())        # True（全是空白）
print("Hello".isupper())     # False
print("HELLO".isupper())     # True
```

## 字符串格式化

### f-string（推荐）

```python
name = "Alice"
age = 25
score = 95.5

# 基础用法
print(f"我是{name}，今年{age}岁")
# 输出：我是Alice，今年25岁

# 表达式
print(f"明年{age + 1}岁")
# 输出：明年26岁

# 格式化数字
print(f"分数：{score:.1f}")      # 95.5（保留1位小数）
print(f"百分比：{0.856:.1%}")    # 85.6%
print(f"金额：{1234567:,}")      # 1,234,567（千位分隔符）
print(f"编号：{42:05d}")         # 00042（补零）

# 对齐
print(f"{'左对齐':<10}|")       # 左对齐      |
print(f"{'右对齐':>10}|")       #       右对齐|
print(f"{'居中':^10}|")         #     居中    |
print(f"{'填充':*^10}|")        # ****填充****|

# 调试技巧
x = 10
print(f"{x=}")                  # x=10
print(f"{x + 5=}")              # x + 5=15
```

### format() 方法

```python
# 位置参数
print("{} is {}".format("Python", "awesome"))
# Python is awesome

# 索引参数
print("{0} {1} {0}".format("Hello", "World"))
# Hello World Hello

# 命名参数
print("{name} is {age}".format(name="Alice", age=25))

# 格式化
print("{:.2f}".format(3.14159))  # 3.14
```

### % 格式化（旧式）

```python
name = "Alice"
age = 25

print("我是%s，今年%d岁" % (name, age))
# 我是Alice，今年25岁

print("分数：%.1f" % 95.5)  # 分数：95.5
```

## 编码与解码

```python
s = "Hello, 你好"

# 编码（字符串→字节）
encoded = s.encode("utf-8")
print(encoded)      # b'Hello, \xe4\xbd\xa0\xe5\xa5\xbd'
print(type(encoded))  # <class 'bytes'>

# 解码（字节→字符串）
decoded = encoded.decode("utf-8")
print(decoded)      # "Hello, 你好"

# 其他编码
encoded_gbk = s.encode("gbk")
print(encoded_gbk.decode("gbk"))
```

## 实用技巧

```python
# 检查子串
if "Python" in "I love Python":
    print("找到Python")

# 字符串反转
s = "Hello"
reversed_s = s[::-1]  # "olleH"

# 统计字符出现次数
text = "hello world"
print(text.count("l"))  # 3

# 提取数字
import re
text = "订单号123，金额456.78元"
numbers = re.findall(r"\d+\.?\d*", text)
print(numbers)  # ['123', '456.78']

# 字符串填充
print("5".zfill(3))      # "005"
print("hello".center(10, "*"))  # "**hello***"
```
