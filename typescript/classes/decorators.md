# 装饰器

## 基本概念

```typescript
// 装饰器是特殊的声明，可以附加到类声明、方法、属性或参数上
// 需要在 tsconfig.json 中启用 experimentalDecorators

// 类装饰器
function Log(target: Function) {
    console.log(`Creating instance of ${target.name}`);
}

@Log
class MyClass {
    constructor() {
        console.log("MyClass instance created");
    }
}

// 方法装饰器
function logMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let originalMethod = descriptor.value;
    
    descriptor.value = function (...args: any[]) {
        console.log(`Calling ${propertyKey} with args: ${args}`);
        let result = originalMethod.apply(this, args);
        console.log(`${propertyKey} returned: ${result}`);
        return result;
    };
}

class Calculator {
    @logMethod
    add(a: number, b: number): number {
        return a + b;
    }
}

let calc = new Calculator();
calc.add(2, 3);
// 输出:
// Calling add with args: 2, 3
// add returned: 5
```

## 类装饰器

```typescript
// 类装饰器工厂
function sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}

@sealed
class Greeter {
    greeting: string;
    
    constructor(message: string) {
        this.greeting = message;
    }
    
    greet(): string {
        return `Hello, ${this.greeting}`;
    }
}

// 带参数的类装饰器
function component(selector: string) {
    return function<T extends { new(...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            selector = selector;
            
            render() {
                console.log(`Rendering ${selector}`);
            }
        };
    };
}

@Component("my-component")
class MyComponent {
    render() {
        console.log("Component content");
    }
}
```

## 方法装饰器

```typescript
// 可重试装饰器
function retry(maxAttempts: number) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        let originalMethod = descriptor.value;
        let attempts = 0;
        
        descriptor.value = function (...args: any[]) {
            while (attempts < maxAttempts) {
                try {
                    return originalMethod.apply(this, args);
                } catch (error) {
                    attempts++;
                    console.log(`Attempt ${attempts} failed, retrying...`);
                    if (attempts >= maxAttempts) {
                        throw error;
                    }
                }
            }
        };
        
        return descriptor;
    };
}

// 缓存装饰器
function memoize(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    let originalMethod = descriptor.value;
    let cache = new Map<string, any>();
    
    descriptor.value = function (...args: any[]) {
        let key = JSON.stringify(args);
        if (cache.has(key)) {
            console.log("Returning cached result");
            return cache.get(key);
        }
        
        let result = originalMethod.apply(this, args);
        cache.set(key, result);
        return result;
    };
    
    return descriptor;
}

class MathService {
    @memoize
    fibonacci(n: number): number {
        if (n <= 1) return n;
        return this.fibonacci(n - 1) + this.fibonacci(n - 2);
    }
    
    @retry(3)
    async fetchData(): Promise<any> {
        // 可能失败的操作
        return await fetch("https://api.example.com/data");
    }
}
```

## 属性装饰器

```typescript
// 验证装饰器
function validate(target: any, propertyKey: string) {
    let value: any;
    
    const getter = () => value;
    const setter = (newVal: any) => {
        if (newVal === null || newVal === undefined) {
            throw new Error(`${propertyKey} cannot be null or undefined`);
        }
        value = newVal;
    };
    
    Object.defineProperty(target, propertyKey, {
        get: getter,
        set: setter
    });
}

class User {
    @validate
    name!: string;
    
    @validate
    email!: string;
}

let user = new User();
user.name = "Alice";   // ✅
// user.name = null;    // ❌ Error: name cannot be null or undefined
```

## 参数装饰器

```typescript
// 参数装饰器
function required(
    target: any,
    propertyKey: string,
    parameterIndex: number
) {
    let existingRequiredParameters = Reflect.getOwnMetadata(
        "required",
        target,
        propertyKey
    ) || [];
    existingRequiredParameters.push(parameterIndex);
    Reflect.defineMetadata(
        "required",
        existingRequiredParameters,
        target,
        propertyKey
    );
}

// 方法装饰器检查参数
function validate(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    let originalMethod = descriptor.value;
    
    descriptor.value = function (...args: any[]) {
        let requiredParameters = Reflect.getOwnMetadata(
            "required",
            target,
            propertyKey
        );
        
        if (requiredParameters) {
            for (let parameterIndex of requiredParameters) {
                if (parameterIndex >= args.length || args[parameterIndex] === undefined) {
                    throw new Error(`Missing required argument at position ${parameterIndex}`);
                }
            }
        }
        
        return originalMethod.apply(this, args);
    };
    
    return descriptor;
}

class UserService {
    @validate
    createUser(
        @required name: string,
        @required email: string,
        age?: number
    ) {
        return { name, email, age };
    }
}

let service = new UserService();
service.createUser("Alice", "alice@example.com");  // ✅
// service.createUser("Alice");  // ❌ Missing required argument
```

## 装饰器组合

```typescript
// 装饰器执行顺序
function first() {
    console.log("first(): factory evaluated");
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("first(): called");
    };
}

function second() {
    console.log("second(): factory evaluated");
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("second(): called");
    };
}

class Example {
    @first()
    @second()
    method() {}
}

// 输出:
// first(): factory evaluated
// second(): factory evaluated
// second(): called
// first(): called

// 实用装饰器组合
function logAndCache(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    let originalMethod = descriptor.value;
    let cache = new Map();
    
    descriptor.value = function (...args: any[]) {
        let key = JSON.stringify(args);
        
        if (cache.has(key)) {
            console.log(`Cache hit for ${propertyKey}`);
            return cache.get(key);
        }
        
        console.log(`Calling ${propertyKey}`);
        let result = originalMethod.apply(this, args);
        cache.set(key, result);
        return result;
    };
    
    return descriptor;
}

class DataService {
    @logAndCache
    getData(id: number): any {
        console.log(`Fetching data for id ${id}`);
        return { id, data: "some data" };
    }
}
```
