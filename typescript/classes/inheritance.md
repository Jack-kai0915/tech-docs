# 继承

## 基本继承

```typescript
// 基类
class Animal {
    constructor(
        public name: string,
        public age: number
    ) {}
    
    speak(): string {
        return `${this.name} makes a sound`;
    }
    
    getInfo(): string {
        return `${this.name} is ${this.age} years old`;
    }
}

// 派生类
class Dog extends Animal {
    constructor(
        name: string,
        age: number,
        public breed: string
    ) {
        super(name, age);  // 调用父类构造函数
    }
    
    // 方法重写
    speak(): string {
        return `${this.name} barks`;
    }
    
    // 新方法
    fetch(): string {
        return `${this.name} fetches the ball`;
    }
}

// 使用
let dog = new Dog("Buddy", 3, "Golden Retriever");
console.log(dog.speak());     // "Buddy barks"
console.log(dog.fetch());     // "Buddy fetches the ball"
console.log(dog.getInfo());   // "Buddy is 3 years old"
```

## super 的使用

```typescript
class Base {
    constructor(public value: number) {}
    
    getValue(): number {
        return this.value;
    }
}

class Derived extends Base {
    constructor(value: number, public extra: number) {
        super(value);  // 调用父类构造函数
    }
    
    // 调用父类方法
    getFullValue(): number {
        return super.getValue() + this.extra;
    }
}

let obj = new Derived(10, 5);
console.log(obj.getValue());      // 10
console.log(obj.getFullValue());  // 15
```

## 多层继承

```typescript
class Shape {
    constructor(public color: string) {}
    
    area(): number {
        return 0;
    }
    
    describe(): string {
        return `A ${this.color} shape with area ${this.area()}`;
    }
}

class Circle extends Shape {
    constructor(color: string, public radius: number) {
        super(color);
    }
    
    area(): number {
        return Math.PI * this.radius ** 2;
    }
}

class Cylinder extends Circle {
    constructor(color: string, radius: number, public height: number) {
        super(color, radius);
    }
    
    // 圆柱体积
    volume(): number {
        return this.area() * this.height;
    }
    
    // 重写 describe
    describe(): string {
        return `A ${this.color} cylinder with radius ${this.radius} and height ${this.height}`;
    }
}

let cylinder = new Cylinder("blue", 5, 10);
console.log(cylinder.describe());  // "A blue cylinder with radius 5 and height 10"
console.log(cylinder.area());      // 78.54
console.log(cylinder.volume());    // 785.4
```

## 方法重写

```typescript
class Base {
    greet(): string {
        return "Hello from Base";
    }
    
    private secret(): string {
        return "secret";
    }
}

class Derived extends Base {
    // 重写方法
    greet(): string {
        return "Hello from Derived";
    }
    
    // 使用 super 调用父类方法
    greetWithBase(): string {
        return `${super.greet()} and Derived`;
    }
}

let obj = new Derived();
console.log(obj.greet());            // "Hello from Derived"
console.log(obj.greetWithBase());    // "Hello from Base and Derived"
```

## 访问修饰符与继承

```typescript
class Base {
    public publicProp = "public";
    protected protectedProp = "protected";
    private privateProp = "private";
    
    publicMethod() { return this.publicProp; }
    protectedMethod() { return this.protectedProp; }
    privateMethod() { return this.privateProp; }
}

class Derived extends Base {
    method() {
        console.log(this.publicProp);     // ✅ 可访问
        console.log(this.protectedProp);  // ✅ 可访问
        // console.log(this.privateProp);  // ❌ 不能访问
        
        console.log(this.publicMethod());     // ✅ 可调用
        console.log(this.protectedMethod());  // ✅ 可调用
        // console.log(this.privateMethod());  // ❌ 不能调用
    }
}
```

## 实战模式

```typescript
// 模板方法模式
abstract class DataProcessor {
    // 模板方法
    process(data: any[]): any[] {
        let filtered = this.filter(data);
        let transformed = this.transform(filtered);
        return this.format(transformed);
    }
    
    // 抽象方法（子类必须实现）
    protected abstract filter(data: any[]): any[];
    protected abstract transform(data: any[]): any[];
    protected abstract format(data: any[]): any[];
}

class NumberProcessor extends DataProcessor {
    protected filter(data: any[]): any[] {
        return data.filter(item => typeof item === "number");
    }
    
    protected transform(data: any[]): any[] {
        return data.map(item => item * 2);
    }
    
    protected format(data: any[]): any[] {
        return data.sort((a, b) => a - b);
    }
}

// 工厂模式
class AnimalFactory {
    static create(type: string, name: string): Animal {
        switch (type) {
            case "dog":
                return new Dog(name, 1, "Unknown");
            case "cat":
                return new Cat(name, 1);
            default:
                throw new Error(`Unknown animal type: ${type}`);
        }
    }
}

// 观察者模式
class Subject {
    private observers: Observer[] = [];
    
    attach(observer: Observer): void {
        this.observers.push(observer);
    }
    
    detach(observer: Observer): void {
        this.observers = this.observers.filter(o => o !== observer);
    }
    
    notify(): void {
        this.observers.forEach(observer => observer.update(this));
    }
}

class Observer {
    update(subject: Subject): void {
        console.log("Subject updated");
    }
}
```

## 接口与继承

```typescript
// 类实现接口
interface Printable {
    print(): void;
}

interface Loggable {
    log(): void;
}

class Document implements Printable, Loggable {
    constructor(public content: string) {}
    
    print(): void {
        console.log(`Printing: ${this.content}`);
    }
    
    log(): void {
        console.log(`Logging: ${this.content}`);
    }
}

// 接口继承接口
interface Shape {
    area(): number;
    perimeter(): number;
}

interface ColoredShape extends Shape {
    color: string;
}

class Circle implements ColoredShape {
    constructor(public radius: number, public color: string) {}
    
    area(): number {
        return Math.PI * this.radius ** 2;
    }
    
    perimeter(): number {
        return 2 * Math.PI * this.radius;
    }
}
```
