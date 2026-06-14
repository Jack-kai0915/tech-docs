# Pandas 数据框

## 安装与导入

```bash
pip install pandas
```

```python
import pandas as pd
import numpy as np
```

## 数据结构

### Series（一维）

```python
# 创建 Series
s = pd.Series([1, 2, 3, 4, 5])
print(s)
# 0    1
# 1    2
# 2    3
# 3    4
# 4    5

# 带索引
s = pd.Series([10, 20, 30], index=['a', 'b', 'c'])
print(s['a'])  # 10

# 从字典创建
s = pd.Series({'a': 1, 'b': 2, 'c': 3})
```

### DataFrame（二维）

```python
# 从字典创建
df = pd.DataFrame({
    '姓名': ['Alice', 'Bob', 'Charlie'],
    '年龄': [25, 23, 28],
    '成绩': [95, 87, 92]
})
print(df)
#       姓名  年龄  成绩
# 0    Alice   25   95
# 1      Bob   23   87
# 2  Charlie   28   92

# 从列表创建
df = pd.DataFrame([
    ['Alice', 25, 95],
    ['Bob', 23, 87],
    ['Charlie', 28, 92]
], columns=['姓名', '年龄', '成绩'])

# 从 NumPy 数组创建
arr = np.random.rand(5, 3)
df = pd.DataFrame(arr, columns=['A', 'B', 'C'])
```

## 查看数据

```python
df = pd.DataFrame({
    '姓名': ['Alice', 'Bob', 'Charlie', 'David'],
    '年龄': [25, 23, 28, 32],
    '成绩': [95, 87, 92, 78]
})

# 基本信息
print(df.head(2))      # 前2行
print(df.tail(2))      # 后2行
print(df.shape)        # (4, 3) → 4行3列
print(df.info())       # 数据类型信息
print(df.describe())   # 统计摘要

# 列名
print(df.columns)      # Index(['姓名', '年龄', '成绩'])

# 数据类型
print(df.dtypes)
```

## 索引与选择

```python
# 选择列
print(df['姓名'])      # 返回 Series
print(df[['姓名', '成绩']])  # 返回 DataFrame

# 选择行
print(df[0:2])         # 切片
print(df.iloc[0])      # 位置索引
print(df.iloc[0:2, 1:3])  # 行列切片

# 条件选择
print(df[df['成绩'] > 90])
print(df[(df['成绩'] > 90) & (df['年龄'] < 30)])

# loc 标签索引
print(df.loc[0, '姓名'])  # Alice
print(df.loc[0:2, '姓名':'成绩'])
```

## 数据操作

```python
# 添加列
df['等级'] = df['成绩'].apply(lambda x: 'A' if x >= 90 else 'B')

# 删除列
df = df.drop('等级', axis=1)

# 重命名列
df = df.rename(columns={'姓名': '名字', '年龄': '岁数'})

# 排序
print(df.sort_values('成绩', ascending=False))  # 按成绩降序
print(df.sort_values(['年龄', '成绩'], ascending=[True, False]))

# 替换值
df['成绩'] = df['成绩'].replace(95, 100)
```

## 数据清洗

```python
# 处理缺失值
df = pd.DataFrame({
    'A': [1, 2, np.nan, 4],
    'B': [5, np.nan, np.nan, 8],
    'C': [10, 11, 12, 13]
})

print(df.isnull())          # 检查缺失值
print(df.isnull().sum())    # 每列缺失值数量

# 删除缺失值
print(df.dropna())          # 删除有缺失值的行
print(df.dropna(subset=['A']))  # 只看A列

# 填充缺失值
print(df.fillna(0))         # 用0填充
print(df.fillna(df.mean()))  # 用均值填充

# 重复值
print(df.duplicated())      # 检查重复行
df = df.drop_duplicates()   # 删除重复行
```

## 分组聚合

```python
# 创建示例数据
df = pd.DataFrame({
    '部门': ['销售', '技术', '销售', '技术', '销售'],
    '姓名': ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
    '工资': [8000, 12000, 7500, 15000, 9000]
})

# 分组统计
print(df.groupby('部门')['工资'].mean())
# 部门
# 技术    13500.0
# 销售     8166.7

# 多种聚合
print(df.groupby('部门')['工资'].agg(['mean', 'max', 'min']))

# 分组后应用函数
def salary_level(x):
    return '高' if x.mean() > 10000 else '低'

print(df.groupby('部门')['工资'].apply(salary_level))
```

## 合并数据

```python
# 创建两个数据框
df1 = pd.DataFrame({'A': [1, 2], 'B': [3, 4]})
df2 = pd.DataFrame({'A': [5, 6], 'B': [7, 8]})

# 纵向合并
print(pd.concat([df1, df2]))

# 横向合并
df3 = pd.DataFrame({'C': [9, 10]})
print(pd.concat([df1, df3], axis=1))

# 类似 SQL 的 join
left = pd.DataFrame({'key': ['A', 'B', 'C'], 'value': [1, 2, 3]})
right = pd.DataFrame({'key': ['B', 'C', 'D'], 'value': [4, 5, 6]})
print(pd.merge(left, right, on='key', how='inner'))  # 内连接
print(pd.merge(left, right, on='key', how='left'))   # 左连接
```

## 文件读写

```python
# 读取 CSV
df = pd.read_csv('data.csv')
df = pd.read_csv('data.csv', encoding='utf-8')  # 指定编码
df = pd.read_csv('data.csv', nrows=100)  # 只读前100行

# 保存 CSV
df.to_csv('output.csv', index=False)

# 读取 Excel
df = pd.read_excel('data.xlsx', sheet_name='Sheet1')

# 保存 Excel
df.to_excel('output.xlsx', index=False)

# 读取 JSON
df = pd.read_json('data.json')

# 保存 JSON
df.to_json('output.json', force_ascii=False)
```

## 时间序列

```python
# 创建日期范围
dates = pd.date_range('2024-01-01', periods=10, freq='D')

# 创建时间序列数据
ts = pd.Series(np.random.randn(10), index=dates)

# 重采样
print(ts.resample('M').mean())  # 月平均
print(ts.resample('W').sum())   # 周求和

# 滚动计算
print(ts.rolling(3).mean())  # 3日移动平均
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

# 按日期统计
daily_sales = sales.groupby('日期')['销售额'].sum()

# 找出销售最好的产品
best_product = sales.groupby('产品')['销售额'].sum().idxmax()
print(f"销售最好的产品: {best_product}")

# 数据透视表
pivot = sales.pivot_table(
    values='销售额',
    index='产品',
    aggfunc=['sum', 'mean']
)
print(pivot)
```
