# async/await

## 基本语法

```typescript
// async 函数
async function fetchData(): Promise<string> {
    return "Hello, World!";
}

// await 表达式
async function getUser(): Promise<User> {
    let response = await fetch("/api/user");
    let user = await response.json();
    return user;
}

// 错误处理
async function getData(): Promise<any> {
    try {
        let response = await fetch("/api/data");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch data:", error);
        throw error;
    }
}
```

## 实用示例

```typescript
// 顺序执行
async function processSequentially(): Promise<void> {
    let result1 = await step1();
    let result2 = await step2(result1);
    let result3 = await step3(result2);
    console.log(result3);
}

// 并行执行
async function processParallel(): Promise<void> {
    let [result1, result2, result3] = await Promise.all([
        step1(),
        step2(),
        step3()
    ]);
    console.log(result1, result2, result3);
}

// 带超时的请求
async function fetchWithTimeout(
    url: string,
    timeout: number
): Promise<any> {
    let controller = new AbortController();
    let timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        let response = await fetch(url, {
            signal: controller.signal
        });
        return await response.json();
    } finally {
        clearTimeout(timeoutId);
    }
}

// 重试逻辑
async function fetchWithRetry(
    url: string,
    maxRetries: number = 3
): Promise<any> {
    for (let i = 0; i < maxRetries; i++) {
        try {
            let response = await fetch(url);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            if (i === maxRetries - 1) {
                throw error;
            }
            await delay(1000 * (i + 1));  // 指数退避
        }
    }
    throw new Error("Max retries exceeded");
}
```

## 错误处理模式

```typescript
// 结果类型（避免 try/catch）
type Result<T> =
    | { success: true; data: T }
    | { success: false; error: Error };

async function safeFetch<T>(url: string): Promise<Result<T>> {
    try {
        let response = await fetch(url);
        if (!response.ok) {
            return {
                success: false,
                error: new Error(`HTTP error! status: ${response.status}`)
            };
        }
        let data = await response.json();
        return { success: true, data };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error : new Error(String(error))
        };
    }
}

// 使用
let result = await safeFetch<User>("/api/user");
if (result.success) {
    console.log(result.data);
} else {
    console.error(result.error);
}

// 错误边界
class ErrorBoundary {
    private errorHandlers: ((error: Error) => void)[] = [];
    
    catchError(handler: (error: Error) => void): void {
        this.errorHandlers.push(handler);
    }
    
    async execute<T>(fn: () => Promise<T>): Promise<T | undefined> {
        try {
            return await fn();
        } catch (error) {
            let err = error instanceof Error ? error : new Error(String(error));
            this.errorHandlers.forEach(handler => handler(err));
            return undefined;
        }
    }
}
```

## 实战模式

```typescript
// API 客户端
class ApiClient {
    private baseUrl: string;
    private headers: Record<string, string>;
    
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        this.headers = {
            "Content-Type": "application/json"
        };
    }
    
    setAuthToken(token: string): void {
        this.headers["Authorization"] = `Bearer ${token}`;
    }
    
    async get<T>(endpoint: string): Promise<T> {
        let response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: "GET",
            headers: this.headers
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response.json();
    }
    
    async post<T>(endpoint: string, data: any): Promise<T> {
        let response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response.json();
    }
}

// 使用
let api = new ApiClient("https://api.example.com");
let users = await api.get<User[]>("/users");
let newUser = await api.post<User>("/users", { name: "Alice" });

// 数据库操作
class Database {
    async connect(): Promise<void> {
        console.log("Connected to database");
    }
    
    async disconnect(): Promise<void> {
        console.log("Disconnected from database");
    }
    
    async query<T>(sql: string, params?: any[]): Promise<T[]> {
        console.log("Executing query:", sql);
        return [];
    }
    
    async transaction<T>(fn: () => Promise<T>): Promise<T> {
        await this.query("BEGIN");
        try {
            let result = await fn();
            await this.query("COMMIT");
            return result;
        } catch (error) {
            await this.query("ROLLBACK");
            throw error;
        }
    }
}

// 使用
let db = new Database();
await db.connect();

let users = await db.query<User>("SELECT * FROM users");
await db.transaction(async () => {
    await db.query("INSERT INTO users (name) VALUES (?)", ["Alice"]);
    await db.query("UPDATE accounts SET balance = balance - 100 WHERE user_id = ?", [1]);
});
```

## 异步迭代

```typescript
// 异步生成器
async function* fetchPages(url: string): AsyncGenerator<any> {
    let page = 1;
    while (true) {
        let response = await fetch(`${url}?page=${page}`);
        let data = await response.json();
        
        if (data.items.length === 0) {
            break;
        }
        
        yield* data.items;
        page++;
    }
}

// 使用
for await (let item of fetchPages("https://api.example.com/items")) {
    console.log(item);
}

// 异步迭代器
class AsyncCounter {
    private count = 0;
    private limit: number;
    
    constructor(limit: number) {
        this.limit = limit;
    }
    
    [Symbol.asyncIterator]() {
        return {
            next: async () => {
                if (this.count < this.limit) {
                    return { value: this.count++, done: false };
                }
                return { done: true, value: undefined };
            }
        };
    }
}

// 使用
let counter = new AsyncCounter(5);
for await (let num of counter) {
    console.log(num);
}
```
