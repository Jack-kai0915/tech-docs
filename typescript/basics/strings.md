# 字符串操作

## 字符串基础

```typescript
// 创建字符串
let str1 = 'Hello';
let str2 = "World";
let str3 = `Template Literal`;

// 字符串长度
let length = "Hello".length;  // 5

// 访问字符
let char = "Hello"[0];  // "H"
let charAt = "Hello".charAt(1);  // "e"
```

## 模板字面量

```typescript
// 基本插值
let name = "Alice";
let age = 25;
let message = `Hello, ${name}! You are ${age} years old.`;

// 表达式插值
let price = 100;
let quantity = 3;
let total = `Total: $${price * quantity}`;

// 多行字符串
let multiLine = `
  Line 1
  Line 2
  Line 3
`;

// 标签模板
function highlight(strings: TemplateStringsArray, ...values: any[]) {
    return strings.reduce((result, str, i) => {
        return result + str + (values[i] ? `<b>${values[i]}</b>` : '');
    }, '');
}

let name2 = "Alice";
let age2 = 25;
let html = highlight`Name: ${name2}, Age: ${age2}`;
// "Name: <b>Alice</b>, Age: <b>25</b>"
```

## 常用方法

### 查找

```typescript
let str = "Hello, World!";

// 查找子串位置
console.log(str.indexOf("World"));       // 7
console.log(str.indexOf("world"));       // -1（区分大小写）
console.log(str.indexOf("o", 5));        // 8（从位置5开始搜索）

// 包含检查
console.log(str.includes("World"));      // true
console.log(str.includes("world"));      // false

// 开头/结尾检查
console.log(str.startsWith("Hello"));    // true
console.log(str.endsWith("!"));          // true

// 查找第一个/最后一个匹配
console.log(str.search(/world/i));       // 7（正则搜索）
```

### 截取

```typescript
let str = "Hello, World!";

// substring（不改变原字符串）
console.log(str.substring(0, 5));        // "Hello"
console.log(str.substring(7));           // "World!"

// slice（支持负数索引）
console.log(str.slice(0, 5));            // "Hello"
console.log(str.slice(-6));              // "orld!"
console.log(str.slice(-6, -1));          // "orld"

// substr（已废弃，不推荐）
console.log(str.substr(7, 5));           // "World"
```

### 替换

```typescript
let str = "Hello, World!";

// 替换第一个匹配
console.log(str.replace("World", "TypeScript"));  // "Hello, TypeScript!"

// 替换所有匹配
let str2 = "aaa";
console.log(str2.replace(/a/g, "b"));  // "bbb"

// 使用函数替换
let result = str.replace(/(\w+)/g, (match) => {
    return match.toUpperCase();
});
console.log(result);  // "HELLO, WORLD!"

//replaceAll（ES2021）
let str3 = "aaa";
console.log(str3.replaceAll("a", "b"));  // "bbb"
```

### 分割和连接

```typescript
// 分割字符串
let csv = "apple,banana,cherry";
let fruits = csv.split(",");  // ["apple", "banana", "cherry"]

let sentence = "Hello World";
let words = sentence.split(" ");  // ["Hello", "World"]

// 限制分割数量
let str = "a,b,c,d";
console.log(str.split(",", 2));  // ["a", "b"]

// 连接数组
let arr = ["Hello", "World"];
console.log(arr.join(" "));  // "Hello World"
console.log(arr.join("-"));  // "Hello-World"
```

### 大小写转换

```typescript
let str = "Hello, World!";

console.log(str.toUpperCase());  // "HELLO, WORLD!"
console.log(str.toLowerCase());  // "hello, world!"

// 首字母大写
function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

console.log(capitalize("hello"));  // "Hello"
```

### 修剪

```typescript
let str = "  Hello, World!  ";

console.log(str.trim());       // "Hello, World!"
console.log(str.trimStart());  // "Hello, World!  "
console.log(str.trimEnd());    // "  Hello, World!"

// 去除所有空白
let noSpace = str.replace(/\s/g, "");  // "Hello,World!"
```

### 重复和填充

```typescript
// 重复字符串
console.log("ha".repeat(3));  // "hahaha"

// 填充字符串
console.log("5".padStart(3, "0"));    // "005"
console.log("hello".padEnd(10, "."));  // "hello....."

// 使用不同字符填充
console.log("5".padStart(8, "-"));    // "-------5"
```

## 正则表达式

```typescript
// 创建正则
let regex1 = /pattern/g;
let regex2 = new RegExp("pattern", "g");

// 常用方法
let str = "Hello, World! 123";

// 测试匹配
console.log(/\d+/.test(str));  // true

// 获取匹配
let match = str.match(/\d+/);
console.log(match);  // ["123"]

// 获取所有匹配
let matches = str.match(/\w+/g);
console.log(matches);  // ["Hello", "World", "123"]

// 替换
console.log(str.replace(/\d+/g, "NUM"));  // "Hello, World! NUM"

// 捕获组
let date = "2024-01-15";
let [, year, month, day] = date.match(/(\d{4})-(\d{2})-(\d{2})/) || [];
console.log(year, month, day);  // "2024" "01" "15"
```

## 实用函数

```typescript
// 反转字符串
function reverse(str: string): string {
    return str.split("").reverse().join("");
}

console.log(reverse("hello"));  // "olleh"

// 检查回文
function isPalindrome(str: string): boolean {
    const clean = str.toLowerCase().replace(/[^a-z0-9]/g, "");
    return clean === reverse(clean);
}

console.log(isPalindrome("A man, a plan, a canal: Panama"));  // true

// 截断字符串
function truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - 3) + "...";
}

console.log(truncate("Hello, World!", 10));  // "Hello, ..."

// 驼峰转换
function toCamelCase(str: string): string {
    return str
        .replace(/[-_\s]+(.)?/g, (_, char) => char?.toUpperCase() ?? "")
        .replace(/^(.)/, (_, char) => char.toLowerCase());
}

console.log(toCamelCase("hello-world"));  // "helloWorld"
console.log(toCamelCase("foo_bar_baz"));  // "fooBarBaz"

// 蛇形转换
function toSnakeCase(str: string): string {
    return str
        .replace(/([A-Z])/g, "_$1")
        .toLowerCase()
        .replace(/^_/, "");
}

console.log(toSnakeCase("helloWorld"));  // "hello_world"

// 格式化数字为字符串
function formatNumber(num: number): string {
    return num.toLocaleString("en-US");
}

console.log(formatNumber(1234567));  // "1,234,567"
```
