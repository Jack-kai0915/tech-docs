# 模块与包

## 模块基础

```python
# 创建模块：my_module.py
def greet(name):
    return f"Hello, {name}!"

def add(a, b):
    return a + b

PI = 3.14159

# 导入模块
import my_module

print(my_module.greet("Alice"))
print(my_module.add(3, 5))
print(my_module.PI)

# 导入特定函数
from my_module import greet, add
print(greet("Bob"))

# 导入所有（不推荐）
from my_module import *

# 别名
import numpy as np
import pandas as pd
from datetime import datetime as dt
```

## 包结构

```
my_package/
├── __init__.py
├── module1.py
├── module2.py
└── sub_package/
    ├── __init__.py
    ├── module3.py
    └── module4.py
```

```python
# __init__.py 可以为空，或导出接口
# my_package/__init__.py
from .module1 import func1
from .module2 import func2

# 使用包
from my_package import func1, func2
from my_package.sub_package import module3
```

## 内置模块

### os 模块

```python
import os

# 文件路径
print(os.path.exists("file.txt"))  # 文件是否存在
print(os.path.isfile("file.txt"))  # 是否是文件
print(os.path.isdir("folder"))     # 是否是目录

# 目录操作
os.makedirs("new_folder", exist_ok=True)  # 创建目录
os.listdir(".")  # 列出目录内容

# 环境变量
print(os.environ.get("PATH"))

# 系统信息
print(os.name)  # nt（Windows）
print(os.getcwd())  # 当前目录
```

### datetime 模块

```python
from datetime import datetime, timedelta

# 当前时间
now = datetime.now()
print(now)  # 2024-01-15 10:30:00.123456

# 格式化
print(now.strftime("%Y-%m-%d %H:%M:%S"))
print(now.strftime("%Y年%m月%d日"))

# 解析字符串
date = datetime.strptime("2024-01-15", "%Y-%m-%d")

# 时间运算
tomorrow = now + timedelta(days=1)
next_week = now + timedelta(weeks=1)
diff = tomorrow - now
print(diff.days)  # 1
```

### re 模块（正则表达式）

```python
import re

text = "我的电话是13812345678，邮箱是test@example.com"

# 查找
pattern = r"\d{11}"
match = re.search(pattern, text)
if match:
    print(match.group())  # 13812345678

# 查找所有
emails = re.findall(r"[\w.]+@[\w.]+", text)
print(emails)  # ['test@example.com']

# 替换
new_text = re.sub(r"\d{11}", "****", text)
print(new_text)

# 分组
pattern = r"(\d{3})(\d{4})(\d{4})"
match = re.search(pattern, "13812345678")
if match:
    print(match.group(1))  # 138
    print(match.group(2))  # 1234
    print(match.group(3))  # 5678
```

### json 模块

```python
import json

# Python 对象 → JSON 字符串
data = {"name": "Alice", "age": 25}
json_str = json.dumps(data, ensure_ascii=False, indent=2)
print(json_str)

# JSON 字符串 → Python 对象
loaded = json.loads(json_str)
print(loaded)

# 读写 JSON 文件
with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open("data.json", "r", encoding="utf-8") as f:
    loaded = json.load(f)
```

## 第三方包

```bash
# 安装包
pip install requests
pip install flask
pip install numpy pandas

# 升级包
pip install --upgrade requests

# 卸载包
pip uninstall requests

# 查看已安装包
pip list

# 导出依赖
pip freeze > requirements.txt

# 从文件安装
pip install -r requirements.txt
```

## 实战示例

```python
# 创建工具包
# myutils/
# ├── __init__.py
# ├── string_utils.py
# └── file_utils.py

# myutils/string_utils.py
def capitalize_words(s):
    return " ".join(word.capitalize() for word in s.split())

def count_words(s):
    return len(s.split())

# myutils/__init__.py
from .string_utils import capitalize_words, count_words

# 使用
from myutils import capitalize_words
print(capitalize_words("hello world"))  # Hello World
```
