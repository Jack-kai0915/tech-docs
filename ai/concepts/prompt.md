# 提示工程 (Prompt Engineering)

## 什么是提示工程

提示工程是设计和优化输入提示（Prompt）以从 AI 模型获得更好输出的技术。

### 核心思想

```
好的 Prompt = 清晰的指令 + 充足的上下文 + 合适的格式要求
```

## Prompt 设计原则

### 1. 明确性

```python
# ❌ 不好的 Prompt
"写点关于 JavaScript 的东西"

# ✅ 好的 Prompt
"用中文写一篇 500 字的技术博客，介绍 JavaScript 中闭包的概念、用途和注意事项，面向有 1 年经验的前端开发者"
```

### 2. 结构化

```python
# 结构化 Prompt 示例
prompt = """
## 任务
将以下 JSON 数据转换为 TypeScript 接口定义

## 输入格式
```json
{
  "name": "string",
  "age": 25,
  "isActive": true
}
```

## 要求
1. 使用 interface 语法
2. 添加中文注释
3. 处理可选字段

## 输出格式
直接输出代码，不需要解释
"""
```

### 3. 示例驱动 (Few-shot)

```python
prompt = """
将用户评论分类为正面、负面或中性。

示例：
评论: "这个产品太棒了，强烈推荐！"
分类: 正面

评论: "质量很差，不值这个价格"
分类: 负面

评论: "一般般，没什么特别的"
分类: 中性

现在请分类：
评论: "服务态度很好，但等待时间太长"
分类: """
```

---

## 常用 Prompt 技术

### 1. 角色设定 (Role Prompting)

```python
prompt = """
你是一位资深的前端架构师，有 10 年 React 开发经验。
请以专业但易懂的方式回答以下问题：

问题：微前端和传统前端有什么区别？各自的适用场景是什么？
"""
```

### 2. 链式思考 (Chain of Thought)

```python
prompt = """
请一步一步分析以下代码的问题：

```javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n-1) + fibonacci(n-2);
}
```

请按照以下步骤分析：
1. 首先解释代码的功能
2. 分析时间复杂度
3. 指出潜在问题
4. 提出优化方案
"""
```

### 3. 格式控制

```python
prompt = """
将以下信息整理成表格格式：

产品：iPhone 15 Pro
价格：7999 元
特点：钛金属边框、A17 Pro 芯片、4800 万像素

请输出 Markdown 表格，包含：属性、值、说明
"""
```

### 4. 限制条件

```python
prompt = """
用不超过 100 字解释什么是 RESTful API。
要求：
- 面向初中级开发者
- 包含一个简单的比喻
- 不要使用技术术语
"""
```

---

## 实战示例

### 代码审查

```python
code_review_prompt = """
你是一位代码审查专家。请审查以下代码，关注：
1. 代码质量和可读性
2. 潜在的 Bug
3. 性能问题
4. 安全风险
5. 最佳实践

输出格式：
- 问题描述
- 严重程度（高/中/低）
- 修改建议

代码：
```javascript
function processUser(user) {
  if (user.name != null) {
    var result = {};
    result.name = user.name;
    result.email = user.email;
    eval('result.age = ' + user.age);
    return result;
  }
}
```
"""
```

### API 文档生成

```python
api_doc_prompt = """
根据以下代码生成 API 文档：

```javascript
app.post('/api/users', async (req, res) => {
  const { name, email, age } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: '缺少必填字段' });
  }
  
  const user = await User.create({ name, email, age });
  res.status(201).json(user);
});
```

请生成包含以下内容的文档：
1. 接口说明
2. 请求方法和路径
3. 请求参数
4. 响应格式
5. 错误码说明
6. 调用示例
"""
```

### 测试用例生成

```python
test_gen_prompt = """
为以下函数生成单元测试用例：

```javascript
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
```

要求：
1. 使用 Jest 测试框架
2. 覆盖正常情况和边界情况
3. 包含注释说明每个测试的目的
4. 测试用例包括：有效邮箱、无效格式、空字符串、特殊字符
"""
```

---

## AI 编程助手的最佳实践

### Cursor / GitHub Copilot

```
# 使用注释引导 AI
// 计算两个日期之间的工作日数量（排除周末和节假日）
function countWorkdays(startDate, endDate, holidays = []) {
  // AI 会根据注释生成完整实现
}
```

### ChatGPT / Claude

```python
# 提供上下文
prompt = """
## 项目背景
我正在开发一个电商网站的购物车功能，使用 React + TypeScript。

## 当前代码
[粘贴现有代码]

## 需求
添加优惠券功能，支持：
1. 折扣码（百分比折扣）
2. 满减券
3. 优惠券有效期检查

请帮我设计数据结构和实现逻辑。
"""
```

---

## 为什么学习提示工程？

1. **提升效率**：更快获得高质量输出
2. **减少返工**：一次到位的 AI 交互
3. **解锁能力**：让 AI 完成复杂任务
4. **核心竞争力**：AI 时代的基本素养
5. **开发加速**：代码生成、文档编写、调试
