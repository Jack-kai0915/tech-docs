# 抽象类

## 基本抽象类

```typescript
// 抽象类不能实例化
abstract class Shape {
    constructor(public color: string) {}
    
    // 抽象方法（必须在子类中实现）
    abstract area(): number;
    abstract perimeter(): number;
    
    // 普通方法（可以有实现）
    describe(): string {
        return `A ${this.color} shape with area ${this.area().toFixed(2)}`;
    }
}

// 不能实例化抽象类
// let shape = new Shape("red");  // ❌ 错误

// 必须实现所有抽象方法
class Circle extends Shape {
    constructor(color: string, public radius: number) {
        super(color);
    }
    
    area(): number {
        return Math.PI * this.radius ** 2;
    }
    
    perimeter(): number {
        return 2 * Math.PI * this.radius;
    }
}

class Rectangle extends Shape {
    constructor(
        color: string,
        public width: number,
        public height: number
    ) {
        super(color);
    }
    
    area(): number {
        return this.width * this.height;
    }
    
    perimeter(): number {
        return 2 * (this.width + this.height);
    }
}

// 使用
let shapes: Shape[] = [
    new Circle("red", 5),
    new Rectangle("blue", 4, 6)
];

shapes.forEach(shape => {
    console.log(shape.describe());
});
```

## 抽象属性

```typescript
abstract class Vehicle {
    // 抽象属性（必须在子类中实现）
    abstract fuelType: string;
    abstract maxSpeed: number;
    
    // 普通属性
    currentSpeed: number = 0;
    
    // 抽象方法
    abstract start(): void;
    abstract stop(): void;
    
    // 普通方法
    accelerate(amount: number): void {
        this.currentSpeed = Math.min(
            this.currentSpeed + amount,
            this.maxSpeed
        );
    }
}

class Car extends Vehicle {
    fuelType = "汽油";
    maxSpeed = 200;
    
    start(): void {
        console.log("Car started");
    }
    
    stop(): void {
        this.currentSpeed = 0;
        console.log("Car stopped");
    }
}

class ElectricCar extends Vehicle {
    fuelType = "电能";
    maxSpeed = 180;
    
    start(): void {
        console.log("Electric car started silently");
    }
    
    stop(): void {
        this.currentSpeed = 0;
        console.log("Electric car stopped");
    }
}
```

## 模板方法模式

```typescript
abstract class DataExporter {
    // 模板方法
    export(data: any[]): string {
        let processed = this.processData(data);
        let formatted = this.formatData(processed);
        let result = this.compress(formatted);
        return result;
    }
    
    // 抽象方法（子类必须实现）
    protected abstract processData(data: any[]): any[];
    protected abstract formatData(data: any[]): string;
    
    // 可选的钩子方法（子类可以重写）
    protected compress(data: string): string {
        return data;  // 默认不压缩
    }
}

class CSVExporter extends DataExporter {
    protected processData(data: any[]): any[] {
        return data.map(item => ({
            id: item.id,
            name: item.name
        }));
    }
    
    protected formatData(data: any[]): string {
        let headers = Object.keys(data[0]).join(",");
        let rows = data.map(item => Object.values(item).join(","));
        return [headers, ...rows].join("\n");
    }
}

class JSONExporter extends DataExporter {
    protected processData(data: any[]): any[] {
        return data;
    }
    
    protected formatData(data: any[]): string {
        return JSON.stringify(data, null, 2);
    }
    
    // 重写钩子方法
    protected compress(data: string): string {
        return JSON.stringify(JSON.parse(data));  // 压缩
    }
}

// 使用
let data = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" }
];

let csvExporter = new CSVExporter();
console.log(csvExporter.export(data));

let jsonExporter = new JSONExporter();
console.log(jsonExporter.export(data));
```

## 策略模式

```typescript
// 排序策略
abstract class SortStrategy<T> {
    abstract sort(data: T[]): T[];
}

class BubbleSort<T> extends SortStrategy<T> {
    sort(data: T[]): T[] {
        let arr = [...data];
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                }
            }
        }
        return arr;
    }
}

class QuickSort<T> extends SortStrategy<T> {
    sort(data: T[]): T[] {
        // 简化的快速排序实现
        if (data.length <= 1) return data;
        let pivot = data[0];
        let left = data.slice(1).filter(x => x <= pivot);
        let right = data.slice(1).filter(x => x > pivot);
        return [...this.sort(left), pivot, ...this.sort(right)];
    }
}

// 上下文类
class Sorter<T> {
    private strategy: SortStrategy<T>;
    
    constructor(strategy: SortStrategy<T>) {
        this.strategy = strategy;
    }
    
    setStrategy(strategy: SortStrategy<T>): void {
        this.strategy = strategy;
    }
    
    sort(data: T[]): T[] {
        return this.strategy.sort(data);
    }
}

// 使用
let sorter = new Sorter(new BubbleSort<number>());
console.log sorter.sort([5, 3, 8, 1, 2]));  // [1, 2, 3, 5, 8]

sorter.setStrategy(new QuickSort<number>());
console.log(sorter.sort([5, 3, 8, 1, 2]));  // [1, 2, 3, 5, 8]
```

## 工厂模式

```typescript
// 抽象产品
abstract class Product {
    abstract name: string;
    abstract price: number;
    
    toString(): string {
        return `${this.name}: $${this.price}`;
    }
}

// 具体产品
class Book extends Product {
    name = "Book";
    price = 29.99;
    
    constructor(public title: string, public author: string) {
        super();
        this.name = title;
    }
}

class Electronics extends Product {
    name = "Electronics";
    price = 999.99;
    
    constructor(public model: string, public brand: string) {
        super();
        this.name = `${brand} ${model}`;
    }
}

// 抽象工厂
abstract class ProductFactory {
    abstract createProduct(): Product;
}

class BookFactory extends ProductFactory {
    createProduct(): Product {
        return new Book("TypeScript in Action", "John Doe");
    }
}

class ElectronicsFactory extends ProductFactory {
    createProduct(): Product {
        return new Electronics("iPhone 15", "Apple");
    }
}

// 使用
let factories: ProductFactory[] = [
    new BookFactory(),
    new ElectronicsFactory()
];

factories.forEach(factory => {
    let product = factory.createProduct();
    console.log(product.toString());
});
```
