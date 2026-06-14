# 封装与抽象

## 访问控制

```python
class BankAccount:
    def __init__(self, owner, balance):
        self.owner = owner       # 公有属性
        self._balance = balance  # 受保护属性（约定）
        self.__pin = "1234"      # 私有属性（名称修饰）
    
    def deposit(self, amount):
        if amount > 0:
            self._balance += amount
            return True
        return False
    
    def withdraw(self, amount, pin):
        if pin != self.__pin:
            print("PIN 错误")
            return False
        if 0 < amount <= self._balance:
            self._balance -= amount
            return True
        return False
    
    @property
    def balance(self):
        return self._balance

account = BankAccount("Alice", 10000)
print(account.owner)       # Alice（公有）
print(account._balance)    # 10000（受保护，但可以访问）
# print(account.__pin)     # ❌ AttributeError
# print(account._BankAccount__pin)  # 名称修饰，可以访问但不推荐
```

## 封装原则

```python
class TemperatureConverter:
    """封装：隐藏内部实现，提供简洁接口"""
    
    def __init__(self, celsius=0):
        self._celsius = celsius  # 内部状态
    
    @property
    def celsius(self):
        return self._celsius
    
    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("温度不能低于绝对零度")
        self._celsius = value
    
    @property
    def fahrenheit(self):
        """摄氏度转华氏度"""
        return self._celsius * 9/5 + 32
    
    @fahrenheit.setter
    def fahrenheit(self, value):
        self.celsius = (value - 32) * 5/9
    
    @property
    def kelvin(self):
        """摄氏度转开尔文"""
        return self._celsius + 273.15
    
    @kelvin.setter
    def kelvin(self, value):
        self.celsius = value - 273.15

# 使用
temp = TemperatureConverter(100)
print(f"{temp.celsius}°C = {temp.fahrenheit}°F = {temp.kelvin}K")
# 100°C = 212.0°F = 373.15K

temp.fahrenheit = 32
print(f"{temp.celsius}°C")  # 0.0°C
```

## 数据类（Python 3.7+）

```python
from dataclasses import dataclass, field
from typing import List

@dataclass
class Student:
    name: str
    age: int
    scores: List[int] = field(default_factory=list)
    
    @property
    def average(self):
        return sum(self.scores) / len(self.scores) if self.scores else 0
    
    def __post_init__(self):
        """初始化后验证"""
        if self.age < 0 or self.age > 150:
            raise ValueError("年龄无效")

# 自动生成 __init__, __repr__, __eq__ 等
alice = Student("Alice", 25, [95, 87, 92])
bob = Student("Bob", 23, [82, 91, 88])

print(alice)  # Student(name='Alice', age=25, scores=[95, 87, 92])
print(alice == bob)  # False

# 不可变数据类
@dataclass(frozen=True)
class Point:
    x: float
    y: float

p1 = Point(1, 2)
# p1.x = 3  # ❌ FrozenInstanceError
```

## 属性描述符

```python
class Validated:
    """属性描述符：验证属性值"""
    def __init__(self, validator, error_msg):
        self.validator = validator
        self.error_msg = error_msg
    
    def __set_name__(self, owner, name):
        self.name = name
    
    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return getattr(obj, f"_{self.name}", None)
    
    def __set__(self, obj, value):
        if not self.validator(value):
            raise ValueError(self.error_msg)
        setattr(obj, f"_{self.name}", value)

class Positive(Validated):
    def __init__(self):
        super().__init__(
            lambda x: isinstance(x, (int, float)) and x > 0,
            "必须是正数"
        )

class NonEmpty(Validated):
    def __init__(self):
        super().__init__(
            lambda x: isinstance(x, str) and len(x) > 0,
            "不能为空字符串"
        )

class Product:
    name = NonEmpty()
    price = Positive()
    quantity = Positive()
    
    def __init__(self, name, price, quantity):
        self.name = name
        self.price = price
        self.quantity = quantity

# 使用
product = Product("iPhone", 999, 10)
print(product.name)  # iPhone

# product = Product("", 999, 10)  # ❌ ValueError: 不能为空字符串
# product = Product("iPhone", -100, 10)  # ❌ ValueError: 必须是正数
```

## 实战示例

```python
# 银行账户系统（封装示例）
from datetime import datetime
from typing import List, Dict

class Transaction:
    """交易记录"""
    def __init__(self, amount, transaction_type, balance_after):
        self.amount = amount
        self.type = transaction_type
        self.balance_after = balance_after
        self.timestamp = datetime.now()
    
    def __str__(self):
        return f"[{self.timestamp:%Y-%m-%d %H:%M}] {self.type}: {self.amount:.2f} → 余额: {self.balance_after:.2f}"

class BankAccount:
    """银行账户（封装）"""
    
    def __init__(self, owner: str, initial_balance: float = 0):
        self._owner = owner
        self._balance = initial_balance
        self._transactions: List[Transaction] = []
        self._is_frozen = False
    
    @property
    def owner(self):
        return self._owner
    
    @property
    def balance(self):
        return self._balance
    
    @property
    def transactions(self):
        return self._transactions.copy()
    
    def deposit(self, amount: float) -> bool:
        """存款"""
        self._check_not_frozen()
        if amount <= 0:
            raise ValueError("存款金额必须大于0")
        
        self._balance += amount
        self._add_transaction(amount, "存款")
        return True
    
    def withdraw(self, amount: float) -> bool:
        """取款"""
        self._check_not_frozen()
        if amount <= 0:
            raise ValueError("取款金额必须大于0")
        if amount > self._balance:
            raise ValueError("余额不足")
        
        self._balance -= amount
        self._add_transaction(-amount, "取款")
        return True
    
    def freeze(self):
        """冻结账户"""
        self._is_frozen = True
    
    def unfreeze(self):
        """解冻账户"""
        self._is_frozen = False
    
    def _check_not_frozen(self):
        if self._is_frozen:
            raise RuntimeError("账户已冻结")
    
    def _add_transaction(self, amount, transaction_type):
        self._transactions.append(
            Transaction(amount, transaction_type, self._balance)
        )
    
    def get_statement(self, n: int = 10) -> str:
        """获取最近n条交易记录"""
        lines = [f"=== {self._owner} 的账户 ==="]
        lines.append(f"当前余额: {self._balance:.2f}")
        lines.append("-" * 30)
        for t in self._transactions[-n:]:
            lines.append(str(t))
        return "\n".join(lines)

# 使用
account = BankAccount("Alice", 10000)
account.deposit(5000)
account.withdraw(2000)
account.deposit(3000)

print(account.get_statement())
```
