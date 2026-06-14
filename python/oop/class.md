# 类与对象

## 类的基础

```python
# 定义类
class Dog:
    # 类属性（所有实例共享）
    species = "犬科"
    
    # 初始化方法
    def __init__(self, name, age):
        # 实例属性（每个实例独有）
        self.name = name
        self.age = age
    
    # 实例方法
    def bark(self):
        return f"{self.name} says: Woof!"
    
    def get_info(self):
        return f"{self.name} is {self.age} years old"

# 创建对象（实例化）
dog1 = Dog("Buddy", 3)
dog2 = Dog("Max", 5)

# 访问属性
print(dog1.name)      # Buddy
print(dog2.age)       # 5
print(Dog.species)    # 犬科

# 调用方法
print(dog1.bark())    # Buddy says: Woof!
print(dog2.get_info())  # Max is 5 years old
```

## self 参数

```python
class Point:
    def __init__(self, x, y):
        self.x = x  # self 指向当前实例
        self.y = y
    
    def distance_to(self, other):
        # self 是调用方法的实例
        # other 是传入的另一个实例
        return ((self.x - other.x)**2 + (self.y - other.y)**2) ** 0.5

p1 = Point(0, 0)
p2 = Point(3, 4)
print(p1.distance_to(p2))  # 5.0
```

## 属性管理

```python
class Circle:
    def __init__(self, radius):
        self._radius = radius  # 私有属性（约定）
    
    @property
    def radius(self):
        """获取半径"""
        return self._radius
    
    @radius.setter
    def radius(self, value):
        """设置半径"""
        if value < 0:
            raise ValueError("半径不能为负数")
        self._radius = value
    
    @property
    def area(self):
        """计算面积（只读）"""
        return 3.14159 * self._radius ** 2

c = Circle(5)
print(c.radius)    # 5
print(c.area)      # 78.53975
c.radius = 10      # 设置新值
print(c.area)      # 314.159
# c.area = 100     # ❌ AttributeError（只读）
```

## 魔术方法

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __str__(self):
        """print() 时调用"""
        return f"Vector({self.x}, {self.y})"
    
    def __repr__(self):
        """交互式环境显示"""
        return f"Vector({self.x!r}, {self.y!r})"
    
    def __add__(self, other):
        """+ 运算符"""
        return Vector(self.x + other.x, self.y + other.y)
    
    def __sub__(self, other):
        """- 运算符"""
        return Vector(self.x - other.x, self.y - other.y)
    
    def __mul__(self, scalar):
        """* 运算符"""
        return Vector(self.x * scalar, self.y * scalar)
    
    def __eq__(self, other):
        """== 运算符"""
        return self.x == other.x and self.y == other.y
    
    def __len__(self):
        """len() 函数"""
        return int((self.x**2 + self.y**2) ** 0.5)

v1 = Vector(1, 2)
v2 = Vector(3, 4)

print(v1)           # Vector(1, 2)
print(v1 + v2)      # Vector(4, 6)
print(v1 - v2)      # Vector(-2, -2)
print(v1 * 3)       # Vector(3, 6)
print(v1 == v2)     # False
print(len(v1))      # 2
```

## 实战示例

```python
# 学生成绩管理
class Student:
    def __init__(self, name, scores):
        self.name = name
        self.scores = scores
    
    @property
    def average(self):
        return sum(self.scores.values()) / len(self.scores)
    
    @property
    def grade(self):
        avg = self.average
        if avg >= 90:
            return "A"
        elif avg >= 80:
            return "B"
        elif avg >= 70:
            return "C"
        elif avg >= 60:
            return "D"
        else:
            return "F"
    
    def __str__(self):
        return f"{self.name}: 平均{self.average:.1f}分, 等级{self.grade}"

class Classroom:
    def __init__(self, name):
        self.name = name
        self.students = []
    
    def add_student(self, student):
        self.students.append(student)
    
    @property
    def class_average(self):
        if not self.students:
            return 0
        return sum(s.average for s in self.students) / len(self.students)
    
    def top_students(self, n=3):
        return sorted(self.students, key=lambda s: s.average, reverse=True)[:n]
    
    def __str__(self):
        return f"{self.name}: {len(self.students)}名学生, 平均{self.class_average:.1f}分"

# 使用
classroom = Classroom("Python班")
classroom.add_student(Student("Alice", {"数学": 95, "英语": 87, "Python": 92}))
classroom.add_student(Student("Bob", {"数学": 82, "英语": 91, "Python": 88}))
classroom.add_student(Student("Charlie", {"数学": 78, "英语": 85, "Python": 95}))

print(classroom)
for student in classroom.top_students():
    print(f"  {student}")
```
