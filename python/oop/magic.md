# 魔术方法

## 创建与初始化

```python
class Book:
    def __new__(cls, title, author):
        """创建实例（在 __init__ 之前调用）"""
        print(f"创建书籍: {title}")
        return super().__new__(cls)
    
    def __init__(self, title, author):
        """初始化实例"""
        self.title = title
        self.author = author
    
    def __del__(self):
        """销毁实例"""
        print(f"删除书籍: {self.title}")

book = Book("Python编程", "Alice")
# 输出：创建书籍: Python编程
del book
# 输出：删除书籍: Python编程
```

## 字符串表示

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __str__(self):
        """str() 和 print() 时调用"""
        return f"({self.x}, {self.y})"
    
    def __repr__(self):
        """交互式环境和 repr() 时调用"""
        return f"Point({self.x}, {self.y})"
    
    def __format__(self, format_spec):
        """format() 时调用"""
        if format_spec == "coords":
            return f"x={self.x}, y={self.y}"
        return f"({self.x}, {self.y})"

p = Point(3, 4)
print(str(p))    # (3, 4)
print(repr(p))   # Point(3, 4)
print(f"{p:coords}")  # x=3, y=4
```

## 比较运算符

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __eq__(self, other):
        """== 运算符"""
        return self.x == other.x and self.y == other.y
    
    def __ne__(self, other):
        """!= 运算符"""
        return not self.__eq__(other)
    
    def __lt__(self, other):
        """< 运算符"""
        return self._magnitude() < other._magnitude()
    
    def __le__(self, other):
        """<= 运算符"""
        return self._magnitude() <= other._magnitude()
    
    def __gt__(self, other):
        """> 运算符"""
        return self._magnitude() > other._magnitude()
    
    def __ge__(self, other):
        """>= 运算符"""
        return self._magnitude() >= other._magnitude()
    
    def _magnitude(self):
        return (self.x**2 + self.y**2) ** 0.5

v1 = Vector(3, 4)
v2 = Vector(1, 2)
print(v1 > v2)   # True
print(v1 == Vector(3, 4))  # True
```

## 算术运算符

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __add__(self, other):
        """+ 运算符"""
        return Vector(self.x + other.x, self.y + other.y)
    
    def __sub__(self, other):
        """- 运算符"""
        return Vector(self.x - other.x, self.y - other.y)
    
    def __mul__(self, scalar):
        """* 运算符"""
        return Vector(self.x * scalar, self.y * scalar)
    
    def __truediv__(self, scalar):
        """/ 运算符"""
        return Vector(self.x / scalar, self.y / scalar)
    
    def __floordiv__(self, scalar):
        """// 运算符"""
        return Vector(self.x // scalar, self.y // scalar)
    
    def __mod__(self, scalar):
        """% 运算符"""
        return Vector(self.x % scalar, self.y % scalar)
    
    def __pow__(self, power):
        """** 运算符"""
        return Vector(self.x ** power, self.y ** power)
    
    def __neg__(self):
        """取负 -v"""
        return Vector(-self.x, -self.y)
    
    def __abs__(self):
        """abs() 函数"""
        return (self.x**2 + self.y**2) ** 0.5

v1 = Vector(3, 4)
v2 = Vector(1, 2)

print(v1 + v2)    # Vector(4, 6)
print(v1 - v2)    # Vector(2, 2)
print(v1 * 2)     # Vector(6, 8)
print(-v1)        # Vector(-3, -4)
print(abs(v1))    # 5.0
```

## 容器协议

```python
class ShoppingCart:
    def __init__(self):
        self.items = []
    
    def __len__(self):
        """len() 函数"""
        return len(self.items)
    
    def __getitem__(self, index):
        """索引访问 cart[0]"""
        return self.items[index]
    
    def __setitem__(self, index, value):
        """索引赋值 cart[0] = item"""
        self.items[index] = value
    
    def __delitem__(self, index):
        """删除 del cart[0]"""
        del self.items[index]
    
    def __contains__(self, item):
        """in 运算符"""
        return item in self.items
    
    def __iter__(self):
        """迭代 for item in cart"""
        return iter(self.items)
    
    def __reversed__(self):
        """reversed() 函数"""
        return reversed(self.items)
    
    def append(self, item):
        self.items.append(item)

cart = ShoppingCart()
cart.append("苹果")
cart.append("香蕉")
cart.append("橘子")

print(len(cart))        # 3
print(cart[0])          # 苹果
print("苹果" in cart)   # True

for item in cart:
    print(item)

del cart[1]
print(list(cart))  # ['苹果', '橘子']
```

## 可调用对象

```python
class Multiplier:
    def __init__(self, factor):
        self.factor = factor
    
    def __call__(self, x):
        """使实例可调用"""
        return x * self.factor

double = Multiplier(2)
triple = Multiplier(3)

print(double(5))   # 10
print(triple(5))   # 15
print(callable(double))  # True
```

## 上下文管理器

```python
class Timer:
    def __init__(self, label=""):
        self.label = label
        self.start_time = None
    
    def __enter__(self):
        """进入 with 语句时调用"""
        import time
        self.start_time = time.time()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """退出 with 语句时调用"""
        import time
        elapsed = time.time() - self.start_time
        print(f"{self.label} 耗时: {elapsed:.4f}秒")
        return False  # 不抑制异常

# 使用
import time

with Timer("计算"):
    total = sum(range(1000000))
    time.sleep(0.1)
# 输出：计算 耗时: 0.1234秒

# 更多示例
class FileHandler:
    def __init__(self, filename, mode):
        self.filename = filename
        self.mode = mode
        self.file = None
    
    def __enter__(self):
        self.file = open(self.filename, self.mode)
        return self.file
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.file:
            self.file.close()
        return False

with FileHandler("test.txt", "w") as f:
    f.write("Hello")
```

## 实战示例

```python
# 自定义集合类
class UniqueList:
    """去重列表"""
    
    def __init__(self):
        self._items = []
        self._seen = set()
    
    def __len__(self):
        return len(self._items)
    
    def __getitem__(self, index):
        return self._items[index]
    
    def __contains__(self, item):
        return item in self._seen
    
    def add(self, item):
        if item not in self._seen:
            self._items.append(item)
            self._seen.add(item)
    
    def __repr__(self):
        return f"UniqueList({self._items})"

# 自定义分数类
class Fraction:
    def __init__(self, numerator, denominator):
        if denominator == 0:
            raise ValueError("分母不能为零")
        self.numerator = numerator
        self.denominator = denominator
        self._simplify()
    
    def _simplify(self):
        gcd = self._gcd(abs(self.numerator), abs(self.denominator))
        self.numerator //= gcd
        self.denominator //= gcd
        if self.denominator < 0:
            self.numerator = -self.numerator
            self.denominator = -self.denominator
    
    def _gcd(self, a, b):
        while b:
            a, b = b, a % b
        return a
    
    def __str__(self):
        if self.denominator == 1:
            return str(self.numerator)
        return f"{self.numerator}/{self.denominator}"
    
    def __add__(self, other):
        num = self.numerator * other.denominator + other.numerator * self.denominator
        den = self.denominator * other.denominator
        return Fraction(num, den)
    
    def __mul__(self, other):
        return Fraction(
            self.numerator * other.numerator,
            self.denominator * other.denominator
        )
    
    def __eq__(self, other):
        return (self.numerator == other.numerator and 
                self.denominator == other.denominator)

# 使用
f1 = Fraction(1, 2)
f2 = Fraction(1, 3)
print(f"{f1} + {f2} = {f1 + f2}")  # 1/2 + 1/3 = 5/6
print(f"{f1} × {f2} = {f1 * f2}")  # 1/2 × 1/3 = 1/6
```
