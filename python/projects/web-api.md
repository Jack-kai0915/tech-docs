# Web API 开发

## 项目概述

使用 Flask 构建 RESTful API，实现用户管理和待办事项功能。

## 项目结构

```
web_api_project/
├── app/
│   ├── __init__.py
│   ├── models.py
│   ├── routes.py
│   └── config.py
├── tests/
│   └── test_api.py
├── requirements.txt
└── run.py
```

## 配置文件

```python
# app/config.py
import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///app.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
```

## 数据模型

```python
# app/models.py
from datetime import datetime
from app import db

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    todos = db.relationship('Todo', backref='author', lazy='dynamic')
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat()
        }

class Todo(db.Model):
    __tablename__ = 'todos'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'completed': self.completed,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'user_id': self.user_id
        }
```

## API 路由

```python
# app/routes.py
from flask import Blueprint, request, jsonify
from app.models import User, Todo
from app import db

api = Blueprint('api', __name__)

# 用户 API
@api.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@api.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

@api.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    user = User(
        username=data['username'],
        email=data['email']
    )
    db.session.add(user)
    db.session.commit()
    
    return jsonify(user.to_dict()), 201

@api.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    db.session.commit()
    
    return jsonify(user.to_dict())

@api.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({'message': 'User deleted'})

# 待办事项 API
@api.route('/api/todos', methods=['GET'])
def get_todos():
    user_id = request.args.get('user_id')
    
    if user_id:
        todos = Todo.query.filter_by(user_id=user_id).all()
    else:
        todos = Todo.query.all()
    
    return jsonify([todo.to_dict() for todo in todos])

@api.route('/api/todos/<int:todo_id>', methods=['GET'])
def get_todo(todo_id):
    todo = Todo.query.get_or_404(todo_id)
    return jsonify(todo.to_dict())

@api.route('/api/todos', methods=['POST'])
def create_todo():
    data = request.get_json()
    
    todo = Todo(
        title=data['title'],
        description=data.get('description'),
        user_id=data['user_id']
    )
    db.session.add(todo)
    db.session.commit()
    
    return jsonify(todo.to_dict()), 201

@api.route('/api/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    todo = Todo.query.get_or_404(todo_id)
    data = request.get_json()
    
    todo.title = data.get('title', todo.title)
    todo.description = data.get('description', todo.description)
    todo.completed = data.get('completed', todo.completed)
    db.session.commit()
    
    return jsonify(todo.to_dict())

@api.route('/api/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    todo = Todo.query.get_or_404(todo_id)
    db.session.delete(todo)
    db.session.commit()
    
    return jsonify({'message': 'Todo deleted'})

# 错误处理
@api.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@api.errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Server error'}), 500
```

## 应用初始化

```python
# app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app.config import config

db = SQLAlchemy()

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    db.init_app(app)
    
    from app.routes import api
    app.register_blueprint(api)
    
    with app.app_context():
        db.create_all()
    
    return app
```

## 运行应用

```python
# run.py
from app import create_app

app = create_app('development')

if __name__ == '__main__':
    app.run(debug=True)
```

## 测试 API

```python
# tests/test_api.py
import requests
import json

BASE_URL = 'http://localhost:5000'

def test_create_user():
    response = requests.post(f'{BASE_URL}/api/users', json={
        'username': 'alice',
        'email': 'alice@example.com'
    })
    assert response.status_code == 201
    print("User created:", response.json())

def test_get_users():
    response = requests.get(f'{BASE_URL}/api/users')
    assert response.status_code == 200
    print("Users:", response.json())

def test_create_todo():
    response = requests.post(f'{BASE_URL}/api/todos', json={
        'title': 'Learn Python',
        'description': 'Complete the Python course',
        'user_id': 1
    })
    assert response.status_code == 201
    print("Todo created:", response.json())

def test_get_todos():
    response = requests.get(f'{BASE_URL}/api/todos?user_id=1')
    assert response.status_code == 200
    print("Todos:", response.json())

if __name__ == '__main__':
    test_create_user()
    test_get_users()
    test_create_todo()
    test_get_todos()
    print("All tests passed!")
```

## 使用 cURL 测试

```bash
# 创建用户
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "email": "alice@example.com"}'

# 获取用户列表
curl http://localhost:5000/api/users

# 创建待办事项
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Python", "description": "Complete the course", "user_id": 1}'

# 获取待办事项
curl http://localhost:5000/api/todos?user_id=1
```
