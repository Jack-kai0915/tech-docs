# 高级类型

## 条件类型

```typescript
// 基本条件类型
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

// 提取函数返回类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type Fn = () => string;
type Result = ReturnType<Fn>;  // string
```

## 映射类型

```typescript
// 基本映射类型
type ReadOnly<T> = {
    readonly [K in keyof T]: T[K];
};

type Optional<T> = {
    [K in keyof T]?: T[K];
};

type Nullable<T> = {
    [K in keyof T]: T[K] | null;
};

// 使用
interface User {
    name: string
    age: number
    email: string
}

type ReadonlyUser = ReadOnly<User>;
type OptionalUser = Optional<User>;
type NullableUser = Nullable<User>;

// 条件映射
type Getters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
};

type UserGetters = Getters<User>;
// {
//   getName: () => string;
//   getAge: () => number;
//   getEmail: () => string;
// }
```

## 模板字面量类型

```typescript
// 基本模板字面量
type EventName = `on${string}`;
type Color = "red" | "green" | "blue";
type ColorClass = `${Color}-color`;

let className: ColorClass = "red-color";  // ✅

// 更复杂的模式
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type Endpoint = `/api/${string}`;
type Route = `${HttpMethod} ${Endpoint}`;

let route: Route = "GET /api/users";  // ✅

// 类型推断
type ExtractRouteParams<T extends string> =
    T extends `${string}:${infer Param}/${infer Rest}`
        ? Param | ExtractRouteParams<Rest>
        : T extends `${string}:${infer Param}`
        ? Param
        : never;

type Params = ExtractRouteParams<"/users/:id/posts/:postId">;
// "id" | "postId"
```

## 内置工具类型

```typescript
// Partial - 所有属性可选
interface User {
    name: string
    age: number
    email: string
}

function updateUser(user: User, updates: Partial<User>): User {
    return { ...user, ...updates }
}

// Required - 所有属性必需
interface Config {
    host?: string
    port?: number
}

function createServer(config: Required<Config>): void {
    console.log(config.host, config.port)
}

// Pick - 选取部分属性
type UserBasic = Pick<User, "name" | "age">

// Omit - 排除部分属性
type UserWithoutEmail = Omit<User, "email">

// Record - 创建键值对类型
type Scores = Record<string, number>
let scores: Scores = { math: 95, english: 87 }

// Readonly - 所有属性只读
type ReadonlyUser = Readonly<User>

// Exclude - 从联合类型中排除
type T = "a" | "b" | "c";
type U = Exclude<T, "a">;  // "b" | "c"

// Extract - 从联合类型中提取
type V = Extract<T, "a" | "b">;  // "a" | "b"

// NonNullable - 排除 null 和 undefined
type W = string | null | undefined;
type X = NonNullable<W>;  // string

// Parameters - 提取函数参数类型
type Params = Parameters<(a: string, b: number) => void>;  // [string, number]

// ConstructorParameters - 提取构造函数参数类型
type CtorParams = ConstructorParameters<typeof Error>;  // [string?]
```

## 实用类型

```typescript
// 深度 Partial
type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
};

// 深度 Readonly
type DeepReadonly<T> = {
    readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
};

// 深度 Required
type DeepRequired<T> = {
    [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K]
};

// 可选链类型
type GetNestedValue<T, K extends string> =
    K extends `${infer Head}.${infer Tail}`
        ? Head extends keyof T
            ? GetNestedValue<T[Head], Tail>
            : never
        : K extends keyof T
        ? T[K]
        : never;

// 使用
interface Config {
    server: {
        host: string
        port: number
    }
    database: {
        url: string
    }
}

type Host = GetNestedValue<Config, "server.host">;  // string
type Port = GetNestedValue<Config, "server.port">;  // number
```
