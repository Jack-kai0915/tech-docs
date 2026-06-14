# SQLAlchemy 数据库

## 安装与导入

```bash
pip install sqlalchemy
```

```python
from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
```

## 基础配置

```python
# 创建引擎
engine = create_engine('sqlite:///app.db', echo=True)

# 声明基类
Base = declarative_base()

# 创建会话
Session = sessionmaker(bind=engine)
session = Session()
```

## 定义模型

```python
class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # 关系
    posts = relationship('Post', back_populates='author')
    
    def __repr__(self):
        return f"<User(id={self.id}, name='{self.name}')>"

class Post(Base):
    __tablename__ = 'posts'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    content = Column(String(1000))
    author_id = Column(Integer, ForeignKey('users.id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # 关系
    author = relationship('User', back_populates='posts')

# 创建表
Base.metadata.create_all(engine)
```

## CRUD 操作

```python
# Create（创建）
user = User(name='Alice', email='alice@example.com')
session.add(user)
session.commit()

# 批量创建
users = [
    User(name='Bob', email='bob@example.com'),
    User(name='Charlie', email='charlie@example.com')
]
session.add_all(users)
session.commit()

# Read（读取）
user = session.query(User).first()  # 第一个
user = session.query(User).get(1)   # 按 ID
users = session.query(User).all()   # 所有

# 过滤
users = session.query(User).filter(User.name == 'Alice').all()
users = session.query(User).filter(User.age > 20).all()
users = session.query(User).filter(User.name.like('%Ali%')).all()

# 排序
users = session.query(User).order_by(User.name).all()
users = session.query(User).order_by(User.name.desc()).all()

# Update（更新）
user.name = 'Alice Updated'
session.commit()

# 批量更新
session.query(User).filter(User.name == 'Bob').update({'name': 'Bob Updated'})
session.commit()

# Delete（删除）
session.delete(user)
session.commit()

# 批量删除
session.query(User).filter(User.name == 'Charlie').delete()
session.commit()
```

## 高级查询

```python
# 聚合函数
from sqlalchemy import func

total_users = session.query(func.count(User.id)).scalar()
avg_age = session.query(func.avg(User.age)).scalar()

# 分组
users_by_age = session.query(User.age, func.count(User.id)).group_by(User.age).all()

# 关系查询
user = session.query(User).first()
posts = user.posts  # 获取用户的所有文章

# 联接查询
results = session.query(User, Post).join(Post, User.id == Post.author_id).all()

# 子查询
subquery = session.query(func.max(User.age)).scalarquery()
users = session.query(User).filter(User.age == subquery).all()
```

## 实战示例

```python
# 博客系统
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    posts = relationship('Post', back_populates='author', lazy='dynamic')
    
    def __repr__(self):
        return f"<User(username='{self.username}')>"

class Post(Base):
    __tablename__ = 'posts'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    content = Column(Text)
    author_id = Column(Integer, ForeignKey('users.id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    author = relationship('User', back_populates='posts')
    
    def __repr__(self):
        return f"<Post(title='{self.title}')>"

# 使用
engine = create_engine('sqlite:///blog.db')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

# 创建用户
user = User(username='alice', email='alice@example.com')
session.add(user)
session.commit()

# 创建文章
post = Post(title='First Post', content='Hello World!', author=user)
session.add(post)
session.commit()

# 查询用户的文章
user = session.query(User).filter_by(username='alice').first()
for post in user.posts:
    print(f"{post.title}: {post.content}")
```
