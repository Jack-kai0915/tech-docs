# 循环语句

## for 循环

```python
# 遍历列表
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# 遍历字符串
for char in "Hello":
    print(char)

# 遍历字典
person = {"name": "Alice", "age": 25}
for key, value in person.items():
    print(f"{key}: {value}")
```

## range() 函数

```python
# range(stop)
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# range(start, stop)
for i in range(1, 6):
    print(i)  # 1, 2, 3, 4, 5

# range(start, stop, step)
for i in range(0, 10, 2):
    print(i)  # 0, 2, 4, 6, 8

# 倒序
for i in range(10, 0, -1):
    print(i)  # 10, 9, 8, ..., 1
```

## while 循环

```python
# 基础 while
count = 0
while count < 5:
    print(count)
    count += 1

# 用户输入验证
while True:
    password = input("请输入密码: ")
    if password == "123456":
        print("登录成功")
        break
    print("密码错误，请重试")

# 猜数字游戏
import random
target = random.randint(1, 100)
attempts = 0

while True:
    guess = int(input("猜一个1-100的数字: "))
    attempts += 1
    
    if guess < target:
        print("太小了")
    elif guess > target:
        print("太大了")
    else:
        print(f"恭喜！猜对了，用了{attempts}次")
        break
```

## break 和 continue

```python
# break：跳出循环
for i in range(10):
    if i == 5:
        break  # 遇到5就停止
    print(i)  # 0, 1, 2, 3, 4

# continue：跳过本次
for i in range(10):
    if i % 2 == 0:
        continue  # 跳过偶数
    print(i)  # 1, 3, 5, 7, 9

# else 子句（循环正常结束时执行）
for i in range(5):
    if i == 10:
        break
else:
    print("循环正常结束")  # 会执行

for i in range(5):
    if i == 3:
        break
else:
    print("这不会执行")  # 被break中断，不执行
```

## 嵌套循环

```python
# 九九乘法表
for i in range(1, 10):
    for j in range(1, i + 1):
        print(f"{j}×{i}={i*j}", end="\t")
    print()

# 输出矩阵
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

for row in matrix:
    for item in row:
        print(item, end=" ")
    print()
```

## 列表推导式

```python
# 基础
squares = [x**2 for x in range(10)]
print(squares)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# 带条件
even_squares = [x**2 for x in range(10) if x % 2 == 0]
print(even_squares)  # [0, 4, 16, 36, 64]

# 嵌套
matrix = [[i*3 + j + 1 for j in range(3)] for i in range(3)]
print(matrix)  # [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

# 字典推导式
word = "hello"
char_count = {c: word.count(c) for c in set(word)}
print(char_count)  # {'h': 1, 'e': 1, 'l': 2, 'o': 1}

# 集合推导式
unique_lengths = {len(word) for word in ["hello", "world", "python"]}
print(unique_lengths)  # {5, 6}
```

## 迭代器与生成器

```python
# enumerate() 获取索引
fruits = ["apple", "banana", "cherry"]
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")

# zip() 并行遍历
names = ["Alice", "Bob", "Charlie"]
scores = [95, 87, 92]
for name, score in zip(names, scores):
    print(f"{name}: {score}")

# 生成器（节省内存）
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

fib = fibonacci()
for _ in range(10):
    print(next(fib), end=" ")
# 0 1 1 2 3 5 8 13 21 34
```

## 实战示例

```python
# 找出所有质数
def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

primes = [n for n in range(2, 100) if is_prime(n)]
print(f"100以内的质数: {primes}")

# 文件处理
def process_large_file(filename):
    """逐行处理大文件，避免内存溢出"""
    with open(filename, "r") as f:
        for line in f:
            yield line.strip()

# 数据统计
data = [85, 92, 78, 95, 88, 76, 91, 83]
passed = sum(1 for score in data if score >= 80)
average = sum(data) / len(data)
print(f"及格人数: {passed}, 平均分: {average:.1f}")
```
