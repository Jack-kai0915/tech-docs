# 变量与数据类型

## 变量声明

TypeScript 使用 `let` 和 `const` 声明变量。

```typescript
// const - 常量，不可重新赋值
const PI = 3.14159;
const NAME = "TypeScript";
// PI = 3.14;  // ❌ 错误：无法重新赋值

// let - 变量，可以重新赋值
let age = 25;
age = 26;  // ✅ 正确

// 同时声明多个变量
let x = 1, y = 2, z = 3;

// 解构赋值
const [a, b] = [1, 2];
const { name, age: userAge } = { name: "Alice", age: 25 };
```

### var 的问题

```typescript
// var 存在作用域问题，不推荐使用
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);
}
// 输出：3, 3, 3（而不是 0, 1, 2）

// let 修复了这个问题
for (let j = 0; j < 3; j++) {
    setTimeout(() => console.log(j), 100);
}
// 输出：0, 1, 2
```

## 基本类型

### 数字类型

```typescript
// 整数
let decimal: number = 42;
let hex: number = 0xff;
let binary: number = 0b1010;
let octal: number = 0o744;

// 浮点数
let pi: number = 3.14159;
let scientific: number = 1.5e10;

// 特殊值
let infinity: number = Infinity;
let notANumber: number = NaN;

// 注意：TypeScript 不区分整数和浮点数
let integer: number = 42;
let float: number = 42.0;  // 同一个值
```

### 字符串类型

```typescript
// 单引号
let name1: string = 'Alice';

// 双引号
let name2: string = "Bob";

// 模板字符串
let greeting: string = `Hello, ${name1}!`;
let multiLine: string = `
  这是
  多行
  字符串
`;

// 标签模板
function highlight(strings: TemplateStringsArray, ...values: any[]) {
    return strings.reduce((result, str, i) => {
        return result + str + (values[i] ? `<b>${values[i]}</b>` : '');
    }, '');
}
const name = "Alice";
const age = 25;
const html = highlight`Name: ${name}, Age: ${age}`;
```

### 布尔类型

```typescript
let isTrue: boolean = true;
let isFalse: boolean = false;

// 真值和假值
let falsyValues: boolean[] = [
    Boolean(0),
    Boolean(""),
    Boolean(null),
    Boolean(undefined),
    Boolean(NaN),
    Boolean(false)
];
// 全部为 false

// 非零数字、非空字符串、对象都是真值
let truthyValues: boolean[] = [
    Boolean(1),
    Boolean("hello"),
    Boolean({}),
    Boolean([])
];
// 全部为 true
```

### null 和 undefined

```typescript
// undefined - 未初始化的变量
let notDefined: undefined = undefined;

// null - 显式表示空值
let empty: null = null;

// 注意：在严格模式下，null 和 undefined 不能赋给其他类型
let name: string = "Alice";
// name = null;  // ❌ 错误
// name = undefined;  // ❌ 错误

// 使用联合类型允许空值
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
// readonlyArray.push(4);  // ❌ 错误：只读数组不能修改

// 元组（固定长度和类型的数组）
let tuple: [string, number] = ["Alice", 25];
// tuple = [25, "Alice"];  // ❌ 错误：类型不匹配

// 可选元素的元组
let optionalTuple: [string, number?] = ["Alice"];
```

## 对象类型

```typescript
// 内联类型注解
let user: { name: string; age: number } = {
    name: "Alice",
    age: 25
};

// 可选属性
let config: { host: string; port?: number } = {
    host: "localhost"
    // port 是可选的
};

// 只读属性
let point: { readonly x: number; readonly y: number } = {
    x: 10,
    y: 20
};
// point.x = 15;  // ❌ 错误：只读属性
```

## 类型推断

```typescript
// TypeScript 可以自动推断类型
let age = 25;           // 推断为 number
let name = "Alice";     // 推断为 string
let isStudent = true;   // 推断为 boolean
let numbers = [1, 2, 3]; // 推断为 number[]

// 函数返回值类型推断
function add(a: number, b: number) {
    return a + b;  // 返回类型推断为 number
}
```

## 类型断言

```typescript
// 当你比 TypeScript 更了解类型时使用
let someValue: any = "this is a string";

// 方式一：as 语法（推荐）
let strLength: number = (someValue as string).length;

// 方式二：尖括号语法（在 JSX 中不可用）
let strLength2: number = (<string>someValue).length;

// 常见场景：DOM 元素获取
const input = document.getElementById("myInput") as HTMLInputElement;
const value = input.value;
```

## 实用技巧

```typescript
// 非空断言
function getLength(str: string | null): number {
    return str!.length;  // 告诉 TypeScript str 不为 null
}

// 可选链
let user: { name?: string } = {};
console.log(user?.name?.length);  // undefined（不会报错）

// 空值合并
let value: string | null = null;
let defaultVal = value ?? "default";  // "default"

// 类型守卫
function isString(value: any): value is string {
    return typeof value === "string";
}

let input: string | number = "hello";
if (isString(input)) {
    console.log(input.toUpperCase());  // TypeScript 知道 input 是 string
}
```
