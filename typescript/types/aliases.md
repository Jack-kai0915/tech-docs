# 类型别名

## 基本类型别名

```typescript
// 基本类型别名
type Name = string;
type Age = number;
type ID = string | number;

let name: Name = "Alice";
let age: Age = 25;
let id: ID = "abc123";

// 对象类型别名
type User = {
    name: string;
    age: number;
    email: string;
};

let user: User = {
    name: "Alice",
    age: 25,
    email: "alice@example.com"
};
```

## 联合类型

```typescript
// 联合类型
type StringOrNumber = string | number;

function format(value: StringOrNumber): string {
    if (typeof value === "string") {
        return value.toUpperCase();
    }
    return value.toFixed(2);
}

// 字面量联合类型
type Direction = "up" | "down" | "left" | "right";

function move(direction: Direction) {
    console.log(`Moving ${direction}`);
}

move("up");    // ✅
// move("diagonal");  // ❌

// 可辨识联合类型
type Shape =
    | { kind: "circle"; radius: number }
    | { kind: "rectangle"; width: number; height: number }
    | { kind: "triangle"; base: number; height: number };

function area(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "rectangle":
            return shape.width * shape.height;
        case "triangle":
            return (shape.base * shape.height) / 2;
    }
}
```

## 交叉类型

```typescript
// 交叉类型
type Person = {
    name: string;
    age: number;
};

type Employee = {
    employeeId: string;
    department: string;
};

type EmployeePerson = Person & Employee;

let employee: EmployeePerson = {
    name: "Alice",
    age: 25,
    employeeId: "EMP001",
    department: "Engineering"
};

// 接口也可以交叉
interface Printable {
    print(): void;
}

interface Loggable {
    log(): void;
}

type PrintableLoggable = Printable & Loggable;
```

## 函数类型别名

```typescript
// 函数类型
type Callback = (data: any) => void;
type AsyncFn<T> = () => Promise<T>;
type Predicate<T> = (item: T) => boolean;

// 使用
function fetchData(callback: Callback) {
    callback({ data: "hello" });
}

function filter<T>(arr: T[], predicate: Predicate<T>): T[] {
    return arr.filter(predicate);
}

// 函数重载类型
type FormatFn = {
    (value: string): string;
    (value: number): string;
    (value: Date): string;
};
```

## 条件类型

```typescript
// 条件类型
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">;  // true
type B = IsString<42>;       // false

// 提取类型
type UnwrapArray<T> = T extends (infer E)[] ? E : T;

type NumArray = number[];
type Num = UnwrapArray<NumArray>;  // number

// 提取 Promise 类型
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type PromiseString = Promise<string>;
type String = UnwrapPromise<PromiseString>;  // string

// 映射类型
type ReadOnly<T> = {
    readonly [K in keyof T]: T[K];
};

type Optional<T> = {
    [K in keyof T]?: T[K];
};
```

## 模板字面量类型

```typescript
// 模板字面量类型
type EventName = `on${string}`;
type Color = "red" | "green" | "blue";
type ColorClass = `${Color}-color`;

let className: ColorClass = "red-color";  // ✅

// 更复杂的模式
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type Endpoint = `/api/${string}`;
type Route = `${HttpMethod} ${Endpoint}`;

let route: Route = "GET /api/users";  // ✅
```

## 实用模式

```typescript
// 类型安全的配置
type Config = {
    host: string;
    port: number;
    ssl?: boolean;
};

function createServer(config: Config) {
    console.log(config);
}

createServer({ host: "localhost", port: 3000 });

// 类型安全的状态
type State =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; data: any }
    | { status: "error"; error: Error };

function handleState(state: State) {
    switch (state.status) {
        case "idle":
            break;
        case "loading":
            break;
        case "success":
            console.log(state.data);
            break;
        case "error":
            console.error(state.error);
            break;
    }
}

// 类型安全的事件系统
type EventMap = {
    login: { userId: number };
    logout: { userId: number };
    error: { message: string };
};

type EventHandler<T> = (data: T) => void;

function on<K extends keyof EventMap>(
    event: K,
    handler: EventHandler<EventMap[K]>
) {
    // 实现
}

on("login", (data) => {
    console.log(data.userId);  // ✅ 类型安全
});
```
