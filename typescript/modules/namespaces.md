# 命名空间

## 基本命名空间

```typescript
// 定义命名空间
namespace Validation {
    export interface Validator {
        validate(value: string): boolean;
    }
    
    export class EmailValidator implements Validator {
        validate(value: string): boolean {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }
    }
    
    export class PhoneValidator implements Validator {
        validate(value: string): boolean {
            return /^\d{11}$/.test(value);
        }
    }
}

// 使用
let emailValidator = new Validation.EmailValidator();
let phoneValidator = new Validation.PhoneValidator();

console.log(emailValidator.validate("test@example.com"));  // true
console.log(phoneValidator.validate("12345678901"));       // true
```

## 命名空间组织

```typescript
// 按功能组织
namespace App.Models {
    export class User {
        constructor(public name: string) {}
    }
    
    export class Post {
        constructor(public title: string) {}
    }
}

namespace App.Services {
    import Models = App.Models;
    
    export class UserService {
        getUser(id: number): Models.User {
            return new Models.User("Alice");
        }
    }
    
    export class PostService {
        getPost(id: number): Models.Post {
            return new Models.Post("Hello");
        }
    }
}

namespace App.Controllers {
    import Services = App.Services;
    
    export class UserController {
        private userService = new Services.UserService();
        
        getUser(id: number) {
            return this.userService.getUser(id);
        }
    }
}

// 使用
let userController = new App.Controllers.UserController();
let user = userController.getUser(1);
```

## 命名空间合并

```typescript
// 同名命名空间自动合并
namespace Animals {
    export class Dog {
        bark() { return "Woof!"; }
    }
}

namespace Animals {
    export class Cat {
        meow() { return "Meow!"; }
    }
}

// 等同于
namespace Animals {
    export class Dog {
        bark() { return "Woof!"; }
    }
    
    export class Cat {
        meow() { return "Meow!"; }
    }
}

// 命名空间与类合并
class MyClass {
    x = 10;
}

namespace MyClass {
    export let y = 20;
}

console.log(new MyClass().x);  // 10
console.log(MyClass.y);        // 20
```

## 命名空间与模块

```typescript
// 在模块文件中使用命名空间
// validators.ts
export namespace Validators {
    export function isEmail(value: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    
    export function isPhone(value: string): boolean {
        return /^\d{11}$/.test(value);
    }
}

// 使用
import { Validators } from "./validators";
console.log(Validators.isEmail("test@example.com"));

// 声明合并
// global.d.ts
declare namespace App {
    interface Config {
        debug: boolean;
    }
}

// 扩展
// config.ts
namespace App {
    export const config: Config = {
        debug: false
    };
}
```

## 实用模式

```typescript
// 工厂模式
namespace Factory {
    export interface Product {
        name: string;
        price: number;
    }
    
    export class Book implements Product {
        name = "Book";
        price = 29.99;
    }
    
    export class Electronics implements Product {
        name = "Electronics";
        price = 999.99;
    }
    
    export function createProduct(type: string): Product {
        switch (type) {
            case "book":
                return new Book();
            case "electronics":
                return new Electronics();
            default:
                throw new Error(`Unknown product type: ${type}`);
        }
    }
}

// 使用
let product = Factory.createProduct("book");
console.log(product.name, product.price);

// 策略模式
namespace Strategies {
    export interface SortStrategy<T> {
        sort(data: T[]): T[];
    }
    
    export class BubbleSort<T> implements SortStrategy<T> {
        sort(data: T[]): T[] {
            // 冒泡排序实现
            return [...data];
        }
    }
    
    export class QuickSort<T> implements SortStrategy<T> {
        sort(data: T[]): T[] {
            // 快速排序实现
            return [...data];
        }
    }
}

// 使用
let sorter = new Strategies.BubbleSort<number>();
let sorted = sorter.sort([3, 1, 4, 1, 5, 9]);
```
