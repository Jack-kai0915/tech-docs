# 接口

## 基本接口

```typescript
// 定义接口
interface User {
    name: string;
    age: number;
    email: string;
}

// 使用接口
let user: User = {
    name: "Alice",
    age: 25,
    email: "alice@example.com"
};

// 缺少属性会报错
// let user2: User = { name: "Bob" };  // ❌ 缺少 age 和 email
```

## 可选属性

```typescript
interface Config {
    host: string;
    port: number;
    debug?: boolean;  // 可选
    verbose?: boolean;
}

let config: Config = {
    host: "localhost",
    port: 3000
    // debug 和 verbose 是可选的
};
```

## 只读属性

```typescript
interface Point {
    readonly x: number;
    readonly y: number;
}

let point: Point = { x: 10, y: 20 };
// point.x = 15;  // ❌ 错误：只读属性

// ReadonlyArray 也是只读接口
let arr: ReadonlyArray<number> = [1, 2, 3];
// arr.push(4);  // ❌ 错误
```

## 函数类型

```typescript
// 定义函数类型接口
interface SearchFunc {
    (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source, subString) {
    return source.search(subString) > -1;
};

// 使用函数签名
interface MathOperation {
    (a: number, b: number): number;
}

const add: MathOperation = (a, b) => a + b;
const subtract: MathOperation = (a, b) => a - b;
```

## 可索引类型

```typescript
// 数字索引
interface NumberArray {
    [index: number]: number;
}

let arr: NumberArray = [1, 2, 3];

// 字符串索引
interface StringDictionary {
    [key: string]: string;
}

let dict: StringDictionary = {
    name: "Alice",
    city: "Beijing"
};

// 混合索引
interface ConcurrentDictionary {
    [key: string]: string;
    length: number;  // 不能覆盖索引签名的类型
}

// 只读索引
interface ReadonlyStringArray {
    readonly [index: number]: string;
}
```

## 继承接口

```typescript
// 单继承
interface Animal {
    name: string;
    age: number;
}

interface Dog extends Animal {
    breed: string;
}

let dog: Dog = {
    name: "Buddy",
    age: 3,
    breed: "Golden Retriever"
};

// 多继承
interface Printable {
    print(): void;
}

interface Loggable {
    log(): void;
}

interface Logger extends Printable, Loggable {
    level: string;
}

// 接口继承类
class Base {
    x = 10;
}

interface Derived extends Base {
    y: number;
}
```

## 接口与类

```typescript
// 类实现接口
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date): void;
}

class Clock implements ClockInterface {
    currentTime: Date = new Date();
    
    setTime(d: Date) {
        this.currentTime = d;
    }
}

// 多接口实现
interface Shape {
    area(): number;
    perimeter(): number;
}

interface Drawable {
    draw(): void;
}

class Circle implements Shape, Drawable {
    constructor(private radius: number) {}
    
    area(): number {
        return Math.PI * this.radius ** 2;
    }
    
    perimeter(): number {
        return 2 * Math.PI * this.radius;
    }
    
    draw(): void {
        console.log(`Drawing circle with radius ${this.radius}`);
    }
}
```

## 混合类型

```typescript
// 一个对象既是函数又是对象
interface Counter {
    (): number;
    count: number;
    reset(): void;
}

function createCounter(): Counter {
    let count = 0;
    
    const counter = (() => {
        return count++;
    }) as Counter;
    
    counter.count = 0;
    counter.reset = () => { count = 0; };
    
    return counter;
}

let counter = createCounter();
counter();       // 0
counter();       // 1
counter.count;   // 2
counter.reset();
counter.count;   // 0
```

## 接口合并

```typescript
// 同名接口自动合并
interface Window {
    title: string;
}

interface Window {
    close(): void;
}

// 等同于
interface Window {
    title: string;
    close(): void;
}

// 声明合并
interface Box {
    width: number;
}

interface Box {
    height: number;
}

let box: Box = { width: 10, height: 20 };  // ✅ 正确
```

## 实用模式

```typescript
// 工厂模式
interface Product {
    name: string;
    price: number;
}

interface ProductFactory {
    create(name: string, price: number): Product;
}

class ElectronicsFactory implements ProductFactory {
    create(name: string, price: number): Product {
        return { name: `Electronics: ${name}`, price: price * 1.2 };
    }
}

// 策略模式
interface SortStrategy<T> {
    sort(data: T[]): T[];
}

class BubbleSort<T> implements SortStrategy<T> {
    sort(data: T[]): T[] {
        // 实现冒泡排序
        return [...data];
    }
}

class QuickSort<T> implements SortStrategy<T> {
    sort(data: T[]): T[] {
        // 实现快速排序
        return [...data];
    }
}

// 依赖注入
interface Logger {
    log(message: string): void;
}

interface UserService {
    getUser(id: number): User;
}

class ConsoleLogger implements Logger {
    log(message: string): void {
        console.log(message);
    }
}

class UserServiceImpl implements UserService {
    constructor(private logger: Logger) {}
    
    getUser(id: number): User {
        this.logger.log(`Getting user ${id}`);
        return { name: "Alice", age: 25, email: "alice@example.com" };
    }
}
```
