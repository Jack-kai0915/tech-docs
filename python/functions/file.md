# 文件操作

## 读写文本文件

```python
# 写入文件
with open("output.txt", "w", encoding="utf-8") as f:
    f.write("第一行\n")
    f.write("第二行\n")
    f.writelines(["第三行\n", "第四行\n"])

# 读取文件
with open("output.txt", "r", encoding="utf-8") as f:
    content = f.read()  # 读取全部内容
    print(content)

# 逐行读取
with open("output.txt", "r", encoding="utf-8") as f:
    for line in f:
        print(line.strip())  # strip() 去除换行符

# 读取所有行到列表
with open("output.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()  # ['第一行\n', '第二行\n', ...]

# 追加内容
with open("output.txt", "a", encoding="utf-8") as f:
    f.write("追加的内容\n")
```

## 文件模式

```python
# r: 读取（默认）
# w: 写入（覆盖）
# a: 追加
# x: 创建（文件已存在则报错）
# b: 二进制模式
# t: 文本模式（默认）

# 读写模式
with open("output.txt", "r+", encoding="utf-8") as f:
    content = f.read()
    f.write("新内容")

# 二进制模式
with open("image.png", "rb") as f:
    data = f.read()

with open("copy.png", "wb") as f:
    f.write(data)
```

## 路径操作

```python
import os
from pathlib import Path

# os.path 方式
path = "/home/user/documents/file.txt"
print(os.path.dirname(path))   # /home/user/documents
print(os.path.basename(path))  # file.txt
print(os.path.splitext(path))  # ('/home/user/documents/file', '.txt')
print(os.path.exists(path))    # True/False

# pathlib 方式（推荐）
path = Path("/home/user/documents/file.txt")
print(path.parent)     # /home/user/documents
print(path.name)       # file.txt
print(path.stem)       # file
print(path.suffix)     # .txt
print(path.exists())   # True/False

# 创建目录
Path("new_folder").mkdir(parents=True, exist_ok=True)

# 遍历目录
for file in Path(".").iterdir():
    print(file.name)

# 递归遍历
for file in Path(".").rglob("*.py"):
    print(file)

# 路径拼接
base = Path("/home/user")
full_path = base / "documents" / "file.txt"
print(full_path)  # /home/user/documents/file.txt
```

## CSV 文件

```python
import csv

# 写入 CSV
with open("data.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["姓名", "年龄", "成绩"])
    writer.writerow(["Alice", 25, 95])
    writer.writerow(["Bob", 23, 87])

# 读取 CSV
with open("data.csv", "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    for row in reader:
        print(row)

# 使用字典读写
with open("data.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(f"{row['姓名']}: {row['成绩']}")
```

## JSON 文件

```python
import json

# 写入 JSON
data = {
    "users": [
        {"name": "Alice", "age": 25},
        {"name": "Bob", "age": 23}
    ]
}

with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# 读取 JSON
with open("data.json", "r", encoding="utf-8") as f:
    loaded = json.load(f)
    print(loaded)
```

## Excel 文件

```python
import pandas as pd

# 读取 Excel
df = pd.read_excel("data.xlsx", sheet_name="Sheet1")

# 写入 Excel
df.to_excel("output.xlsx", index=False)

# 多个 sheet
with pd.ExcelWriter("output.xlsx") as writer:
    df1.to_excel(writer, sheet_name="Sheet1", index=False)
    df2.to_excel(writer, sheet_name="Sheet2", index=False)
```

## 临时文件

```python
import tempfile

# 创建临时文件
with tempfile.NamedTemporaryFile(mode="w", suffix=".txt", delete=False) as f:
    f.write("临时内容")
    temp_path = f.name

print(temp_path)

# 创建临时目录
with tempfile.TemporaryDirectory() as temp_dir:
    print(temp_dir)
    # 在临时目录中创建文件
    temp_file = os.path.join(temp_dir, "test.txt")
```

## 实战示例

```python
import os
from pathlib import Path
import json
import csv

# 日志文件处理
def read_log_file(filename):
    """读取日志文件并统计"""
    log_count = {}
    with open(filename, "r", encoding="utf-8") as f:
        for line in f:
            if "ERROR" in line:
                log_count["error"] = log_count.get("error", 0) + 1
            elif "WARNING" in line:
                log_count["warning"] = log_count.get("warning", 0) + 1
    return log_count

# 批量重命名文件
def batch_rename(directory, pattern):
    """批量重命名文件"""
    for i, file in enumerate(Path(directory).iterdir()):
        if file.is_file():
            new_name = f"{pattern}_{i:03d}{file.suffix}"
            file.rename(file.parent / new_name)

# 配置文件管理
def load_config(config_path):
    """加载配置文件"""
    default_config = {
        "host": "localhost",
        "port": 8080,
        "debug": False
    }
    
    if os.path.exists(config_path):
        with open(config_path, "r", encoding="utf-8") as f:
            config = json.load(f)
            default_config.update(config)
    
    return default_config

# 使用
config = load_config("config.json")
print(config)
```
