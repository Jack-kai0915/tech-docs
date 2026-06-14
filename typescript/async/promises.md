# Promise

## 基本 Promise

```typescript
// 创建 Promise
let promise = new Promise<string>((resolve, reject) => {
    setTimeout(() => {
        resolve("Hello, World!");
        // reject(new Error("Something went wrong"));
    }, 1000);
});

// 使用 Promise
promise
    .then(message => console.log(message))
    .catch(error => console.error(error))
    .finally(() => console.log("Done"));

// Promise 类型
function fetchData(): Promise<string> {
    return new Promise((resolve) => {
        setTimeout(() => resolve("data"), 1000);
    });
}
```

## Promise 链

```typescript
// 链式调用
function getUser(id: number): Promise<{ name: string }> {
    return new Promise(resolve => {
        setTimeout(() => resolve({ name: "Alice" }), 100);
    });
}

function getPosts(user: { name: string }): Promise<string[]> {
    return new Promise(resolve => {
        setTimeout(() => resolve(["Post 1", "Post 2"]), 100);
    });
}

function getComments(post: string): Promise<string[]> {
    return new Promise(resolve => {
        setTimeout(() => resolve(["Comment 1", "Comment 2"]), 100);
    });
}

// 链式调用
getUser(1)
    .then(user => getPosts(user))
    .then(posts => getComments(posts[0]))
    .then(comments => console.log(comments))
    .catch(error => console.error(error));
```

## 并发 Promise

```typescript
// Promise.all - 全部成功
let promise1 = fetch("/api/users");
let promise2 = fetch("/api/posts");
let promise3 = fetch("/api/comments");

Promise.all([promise1, promise2, promise3])
    .then(([users, posts, comments]) => {
        console.log(users, posts, comments);
    })
    .catch(error => {
        console.error("One of the promises failed:", error);
    });

// Promise.allSettled - 等待所有完成
Promise.allSettled([promise1, promise2, promise3])
    .then(results => {
        results.forEach((result, index) => {
            if (result.status === "fulfilled") {
                console.log(`Promise ${index} succeeded:`, result.value);
            } else {
                console.log(`Promise ${index} failed:`, result.reason);
            }
        });
    });

// Promise.race - 第一个完成的
Promise.race([promise1, promise2, promise3])
    .then(result => {
        console.log("First to complete:", result);
    })
    .catch(error => {
        console.error("First to fail:", error);
    });

// Promise.any - 第一个成功的
Promise.any([promise1, promise2, promise3])
    .then(result => {
        console.log("First successful:", result);
    })
    .catch(error => {
        console.error("All failed:", error);
    });
```

## Promise 工具函数

```typescript
// 延迟执行
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 使用
async function main() {
    console.log("Start");
    await delay(1000);
    console.log("End");
}

// 超时控制
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) => {
            setTimeout(() => reject(new Error("Timeout")), ms);
        })
    ]);
}

// 使用
let result = await withTimeout(fetch("/api/data"), 5000);

// 重试
function retry<T>(
    fn: () => Promise<T>,
    maxAttempts: number,
    delayMs: number = 1000
): Promise<T> {
    return fn().catch((error, attempt) => {
        if (attempt < maxAttempts) {
            return delay(delayMs).then(() => retry(fn, maxAttempts, delayMs));
        }
        throw error;
    });
}

// 使用
let data = await retry(() => fetch("/api/data").then(r => r.json()), 3);
```

## 错误处理

```typescript
// 统一错误处理
class AppError extends Error {
    constructor(
        message: string,
        public code: string,
        public statusCode: number
    ) {
        super(message);
    }
}

// Promise 错误处理
function fetchData(): Promise<any> {
    return fetch("/api/data")
        .then(response => {
            if (!response.ok) {
                throw new AppError(
                    "Failed to fetch",
                    "FETCH_ERROR",
                    response.status
                );
            }
            return response.json();
        })
        .catch(error => {
            if (error instanceof AppError) {
                console.error(`Error ${error.code}: ${error.message}`);
            } else {
                console.error("Unexpected error:", error);
            }
            throw error;
        });
}

// 全局未处理的 Promise 错误
window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled promise rejection:", event.reason);
    event.preventDefault();
});
```

## 实用模式

```typescript
// Promise 化回调函数
function promisify<T>(
    fn: (...args: any[]) => void
): (...args: any[]) => Promise<T> {
    return (...args: any[]) => {
        return new Promise((resolve, reject) => {
            fn(...args, (error: any, result: T) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    };
}

// 使用
const readFile = promisify<string>(require("fs").readFile);
let content = await readFile("file.txt", "utf8");

// 顺序执行
async function sequential<T>(
    tasks: (() => Promise<T>)[]
): Promise<T[]> {
    let results: T[] = [];
    for (const task of tasks) {
        results.push(await task());
    }
    return results;
}

// 并发限制
async function concurrent<T>(
    tasks: (() => Promise<T>)[],
    limit: number
): Promise<T[]> {
    let results: T[] = [];
    let executing: Promise<void>[] = [];
    
    for (const task of tasks) {
        let p = task().then(result => {
            results.push(result);
        });
        executing.push(p);
        
        if (executing.length >= limit) {
            await Promise.race(executing);
            executing = executing.filter(p => p !== executing[0]);
        }
    }
    
    await Promise.all(executing);
    return results;
}
```
