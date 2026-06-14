# 数据分析项目

## 项目概述

本项目将使用 Pandas、NumPy 和 Matplotlib 进行完整的数据分析流程。

## 数据准备

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# 生成模拟销售数据
np.random.seed(42)
n_records = 1000

data = {
    '日期': pd.date_range('2024-01-01', periods=n_records, freq='D'),
    '产品': np.random.choice(['iPhone', 'iPad', 'MacBook', 'AirPods'], n_records),
    '地区': np.random.choice(['北京', '上海', '广州', '深圳'], n_records),
    '销量': np.random.randint(1, 50, n_records),
    '单价': np.random.uniform(100, 10000, n_records).round(2)
}

df = pd.DataFrame(data)
df['销售额'] = df['销量'] * df['单价']
df['成本'] = df['销售额'] * np.random.uniform(0.6, 0.8, n_records)
df['利润'] = df['销售额'] - df['成本']

# 保存数据
df.to_csv('sales_data.csv', index=False)
```

## 数据探索

```python
# 基本信息
print("数据形状:", df.shape)
print("\n数据类型:")
print(df.dtypes)
print("\n前5行:")
print(df.head())
print("\n统计摘要:")
print(df.describe())

# 检查缺失值
print("\n缺失值统计:")
print(df.isnull().sum())

# 检查重复值
print("\n重复行数:", df.duplicated().sum())
```

## 数据清洗

```python
# 处理缺失值
df = df.dropna()

# 处理重复值
df = df.drop_duplicates()

# 数据类型转换
df['日期'] = pd.to_datetime(df['日期'])

# 异常值处理
Q1 = df['销售额'].quantile(0.25)
Q3 = df['销售额'].quantile(0.75)
IQR = Q3 - Q1
lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

df = df[(df['销售额'] >= lower_bound) & (df['销售额'] <= upper_bound)]
```

## 数据分析

### 按产品分析

```python
# 产品销售统计
product_stats = df.groupby('产品').agg({
    '销量': 'sum',
    '销售额': ['sum', 'mean'],
    '利润': 'sum'
}).round(2)

print("产品销售统计:")
print(product_stats)

# 可视化
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# 销售额
product_sales = df.groupby('产品')['销售额'].sum()
axes[0, 0].bar(product_sales.index, product_sales.values)
axes[0, 0].set_title('各产品销售额')
axes[0, 0].set_ylabel('销售额')

# 销量
product_quantity = df.groupby('产品')['销量'].sum()
axes[0, 1].pie(product_quantity.values, labels=product_quantity.index, autopct='%1.1f%%')
axes[0, 1].set_title('各产品销量占比')

# 利润
product_profit = df.groupby('产品')['利润'].sum()
axes[1, 0].bar(product_profit.index, product_profit.values, color='green')
axes[1, 0].set_title('各产品利润')
axes[1, 0].set_ylabel('利润')

# 平均单价
product_avg_price = df.groupby('产品')['单价'].mean()
axes[1, 1].bar(product_avg_price.index, product_avg_price.values, color='orange')
axes[1, 1].set_title('各产品平均单价')
axes[1, 1].set_ylabel('单价')

plt.tight_layout()
plt.savefig('product_analysis.png', dpi=300)
plt.show()
```

### 按地区分析

```python
# 地区销售统计
region_stats = df.groupby('地区').agg({
    '销量': 'sum',
    '销售额': 'sum',
    '利润': 'sum'
}).round(2)

print("\n地区销售统计:")
print(region_stats)

# 可视化
fig, axes = plt.subplots(1, 3, figsize=(15, 5))

# 销售额
region_sales = df.groupby('地区')['销售额'].sum()
axes[0].bar(region_sales.index, region_sales.values, color=['red', 'green', 'blue', 'orange'])
axes[0].set_title('各地区销售额')
axes[0].set_ylabel('销售额')

# 销量
region_quantity = df.groupby('地区')['销量'].sum()
axes[1].bar(region_quantity.index, region_quantity.values, color=['red', 'green', 'blue', 'orange'])
axes[1].set_title('各地区销量')
axes[1].set_ylabel('销量')

# 利润
region_profit = df.groupby('地区')['利润'].sum()
axes[2].bar(region_profit.index, region_profit.values, color=['red', 'green', 'blue', 'orange'])
axes[2].set_title('各地区利润')
axes[2].set_ylabel('利润')

plt.tight_layout()
plt.savefig('region_analysis.png', dpi=300)
plt.show()
```

### 时间趋势分析

```python
# 按月统计
df['月份'] = df['日期'].dt.to_period('M')
monthly_sales = df.groupby('月份')['销售额'].sum()

plt.figure(figsize=(12, 6))
monthly_sales.plot(kind='line', marker='o')
plt.title('月度销售趋势')
plt.xlabel('月份')
plt.ylabel('销售额')
plt.grid(True)
plt.savefig('monthly_trend.png', dpi=300)
plt.show()

# 按星期统计
df['星期'] = df['日期'].dt.day_name()
weekday_sales = df.groupby('星期')['销售额'].mean()

plt.figure(figsize=(10, 6))
weekday_sales.plot(kind='bar')
plt.title('各星期平均销售额')
plt.xlabel('星期')
plt.ylabel('平均销售额')
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('weekday_analysis.png', dpi=300)
plt.show()
```

## 报告生成

```python
# 生成分析报告
report = f"""
# 销售数据分析报告

## 数据概览
- 数据时间范围: {df['日期'].min().date()} 至 {df['日期'].max().date()}
- 总记录数: {len(df)}
- 总销售额: ¥{df['销售额'].sum():,.2f}
- 总利润: ¥{df['利润'].sum():,.2f}

## 产品分析
{product_stats.to_markdown()}

## 地区分析
{region_stats.to_markdown()}

## 关键发现
1. 销售额最高的产品是: {product_sales.idxmax()}
2. 销售额最高的地区是: {region_sales.idxmax()}
3. 月度销售趋势显示: {'增长' if monthly_sales.iloc[-1] > monthly_sales.iloc[0] else '下降'}趋势

## 建议
1. 加强{product_sales.idxmax()}产品的营销
2. 重点关注{region_sales.idxmax()}市场
3. 优化{product_sales.idxmin()}产品的定价策略
"""

with open('analysis_report.md', 'w', encoding='utf-8') as f:
    f.write(report)

print("报告已生成: analysis_report.md")
```

## 项目结构

```
data_analysis_project/
├── data/
│   └── sales_data.csv
├── analysis/
│   ├── product_analysis.png
│   ├── region_analysis.png
│   ├── monthly_trend.png
│   └── weekday_analysis.png
├── reports/
│   └── analysis_report.md
├── notebooks/
│   └── analysis.ipynb
└── scripts/
    └── analyze.py
```
