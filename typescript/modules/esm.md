# ES 模块

## 导出

```typescript
// 命名导出
export let name = "Alice";
export let age = 25;

export function greet(name: string): string {
    return `Hello, ${name}!`;
}

export class Person {
    constructor(public name: string) {}
}

// 类型导出
export type User = {
    name: string;
    age: number;
};

export interface Config {
    host: string;
    port: number;
}

// 重导出
export { something } from "./other-module";
export type { Something } from "./other-module";

// 默认导出
export default class UserService {
    getUser(id: number): User {
        return { name: "Alice", age: 25 };
    }
}

// 多个导出
export {
    name,
    age,
    greet,
    Person
};
```

## 导入

```typescript
// 基本导入
import { name, age, greet } from "./module";

// 导入并重命名
import { name as userName, age as userAge } from "./module";

// 导入整个模块
import * as module from "./module";
console.log(module.name);
console.log(module.greet("Alice"));

// 默认导入
import UserService from "./module";
let service = new UserService();

// 命名空间导入
import * as UserService from "./module";
let service = new UserService.default();

// 类型导入
import type { User, Config } from "./module";

// 混合导入
import UserService, { type User } from "./module";
```

## 动态导入

```typescript
// 动态导入（按需加载）
async function loadModule() {
    let module = await import("./module");
    module.doSomething();
}

// 条件导入
async function loadModule(condition: boolean) {
    if (condition) {
        let module = await import("./moduleA");
        module.doSomething();
    } else {
        let module = await import("./moduleB");
        module.doSomething();
    }
}

// 预加载
let modulePromise = import("./module");

// 使用时
async function main() {
    let module = await modulePromise;
    module.doSomething();
}
```

## 模块模式

```typescript
// 工厂模式
export function createLogger(level: string) {
    return {
        log: (message: string) => console.log(`[${level}] ${message}`)
    };
}

// 单例模式
class Database {
    private static instance: Database;
    
    static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

export default Database;

// 命名空间模式
export namespace MathUtils {
    export function add(a: number, b: number): number {
        return a + b;
    }
    
    export function subtract(a: number, b: number): number {
        return a - b;
    }
}

// 混合导出
export let PI = 3.14159;

export function circleArea(radius: number): number {
    return PI * radius ** 2;
}

export default class Circle {
    constructor(public radius: number) {}
    
    area(): number {
        return circleArea(this.radius);
    }
}
```

## 循环依赖

```typescript
// 循环依赖可能导致问题
// module-a.ts
import { b } from "./module-b";
export let a = 1;
export let c = a + b;

// module-b.ts
import { a } from "./module-a";
export let b = 2;

// 解决方案：使用动态导入
// module-a.ts
export let a = 1;

async function init() {
    let { b } = await import("./module-b");
    return a + b;
}

// 或者重新组织代码结构
```

## 重新导出

```typescript
// index.ts - 统一导出
export { User, UserService } from "./user";
export { Post, PostService } from "./post";
export type { Config } from "./config";

// 或使用命名空间
export * as UserService from "./user";
export * as PostService from "./post";

// 条件重新导出
export { something } from "./module-a";
export { other } from "./module-b";
```

## 实用模式

```typescript
// 类型安全的模块
// types.ts
export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    authorId: number;
}

// api.ts
import type { User, Post } from "./types";

export async function getUsers(): Promise<User[]> {
    let response = await fetch("/api/users");
    return response.json();
}

export async function getPosts(): Promise<Post[]> {
    let response = await fetch("/api/posts");
    return response.json();
}

// main.ts
import { getUsers, getPosts } from "./api";

async function main() {
    let users = await getUsers();
    let posts = await getPosts();
    
    console.log(users);
    console.log(posts);
}

// barrel 模式
// index.ts
export * from "./user";
export * from "./post";
export * from "./comment";

// 使用时只需导入一次
import { User, Post, Comment } from "./index";
```
