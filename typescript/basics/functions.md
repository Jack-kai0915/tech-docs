# 函数

## 函数定义

```typescript
// 函数声明
function greet(name: string): string {
    return `Hello, ${name}!`;
}

// 函数表达式
const add = function(a: number, b: number): number {
    return a + b;
};

// 箭头函数
const multiply = (a: number, b: number): number => a * b;

// 箭头函数（单行省略大括号和 return）
const square = (x: number) => x * x;
```

## 参数类型

```typescript
// 必需参数
function greet(name: string): string {
    return `Hello, ${name}!`;
}
// greet();  // ❌ 错误：缺少参数

// 可选参数（使用 ?）
function greet2(name: string, greeting?: string): string {
    return `${greeting ?? "Hello"}, ${name}!`;
}
greet2("Alice");           // "Hello, Alice!"
greet2("Alice", "Hi");     // "Hi, Alice!"

// 默认参数
function greet3(name: string, greeting = "Hello"): string {
    return `${greeting}, ${name}!`;
}
greet3("Alice");           // "Hello, Alice!"
greet3("Alice", "Hi");     // "Hi, Alice!"

// 剩余参数
function sum(...numbers: number[]): number {
    return numbers.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3);           // 6
sum(1, 2, 3, 4, 5);     // 15

// 解构参数
function printUser({ name, age }: { name: string; age: number }): void {
    console.log(`${name} is ${age} years old`);
}
printUser({ name: "Alice", age: 25 });
```

## 参数类型注解

```typescript
// 基本类型
function add(a: number, b: number): number {
    return a + b;
}

// 联合类型
function format(value: string | number): string {
    return String(value);
}

// 对象类型
function createUser(user: { name: string; age: number }): void {
    console.log(user);
}

// 可选属性
function createConfig(config: { host: string; port?: number }): void {
    console.log(config);
}

// 只读属性
function printPoint(point: { readonly x: number; readonly y: number }): void {
    console.log(`(${point.x}, ${point.y})`);
}
```

## 返回值类型

```typescript
// 显式声明返回值
function add(a: number, b: number): number {
    return a + b;
}

// 返回 void（无返回值）
function log(message: string): void {
    console.log(message);
}

// 返回 never（永不返回）
function throwError(message: string): never {
    throw new Error(message);
}

// 返回 undefined
function doNothing(): undefined {
    return undefined;
}

// 返回联合类型
function format(value: string | number): string | number {
    if (typeof value === "string") {
        return value.toUpperCase();
    }
    return value.toFixed(2);
}
```

## 函数重载

```typescript
// 函数重载声明
function format(value: string): string;
function format(value: number): string;
function format(value: Date): string;
function format(value: string | number | Date): string {
    if (typeof value === "string") {
        return value.toUpperCase();
    } else if (typeof value === "number") {
        return value.toFixed(2);
    } else {
        return value.toISOString();
    }
}

console.log(format("hello"));       // "HELLO"
console.log(format(3.14159));       // "3.14"
console.log(format(new Date()));    // "2024-01-15T..."
```

## 高阶函数

```typescript
// 函数作为参数
function applyOperation(a: number, b: number, operation: (x: number, y: number) => number): number {
    return operation(a, b);
}

const add = (a: number, b: number) => a + b;
const multiply = (a: number, b: number) => a * b;

console.log(applyOperation(2, 3, add));       // 5
console.log(applyOperation(2, 3, multiply));  // 6

// 返回函数
function createMultiplier(factor: number): (value: number) => number {
    return (value) => value * factor;
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));   // 10
console.log(triple(5));   // 15

// 柯里化
function curry(fn: (...args: any[]) => any): any {
    return function curried(...args: any[]) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        }
        return (...args2: any[]) => curried.apply(this, args.concat(args2));
    };
}

const addCurried = curry((a: number, b: number, c: number) => a + b + c);
console.log(addCurried(1)(2)(3));  // 6
console.log(addCurried(1, 2)(3));  // 6
console.log(addCurried(1, 2, 3));  // 6
```

## 闭包

```typescript
// 基本闭包
function createCounter() {
    let count = 0;
    return {
        increment: () => ++count,
        decrement: () => --count,
        getCount: () => count
    };
}

const counter = createCounter();
console.log(counter.increment());  // 1
console.log(counter.increment());  // 2
console.log(counter.decrement());  // 1
console.log(counter.getCount());   // 1

// 私有变量
function createUser(name: string) {
    let _name = name;
    return {
        getName: () => _name,
        setName: (newName: string) => { _name = newName; }
    };
}

const user = createUser("Alice");
console.log(user.getName());   // "Alice"
user.setName("Bob");
console.log(user.getName());   // "Bob"
// console.log(user._name);    // ❌ 无法访问
```

## 实用模式

```typescript
// 防抖
function debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

// 节流
function throttle<T extends (...args: any[]) => any>(
    fn: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// 记忆化
function memoize<T extends (...args: any[]) => any>(fn: T): T {
    const cache = new Map<string, ReturnType<T>>();
    return ((...args: any[]) => {
        const key = JSON.stringify(args);
        if (!cache.has(key)) {
            cache.set(key, fn(...args));
        }
        return cache.get(key)!;
    }) as T;
}

const expensiveCalculation = memoize((n: number) => {
    console.log("Computing...");
    return n * 2;
});

console.log(expensiveCalculation(5));  // Computing... 10
console.log(expensiveCalculation(5));  // 10（无计算）
```
