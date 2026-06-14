# 机器学习 (Machine Learning)

## 什么是机器学习

机器学习是 AI 的核心分支，让计算机从数据中学习规律，而不是通过显式编程。

### 核心思想

```
传统编程：输入 + 规则 → 输出
机器学习：输入 + 输出 → 规则（模型）
```

## 机器学习的三种类型

### 1. 监督学习 (Supervised Learning)

**定义**：使用带标签的数据训练模型

**应用场景**：
- 垃圾邮件检测
- 图像分类
- 房价预测

**示例代码**：

```python
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import numpy as np

# 准备数据（带标签）
# 特征：[年龄, 收入, 购买次数]
X = np.array([
    [25, 5000, 10],
    [30, 8000, 20],
    [45, 12000, 30],
    [35, 6000, 15],
    [50, 15000, 40]
])

# 标签：是否为高价值客户 (1=是, 0=否)
y = np.array([0, 0, 1, 0, 1])

# 划分训练集和测试集
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 训练模型
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# 预测
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)

print(f"模型准确率: {accuracy * 100:.2f}%")

# 预测新客户
new_customer = [[38, 9000, 25]]
result = model.predict(new_customer)
print(f"预测结果: {'高价值客户' if result[0] == 1 else '普通客户'}")
```

### 2. 无监督学习 (Unsupervised Learning)

**定义**：从无标签数据中发现隐藏模式

**应用场景**：
- 客户分群
- 异常检测
- 数据降维

**示例代码**：

```python
from sklearn.cluster import KMeans
import numpy as np

# 客户数据（无标签）
# [年消费额, 访问频率, 购买频率]
customers = np.array([
    [1000, 5, 2],
    [1500, 8, 3],
    [5000, 20, 10],
    [4500, 18, 8],
    [800, 3, 1],
    [5200, 22, 12],
    [1200, 6, 2],
    [4800, 19, 9]
])

# K-Means 聚类
kmeans = KMeans(n_clusters=3, random_state=42)
clusters = kmeans.fit_predict(customers)

# 分析结果
for i, (customer, cluster) in enumerate(zip(customers, clusters)):
    print(f"客户 {i+1}: 消费={customer[0]}, 访问={customer[1]}, 购买={customer[2]} → 群组 {cluster+1}")

# 分群分析
print("\n分群特征:")
for i in range(3):
    cluster_customers = customers[clusters == i]
    print(f"群组 {i+1}: 平均消费={cluster_customers[:, 0].mean():.0f}, "
          f"平均访问={cluster_customers[:, 1].mean():.1f}")
```

### 3. 强化学习 (Reinforcement Learning)

**定义**：通过与环境交互，学习最优策略

**应用场景**：
- 游戏 AI
- 机器人控制
- 自动驾驶

**示例代码**：

```python
import numpy as np
import random

class SimpleQLearning:
    """简化的 Q-Learning 实现"""
    
    def __init__(self, n_states, n_actions, learning_rate=0.1, discount=0.95):
        self.q_table = np.zeros((n_states, n_actions))
        self.lr = learning_rate
        self.discount = discount
        self.epsilon = 0.1  # 探索率
    
    def choose_action(self, state):
        """选择动作（ε-贪心策略）"""
        if random.random() < self.epsilon:
            return random.randint(0, self.q_table.shape[1] - 1)
        return np.argmax(self.q_table[state])
    
    def update(self, state, action, reward, next_state):
        """更新 Q 值"""
        best_next = np.max(self.q_table[next_state])
        self.q_table[state, action] = (
            self.q_table[state, action] + 
            self.lr * (reward + self.discount * best_next - self.q_table[state, action])
        )

# 迷宫游戏示例
# 状态: 位置 (0-5)
# 动作: 0=左, 1=右
# 目标: 到达位置 5

env = SimpleQLearning(n_states=6, n_actions=2)

# 奖励设置
rewards = {
    (0, 1): -1, (1, 1): -1, (2, 1): -1,
    (3, 1): -1, (4, 1): 100,  # 到达目标
    (1, 0): -1, (2, 0): -1, (3, 0): -1,
    (4, 0): -1, (5, 0): -1
}

# 训练
for episode in range(1000):
    state = 0
    while state != 5:
        action = env.choose_action(state)
        next_state = state + (1 if action == 1 else -1)
        next_state = max(0, min(5, next_state))
        
        reward = rewards.get((state, action), -1)
        env.update(state, action, reward, next_state)
        state = next_state

# 测试学到的策略
state = 0
print("学到的路径: ", end="")
while state != 5:
    action = np.argmax(env.q_table[state])
    print(f"{state}", end=" → ")
    state = state + (1 if action == 1 else -1)
print("5 (目标)")
```

---

## 关键术语

| 术语 | 解释 | 示例 |
|------|------|------|
| **特征 (Feature)** | 输入数据的属性 | 房价预测中的"面积"、"位置" |
| **标签 (Label)** | 监督学习的目标值 | 图片分类中的"猫"、"狗" |
| **模型 (Model)** | 从数据中学到的规律 | 决策树、神经网络 |
| **训练 (Training)** | 用数据更新模型参数 | 调整神经网络权重 |
| **过拟合 (Overfitting)** | 模型过度记忆训练数据 | 在训练集表现好，测试集差 |
| **欠拟合 (Underfitting)** | 模型未能捕捉数据规律 | 训练集和测试集都差 |

---

## 机器学习工作流程

```
1. 数据收集 → 2. 数据清洗 → 3. 特征工程 → 4. 模型选择 
    ↓
8. 部署上线 ← 7. 模型优化 ← 6. 超参数调优 ← 5. 模型训练
```

### 实际案例：房价预测

```python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_squared_error

# 1. 数据收集
data = pd.DataFrame({
    'area': [100, 120, 80, 150, 90, 200, 110, 130],
    'rooms': [2, 3, 2, 4, 2, 5, 3, 3],
    'age': [10, 5, 15, 3, 12, 2, 8, 6],
    'price': [300, 400, 250, 550, 280, 700, 350, 420]
})

# 2. 特征和标签分离
X = data[['area', 'rooms', 'age']]
y = data['price']

# 3. 划分数据集
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# 4. 训练模型
model = GradientBoostingRegressor()
model.fit(X_train, y_train)

# 5. 评估
predictions = model.predict(X_test)
mse = mean_squared_error(y_test, predictions)
print(f"均方误差: {mse:.2f}")

# 6. 预测新房价格
new_house = [[125, 3, 5]]
predicted_price = model.predict(new_house)
print(f"预测房价: {predicted_price[0]:.0f} 万元")
```

---

## 为什么学习机器学习？

1. **自动化决策**：从数据中自动发现规律
2. **预测能力**：预测未来趋势和结果
3. **个性化推荐**：为每个用户提供定制体验
4. **异常检测**：自动发现异常行为
5. **核心技能**：AI 时代的基础能力
