# 条件语句

## if/else

```typescript
// 基本 if
let age = 20;
if (age >= 18) {
    console.log("已成年");
}

// if/else
if (age >= 18) {
    console.log("已成年");
} else {
    console.log("未成年");
}

// if/else if/else
let score = 85;
if (score >= 90) {
    console.log("优秀");
} else if (score >= 80) {
    console.log("良好");
} else if (score >= 70) {
    console.log("中等");
} else if (score >= 60) {
    console.log("及格");
} else {
    console.log("不及格");
}

// 嵌套 if
let isVip = true;
let balance = 1000;
if (isVip) {
    if (balance >= 100) {
        console.log("VIP用户，余额充足");
    } else {
        console.log("VIP用户，余额不足");
    }
} else {
    console.log("普通用户");
}
```

## 真值和假值

```typescript
// 假值（Falsy）
let falsyValues = [
    false,
    0,
    -0,
    0n,
    "",
    null,
    undefined,
    NaN
];

// 真值（Truthy）
let truthyValues = [
    true,
    1,
    -1,
    "hello",
    [],
    {},
    function() {},
    Symbol(),
    Date.now()
];

// 实际应用
let name = "";
if (name) {
    console.log("有名字");
} else {
    console.log("没有名字");
}

// 空数组是真值！
let arr = [];
if (arr) {
    console.log("数组存在");  // 会执行
}
// 如果要检查数组是否为空
if (arr.length > 0) {
    console.log("数组不为空");
}
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

// 条件渲染
let isLoggedIn = true;
let buttonText = isLoggedIn ? "退出" : "登录";
```

## switch 语句

```typescript
// 基本 switch
let day = "Monday";
switch (day) {
    case "Monday":
        console.log("星期一");
        break;
    case "Tuesday":
        console.log("星期二");
        break;
    case "Wednesday":
        console.log("星期三");
        break;
    case "Thursday":
        console.log("星期四");
        break;
    case "Friday":
        console.log("星期五");
        break;
    case "Saturday":
        console.log("星期六");
        break;
    case "Sunday":
        console.log("星期日");
        break;
    default:
        console.log("无效日期");
}

// 多个 case 共享代码
let month = 3;
switch (month) {
    case 12:
    case 1:
    case 2:
        console.log("冬季");
        break;
    case 3:
    case 4:
    case 5:
        console.log("春季");
        break;
    case 6:
    case 7:
    case 8:
        console.log("夏季");
        break;
    case 9:
    case 10:
    case 11:
        console.log("秋季");
        break;
    default:
        console.log("无效月份");
}

// 类型守卫中使用
function handleResponse(status: number): string {
    switch (status) {
        case 200:
            return "成功";
        case 301:
            return "重定向";
        case 404:
            return "未找到";
        case 500:
            return "服务器错误";
        default:
            return `未知状态码: ${status}`;
    }
}
```

## 逻辑运算符

```typescript
// 与运算（&&）- 短路求值
let user = { name: "Alice", age: 25 };
let displayName = user && user.name;  // "Alice"

// 如果 user 为假值，不会继续访问 .name
let emptyUser = null;
let name = emptyUser && emptyUser.name;  // null

// 或运算（||）- 默认值
let config = null;
let defaultConfig = config || { host: "localhost", port: 3000 };

// 注意：0 和 "" 也是假值
let count = 0;
let defaultCount = count || 10;  // 10（可能不是你想要的）

// 使用 ?? 更安全
let defaultCount2 = count ?? 10;  // 0（只在 null/undefined 时使用默认值）

// 组合使用
function greet(name?: string): string {
    return `Hello, ${name ?? "Guest"}!`;
}
```

## 空值合并和可选链

```typescript
// 空值合并（??）
let value = null;
let defaultVal = value ?? "default";  // "default"

let count = 0;
let defaultCount = count ?? 10;  // 0（不是 10）

// 可选链（?.）
let user = {
    name: "Alice",
    address: {
        city: "Beijing"
    }
};

console.log(user?.name);           // "Alice"
console.log(user?.address?.city);  // "Beijing"
console.log(user?.phone?.number);  // undefined（不报错）

// 可选链调用方法
let result = user?.getName?.();  // undefined（如果方法不存在）

// 可选链索引
let arr = [1, 2, 3];
console.log(arr?.[0]);  // 1
console.log(arr?.[10]); // undefined
```

## 类型守卫

```typescript
// typeof 守卫
function process(value: string | number): string {
    if (typeof value === "string") {
        return value.toUpperCase();
    } else {
        return value.toFixed(2);
    }
}

// instanceof 守卫
function formatDate(value: string | Date): string {
    if (value instanceof Date) {
        return value.toISOString();
    }
    return value;
}

// in 守卫
interface Bird { fly(): void; }
interface Fish { swim(): void; }

function move(animal: Bird | Fish): void {
    if ("fly" in animal) {
        animal.fly();
    } else {
        animal.swim();
    }
}

// 自定义类型守卫
function isString(value: unknown): value is string {
    return typeof value === "string";
}

function processValue(value: unknown): string {
    if (isString(value)) {
        return value.toUpperCase();
    }
    return String(value);
}
```

## 实用模式

```typescript
// 提前返回（Guard Clause）
function processUser(user: { name?: string; age?: number }): string {
    if (!user.name) {
        return "名称不能为空";
    }
    if (!user.age || user.age < 0) {
        return "年龄无效";
    }
    // 主要逻辑
    return `${user.name} is ${user.age} years old`;
}

// 多条件简化
function getDiscount(isVip: boolean, isBirthday: boolean): number {
    let discount = 1;
    if (isVip) discount -= 0.1;
    if (isBirthday) discount -= 0.05;
    return discount;
}

// 使用对象映射替代 switch
const statusMessages: Record<number, string> = {
    200: "成功",
    301: "重定向",
    404: "未找到",
    500: "服务器错误"
};

function getStatusMessage(status: number): string {
    return statusMessages[status] ?? `未知状态码: ${status}`;
}
```
