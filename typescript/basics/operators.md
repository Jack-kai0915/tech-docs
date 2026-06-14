# 运算符

## 算术运算符

```typescript
let a = 10, b = 3;

// 基本运算
console.log(a + b);   // 13  加法
console.log(a - b);   // 7   减法
console.log(a * b);   // 30  乘法
console.log(a / b);   // 3.333...  除法
console.log(a % b);   // 1   取模（余数）
console.log(a ** b);  // 1000  幂运算

// 自增自减
let count = 5;
count++;      // count = 6
count--;      // count = 5
console.log(++count);  // 6（先增后用）
console.log(count++);  // 6（先用后增，然后 count = 7）
```

### 特殊数值运算

```typescript
// 浮点数精度问题
console.log(0.1 + 0.2);  // 0.30000000000000004

// 解决方案
let result = Math.round((0.1 + 0.2) * 100) / 100;  // 0.3

// 大数运算
let big = 9007199254740991;  // Number.MAX_SAFE_INTEGER
console.log(big + 1);  // 9007199254740992（正确）
console.log(big + 2);  // 9007199254740992（精度丢失）

// 使用 BigInt 处理大数
let bigInt = 9007199254740991n;
console.log(bigInt + 2n);  // 9007199254740993n
```

## 赋值运算符

```typescript
let x = 10;

// 基本赋值
x = 20;

// 复合赋值
x += 5;    // x = x + 5 = 25
x -= 3;    // x = x - 3 = 22
x *= 2;    // x = x * 2 = 44
x /= 4;    // x = x / 4 = 11
x %= 3;    // x = x % 3 = 2
x **= 3;   // x = x ** 3 = 8

// 位运算赋值
x &= 0xff;   // 按位与赋值
x |= 0x01;   // 按位或赋值
x ^= 0xff;   // 按位异或赋值
x <<= 2;     // 左移赋值
x >>= 1;     // 右移赋值
x >>>= 1;    // 无符号右移赋值
```

## 比较运算符

```typescript
// 相等比较
console.log(5 == 5);      // true（值相等）
console.log(5 == "5");    // true（类型转换后相等）
console.log(5 === 5);     // true（值和类型都相等）
console.log(5 === "5");   // false（类型不同）

// 不相等比较
console.log(5 != 5);      // false
console.log(5 != "5");    // false
console.log(5 !== 5);     // false
console.log(5 !== "5");   // true

// 大小比较
console.log(5 > 3);       // true
console.log(5 < 3);       // false
console.log(5 >= 5);      // true
console.log(5 <= 4);      // false

// 字符串比较（按字典序）
console.log("apple" < "banana");  // true
console.log("A" < "a");          // true（大写字母在前）
```

## 逻辑运算符

```typescript
// 与运算（&&）
console.log(true && true);    // true
console.log(true && false);   // false
console.log(false && true);   // false
console.log(false && false);  // false

// 或运算（||）
console.log(true || true);    // true
console.log(true || false);   // true
console.log(false || true);   // true
console.log(false || false);  // false

// 非运算（!）
console.log(!true);    // false
console.log(!false);   // true

// 空值合并（??）
let value = null;
let defaultVal = value ?? "default";  // "default"

// 逻辑赋值
let a = 1;
let b = 2;
a &&= b;   // a = a && b = 2
a ||= b;   // a = a || b = 2
a ??= b;   // a = a ?? b = 2
```

## 三元运算符

```typescript
// 基本语法
let age = 20;
let status = age >= 18 ? "成年" : "未成年";

// 嵌套三元（不推荐过度嵌套）
let score = 85;
let grade = score >= 90 ? "A" :
            score >= 80 ? "B" :
            score >= 70 ? "C" :
            score >= 60 ? "D" : "F";

// 在模板字符串中使用
let message = `你${age >= 18 ? "已成年" : "未成年"}`;
```

## 位运算符

```typescript
let a = 5;   // 二进制：101
let b = 3;   // 二进制：011

// 按位与（&）
console.log(a & b);   // 1（二进制：001）

// 按位或（|）
console.log(a | b);   // 7（二进制：111）

// 按位异或（^）
console.log(a ^ b);   // 6（二进制：110）

// 按位非（~）
console.log(~a);      // -6

// 左移（<<）
console.log(a << 1);  // 10（二进制：1010）
console.log(a << 2);  // 20（二进制：10100）

// 右移（>>）
console.log(a >> 1);  // 2（二进制：10）

// 无符号右移（>>>）
let c = -5;
console.log(c >>> 1); // 2147483645
```

## 实用技巧

```typescript
// 交换两个变量
let x = 1, y = 2;
[x, y] = [y, x];  // x = 2, y = 1

// 快速生成范围
let range = Array.from({length: 10}, (_, i) => i);  // [0, 1, 2, ..., 9]

// 条件赋值
let isVip = true;
let discount = isVip ? 0.8 : 1;

// 链式比较（模拟 Python）
function between(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
}
console.log(between(5, 1, 10));  // true

// 安全的除法
function safeDivide(a: number, b: number): number | null {
    if (b === 0) return null;
    return a / b;
}

// 类型安全的相等比较
function equals(a: unknown, b: unknown): boolean {
    return Object.is(a, b);
}
console.log(equals(NaN, NaN));  // true（与 === 不同）
```
