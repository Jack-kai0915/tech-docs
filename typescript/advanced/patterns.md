# 设计模式

## 单例模式

```typescript
class Singleton {
    private static instance: Singleton;
    
    private constructor() {}
    
    static getInstance(): Singleton {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        return Singleton.instance;
    }
    
    doSomething(): void {
        console.log("Doing something");
    }
}

// 使用
let instance1 = Singleton.getInstance();
let instance2 = Singleton.getInstance();
console.log(instance1 === instance2);  // true
```

## 工厂模式

```typescript
// 简单工厂
interface Product {
    name: string
    price: number
}

class Book implements Product {
    name = "Book"
    price = 29.99
}

class Electronics implements Product {
    name = "Electronics"
    price = 999.99
}

class ProductFactory {
    static create(type: string): Product {
        switch (type) {
            case "book":
                return new Book()
            case "electronics":
                return new Electronics()
            default:
                throw new Error(`Unknown product type: ${type}`)
        }
    }
}

// 抽象工厂
interface AbstractFactory {
    createProductA(): ProductA
    createProductB(): ProductB
}

class ConcreteFactory1 implements AbstractFactory {
    createProductA(): ProductA {
        return new ProductA1()
    }
    
    createProductB(): ProductB {
        return new ProductB1()
    }
}
```

## 观察者模式

```typescript
interface Observer {
    update(subject: Subject): void
}

interface Subject {
    attach(observer: Observer): void
    detach(observer: Observer): void
    notify(): void
}

class ConcreteSubject implements Subject {
    private observers: Observer[] = []
    private state: number = 0
    
    attach(observer: Observer): void {
        this.observers.push(observer)
    }
    
    detach(observer: Observer): void {
        this.observers = this.observers.filter(o => o !== observer)
    }
    
    notify(): void {
        this.observers.forEach(observer => observer.update(this))
    }
    
    getState(): number {
        return this.state
    }
    
    setState(state: number): void {
        this.state = state
        this.notify()
    }
}

class ConcreteObserver implements Observer {
    update(subject: Subject): void {
        console.log(`Observer updated: ${subject.getState()}`)
    }
}
```

## 策略模式

```typescript
interface Strategy<T> {
    execute(data: T): T
}

class BubbleSort<T> implements Strategy<T[]> {
    execute(data: T[]): T[] {
        // 冒泡排序实现
        return [...data]
    }
}

class QuickSort<T> implements Strategy<T[]> {
    execute(data: T[]): T[] {
        // 快速排序实现
        return [...data]
    }
}

class Sorter<T> {
    private strategy: Strategy<T[]>
    
    constructor(strategy: Strategy<T[]>) {
        this.strategy = strategy
    }
    
    setStrategy(strategy: Strategy<T[]>): void {
        this.strategy = strategy
    }
    
    sort(data: T[]): T[] {
        return this.strategy.execute(data)
    }
}
```

## 装饰器模式

```typescript
interface Component {
    operation(): string
}

class ConcreteComponent implements Component {
    operation(): string {
        return "ConcreteComponent"
    }
}

class Decorator implements Component {
    protected component: Component
    
    constructor(component: Component) {
        this.component = component
    }
    
    operation(): string {
        return this.component.operation()
    }
}

class ConcreteDecoratorA extends Decorator {
    operation(): string {
        return `ConcreteDecoratorA(${super.operation()})`
    }
}

class ConcreteDecoratorB extends Decorator {
    operation(): string {
        return `ConcreteDecoratorB(${super.operation()})`
    }
}

// 使用
let component = new ConcreteComponent()
let decoratorA = new ConcreteDecoratorA(component)
let decoratorB = new ConcreteDecoratorB(decoratorA)

console.log(decoratorB.operation())
// "ConcreteDecoratorB(ConcreteDecoratorA(ConcreteComponent))"
```

## 适配器模式

```typescript
// 旧接口
class OldCalculator {
    operations(a: number, b: number, operation: string): number {
        switch (operation) {
            case "add": return a + b
            case "sub": return a - b
            default: return NaN
        }
    }
}

// 新接口
class NewCalculator {
    add(a: number, b: number): number {
        return a + b
    }
    
    sub(a: number, b: number): number {
        return a - b
    }
}

// 适配器
class CalculatorAdapter {
    private newCalc = new NewCalculator()
    
    operations(a: number, b: number, operation: string): number {
        switch (operation) {
            case "add": return this.newCalc.add(a, b)
            case "sub": return this.newCalc.sub(a, b)
            default: return NaN
        }
    }
}
```

## 代理模式

```typescript
interface Image {
    display(): void
}

class RealImage implements Image {
    constructor(private filename: string) {
        this.loadFromDisk()
    }
    
    private loadFromDisk(): void {
        console.log(`Loading ${this.filename}`)
    }
    
    display(): void {
        console.log(`Displaying ${this.filename}`)
    }
}

class ProxyImage implements Image {
    private realImage: RealImage | null = null
    
    constructor(private filename: string) {}
    
    display(): void {
        if (!this.realImage) {
            this.realImage = new RealImage(this.filename)
        }
        this.realImage.display()
    }
}

// 使用
let image = new ProxyImage("test.jpg")
// 图片不会立即加载
image.display()  // 此时加载并显示
image.display()  // 直接显示，不加载
```

## 命令模式

```typescript
interface Command {
    execute(): void
    undo(): void
}

class ConcreteCommand implements Command {
    private state: number = 0
    
    execute(): void {
        this.state = 1
        console.log("Command executed")
    }
    
    undo(): void {
        this.state = 0
        console.log("Command undone")
    }
}

class Invoker {
    private history: Command[] = []
    
    execute(command: Command): void {
        command.execute()
        this.history.push(command)
    }
    
    undo(): void {
        let command = this.history.pop()
        command?.undo()
    }
}
```

## 实用模式

```typescript
// 类型安全的 Builder 模式
class QueryBuilder {
    private table: string = ""
    private conditions: string[] = []
    private orderByField: string = ""
    private limitValue: number = 0
    
    from(table: string): this {
        this.table = table
        return this
    }
    
    where(condition: string): this {
        this.conditions.push(condition)
        return this
    }
    
    orderBy(field: string): this {
        this.orderByField = field
        return this
    }
    
    limit(count: number): this {
        this.limitValue = count
        return this
    }
    
    build(): string {
        let query = `SELECT * FROM ${this.table}`
        if (this.conditions.length > 0) {
            query += ` WHERE ${this.conditions.join(" AND ")}`
        }
        if (this.orderByField) {
            query += ` ORDER BY ${this.orderByField}`
        }
        if (this.limitValue > 0) {
            query += ` LIMIT ${this.limitValue}`
        }
        return query
    }
}

// 使用
let query = new QueryBuilder()
    .from("users")
    .where("age > 18")
    .where("status = 'active'")
    .orderBy("name")
    .limit(10)
    .build()
```
