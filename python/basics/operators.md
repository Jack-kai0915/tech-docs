# 运算符

## 算术运算符

```python
a = 10
b = 3

print(a + b)    # 13   加法
print(a - b)    # 7    减法
print(a * b)    # 30   乘法
print(a / b)    # 3.33 除法（返回浮点数）
print(a // b)   # 3    整除（向下取整）
print(a % b)    # 1    取余/模
print(a ** b)   # 1000 幂运算

# 注意：整除会向下取整
print(-7 // 2)  # -4（不是-3）
print(-7 % 2)   # 1（不是-1）
```

## 比较运算符

```python
x = 10
y = 20

print(x == y)   # False  等于
print(x != y)   # True   不等于
print(x > y)    # False  大于
print(x < y)    # True   小于
print(x >= 10)  # True   大于等于
print(x <= 5)   # False  小于等于

# 链式比较（Python 特有）
age = 25
print(18 <= age <= 65)  # True
```

## 逻辑运算符

```python
a = True
b = False

print(a and b)   # False  与（两个都为True才True）
print(a or b)    # True   或（一个为True就True）
print(not a)     # False  非（取反）

# 实际应用
age = 25
income = 10000

# 两个条件都满足
if age >= 18 and income >= 5000:
    print("符合申请条件")

# 至少一个条件满足
if age < 12 or age > 60:
    print("免费乘车")
```

## 赋值运算符

```python
x = 10

x += 5    # x = x + 5  → 15
x -= 3    # x = x - 3  → 12
x *= 2    # x = x * 2  → 24
x /= 4    # x = x / 4  → 6.0
x //= 2   # x = x // 2 → 3.0
x **= 3   # x = x ** 3 → 27.0
x %= 5    # x = x % 5  → 2.0
```

## 位运算符

```python
a = 12    # 二进制：1100
b = 10    # 二进制：1010

print(a & b)    # 8    按位与（1000）
print(a | b)    # 14   按位或（1110）
print(a ^ b)    # 6    按位异或（0110）
print(~a)       # -13  按位取反
print(a << 2)   # 48   左移（110000）
print(a >> 2)   # 3    右移（11）

# 实际用途：权限管理
READ = 4      # 100
WRITE = 2     # 010
EXECUTE = 1   # 001

permission = READ | WRITE      # 6 (110) 读写权限
print(permission & READ)       # 4 (100) 有读权限
print(permission & EXECUTE)    # 0 (000) 无执行权限
```

## 成员运算符

```python
fruits = ["apple", "banana", "cherry"]

print("apple" in fruits)      # True
print("grape" not in fruits)  # True

text = "Hello World"
print("World" in text)        # True
```

## 身份运算符

```python
a = [1, 2, 3]
b = [1, 2, 3]
c = a

print(a == b)     # True  值相等
print(a is b)     # False 不是同一个对象
print(a is c)     # True  是同一个对象

# is 用于判断是否为 None
x = None
print(x is None)       # True
print(x is not None)   # False
```

## 运算符优先级

```python
# 优先级从高到低：
# 1. **           幂运算
# 2. ~ + -        一元运算符
# 3. * / // %     乘除
# 4. + -          加减
# 5. << >>        位移
# 6. &            按位与
# 7. ^ |          异或、按位或
# 8. == != > < >= <=  比较
# 9. not          逻辑非
# 10. and         逻辑与
# 11. or          逻辑或

# 使用括号明确优先级
result = (2 + 3) * 4   # 20，不是 14
```
