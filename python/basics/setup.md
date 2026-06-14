# 环境搭建

## 安装 Python

### Windows 安装

1. 访问 [python.org](https://www.python.org/downloads/)
2. 下载最新版本（推荐 Python 3.10+）
3. 运行安装程序，**勾选 "Add Python to PATH"**
4. 选择 "Install Now" 完成安装

### 验证安装

```bash
# 打开命令行（Win+R 输入 cmd）
python --version
# 输出：Python 3.11.5

pip --version
# 输出：pip 23.2.1
```

## 配置开发环境

### VSCode（推荐）

1. 安装 [VSCode](https://code.visualstudio.com/)
2. 安装 Python 扩展（搜索 `Python`）
3. 安装 Pylance（代码补全）

### PyCharm

1. 下载 [PyCharm Community](https://www.jetbrains.com/pycharm/)
2. 创建新项目，选择 Python 解释器

## 第一个程序

```python
# hello.py
print("Hello, World!")
```

运行方式：
```bash
python hello.py
# 输出：Hello, World!
```

## 包管理工具 pip

```bash
# 安装包
pip install numpy

# 安装指定版本
pip install pandas==2.0.0

# 升级包
pip install --upgrade numpy

# 查看已安装包
pip list

# 导出依赖
pip freeze > requirements.txt

# 从文件安装
pip install -r requirements.txt
```

## 虚拟环境（推荐）

```bash
# 创建虚拟环境
python -m venv myenv

# 激活虚拟环境（Windows）
myenv\Scripts\activate

# 激活虚拟环境（Mac/Linux）
source myenv/bin/activate

# 退出虚拟环境
deactivate
```
