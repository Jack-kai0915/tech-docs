# 输入输出

## 输出 print()

```python
# 基础输出
print("Hello, World!")

# 多个值
print("姓名:", "张三", "年龄:", 25)
# 输出：姓名: 张三 年龄: 25

# 自定义分隔符
print("Hello", "World", sep=", ")  # Hello, World
print("a", "b", "c", sep="-")      # a-b-c

# 自定义结束符
print("Hello", end=" ")
print("World")
# 输出：Hello World（不换行）

# 输出到文件
with open("output.txt", "w") as f:
    print("写入文件", file=f)
```

## 输入 input()

```python
# 基础输入
name = input("请输入你的名字: ")
print(f"你好, {name}!")

# 输入数字（input 返回字符串）
age = int(input("请输入你的年龄: "))
birth_year = 2024 - age
print(f"你大约出生于 {birth_year} 年")

# 输入浮点数
height = float(input("请输入你的身高(m): "))

# 输入多个值
x, y = input("输入两个数(用空格分隔): ").split()
x, y = int(x), int(y)
print(f"和: {x + y}")

# 更简洁的写法
a, b = map(int, input("输入两个数: ").split())
```

## 格式化输出

```python
# 对齐与宽度
name = "Alice"
score = 95

print(f"{'姓名':<10}{'分数':>10}")
print(f"{name:<10}{score:>10}")
# 姓名              分数
# Alice            95

# 表格输出
data = [
    ("Alice", 95, "A"),
    ("Bob", 87, "B"),
    ("Charlie", 92, "A+")
]

print(f"{'姓名':<10}{'分数':>6}{'等级':>6}")
print("-" * 22)
for name, score, grade in data:
    print(f"{name:<10}{score:>6}{grade:>6}")
```

## 文件输出

```python
# 写入文本
with open("output.txt", "w", encoding="utf-8") as f:
    f.write("第一行\n")
    f.write("第二行\n")
    f.writelines(["第三行\n", "第四行\n"])

# 追加内容
with open("output.txt", "a", encoding="utf-8") as f:
    f.write("追加的内容\n")

# 格式化写入
data = {"name": "Alice", "score": 95}
with open("output.txt", "w", encoding="utf-8") as f:
    f.write(f"姓名: {data['name']}\n")
    f.write(f"分数: {data['score']}\n")
```

## JSON 输出

```python
import json

data = {
    "name": "Alice",
    "age": 25,
    "scores": [95, 87, 92]
}

# 转换为 JSON 字符串
json_str = json.dumps(data, ensure_ascii=False, indent=2)
print(json_str)

# 写入 JSON 文件
with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# 读取 JSON 文件
with open("data.json", "r", encoding="utf-8") as f:
    loaded_data = json.load(f)
    print(loaded_data)
```

## 实用技巧

```python
# 彩色输出（需要 colorama 库）
# pip install colorama
from colorama import init, Fore, Back, Style
init()

print(Fore.RED + "红色文字")
print(Fore.GREEN + "绿色文字")
print(Style.RESET_ALL)

# 进度条
import sys
for i in range(101):
    print(f"\r进度: {i}%", end="")
    sys.stdout.flush()
print()  # 换行

# 打印调试
import pprint
data = {"users": [{"name": "Alice", "scores": [95, 87]}]}
pprint.pprint(data, indent=2)
```
