# Requests 网络请求

## 安装与导入

```bash
pip install requests
```

```python
import requests
```

## 基础请求

```python
# GET 请求
response = requests.get('https://api.github.com')

# 检查状态码
print(response.status_code)  # 200
print(response.ok)           # True

# 获取内容
print(response.text)         # 文本内容
print(response.json())       # JSON 解析

# 响应头
print(response.headers)
print(response.headers['Content-Type'])
```

## 请求参数

```python
# URL 参数
params = {
    'q': 'python',
    'page': 1,
    'per_page': 10
}
response = requests.get('https://api.github.com/search/repositories', params=params)
print(response.json())

# 请求头
headers = {
    'User-Agent': 'Mozilla/5.0',
    'Authorization': 'token YOUR_TOKEN'
}
response = requests.get('https://api.github.com', headers=headers)
```

## POST 请求

```python
# 表单数据
data = {
    'username': 'alice',
    'password': '123456'
}
response = requests.post('https://httpbin.org/post', data=data)

# JSON 数据
json_data = {
    'name': 'Alice',
    'age': 25
}
response = requests.post('https://httpbin.org/post', json=json_data)
```

## 文件上传

```python
# 上传文件
files = {
    'file': open('report.pdf', 'rb')
}
response = requests.post('https://httpbin.org/post', files=files)

# 带参数的文件上传
files = {
    'file': ('report.pdf', open('report.pdf', 'rb'), 'application/pdf')
}
data = {
    'description': 'Monthly report'
}
response = requests.post('https://httpbin.org/post', files=files, data=data)
```

## 会话管理

```python
# 使用会话（保持 Cookie）
session = requests.Session()

# 登录
session.post('https://example.com/login', data={
    'username': 'alice',
    'password': '123456'
})

# 后续请求会自动带上 Cookie
response = session.get('https://example.com/dashboard')
```

## 错误处理

```python
try:
    response = requests.get('https://api.example.com/data', timeout=5)
    response.raise_for_status()  # 检查 HTTP 错误
    
    data = response.json()
    print(data)

except requests.exceptions.Timeout:
    print("请求超时")
except requests.exceptions.HTTPError as e:
    print(f"HTTP 错误: {e}")
except requests.exceptions.ConnectionError:
    print("连接错误")
except requests.exceptions.RequestException as e:
    print(f"请求错误: {e}")
```

## 实战示例

```python
# GitHub API 使用
import requests

def get_github_user(username):
    """获取 GitHub 用户信息"""
    url = f'https://api.github.com/users/{username}'
    response = requests.get(url)
    
    if response.status_code == 200:
        user = response.json()
        return {
            'name': user.get('name'),
            'public_repos': user.get('public_repos'),
            'followers': user.get('followers'),
            'following': user.get('following')
        }
    return None

def search_repositories(query, page=1, per_page=10):
    """搜索 GitHub 仓库"""
    url = 'https://api.github.com/search/repositories'
    params = {
        'q': query,
        'page': page,
        'per_page': per_page
    }
    
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        return [{
            'name': repo['name'],
            'stars': repo['stargazers_count'],
            'language': repo['language']
        } for repo in data['items']]
    return []

# 使用
user = get_github_user('octocat')
print(f"用户: {user}")

repos = search_repositories('python machine learning')
for repo in repos:
    print(f"{repo['name']} - {repo['stars']} stars")
```
