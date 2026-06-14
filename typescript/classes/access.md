# 访问修饰符

## public

```typescript
class Person {
    public name: string;
    public age: number;
    
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
    
    public greet(): string {
        return `Hello, I'm ${this.name}`;
    }
}

// public 是默认修饰符，可以省略
class Person2 {
    constructor(
        public name: string,  // public
        public age: number    // public
    ) {}
}

let person = new Person("Alice", 25);
console.log(person.name);     // ✅ 可访问
console.log(person.greet());  // ✅ 可调用
```

## private

```typescript
class BankAccount {
    private balance: number = 0;
    private _pin: string;
    
    constructor(initialBalance: number, pin: string) {
        this.balance = initialBalance;
        this._pin = pin;
    }
    
    // 公共方法访问私有属性
    deposit(amount: number): void {
        if (amount > 0) {
            this.balance += amount;
        }
    }
    
    withdraw(amount: number, pin: string): boolean {
        if (pin !== this._pin) {
            return false;
        }
        if (amount > 0 && amount <= this.balance) {
            this.balance -= amount;
            return true;
        }
        return false;
    }
    
    getBalance(pin: string): number {
        if (pin !== this._pin) {
            return -1;
        }
        return this.balance;
    }
}

let account = new BankAccount(1000, "1234");
// console.log(account.balance);  // ❌ 错误：私有属性
// console.log(account._pin);     // ❌ 错误：私有属性

account.deposit(500);
account.withdraw(200, "1234");   // ✅ 通过公共方法访问
console.log(account.getBalance("1234"));  // 1300
```

## protected

```typescript
class Employee {
    constructor(
        public name: string,
        protected department: string,
        private salary: number
    ) {}
    
    protected getBonus(): number {
        return this.salary * 0.1;
    }
    
    // 公共方法使用 protected 方法
    getTotalCompensation(): number {
        return this.salary + this.getBonus();
    }
}

class Manager extends Employee {
    constructor(
        name: string,
        department: string,
        salary: number,
        private teamSize: number
    ) {
        super(name, department, salary);
    }
    
    // 可以访问父类的 protected 成员
    getTeamInfo(): string {
        return `${this.name} manages ${this.teamSize} people in ${this.department}`;
    }
    
    // 重写 protected 方法
    protected getBonus(): number {
        return super.getBonus() * 1.5;  // 经理奖金 15%
    }
}

let manager = new Manager("Alice", "Engineering", 100000, 5);
console.log(manager.name);           // ✅ 可访问（public）
// console.log(manager.department);   // ❌ 错误：protected
// console.log(manager.salary);       // ❌ 错误：private

console.log(manager.getTeamInfo());         // ✅ 可调用
console.log(manager.getTotalCompensation()); // ✅ 可调用
```

## readonly

```typescript
class Point {
    constructor(
        public readonly x: number,
        public readonly y: number
    ) {}
    
    // readonly 属性可以在构造函数中赋值
    // 之后只能读取，不能修改
}

let point = new Point(10, 20);
console.log(point.x);    // 10
// point.x = 15;          // ❌ 错误：readonly 属性

// 结合访问修饰符
class Config {
    constructor(
        public readonly host: string,
        public readonly port: number,
        private readonly _apiKey: string
    ) {}
    
    getApiUrl(): string {
        return `https://${this.host}:${this.port}/api?key=${this._apiKey}`;
    }
}
```

## 实用模式

```typescript
// 单例模式（私有构造函数）
class Database {
    private static instance: Database;
    
    private constructor(
        private host: string,
        private port: number
    ) {}
    
    static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database("localhost", 5432);
        }
        return Database.instance;
    }
    
    connect(): void {
        console.log(`Connected to ${this.host}:${this.port}`);
    }
}

// let db = new Database();  // ❌ 错误：私有构造函数
let db = Database.getInstance();  // ✅ 通过静态方法获取
db.connect();

// 工厂模式（私有构造 + 静态创建）
class User {
    private constructor(
        public name: string,
        public email: string
    ) {}
    
    static create(name: string, email: string): User {
        // 验证逻辑
        if (!email.includes("@")) {
            throw new Error("Invalid email");
        }
        return new User(name, email);
    }
    
    static fromDatabase(data: any): User {
        return new User(data.name, data.email);
    }
}

let user = User.create("Alice", "alice@example.com");

// 属性验证器
class ValidatedUser {
    private _age: number = 0;
    
    constructor(
        public name: string,
        age: number
    ) {
        this.age = age;  // 使用 setter 进行验证
    }
    
    get age(): number {
        return this._age;
    }
    
    set age(value: number) {
        if (value < 0 || value > 150) {
            throw new Error("Invalid age");
        }
        this._age = value;
    }
}
```
