# 机器学习入门

## 项目概述

使用 Scikit-learn 实现机器学习项目，包括数据预处理、模型训练、评估和预测。

## 环境准备

```bash
pip install numpy pandas scikit-learn matplotlib seaborn
```

## 数据集加载

```python
import numpy as np
import pandas as pd
from sklearn.datasets import load_iris, load_wine, load_breast_cancer

# 加载内置数据集
iris = load_iris()
X = pd.DataFrame(iris.data, columns=iris.feature_names)
y = pd.Series(iris.target, name='species')

print("数据集信息:")
print(f"样本数: {len(X)}")
print(f"特征数: {len(X.columns)}")
print(f"类别数: {len(np.unique(y))}")
print(f"\n特征名称: {iris.feature_names}")
print(f"类别名称: {iris.target_names}")
```

## 数据预处理

```python
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer

# 处理缺失值
imputer = SimpleImputer(strategy='mean')
X_imputed = pd.DataFrame(imputer.fit_transform(X), columns=X.columns)

# 特征缩放
scaler = StandardScaler()
X_scaled = pd.DataFrame(scaler.fit_transform(X_imputed), columns=X.columns)

# 划分训练集和测试集
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42, stratify=y
)

print(f"训练集大小: {len(X_train)}")
print(f"测试集大小: {len(X_test)}")
```

## 模型训练

### 分类模型

```python
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# 定义模型
models = {
    'Logistic Regression': LogisticRegression(max_iter=200),
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
    'SVM': SVC(kernel='rbf', random_state=42),
    'KNN': KNeighborsClassifier(n_neighbors=5),
    'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42)
}

# 训练和评估模型
results = {}
for name, model in models.items():
    # 训练
    model.fit(X_train, y_train)
    
    # 预测
    y_pred = model.predict(X_test)
    
    # 评估
    accuracy = accuracy_score(y_test, y_pred)
    results[name] = accuracy
    
    print(f"\n{name}:")
    print(f"准确率: {accuracy:.4f}")
    print("\n分类报告:")
    print(classification_report(y_test, y_pred, target_names=iris.target_names))
```

### 回归模型

```python
from sklearn.datasets import load_boston
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score

# 加载回归数据集
boston = load_boston()
X_reg = pd.DataFrame(boston.data, columns=boston.feature_names)
y_reg = pd.Series(boston.target, name='MEDV')

# 划分数据
X_reg_train, X_reg_test, y_reg_train, y_reg_test = train_test_split(
    X_reg, y_reg, test_size=0.2, random_state=42
)

# 定义回归模型
reg_models = {
    'Linear Regression': LinearRegression(),
    'Ridge Regression': Ridge(alpha=1.0),
    'Lasso Regression': Lasso(alpha=0.1),
    'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42)
}

# 训练和评估
reg_results = {}
for name, model in reg_models.items():
    model.fit(X_reg_train, y_reg_train)
    y_pred = model.predict(X_reg_test)
    
    mse = mean_squared_error(y_reg_test, y_pred)
    r2 = r2_score(y_reg_test, y_pred)
    reg_results[name] = {'MSE': mse, 'R2': r2}
    
    print(f"\n{name}:")
    print(f"MSE: {mse:.4f}")
    print(f"R2: {r2:.4f}")
```

## 模型调优

```python
from sklearn.model_selection import GridSearchCV, cross_val_score

# 随机森林参数调优
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [None, 10, 20, 30],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4]
}

rf = RandomForestClassifier(random_state=42)
grid_search = GridSearchCV(
    rf, param_grid, cv=5, scoring='accuracy', n_jobs=-1, verbose=1
)
grid_search.fit(X_train, y_train)

print(f"最佳参数: {grid_search.best_params_}")
print(f"最佳交叉验证分数: {grid_search.best_score_:.4f}")

# 使用最佳模型
best_model = grid_search.best_estimator_
y_pred = best_model.predict(X_test)
print(f"测试集准确率: {accuracy_score(y_test, y_pred):.4f}")
```

## 模型评估

```python
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import roc_curve, auc, confusion_matrix

# 混淆矩阵
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
            xticklabels=iris.target_names, 
            yticklabels=iris.target_names)
plt.title('Confusion Matrix')
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.savefig('confusion_matrix.png', dpi=300)
plt.show()

# 特征重要性
feature_importance = pd.DataFrame({
    'feature': iris.feature_names,
    'importance': best_model.feature_importances_
}).sort_values('importance', ascending=False)

plt.figure(figsize=(10, 6))
sns.barplot(x='importance', y='feature', data=feature_importance)
plt.title('Feature Importance')
plt.savefig('feature_importance.png', dpi=300)
plt.show()
```

## 保存和加载模型

```python
import joblib

# 保存模型
joblib.dump(best_model, 'iris_classifier.pkl')
joblib.dump(scaler, 'scaler.pkl')

# 加载模型
loaded_model = joblib.load('iris_classifier.pkl')
loaded_scaler = joblib.load('scaler.pkl')

# 使用加载的模型预测
sample = X_test.iloc[0:1]
prediction = loaded_model.predict(sample)
print(f"预测类别: {iris.target_names[prediction[0]]}")
```

## 实战示例

```python
# 完整的机器学习流程
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib

# 1. 数据加载
def load_data():
    """加载数据"""
    from sklearn.datasets import load_breast_cancer
    data = load_breast_cancer()
    X = pd.DataFrame(data.data, columns=data.feature_names)
    y = pd.Series(data.target, name='target')
    return X, y, data.target_names

# 2. 数据预处理
def preprocess_data(X, y):
    """数据预处理"""
    # 划分数据集
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # 特征缩放
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    return X_train_scaled, X_test_scaled, y_train, y_test, scaler

# 3. 模型训练
def train_model(X_train, y_train):
    """训练模型"""
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42
    )
    model.fit(X_train, y_train)
    return model

# 4. 模型评估
def evaluate_model(model, X_test, y_test, target_names):
    """评估模型"""
    y_pred = model.predict(X_test)
    
    print("准确率:", accuracy_score(y_test, y_pred))
    print("\n分类报告:")
    print(classification_report(y_test, y_pred, target_names=target_names))
    
    return y_pred

# 5. 保存模型
def save_artifacts(model, scaler, filename='breast_cancer_model'):
    """保存模型和预处理器"""
    joblib.dump(model, f'{filename}_model.pkl')
    joblib.dump(scaler, f'{filename}_scaler.pkl')
    print(f"模型已保存: {filename}_model.pkl")

# 主流程
def main():
    # 加载数据
    X, y, target_names = load_data()
    
    # 预处理
    X_train, X_test, y_train, y_test, scaler = preprocess_data(X, y)
    
    # 训练
    model = train_model(X_train, y_train)
    
    # 评估
    y_pred = evaluate_model(model, X_test, y_test, target_names)
    
    # 保存
    save_artifacts(model, scaler)
    
    # 预测新数据
    sample = X_test[0:1]
    prediction = model.predict(sample)
    print(f"\n预测结果: {target_names[prediction[0]]}")

if __name__ == '__main__':
    main()
```

## 项目结构

```
ml_project/
├── data/
│   ├── raw/
│   └── processed/
├── notebooks/
│   ├── 01_data_exploration.ipynb
│   ├── 02_data_preprocessing.ipynb
│   ├── 03_model_training.ipynb
│   └── 04_model_evaluation.ipynb
├── src/
│   ├── data_loader.py
│   ├── preprocessor.py
│   ├── model.py
│   └── utils.py
├── models/
│   ├── iris_classifier.pkl
│   └── scaler.pkl
├── reports/
│   ├── confusion_matrix.png
│   └── feature_importance.png
├── requirements.txt
└── README.md
```
