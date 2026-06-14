# 继承与多态

## 基础继承

```python
# 父类
class Animal:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def speak(self):
        return "..."
    
    def info(self):
        return f"{self.name} is {self.age} years old"

# 子类
class Dog(Animal):
    def __init__(self, name, age, breed):
        super().__init__(name, age)  # 调用父类方法
        self.breed = breed
    
    def speak(self):  # 重写父类方法
        return "Woof!"
    
    def fetch(self):  # 新增方法
        return f"{self.name} fetches the ball"

class Cat(Animal):
    def speak(self):
        return "Meow!"

# 使用
dog = Dog("Buddy", 3, "Golden Retriever")
cat = Cat("Kitty", 2)

print(dog.info())    # Buddy is 3 years old（继承）
print(dog.speak())   # Woof!（重写）
print(dog.fetch())   # Buddy fetches the ball（新增）
print(cat.speak())   # Meow!（重写）
```

## 多态

```python
class Shape:
    def area(self):
        raise NotImplementedError

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        return 3.14159 * self.radius ** 2

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height

class Triangle(Shape):
    def __init__(self, base, height):
        self.base = base
        self.height = height
    
    def area(self):
        return 0.5 * self.base * self.height

# 多态：同一个接口，不同实现
def print_area(shape):
    print(f"面积: {shape.area()}")

shapes = [Circle(5), Rectangle(4, 6), Triangle(3, 8)]
for shape in shapes:
    print_area(shape)
# 面积: 78.53975
# 面积: 24
# 面积: 12.0
```

## isinstance 和 issubclass

```python
dog = Dog("Buddy", 3, "Golden Retriever")

# isinstance：检查实例类型
print(isinstance(dog, Dog))       # True
print(isinstance(dog, Animal))    # True（父类也返回 True）
print(isinstance(dog, Cat))       # False

# issubclass：检查类关系
print(issubclass(Dog, Animal))    # True
print(issubclass(Cat, Animal))    # True
print(issubclass(Dog, Cat))       # False

# 类型检查
print(type(dog))  # <class '__main__.Dog'>
```

## 多重继承

```python
class Flyable:
    def fly(self):
        return f"{self.name} is flying"

class Swimmable:
    def swim(self):
        return f"{self.name} is swimming"

class Duck(Animal, Flyable, Swimmable):
    def speak(self):
        return "Quack!"

duck = Duck("Donald", 5)
print(duck.speak())  # Quack!
print(duck.fly())    # Donald is flying
print(duck.swim())   # Donald is swimming

# 查看方法解析顺序（MRO）
print(Duck.__mro__)
# (<class 'Duck'>, <class 'Animal'>, <class 'Flyable'>, 
#  <class 'Swimmable'>, <class 'object'>)
```

## 抽象类

```python
from abc import ABC, abstractmethod

class Vehicle(ABC):
    @abstractmethod
    def start(self):
        pass
    
    @abstractmethod
    def stop(self):
        pass
    
    def info(self):
        return f"{self.__class__.__name__} vehicle"

class Car(Vehicle):
    def start(self):
        return "Car engine started"
    
    def stop(self):
        return "Car engine stopped"

class Bicycle(Vehicle):
    def start(self):
        return "Bicycle starts moving"
    
    def stop(self):
        return "Bicycle stops"

# vehicle = Vehicle()  # ❌ TypeError: Can't instantiate abstract class
car = Car()
bicycle = Bicycle()

print(car.start())      # Car engine started
print(bicycle.start())  # Bicycle starts moving
```

## 实战示例

```python
# 员工管理系统
class Employee:
    def __init__(self, name, base_salary):
        self.name = name
        self.base_salary = base_salary
    
    def calculate_salary(self):
        return self.base_salary
    
    def __str__(self):
        return f"{self.name}: {self.calculate_salary():.2f}元"

class Manager(Employee):
    def __init__(self, name, base_salary, bonus):
        super().__init__(name, base_salary)
        self.bonus = bonus
    
    def calculate_salary(self):
        return self.base_salary + self.bonus

class Developer(Employee):
    def __init__(self, name, base_salary, overtime_hours, hourly_rate):
        super().__init__(name, base_salary)
        self.overtime_hours = overtime_hours
        self.hourly_rate = hourly_rate
    
    def calculate_salary(self):
        return self.base_salary + self.overtime_hours * self.hourly_rate

class Salesperson(Employee):
    def __init__(self, name, base_salary, commission_rate, sales):
        super().__init__(name, base_salary)
        self.commission_rate = commission_rate
        self.sales = sales
    
    def calculate_salary(self):
        return self.base_salary + self.sales * self.commission_rate

# 使用
employees = [
    Manager("Alice", 10000, 5000),
    Developer("Bob", 8000, 20, 100),
    Salesperson("Charlie", 6000, 0.1, 50000)
]

print("员工工资:")
total = 0
for emp in employees:
    print(f"  {emp}")
    total += emp.calculate_salary()

print(f"总工资支出: {total:.2f}元")
```
