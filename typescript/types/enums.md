# 枚举

## 数字枚举

```typescript
// 基本数字枚举
enum Direction {
    Up,      // 0
    Down,    // 1
    Left,    // 2
    Right    // 3
}

let dir: Direction = Direction.Up;
console.log(dir);  // 0

// 指定起始值
enum Status {
    Running = 1,
    Stopped = 2,
    Paused = 3
}

console.log(Status.Running);  // 1

// 常量枚举
const enum Color {
    Red,
    Green,
    Blue
}

let color = Color.Red;  // 编译时替换为 0
```

## 字符串枚举

```typescript
// 字符串枚举
enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT"
}

let dir: Direction = Direction.Up;
console.log(dir);  // "UP"

// 好处：可读性更好，调试更清晰
enum HttpStatus {
    OK = "200 OK",
    NotFound = "404 Not Found",
    ServerError = "500 Internal Server Error"
}
```

## 异构枚举

```typescript
// 混合数字和字符串（不推荐）
enum Mixed {
    No = 0,
    Yes = "YES"
}

// 可以计算的成员
enum FileAccess {
    None,
    Read = 1 << 0,
    Write = 1 << 1,
    ReadWrite = Read | Write
}

console.log(FileAccess.ReadWrite);  // 3
```

## 枚举与联合类型

```typescript
// 联合类型代替枚举（更轻量）
type Direction = "up" | "down" | "left" | "right";

function move(direction: Direction) {
    console.log(`Moving ${direction}`);
}

move("up");    // ✅
// move("diagonal");  // ❌

// 字面量类型
type StatusCode = 200 | 301 | 404 | 500;

function getStatus(status: StatusCode): string {
    switch (status) {
        case 200: return "OK";
        case 301: return "Moved";
        case 404: return "Not Found";
        case 500: return "Server Error";
    }
}
```

## 枚举的使用场景

```typescript
// 状态机
enum OrderStatus {
    Pending = "PENDING",
    Processing = "PROCESSING",
    Shipped = "SHIPPED",
    Delivered = "DELIVERED",
    Cancelled = "CANCELLED"
}

class Order {
    status: OrderStatus = OrderStatus.Pending;
    
    process() {
        if (this.status === OrderStatus.Pending) {
            this.status = OrderStatus.Processing;
        }
    }
    
    ship() {
        if (this.status === OrderStatus.Processing) {
            this.status = OrderStatus.Shipped;
        }
    }
}

// 配置选项
enum LogLevel {
    Debug = 0,
    Info = 1,
    Warn = 2,
    Error = 3
}

function log(level: LogLevel, message: string) {
    if (level >= config.logLevel) {
        console.log(`[${LogLevel[level]}] ${message}`);
    }
}

// 权限系统
enum Permission {
    Read = 1 << 0,
    Write = 1 << 1,
    Execute = 1 << 2,
    Admin = Read | Write | Execute
}

function hasPermission(user: number, permission: Permission): boolean {
    return (user & permission) === permission;
}
```

## 实用技巧

```typescript
// 枚举映射
enum Fruit {
    Apple = "apple",
    Banana = "banana",
    Cherry = "cherry"
}

const fruitPrices: Record<Fruit, number> = {
    [Fruit.Apple]: 1.99,
    [Fruit.Banana]: 0.99,
    [Fruit.Cherry]: 3.99
};

// 枚举遍历
function getAllValues<T>(enumObj: T): T[keyof T][] {
    return Object.values(enumObj).filter(v => typeof v === "string") as T[keyof T][];
}

let allFruits = getAllValues(Fruit);
console.log(allFruits);  // ["apple", "banana", "cherry"]

// 枚举与类型守卫
function isDirection(value: unknown): value is Direction {
    return Object.values(Direction).includes(value as Direction);
}

// 枚举作为键
type FruitKey = keyof typeof Fruit;
function getFruit(key: FruitKey): Fruit {
    return Fruit[key];
}
```
