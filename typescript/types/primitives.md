# 基本类型

## 数字类型

```typescript
// 所有数字都是浮点数
let decimal: number = 42;
let hex: number = 0xff;
let binary: number = 0b1010;
let octal: number = 0o744;
let big: number = 100n;  // BigInt

// 特殊值
let notANumber: number = NaN;
let infinity: number = Infinity;

// 注意：TypeScript 不区分整数和浮点数
let int: number = 42;
let float: number = 42.0;  // 同一个值
```

## 字符串类型

```typescript
let name: string = "Alice";
let greeting: string = `Hello, ${name}!`;
let multiLine: string = `
  Line 1
  Line 2
`;

// 模板字面量类型
type Name = `user_${string}`;
let userName: Name = "user_alice";  // ✅
// let invalid: Name = "admin_alice";  // ❌
```

## 布尔类型

```typescript
let isDone: boolean = true;
let isComplete: boolean = false;

// 真值和假值
let falsy: boolean[] = [
    Boolean(0),
    Boolean(""),
    Boolean(null),
    Boolean(undefined),
    Boolean(NaN),
    Boolean(false)
];
```

## null 和 undefined

```typescript
// undefined - 未初始化
let notDefined: undefined = undefined;

// null - 显式空值
let empty: null = null;

// 在严格模式下，不能赋给其他类型
let name: string = "Alice";
// name = null;  // ❌ 错误

// 使用联合类型
let optionalName: string | null = "Alice";
optionalName = null;  // ✅ 正确
```

## 数组类型

```typescript
// 方式一：类型[]
let numbers: number[] = [1, 2, 3];
let names: string[] = ["Alice", "Bob"];

// 方式二：Array<类型>（泛型）
let scores: Array<number> = [95, 87, 92];

// 多维数组
let matrix: number[][] = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

// 只读数组
let readonlyArray: readonly number[] = [1, 2, 3];
// readonlyArray.push(4);  // ❌ 错误

// ReadonlyArray 类型
let readonlyArr: ReadonlyArray<string> = ["a", "b", "c"];
```

## 元组类型

```typescript
// 固定长度和类型
let tuple: [string, number] = ["Alice", 25];
// tuple = [25, "Alice"];  // ❌ 类型不匹配

// 可选元素
let optionalTuple: [string, number?] = ["Alice"];

// 只读元组
let readonlyTuple: readonly [string, number] = ["Alice", 25];

// 带标签的元组
type UserTuple = [name: string, age: number, email?: string];
let user: UserTuple = ["Alice", 25];
```

## 对象类型

```typescript
// 内联类型
let user: { name: string; age: number } = {
    name: "Alice",
    age: 25
};

// 可选属性
let config: { host: string; port?: number } = {
    host: "localhost"
};

// 只读属性
let point: { readonly x: number; readonly y: number } = {
    x: 10,
    y: 20
};
// point.x = 15;  // ❌ 错误

// 索引签名
let dict: { [key: string]: number } = {
    a: 1,
    b: 2
};
```

## 特殊类型

```typescript
// any - 任意类型（关闭类型检查）
let anything: any = 42;
anything = "hello";
anything = true;

// unknown - 安全的 any
let value: unknown = 42;
// value.toUpperCase();  // ❌ 错误：必须先检查类型
if (typeof value === "string") {
    value.toUpperCase();  // ✅ 正确
}

// never - 永不返回
function throwError(message: string): never {
    throw new Error(message);
}

function infiniteLoop(): never {
    while (true) {}
}

// void - 无返回值
function log(message: string): void {
    console.log(message);
}

// object - 非原始类型
function process(obj: object): void {
    console.log(obj);
}
// process(42);  // ❌ 错误：42 是原始类型
```

## 类型推断

```typescript
// TypeScript 自动推断类型
let age = 25;           // number
let name = "Alice";     // string
let isStudent = true;   // boolean
let numbers = [1, 2, 3]; // number[]

// 函数返回值推断
function add(a: number, b: number) {
    return a + b;  // 返回类型推断为 number
}

// 最佳通用类型
let arr = [1, null];  // (number | null)[]
```

## 类型断言

```typescript
// 当你比 TypeScript 更了解类型时
let someValue: any = "this is a string";

// as 语法（推荐）
let strLength: number = (someValue as string).length;

// 尖括号语法（JSX 中不可用）
let strLength2: number = (<string>someValue).length;

// DOM 操作
const input = document.getElementById("myInput") as HTMLInputElement;
const value = input.value;

// 非空断言
function getLength(str: string | null): number {
    return str!.length;  // 告诉 TS str 不为 null
}
```

## 类型兼容性

```typescript
// 结构类型系统
interface Point {
    x: number;
    y: number;
}

let point3D = { x: 1, y: 2, z: 3 };
let point2D: Point = point3D;  // ✅ 兼容（有多余属性）

// 但直接赋值会报错
// let point2D: Point = { x: 1, y: 2, z: 3 };  // ❌ 多余属性错误

// 函数参数协变
function processPoint(point: Point) {
    console.log(point.x, point.y);
}
processPoint(point3D);  // ✅ 兼容
```
