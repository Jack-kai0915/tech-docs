# 集合 Set

## 创建集合

```python
# 空集合（注意：{} 是空字典）
empty_set = set()

# 从数据创建
fruits = {"apple", "banana", "cherry"}

# 从列表创建（自动去重）
numbers = set([1, 2, 2, 3, 3, 3])
print(numbers)  # {1, 2, 3}

# 集合推导式
squares = {x**2 for x in range(5)}
print(squares)  # {0, 1, 4, 9, 16}
```

## 集合操作

```python
fruits = {"apple", "banana", "cherry"}

# 添加元素
fruits.add("date")          # 添加单个元素
fruits.update(["fig", "grape"])  # 添加多个元素

# 删除元素
fruits.remove("banana")     # 删除（不存在会报错）
fruits.discard("xxx")       # 删除（不存在不报错）
popped = fruits.pop()       # 删除并返回任意元素
fruits.clear()              # 清空

# 成员测试（O(1) 时间复杂度）
print("apple" in fruits)    # True
```

## 集合运算

```python
A = {1, 2, 3, 4, 5}
B = {4, 5, 6, 7, 8}

# 并集（所有元素）
print(A | B)           # {1, 2, 3, 4, 5, 6, 7, 8}
print(A.union(B))      # 同上

# 交集（共同元素）
print(A & B)           # {4, 5}
print(A.intersection(B))

# 差集（A有B没有）
print(A - B)           # {1, 2, 3}
print(A.difference(B))

# 对称差集（不共同的元素）
print(A ^ B)           # {1, 2, 3, 6, 7, 8}
print(A.symmetric_difference(B))
```

## 子集与超集

```python
A = {1, 2, 3}
B = {1, 2, 3, 4, 5}
C = {1, 2}

# 子集
print(C.issubset(A))      # True（C 是 A 的子集）
print(C <= A)              # True

# 超集
print(B.issuperset(A))    # True（B 是 A 的超集）
print(B >= A)              # True

# 真子集/真超集
print(C < A)               # True（C 是 A 的真子集）
print(A < B)               # True
```

## 集合方法

```python
A = {1, 2, 3}
B = {3, 4, 5}

# 复制
C = A.copy()

# 交集更新（修改原集合）
A.intersection_update(B)
print(A)  # {3}

# 差集更新
A = {1, 2, 3}
A.difference_update(B)
print(A)  # {1, 2}

# 对称差集更新
A = {1, 2, 3}
A.symmetric_difference_update(B)
print(A)  # {1, 2, 4, 5}
```

## 不可变集合 frozenset

```python
# frozenset 是不可变的，可以作为字典的键或集合的元素
fs = frozenset([1, 2, 3])

# 可以进行集合运算
fs2 = frozenset([3, 4, 5])
print(fs | fs2)   # frozenset({1, 2, 3, 4, 5})
print(fs & fs2)   # frozenset({3})

# 作为字典的键
distances = {
    frozenset(["A", "B"]): 10,
    frozenset(["B", "C"]): 15
}
print(distances[frozenset(["A", "B"])])  # 10
```

## 实用技巧

```python
# 列表去重
numbers = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4]
unique = list(set(numbers))  # [1, 2, 3, 4]（顺序可能改变）
unique_ordered = list(dict.fromkeys(numbers))  # [1, 2, 3, 4]（保持顺序）

# 快速查找
large_list = list(range(1000000))
large_set = set(large_list)

# set 查找是 O(1)，list 查找是 O(n)
import time
start = time.time()
999999 in large_list  # 慢
print(f"list: {time.time() - start}")

start = time.time()
999999 in large_set   # 快
print(f"set: {time.time() - start}")

# 找出共同好友
alice_friends = {"Bob", "Charlie", "David", "Eve"}
bob_friends = {"Alice", "Charlie", "Frank", "Eve"}

mutual = alice_friends & bob_friends
print(f"共同好友: {mutual}")  # {'Charlie', 'Eve'}

# 找出差异
only_alice = alice_friends - bob_friends
only_bob = bob_friends - alice_friends
print(f"Alice独有的朋友: {only_alice}")
print(f"Bob独有的朋友: {only_bob}")

# 数据验证
required_fields = {"name", "email", "phone"}
user_data = {"name": "Alice", "email": "alice@example.com"}

missing = required_fields - user_data.keys()
if missing:
    print(f"缺少字段: {missing}")
```

## 实战示例

```python
# 标签系统
articles = {
    "article1": {"python", "tutorial", "beginner"},
    "article2": {"python", "advanced", "performance"},
    "article3": {"javascript", "web", "beginner"},
    "article4": {"python", "web", "django"}
}

# 查找包含特定标签的文章
tag = "python"
matching = [title for title, tags in articles.items() if tag in tags]
print(f"包含{tag}标签的文章: {matching}")

# 查找同时包含多个标签的文章
tags_needed = {"python", "tutorial"}
matching = [title for title, tags in articles.items() if tags_needed.issubset(tags)]
print(f"同时包含{tags_needed}的文章: {matching}")

# 标签统计
all_tags = set()
for tags in articles.values():
    all_tags.update(tags)
print(f"所有标签: {all_tags}")

# 推荐系统：找出相似文章
article1_tags = articles["article1"]
similarities = {}
for title, tags in articles.items():
    if title != "article1":
        common = len(article1_tags & tags)
        similarities[title] = common

print("与article1相似度:", similarities)
```
