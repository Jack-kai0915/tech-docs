# Matplotlib 可视化

## 安装与导入

```bash
pip install matplotlib
```

```python
import matplotlib.pyplot as plt
import numpy as np
```

## 基础图表

### 折线图

```python
x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.figure(figsize=(10, 6))
plt.plot(x, y, label='sin(x)', color='blue', linewidth=2)
plt.xlabel('X 轴')
plt.ylabel('Y 轴')
plt.title('正弦函数')
plt.legend()
plt.grid(True)
plt.show()
```

### 散点图

```python
x = np.random.rand(50)
y = np.random.rand(50)
colors = np.random.rand(50)
sizes = np.random.rand(50) * 1000

plt.figure(figsize=(10, 6))
plt.scatter(x, y, c=colors, s=sizes, alpha=0.5, cmap='viridis')
plt.colorbar()
plt.title('随机散点图')
plt.show()
```

### 柱状图

```python
categories = ['A', 'B', 'C', 'D', 'E']
values = [23, 45, 56, 78, 32]

plt.figure(figsize=(10, 6))
plt.bar(categories, values, color=['red', 'green', 'blue', 'orange', 'purple'])
plt.xlabel('类别')
plt.ylabel('值')
plt.title('柱状图')
plt.show()
```

### 饼图

```python
labels = ['Python', 'Java', 'C++', 'JavaScript', 'Others']
sizes = [35, 25, 20, 15, 5]
colors = ['#ff9999', '#66b3ff', '#99ff99', '#ffcc99', '#ff66b3']
explode = (0.1, 0, 0, 0, 0)  # 突出显示

plt.figure(figsize=(10, 6))
plt.pie(sizes, explode=explode, labels=labels, colors=colors,
        autopct='%1.1f%%', shadow=True, startangle=90)
plt.title('编程语言使用比例')
plt.axis('equal')
plt.show()
```

## 子图

```python
# 创建子图
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# 折线图
axes[0, 0].plot(x, y)
axes[0, 0].set_title('折线图')

# 散点图
axes[0, 1].scatter(x, y)
axes[0, 1].set_title('散点图')

# 柱状图
axes[1, 0].bar(categories, values)
axes[1, 0].set_title('柱状图')

# 饼图
axes[1, 1].pie(sizes, labels=labels)
axes[1, 1].set_title('饼图')

plt.tight_layout()
plt.show()
```

## 样式设置

```python
# 查看可用样式
print(plt.style.available)

# 使用样式
plt.style.use('seaborn-v0_8')  # 或 'ggplot', 'dark_background' 等

# 自定义样式
plt.rcParams['figure.figsize'] = (10, 6)
plt.rcParams['font.size'] = 12
plt.rcParams['axes.grid'] = True
```

## 保存图表

```python
# 保存为文件
plt.savefig('chart.png', dpi=300, bbox_inches='tight')
plt.savefig('chart.pdf')
plt.savefig('chart.svg')
```

## 实战示例

```python
# 数据可视化分析
np.random.seed(42)

# 生成模拟数据
dates = pd.date_range('2024-01-01', periods=365)
temperature = 20 + 10 * np.sin(np.linspace(0, 2*np.pi, 365)) + np.random.randn(365) * 3
sales = 1000 + 200 * np.sin(np.linspace(0, 2*np.pi, 365)) + np.random.randn(365) * 100

# 创建综合图表
fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# 温度变化
axes[0, 0].plot(dates, temperature, color='red', alpha=0.7)
axes[0, 0].set_title('每日温度变化')
axes[0, 0].set_ylabel('温度 (°C)')

# 销售趋势
axes[0, 1].plot(dates, sales, color='blue', alpha=0.7)
axes[0, 1].set_title('销售趋势')
axes[0, 1].set_ylabel('销售额')

# 温度分布
axes[1, 0].hist(temperature, bins=30, color='orange', edgecolor='black')
axes[1, 0].set_title('温度分布')
axes[1, 0].set_xlabel('温度 (°C)')

# 销售分布
axes[1, 1].hist(sales, bins=30, color='green', edgecolor='black')
axes[1, 1].set_title('销售分布')
axes[1, 1].set_xlabel('销售额')

plt.tight_layout()
plt.savefig('analysis.png', dpi=300)
plt.show()
```
