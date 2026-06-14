# 类基础

## 定义类

```typescript
class Person {
    // 属性声明
    name: string;
    age: number;
    
    // 构造函数
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
    
    // 方法
    greet(): string {
        return `Hello, I'm ${this.name}`;
    }
}

// 创建实例
let person = new Person("Alice", 25);
console.log(person.name);    // "Alice"
console.log(person.greet()); // "Hello, I'm Alice"
```

## 简写语法

```typescript
// 参数属性（自动创建和赋值属性）
class Person {
    constructor(
        public name: string,
        public age: number,
        private email: string
    ) {}
    
    greet(): string {
        return `Hello, I'm ${this.name}`;
    }
}

// 等同于
class Person {
    name: string;
    age: number;
    private email: string;
    
    constructor(name: string, age: number, email: string) {
        this.name = name;
        this.age = age;
        this.email = email;
    }
    
    greet(): string {
        return `Hello, I'm ${this.name}`;
    }
}
```

## 属性初始化

```typescript
class Person {
    // 属性初始化器
    name: string = "Unknown";
    age: number = 0;
    scores: number[] = [];
    
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}

// 可选属性
class Person {
    constructor(
        public name: string,
        public age: number,
        public email?: string  // 可选
    ) {}
}
```

## 方法

```typescript
class Calculator {
    private result: number = 0;
    
    // 基本方法
    add(value: number): Calculator {
        this.result += value;
        return this;  // 链式调用
    }
    
    subtract(value: number): Calculator {
        this.result -= value;
        return this;
    }
    
    // getter
    get value(): number {
        return this.result;
    }
    
    // setter
    set value(val: number) {
        this.result = val;
    }
    
    // 静态方法
    static create(): Calculator {
        return new Calculator();
    }
}

// 使用
let calc = Calculator.create()
    .add(5)
    .add(3)
    .subtract(2);

console.log(calc.value);  // 6
```

## 方法重载

```typescript
class Formatter {
    // 方法重载签名
    format(value: string): string;
    format(value: number): string;
    format(value: Date): string;
    
    // 实现签名
    format(value: string | number | Date): string {
        if (typeof value === "string") {
            return value.toUpperCase();
        } else if (typeof value === "number") {
            return value.toFixed(2);
        } else {
            return value.toISOString();
        }
    }
}

let formatter = new Formatter();
console.log(formatter.format("hello"));       // "HELLO"
console.log(formatter.format(3.14159));       // "3.14"
console.log(formatter.format(new Date()));    // "2024-01-15T..."
```

## 实战示例

```typescript
// 链式调用的 Builder 模式
class QueryBuilder {
    private table: string = "";
    private conditions: string[] = [];
    private orderByField: string = "";
    private limitValue: number = 0;
    
    from(table: string): QueryBuilder {
        this.table = table;
        return this;
    }
    
    where(condition: string): QueryBuilder {
        this.conditions.push(condition);
        return this;
    }
    
    orderBy(field: string): QueryBuilder {
        this.orderByField = field;
        return this;
    }
    
    limit(count: number): QueryBuilder {
        this.limitValue = count;
        return this;
    }
    
    build(): string {
        let query = `SELECT * FROM ${this.table}`;
        if (this.conditions.length > 0) {
            query += ` WHERE ${this.conditions.join(" AND ")}`;
        }
        if (this.orderByField) {
            query += ` ORDER BY ${this.orderByField}`;
        }
        if (this.limitValue > 0) {
            query += ` LIMIT ${this.limitValue}`;
        }
        return query;
    }
}

// 使用
let query = new QueryBuilder()
    .from("users")
    .where("age > 18")
    .where("status = 'active'")
    .orderBy("name")
    .limit(10)
    .build();

console.log(query);
// "SELECT * FROM users WHERE age > 18 AND status = 'active' ORDER BY name LIMIT 10"

// 事件系统
class EventEmitter {
    private listeners: Map<string, Function[]> = new Map();
    
    on(event: string, callback: Function): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push(callback);
    }
    
    off(event: string, callback: Function): void {
        let callbacks = this.listeners.get(event);
        if (callbacks) {
            this.listeners.set(
                event,
                callbacks.filter(cb => cb !== callback)
            );
        }
    }
    
    emit(event: string, ...args: any[]): void {
        let callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach(cb => cb(...args));
        }
    }
}

// 使用
let emitter = new EventEmitter();
emitter.on("data", (data: any) => console.log("Received:", data));
emitter.emit("data", { message: "Hello" });
```
