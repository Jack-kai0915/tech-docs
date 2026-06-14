# 字典 Dict

## 创建字典

```python
# 空字典
empty_dict = {}

# 从数据创建
person = {
    "name": "Alice",
    "age": 25,
    "city": "Beijing"
}

# dict() 构造函数
person = dict(name="Alice", age=25, city="Beijing")

# 从键值对列表创建
items = [("a", 1), ("b", 2), ("c", 3)]
d = dict(items)

# 字典推导式
squares = {x: x**2 for x in range(5)}
print(squares)  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}
```

## 访问元素

```python
person = {"name": "Alice", "age": 25, "city": "Beijing"}

# 通过键访问
print(person["name"])  # Alice

# 安全访问（键不存在时返回默认值）
print(person.get("email", "未设置"))  # 未设置

# 检查键是否存在
if "name" in person:
    print("存在")

# 获取所有键、值、键值对
print(person.keys())    # dict_keys(['name', 'age', 'city'])
print(person.values())  # dict_values(['Alice', 25, 'Beijing'])
print(person.items())   # dict_items([('name', 'Alice'), ('age', 25), ('city', 'Beijing')])
```

## 修改字典

```python
person = {"name": "Alice", "age": 25}

# 添加/修改
person["email"] = "alice@example.com"  # 添加
person["age"] = 26                     # 修改

# 批量更新
person.update({"phone": "123456", "city": "Beijing"})

# setdefault：键不存在时设置默认值
person.setdefault("score", 0)  # 如果score不存在，设置为0

# 删除
del person["phone"]           # 删除指定键
popped = person.pop("city")   # 删除并返回值
popped = person.pop("xxx", None)  # 键不存在时返回默认值
person.clear()                # 清空字典
```

## 遍历字典

```python
person = {"name": "Alice", "age": 25, "city": "Beijing"}

# 遍历键
for key in person:
    print(key)

# 遍历值
for value in person.values():
    print(value)

# 遍历键值对
for key, value in person.items():
    print(f"{key}: {value}")

# 带索引遍历
for i, (key, value) in enumerate(person.items()):
    print(f"{i+1}. {key}: {value}")
```

## 嵌套字典

```python
students = {
    "alice": {
        "name": "Alice",
        "scores": {"math": 95, "english": 87}
    },
    "bob": {
        "name": "Bob",
        "scores": {"math": 82, "english": 91}
    }
}

# 访问嵌套值
print(students["alice"]["scores"]["math"])  # 95

# 遍历嵌套字典
for username, info in students.items():
    print(f"\n{info['name']}:")
    for subject, score in info["scores"].items():
        print(f"  {subject}: {score}")
```

## 字典推导式

```python
# 基础推导式
squares = {x: x**2 for x in range(6)}
print(squares)  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# 带条件
even_squares = {x: x**2 for x in range(10) if x % 2 == 0}
print(even_squares)  # {0: 0, 2: 4, 4: 16, 6: 36, 8: 64}

# 键值互换
original = {"a": 1, "b": 2, "c": 3}
swapped = {v: k for k, v in original.items()}
print(swapped)  # {1: 'a', 2: 'b', 3: 'c'}

# 过滤
prices = {"apple": 5, "banana": 3, "cherry": 8, "date": 12}
expensive = {k: v for k, v in prices.items() if v > 5}
print(expensive)  # {'cherry': 8, 'date': 12}
```

## 实用技巧

```python
# 字典合并（Python 3.9+）
dict1 = {"a": 1, "b": 2}
dict2 = {"b": 3, "c": 4}
merged = dict1 | dict2  # {'a': 1, 'b': 3, 'c': 4}

# 统计字符频率
text = "hello world"
char_count = {}
for char in text:
    char_count[char] = char_count.get(char, 0) + 1
print(char_count)  # {'h': 1, 'e': 1, 'l': 3, 'o': 2, ...}

# 使用 Counter（更简洁）
from collections import Counter
char_count = Counter(text)
print(char_count)  # Counter({'l': 3, 'o': 2, ...})

# 字典排序
prices = {"apple": 5, "banana": 3, "cherry": 8}
sorted_by_price = dict(sorted(prices.items(), key=lambda x: x[1]))
print(sorted_by_price)  # {'banana': 3, 'apple': 5, 'cherry': 8}

# 默认字典
from collections import defaultdict
word_count = defaultdict(int)
for word in ["hello", "world", "hello"]:
    word_count[word] += 1
print(dict(word_count))  # {'hello': 2, 'world': 1}

# 字典用于缓存
def fibonacci_dict(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci_dict(n-1) + fibonacci_dict(n-2)
    return memo[n]
```

## 实战示例

```python
# 学生成绩管理系统
students = {
    "Alice": {"math": 95, "english": 87, "python": 92},
    "Bob": {"math": 82, "english": 91, "python": 88},
    "Charlie": {"math": 78, "english": 85, "python": 95}
}

# 计算每个学生的平均分
averages = {}
for name, scores in students.items():
    avg = sum(scores.values()) / len(scores)
    averages[name] = round(avg, 1)

print("平均分:", averages)

# 找出每科最高分的学生
for subject in ["math", "english", "python"]:
    top_student = max(students.items(), key=lambda x: x[1][subject])
    print(f"{subject}最高分: {top_student[0]} ({top_student[1][subject]})")

# 成绩排名
ranking = sorted(averages.items(), key=lambda x: x[1], reverse=True)
for rank, (name, avg) in enumerate(ranking, 1):
    print(f"第{rank}名: {name} (平均{avg}分)")
```
