# 条件语句

## if 语句

```python
age = 20

if age >= 18:
    print("成年人")
    print("可以投票")
```

## if-else 语句

```python
age = 15

if age >= 18:
    print("成年人")
else:
    print("未成年人")
```

## if-elif-else 语句

```python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"成绩等级: {grade}")
```

## 嵌套条件

```python
age = 25
has_id = True

if age >= 18:
    if has_id:
        print("可以进入")
    else:
        print("请出示身份证")
else:
    print("未成年人不能进入")
```

## 三元表达式

```python
age = 20

# 基础三元
status = "成年" if age >= 18 else "未成年"
print(status)

# 嵌套三元（不推荐，可读性差）
score = 85
grade = "A" if score >= 90 else "B" if score >= 80 else "C"
```

## match-case（Python 3.10+）

```python
# 基础用法
status = 404

match status:
    case 200:
        print("成功")
    case 404:
        print("未找到")
    case 500:
        print("服务器错误")
    case _:
        print("未知状态")

# 模式匹配
point = (1, 2)

match point:
    case (0, 0):
        print("原点")
    case (x, 0):
        print(f"X轴上，x={x}")
    case (0, y):
        print(f"Y轴上，y={y}")
    case (x, y):
        print(f"点 ({x}, {y})")

# Guard 条件
age = 25

match age:
    case n if n < 18:
        print("未成年")
    case n if n < 60:
        print("成年人")
    case _:
        print("老年人")
```

## 条件表达式技巧

```python
# 链式比较
x = 15
if 10 <= x <= 20:
    print("在10到20之间")

# 多条件组合
age = 25
income = 10000

if age >= 18 and income >= 5000:
    print("符合申请条件")

# 使用 in 检查多个值
day = "Saturday"
if day in ["Saturday", "Sunday"]:
    print("周末")
else:
    print("工作日")

# 短路求值
name = ""
display_name = name or "匿名用户"
print(display_name)  # 匿名用户
```

## 实战示例

```python
# 闰年判断
year = 2024

if (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0):
    print(f"{year}年是闰年")
else:
    print(f"{year}年不是闰年")

# 成绩评级系统
scores = {"数学": 95, "英语": 82, "Python": 91}

for subject, score in scores.items():
    if score >= 90:
        grade = "优秀"
    elif score >= 80:
        grade = "良好"
    elif score >= 70:
        grade = "中等"
    elif score >= 60:
        grade = "及格"
    else:
        grade = "不及格"
    
    print(f"{subject}: {score}分 - {grade}")
```
