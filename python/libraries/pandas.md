# Pandas 数据分析

## 安装与导入

```bash
pip install pandas
```

```python
import pandas as pd
import numpy as np
```

## 创建数据

```python
# 从字典创建
df = pd.DataFrame({
    '姓名': ['Alice', 'Bob', 'Charlie'],
    '年龄': [25, 23, 28],
    '成绩': [95, 87, 92]
})

# 从 CSV 读取
df = pd.read_csv('data.csv')

# 从 Excel 读取
df = pd.read_excel('data.xlsx')
```

## 查看数据

```python
df.head(5)        # 前5行
df.tail(5)        # 后5行
df.shape          # (行数, 列数)
df.info()         # 数据类型信息
df.describe()     # 统计摘要
df.columns        # 列名
df.dtypes         # 数据类型
```

## 选择数据

```python
# 选择列
df['姓名']              # 单列
df[['姓名', '成绩']]    # 多列

# 选择行
df[0:5]                 # 切片
df.iloc[0]              # 位置索引
df.loc[0:5]             # 标签索引

# 条件选择
df[df['成绩'] > 90]
df[(df['成绩'] > 90) & (df['年龄'] < 30)]
```

## 数据操作

```python
# 添加列
df['等级'] = df['成绩'].apply(lambda x: 'A' if x >= 90 else 'B')

# 删除列
df = df.drop('等级', axis=1)

# 重命名
df = df.rename(columns={'姓名': '名字'})

# 排序
df.sort_values('成绩', ascending=False)

# 替换
df['成绩'] = df['成绩'].replace(95, 100)
```

## 数据清洗

```python
# 检查缺失值
df.isnull()
df.isnull().sum()

# 处理缺失值
df.dropna()                    # 删除
df.fillna(0)                   # 填充0
df.fillna(df.mean())           # 填充均值

# 删除重复
df.drop_duplicates()
```

## 分组聚合

```python
# 按组统计
df.groupby('部门')['工资'].mean()

# 多种聚合
df.groupby('部门')['工资'].agg(['mean', 'max', 'min'])

# 自定义聚合
df.groupby('部门').apply(lambda x: x['工资'].max() - x['工资'].min())
```

## 合并数据

```python
# 纵向合并
pd.concat([df1, df2])

# 横向合并
pd.concat([df1, df2], axis=1)

# 类似 SQL join
pd.merge(left, right, on='key', how='inner')
pd.merge(left, right, on='key', how='left')
```

## 文件读写

```python
# CSV
df.to_csv('output.csv', index=False)

# Excel
df.to_excel('output.xlsx', index=False)

# JSON
df.to_json('output.json', force_ascii=False)
```

## 实战示例

```python
# 销售数据分析
sales = pd.DataFrame({
    '日期': pd.date_range('2024-01-01', periods=100),
    '产品': np.random.choice(['A', 'B', 'C'], 100),
    '销量': np.random.randint(10, 100, 100),
    '单价': np.random.uniform(10, 100, 100)
})

# 计算销售额
sales['销售额'] = sales['销量'] * sales['单价']

# 按产品统计
product_stats = sales.groupby('产品').agg({
    '销量': 'sum',
    '销售额': ['sum', 'mean']
})
print(product_stats)

# 数据透视表
pivot = sales.pivot_table(
    values='销售额',
    index='产品',
    aggfunc=['sum', 'mean']
)
print(pivot)
```
