# 循环语句

## for 循环

```typescript
// 基本 for 循环
for (let i = 0; i < 5; i++) {
    console.log(i);  // 0, 1, 2, 3, 4
}

// 遍历数组
let fruits = ["apple", "banana", "cherry"];
for (let i = 0; i < fruits.length; i++) {
    console.log(fruits[i]);
}

// 反向遍历
for (let i = fruits.length - 1; i >= 0; i--) {
    console.log(fruits[i]);
}

// 步长为 2
for (let i = 0; i < 10; i += 2) {
    console.log(i);  // 0, 2, 4, 6, 8
}

// 嵌套循环
for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        console.log(`${i},${j}`);
    }
}
```

## while 循环

```typescript
// 基本 while 循环
let count = 0;
while (count < 5) {
    console.log(count);
    count++;
}

// do...while 循环（至少执行一次）
let num = 0;
do {
    console.log(num);
    num++;
} while (num < 5);

// 无限循环
while (true) {
    // 需要 break 退出
    if (someCondition) break;
}

// 处理不确定次数的循环
function processItems(items: number[]): number {
    let sum = 0;
    let index = 0;
    while (index < items.length && sum < 100) {
        sum += items[index];
        index++;
    }
    return sum;
}
```

## for...of 循环

```typescript
// 遍历数组
let fruits = ["apple", "banana", "cherry"];
for (const fruit of fruits) {
    console.log(fruit);
}

// 遍历字符串
let str = "Hello";
for (const char of str) {
    console.log(char);  // H, e, l, l, o
}

// 遍历 Map
let map = new Map<string, number>();
map.set("a", 1);
map.set("b", 2);
for (const [key, value] of map) {
    console.log(`${key}: ${value}`);
}

// 遍历 Set
let set = new Set([1, 2, 3]);
for (const value of set) {
    console.log(value);
}

// 遍历可迭代对象
function* numberGenerator() {
    yield 1;
    yield 2;
    yield 3;
}

for (const num of numberGenerator()) {
    console.log(num);  // 1, 2, 3
}

// 带索引遍历
let arr = ["a", "b", "c"];
for (const [index, value] of arr.entries()) {
    console.log(`${index}: ${value}`);
}
```

## for...in 循环

```typescript
// 遍历对象属性
let user = {
    name: "Alice",
    age: 25,
    city: "Beijing"
};

for (const key in user) {
    console.log(`${key}: ${user[key as keyof typeof user]}`);
}

// 遍历数组（不推荐，遍历的是索引）
let arr = ["a", "b", "c"];
for (const index in arr) {
    console.log(`${index}: ${arr[Number(index)]}`);
}

// 遍历类的实例属性
class Person {
    name = "Alice";
    age = 25;
}

let person = new Person();
for (const key in person) {
    console.log(`${key}: ${(person as any)[key]}`);
}
```

## break 和 continue

```typescript
// break - 跳出循环
for (let i = 0; i < 10; i++) {
    if (i === 5) break;
    console.log(i);  // 0, 1, 2, 3, 4
}

// continue - 跳过当前迭代
for (let i = 0; i < 10; i++) {
    if (i % 2 === 0) continue;
    console.log(i);  // 1, 3, 5, 7, 9
}

// 带标签的 break/outer
outer: for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        if (i === 1 && j === 1) break outer;
        console.log(`${i},${j}`);
    }
}
// 输出: 0,0  0,1  0,2  1,0

// 带标签的 continue
outer: for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        if (j === 1) continue outer;
        console.log(`${i},${j}`);
    }
}
// 输出: 0,0  1,0  2,0
```

## 实用技巧

```typescript
// 数组遍历方法对比
let arr = [1, 2, 3, 4, 5];

// map - 映射
let doubled = arr.map(x => x * 2);  // [2, 4, 6, 8, 10]

// filter - 过滤
let evens = arr.filter(x => x % 2 === 0);  // [2, 4]

// reduce - 归约
let sum = arr.reduce((a, b) => a + b, 0);  // 15

// find - 查找
let found = arr.find(x => x > 3);  // 4

// some/every - 条件检查
let hasEven = arr.some(x => x % 2 === 0);  // true
let allPositive = arr.every(x => x > 0);   // true

// 优化循环性能
// 使用缓存长度
for (let i = 0, len = arr.length; i < len; i++) {
    console.log(arr[i]);
}

// 使用倒序遍历（当不需要按顺序处理时）
for (let i = arr.length - 1; i >= 0; i--) {
    console.log(arr[i]);
}

// 避免在循环中创建函数
// 不好的做法
for (let i = 0; i < 10; i++) {
    setTimeout(() => console.log(i), 100);
}

// 好的做法
for (let i = 0; i < 10; i++) {
    const value = i;
    setTimeout(() => console.log(value), 100);
}
```

## 异步循环

```typescript
// 顺序执行异步操作
async function processSequentially(items: number[]): Promise<void> {
    for (const item of items) {
        await processItem(item);
    }
}

// 并行执行异步操作
async function processParallel(items: number[]): Promise<void> {
    await Promise.all(items.map(item => processItem(item)));
}

// 使用 for await...of
async function* asyncGenerator() {
    yield 1;
    yield 2;
    yield 3;
}

async function process() {
    for await (const num of asyncGenerator()) {
        console.log(num);
    }
}

// 带并发限制的异步处理
async function processWithLimit<T>(
    items: T[],
    limit: number,
    processor: (item: T) => Promise<void>
): Promise<void> {
    const executing: Promise<void>[] = [];
    
    for (const item of items) {
        const p = processor(item).then(() => {
            executing.splice(executing.indexOf(p), 1);
        });
        executing.push(p);
        
        if (executing.length >= limit) {
            await Promise.race(executing);
        }
    }
    
    await Promise.all(executing);
}
```
