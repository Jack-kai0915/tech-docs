# 大语言模型 (LLM)

## 什么是大语言模型

大语言模型（Large Language Model，LLM）是基于 Transformer 架构、经过海量文本数据训练的超大规模神经网络模型。

### 核心特点

- **参数规模大**：数十亿到数万亿参数
- **训练数据多**：万亿级 tokens
- **涌现能力**：规模达到一定程度后出现的能力

## 主流大模型对比

| 模型 | 公司 | 参数量 | 特点 |
|------|------|--------|------|
| GPT-4o | OpenAI | 未公开 | 多模态、强大推理 |
| Claude 3.5 | Anthropic | 未公开 | 安全、长文本 |
| Gemini 1.5 | Google | 未公开 | 超长上下文 |
| Llama 3 | Meta | 405B | 开源 |
| DeepSeek-V3 | 深度求索 | 671B | MoE、推理强 |
| Qwen 2.5 | 阿里 | 72B | 中文优化 |

## LLM 工作原理

### Transformer 架构

```
输入文本 → Tokenization → 嵌入层 → Transformer层 → 输出概率分布
                                   ↓
                              自注意力机制
                              (关注相关词语)
```

### Tokenization（分词）

```python
# 不同模型的分词方式
from transformers import AutoTokenizer

# GPT-4 分词器
tokenizer = AutoTokenizer.from_pretrained("gpt2")

text = "Hello, 你好世界！"
tokens = tokenizer.encode(text)
print(f"原文: {text}")
print(f"Token IDs: {tokens}")
print(f"解码: {tokenizer.decode(tokens)}")
print(f"Token 数量: {len(tokens)}")

# 输出示例:
# 原文: Hello, 你好世界！
# Token IDs: [15496, 11, 44329, 32647, 9972, 95047, 0]
# 解码: Hello, 你好世界！
# Token 数量: 7
```

### 自注意力机制

```python
import torch
import torch.nn.functional as F

def self_attention(Q, K, V, mask=None):
    """
    自注意力机制
    Q: Query 矩阵
    K: Key 矩阵
    V: Value 矩阵
    """
    d_k = Q.size(-1)
    
    # 计算注意力分数
    scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)
    
    # 应用 mask（可选）
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
    
    # Softmax 归一化
    attention_weights = F.softmax(scores, dim=-1)
    
    # 加权求和
    output = torch.matmul(attention_weights, V)
    
    return output, attention_weights

# 示例
seq_len = 4
d_model = 8

Q = torch.randn(1, seq_len, d_model)
K = torch.randn(1, seq_len, d_model)
V = torch.randn(1, seq_len, d_model)

output, weights = self_attention(Q, K, V)
print(f"输出形状: {output.shape}")
print(f"注意力权重形状: {weights.shape}")
```

---

## LLM 核心能力

### 1. 文本生成

```python
# 使用 OpenAI API 生成文本
import openai

client = openai.OpenAI(api_key="your-api-key")

response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "你是一个专业的技术作家"},
        {"role": "user", "content": "写一段关于 JavaScript 闭包的说明"}
    ],
    temperature=0.7,
    max_tokens=500
)

print(response.choices[0].message.content)
```

### 2. 代码生成

```python
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "user", "content": "用 Python 写一个快速排序算法"}
    ]
)

code = response.choices[0].message.content
print(code)
```

### 3. 文本理解与分析

```python
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "user", "content": "分析以下代码的问题：\n```javascript\nvar x = 1;\nif (x = 2) {\n  console.log('yes');\n}\n```"}
    ]
)

analysis = response.choices[0].message.content
print(analysis)
```

### 4. 翻译与摘要

```python
# 翻译
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "user", "content": "将以下英文翻译成中文：\n'Transformer is a deep learning model that uses self-attention mechanism.'"}
    ]
)

# 摘要
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "user", "content": "用一句话总结以下文章的核心观点：[长文本...]"}
    ]
)
```

---

## LLM 参数详解

| 参数 | 说明 | 推荐值 |
|------|------|--------|
| **temperature** | 控制输出随机性 | 0.0-1.0（越高越随机） |
| **top_p** | 核采样阈值 | 0.1-1.0 |
| **max_tokens** | 最大生成长度 | 根据需求设置 |
| **frequency_penalty** | 降低重复度 | 0.0-2.0 |
| **presence_penalty** | 鼓励新话题 | 0.0-2.0 |

```python
# 不同参数的效果对比

# 精确回答
response_exact = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "1+1=??"}],
    temperature=0  # 最确定性
)

# 创意回答
response_creative = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "写一首关于编程的诗"}],
    temperature=0.9  # 高随机性
)
```

---

## 本地部署开源模型

### 使用 Ollama

```bash
# 安装 Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 下载并运行模型
ollama run llama3
ollama run qwen2.5
ollama run deepseek-r1

# API 调用
curl http://localhost:11434/api/generate -d '{
  "model": "llama3",
  "prompt": "什么是闭包？"
}'
```

### 使用 Hugging Face

```python
from transformers import pipeline

# 文本生成
generator = pipeline('text-generation', model='gpt2')
output = generator("The future of AI is", max_length=50)
print(output[0]['generated_text'])

# 情感分析
classifier = pipeline('sentiment-analysis')
result = classifier("I love this product!")
print(result)
```

---

## 为什么学习 LLM？

1. **理解 AI 核心**：GPT、ChatGPT 的底层原理
2. **应用开发能力**：构建 AI 驱动的应用
3. **Prompt Engineering**：高效使用 AI 工具
4. **职业竞争力**：AI 时代的核心技能
5. **创新机会**：开发 AI 原生产品
