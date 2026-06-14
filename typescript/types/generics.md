# 泛型

## 基本泛型

```typescript
// 泛型函数
function identity<T>(arg: T): T {
    return arg;
}

let num = identity<number>(42);    // 42
let str = identity<string>("hello"); // "hello"

// 类型推断
let result = identity(42);  // TypeScript 自动推断为 number

// 泛型接口
interface Box<T> {
    value: T;
}

let numBox: Box<number> = { value: 42 };
let strBox: Box<string> = { value: "hello" };
```

## 泛型约束

```typescript
// 使用 extends 约束泛型
interface Lengthwise {
    length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}

logLength("hello");      // 5
logLength([1, 2, 3]);    // 3
logLength({ length: 10 }); // 10
// logLength(42);  // ❌ 错误：number 没有 length 属性

// keyof 约束
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

let user = { name: "Alice", age: 25 };
let name = getProperty(user, "name");  // string
let age = getProperty(user, "age");    // number
// getProperty(user, "email");  // ❌ 错误：email 不存在
```

## 泛型类

```typescript
class Stack<T> {
    private items: T[] = [];
    
    push(item: T): void {
        this.items.push(item);
    }
    
    pop(): T | undefined {
        return this.items.pop();
    }
    
    peek(): T | undefined {
        return this.items[this.items.length - 1];
    }
    
    isEmpty(): boolean {
        return this.items.length === 0;
    }
    
    size(): number {
        return this.items.length;
    }
}

let numStack = new Stack<number>();
numStack.push(1);
numStack.push(2);
console.log(numStack.pop());  // 2

let strStack = new Stack<string>();
strStack.push("hello");
strStack.push("world");
console.log(strStack.pop());  // "world"
```

## 多泛型参数

```typescript
// 多个泛型参数
function makePair<T, U>(first: T, second: U): [T, U] {
    return [first, second];
}

let pair = makePair("hello", 42);  // [string, number]

// 泛型接口
interface Pair<T, U> {
    first: T;
    second: U;
}

let point: Pair<number, number> = { first: 10, second: 20 };

// 泛型映射
function mapArray<T, U>(arr: T[], fn: (item: T) => U): U[] {
    return arr.map(fn);
}

let numbers = [1, 2, 3];
let strings = mapArray(numbers, n => n.toString());  // string[]
```

## 泛型默认值

```typescript
// 泛型默认值
interface Response<T = any> {
    data: T;
    status: number;
    message: string;
}

// 使用默认值
let response: Response = {
    data: "hello",
    status: 200,
    message: "OK"
};

// 覆盖默认值
let typedResponse: Response<number> = {
    data: 42,
    status: 200,
    message: "OK"
};

// 多泛型默认值
interface Result<T, E = Error> {
    data?: T;
    error?: E;
}
```

## 泛型工具类型

```typescript
// Partial - 所有属性可选
interface User {
    name: string;
    age: number;
    email: string;
}

function updateUser(user: User, updates: Partial<User>): User {
    return { ...user, ...updates };
}

let user: User = { name: "Alice", age: 25, email: "alice@example.com" };
let updated = updateUser(user, { age: 26 });  // ✅ 只更新 age

// Required - 所有属性必需
interface Config {
    host?: string;
    port?: number;
}

function createServer(config: Required<Config>): void {
    console.log(config.host, config.port);
}

// createServer({});  // ❌ 错误：缺少必需属性
createServer({ host: "localhost", port: 3000 });  // ✅

// Pick - 选取部分属性
type UserBasic = Pick<User, "name" | "age">;

// Omit - 排除部分属性
type UserWithoutEmail = Omit<User, "email">;

// Record - 创建键值对类型
type Scores = Record<string, number>;
let scores: Scores = { math: 95, english: 87 };

// Readonly - 所有属性只读
type ReadonlyUser = Readonly<User>;
```

## 泛型与条件类型

```typescript
// 条件类型
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">;  // true
type B = IsString<42>;       // false

// infer 关键字
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type Fn = () => string;
type Result = ReturnType<Fn>;  // string

// 提取数组元素类型
type ElementType<T> = T extends (infer E)[] ? E : never;

type NumArray = number[];
type Num = ElementType<NumArray>;  // number

// 提取 Promise 的类型
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type PromiseString = Promise<string>;
type String = UnwrapPromise<PromiseString>;  // string
```

## 实用泛型模式

```typescript
// 类型安全的事件系统
interface EventMap {
    login: { userId: number };
    logout: { userId: number };
    error: { message: string };
}

class EventEmitter<Events extends Record<string, any>> {
    private handlers: { [K in keyof Events]?: ((data: Events[K]) => void)[] } = {};
    
    on<K extends keyof Events>(event: K, handler: (data: Events[K]) => void): void {
        if (!this.handlers[event]) {
            this.handlers[event] = [];
        }
        this.handlers[event]!.push(handler);
    }
    
    emit<K extends keyof Events>(event: K, data: Events[K]): void {
        this.handlers[event]?.forEach(handler => handler(data));
    }
}

let emitter = new EventEmitter<EventMap>();
emitter.on("login", (data) => {
    console.log(data.userId);  // ✅ 类型安全
});

// 类型安全的 API 客户端
interface ApiEndpoints {
    "/users": { get: User[]; post: User };
    "/posts": { get: Post[]; post: Post };
}

async function api<K extends keyof ApiEndpoints>(
    endpoint: K,
    method: keyof ApiEndpoints[K]
): Promise<any> {
    const response = await fetch(endpoint, { method });
    return response.json();
}

// 使用
let users = await api("/users", "get");  // ✅ 类型安全

// 类型安全的状态管理
type State = {
    count: number;
    name: string;
};

type Action =
    | { type: "increment" }
    | { type: "setName"; payload: string };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "increment":
            return { ...state, count: state.count + 1 };
        case "setName":
            return { ...state, name: action.payload };
    }
}
```
