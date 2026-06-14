# 深度学习 (Deep Learning)

## 什么是深度学习

深度学习是机器学习的一个子集，使用多层神经网络从数据中学习特征表示。

### 核心思想

```
输入数据 → 多层神经网络 → 自动学习特征 → 输出结果
         （不需要人工设计特征）
```

## 神经网络基础

### 单个神经元

```python
import numpy as np

def sigmoid(x):
    """激活函数"""
    return 1 / (1 + np.exp(-x))

# 单个神经元
def neuron(inputs, weights, bias):
    """神经元计算"""
    # 加权求和
    weighted_sum = np.dot(inputs, weights) + bias
    # 激活
    output = sigmoid(weighted_sum)
    return output

# 示例：感知机
inputs = np.array([0.5, 0.3, 0.8])  # 输入
weights = np.array([0.4, 0.7, 0.2])  # 权重
bias = 0.1  # 偏置

result = neuron(inputs, weights, bias)
print(f"神经元输出: {result:.4f}")
```

### 多层神经网络

```python
import numpy as np

class NeuralNetwork:
    """简单的多层神经网络"""
    
    def __init__(self, input_size, hidden_size, output_size):
        # 初始化权重
        self.weights1 = np.random.randn(input_size, hidden_size) * 0.5
        self.weights2 = np.random.randn(hidden_size, output_size) * 0.5
        self.bias1 = np.zeros((1, hidden_size))
        self.bias2 = np.zeros((1, output_size))
    
    def sigmoid(self, x):
        return 1 / (1 + np.exp(-np.clip(x, -500, 500)))
    
    def sigmoid_derivative(self, x):
        return x * (1 - x)
    
    def forward(self, X):
        """前向传播"""
        self.hidden = self.sigmoid(np.dot(X, self.weights1) + self.bias1)
        self.output = self.sigmoid(np.dot(self.hidden, self.weights2) + self.bias2)
        return self.output
    
    def backward(self, X, y, output, learning_rate=0.1):
        """反向传播"""
        # 输出层误差
        error = y - output
        delta_output = error * self.sigmoid_derivative(output)
        
        # 隐藏层误差
        error_hidden = delta_output.dot(self.weights2.T)
        delta_hidden = error_hidden * self.sigmoid_derivative(self.hidden)
        
        # 更新权重
        self.weights2 += self.hidden.T.dot(delta_output) * learning_rate
        self.weights1 += X.T.dot(delta_hidden) * learning_rate
    
    def train(self, X, y, epochs=1000):
        """训练模型"""
        for epoch in range(epochs):
            output = self.forward(X)
            self.backward(X, y, output)
            
            if (epoch + 1) % 100 == 0:
                loss = np.mean((y - output) ** 2)
                print(f"Epoch {epoch+1}/{epochs}, Loss: {loss:.6f}")

# XOR 问题
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
y = np.array([[0], [1], [1], [0]])

# 创建并训练网络
nn = NeuralNetwork(input_size=2, hidden_size=4, output_size=1)
nn.train(X, y, epochs=1000)

# 测试
print("\n预测结果:")
for inputs in X:
    output = nn.forward(inputs.reshape(1, -1))
    print(f"{inputs} → {output[0][0]:.4f} (期望: {y[list(X).index(list(inputs))][0]})")
```

---

## 主要神经网络架构

### 1. 卷积神经网络 (CNN)

**用途**：图像识别、视频分析

```python
import torch
import torch.nn as nn

class SimpleCNN(nn.Module):
    """简单的 CNN 用于图像分类"""
    
    def __init__(self, num_classes=10):
        super(SimpleCNN, self).__init__()
        
        # 卷积层
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, padding=1)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.pool = nn.MaxPool2d(2, 2)
        
        # 全连接层
        self.fc1 = nn.Linear(64 * 7 * 7, 128)
        self.fc2 = nn.Linear(128, num_classes)
        
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.25)
    
    def forward(self, x):
        # 卷积 + 池化
        x = self.pool(self.relu(self.conv1(x)))
        x = self.pool(self.relu(self.conv2(x)))
        
        # 展平
        x = x.view(-1, 64 * 7 * 7)
        
        # 全连接
        x = self.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.fc2(x)
        
        return x

# 创建模型
model = SimpleCNN(num_classes=10)
print(f"模型参数: {sum(p.numel() for p in model.parameters()):,}")
```

**应用场景**：
- 人脸识别
- 物体检测
- 医学图像分析
- 自动驾驶

### 2. 循环神经网络 (RNN/LSTM)

**用途**：序列数据处理

```python
import torch
import torch.nn as nn

class SentimentLSTM(nn.Module):
    """情感分析 LSTM 模型"""
    
    def __init__(self, vocab_size, embedding_dim, hidden_dim, output_dim):
        super(SentimentLSTM, self).__init__()
        
        # 词嵌入层
        self.embedding = nn.Embedding(vocab_size, embedding_dim)
        
        # LSTM 层
        self.lstm = nn.LSTM(
            embedding_dim, 
            hidden_dim, 
            num_layers=2,
            batch_first=True,
            dropout=0.2
        )
        
        # 全连接层
        self.fc = nn.Linear(hidden_dim, output_dim)
        self.dropout = nn.Dropout(0.3)
    
    def forward(self, x):
        # 词嵌入
        embedded = self.dropout(self.embedding(x))
        
        # LSTM 处理
        lstm_out, (hidden, cell) = self.lstm(embedded)
        
        # 取最后一个时间步的输出
        hidden = self.dropout(hidden[-1])
        
        # 分类
        output = self.fc(hidden)
        return output

# 示例
vocab_size = 10000
model = SentimentLSTM(
    vocab_size=vocab_size,
    embedding_dim=128,
    hidden_dim=256,
    output_dim=2  # 正面/负面
)

# 模拟输入
batch_size = 32
seq_length = 50
x = torch.randint(0, vocab_size, (batch_size, seq_length))
output = model(x)
print(f"输出形状: {output.shape}")  # [32, 2]
```

**应用场景**：
- 机器翻译
- 文本生成
- 语音识别
- 时间序列预测

### 3. Transformer

**用途**：大语言模型的基础

```python
import torch
import torch.nn as nn
import math

class MultiHeadAttention(nn.Module):
    """多头注意力机制"""
    
    def __init__(self, d_model, n_heads):
        super().__init__()
        self.d_model = d_model
        self.n_heads = n_heads
        self.d_k = d_model // n_heads
        
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
    
    def forward(self, x, mask=None):
        batch_size = x.size(0)
        
        # 线性变换
        Q = self.W_q(x).view(batch_size, -1, self.n_heads, self.d_k).transpose(1, 2)
        K = self.W_k(x).view(batch_size, -1, self.n_heads, self.d_k).transpose(1, 2)
        V = self.W_v(x).view(batch_size, -1, self.n_heads, self.d_k).transpose(1, 2)
        
        # 注意力计算
        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.d_k)
        
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
        
        attention = torch.softmax(scores, dim=-1)
        output = torch.matmul(attention, V)
        
        # 合并多头
        output = output.transpose(1, 2).contiguous().view(batch_size, -1, self.d_model)
        output = self.W_o(output)
        
        return output

# 使用示例
d_model = 512
n_heads = 8
attention = MultiHeadAttention(d_model, n_heads)

x = torch.randn(2, 10, d_model)  # batch=2, seq_len=10
output = attention(x)
print(f"输入形状: {x.shape}")
print(f"输出形状: {output.shape}")
```

---

## 深度学习框架对比

| 框架 | 公司 | 特点 | 适用场景 |
|------|------|------|----------|
| **PyTorch** | Meta | 动态图、易调试 | 研究、NLP |
| **TensorFlow** | Google | 静态图、生产友好 | 工业部署 |
| **JAX** | Google | 函数式、可组合 | 高性能计算 |
| **Keras** | Google | 高级 API | 快速原型 |

---

## 为什么学习深度学习？

1. **自动特征提取**：不需要人工设计特征
2. **性能强大**：在许多任务上超越人类
3. **应用广泛**：从图像到语言到游戏
4. **技术基础**：理解 GPT、Stable Diffusion 的原理
5. **职业发展**：AI 工程师的核心技能
