# 向量数据库

## 什么是向量数据库

向量数据库是专门用于存储和检索向量数据的数据库，是 AI 应用（特别是 RAG）的核心组件。

### 核心概念

```
传统数据库：精确匹配
SELECT * FROM users WHERE name = '张三'

向量数据库：语义搜索
搜索 "如何配置 API 密钥" → 返回相关文档（即使没有完全相同的词）
```

---

## 为什么需要向量数据库？

### 问题：语义搜索

```
用户搜索："如何安装软件"

传统搜索（关键词匹配）：
✅ "安装软件教程" - 包含"安装"和"软件"
❌ "部署应用程序" - 语义相同但关键词不同
❌ "Setting up the application" - 不同语言

向量搜索（语义匹配）：
✅ "安装软件教程" - 相似语义
✅ "部署应用程序" - 相似语义
✅ "Setting up the application" - 跨语言理解
```

### 向量的工作原理

```
文本 → Embedding 模型 → 向量（数字数组）

"如何安装软件" → [0.2, -0.5, 0.8, 0.1, ..., 0.3] (1536维)

相似文本的向量在空间中距离相近：
"安装软件教程" → [0.2, -0.5, 0.8, 0.1, ..., 0.3]
"部署应用程序" → [0.3, -0.4, 0.7, 0.2, ..., 0.4]
```

---

## 主流向量数据库对比

| 数据库 | 类型 | 特点 | 适用场景 |
|--------|------|------|----------|
| **Pinecone** | 云服务 | 全托管、易用 | 快速开始 |
| **Weaviate** | 开源 | GraphQL API、模块化 | 复杂查询 |
| **Chroma** | 开源 | 轻量、嵌入式 | 开发测试 |
| **Milvus** | 开源 | 高性能、分布式 | 大规模生产 |
| **Qdrant** | 开源 | Rust 编写、高性能 | 性能敏感 |
| **pgvector** | 扩展 | PostgreSQL 扩展 | 已有 PG 基础设施 |

---

## 使用示例

### 1. Chroma（推荐入门）

```python
# 安装
# pip install chromadb

import chromadb
from chromadb.utils import embedding_functions

class VectorStore:
    """Chroma 向量数据库封装"""
    
    def __init__(self, collection_name: str = "documents"):
        # 创建客户端
        self.client = chromadb.Client()
        
        # 使用 OpenAI 嵌入
        self.embedding_fn = embedding_functions.OpenAIEmbeddingFunction(
            api_key="your-api-key",
            model_name="text-embedding-3-small"
        )
        
        # 创建集合
        self.collection = self.client.create_collection(
            name=collection_name,
            embedding_function=self.embedding_fn
        )
    
    def add_documents(self, documents: list, metadatas: list = None, ids: list = None):
        """添加文档"""
        if ids is None:
            ids = [f"doc_{i}" for i in range(len(documents))]
        
        self.collection.add(
            documents=documents,
            metadatas=metadatas or [{}] * len(documents),
            ids=ids
        )
        
        print(f"添加了 {len(documents)} 个文档")
    
    def search(self, query: str, n_results: int = 5) -> dict:
        """搜索相似文档"""
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results
        )
        
        return {
            "documents": results["documents"][0],
            "metadatas": results["metadatas"][0],
            "distances": results["distances"][0]
        }
    
    def delete(self, ids: list):
        """删除文档"""
        self.collection.delete(ids=ids)

# 使用示例
store = VectorStore("my_docs")

# 添加文档
store.add_documents(
    documents=[
        "Python 是一种解释型、面向对象的高级编程语言",
        "JavaScript 是 Web 开发的核心语言",
        "React 是 Facebook 开发的前端框架",
        "Vue.js 是一个渐进式 JavaScript 框架",
        "Node.js 让 JavaScript 可以在服务器端运行"
    ],
    metadatas=[
        {"category": "programming", "language": "python"},
        {"category": "programming", "language": "javascript"},
        {"category": "frontend", "framework": "react"},
        {"category": "frontend", "framework": "vue"},
        {"category": "backend", "runtime": "node"}
    ],
    ids=["python", "javascript", "react", "vue", "nodejs"]
)

# 搜索
results = store.search("前端框架有哪些？")
for doc, meta, dist in zip(results["documents"], results["metadatas"], results["distances"]):
    print(f"[相似度: {1-dist:.2f}] {doc}")
    print(f"  元数据: {meta}")
    print()
```

### 2. Pinecone（云服务）

```python
# 安装
# pip install pinecone-client

import pinecone
from langchain.vectorstores import Pinecone
from langchain.embeddings import OpenAIEmbeddings

class PineconeVectorStore:
    """Pinecone 向量数据库封装"""
    
    def __init__(self, index_name: str = "documents"):
        # 初始化 Pinecone
        pinecone.init(
            api_key="your-api-key",
            environment="us-east1-gcp"
        )
        
        self.index_name = index_name
        self.embeddings = OpenAIEmbeddings()
        
        # 创建索引（如果不存在）
        if index_name not in pinecone.list_indexes():
            pinecone.create_index(
                name=index_name,
                dimension=1536,  # OpenAI embedding 维度
                metric="cosine"
            )
        
        self.index = pinecone.Index(index_name)
    
    def upsert_documents(self, documents: list, ids: list = None):
        """上传文档向量"""
        # 生成嵌入
        embeddings = self.embeddings.embed_documents(documents)
        
        # 准备数据
        vectors = []
        for i, (doc, embedding) in enumerate(zip(documents, embeddings)):
            vectors.append({
                "id": ids[i] if ids else f"doc_{i}",
                "values": embedding,
                "metadata": {"text": doc}
            })
        
        # 上传
        self.index.upsert(vectors=vectors)
        print(f"上传了 {len(vectors)} 个向量")
    
    def search(self, query: str, top_k: int = 5) -> list:
        """搜索相似文档"""
        # 生成查询向量
        query_embedding = self.embeddings.embed_query(query)
        
        # 搜索
        results = self.index.query(
            vector=query_embedding,
            top_k=top_k,
            include_metadata=True
        )
        
        return [
            {
                "id": match["id"],
                "score": match["score"],
                "text": match["metadata"]["text"]
            }
            for match in results["matches"]
        ]

# 使用示例
store = PineconeVectorStore("my-index")

# 上传文档
store.upsert_documents([
    "React 是 Facebook 开发的用户界面库",
    "Vue.js 是一个渐进式 JavaScript 框架",
    "Angular 是 Google 开发的前端框架"
])

# 搜索
results = store.search("前端开发框架")
for r in results:
    print(f"[{r['score']:.2f}] {r['text']}")
```

### 3. 使用 LangChain 集成

```python
from langchain.vectorstores import Chroma, Pinecone, Weaviate
from langchain.embeddings import OpenAIEmbeddings
from langchain.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

# 统一接口示例
def create_vectorstore(db_type: str, documents: list, **kwargs):
    """创建向量数据库"""
    
    # 分割文档
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    chunks = text_splitter.split_documents(documents)
    
    # 创建嵌入
    embeddings = OpenAIEmbeddings()
    
    # 根据类型创建数据库
    if db_type == "chroma":
        return Chroma.from_documents(
            chunks, 
            embeddings,
            persist_directory=kwargs.get("persist_dir", "./chroma_db")
        )
    elif db_type == "pinecone":
        return Pinecone.from_documents(
            chunks,
            embeddings,
            index_name=kwargs.get("index_name", "langchain")
        )
    else:
        raise ValueError(f"不支持的数据库类型: {db_type}")

# 使用
loader = TextLoader("docs/technical_doc.txt")
documents = loader.load()

vectorstore = create_vectorstore("chroma", documents)

# 搜索
docs = vectorstore.similarity_search("如何配置环境变量？", k=3)
```

---

## 前端集成

### React + 向量搜索

```typescript
// app/api/search/route.ts
import { openai } from '@ai-sdk/openai';
import { ChromaClient } from 'chromadb';

export async function POST(req: Request) {
  const { query, limit = 5 } = await req.json();
  
  // 生成查询向量
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query
  });
  
  // 搜索向量数据库
  const client = new ChromaClient();
  const collection = await client.getCollection('documents');
  
  const results = await collection.query({
    queryEmbeddings: [embedding.data[0].embedding],
    nResults: limit
  });
  
  return Response.json({
    results: results.documents[0].map((doc, i) => ({
      content: doc,
      metadata: results.metadatas[0][i],
      score: 1 - results.distances[0][i]  // 转换为相似度
    }))
  });
}

// 前端组件
// components/SearchBox.tsx
'use client';

import { useState } from 'react';

export function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  return (
    <div className="search-box">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="语义搜索..."
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button onClick={handleSearch} disabled={isSearching}>
        {isSearching ? '搜索中...' : '搜索'}
      </button>
      
      {results.length > 0 && (
        <div className="results">
          {results.map((r, i) => (
            <div key={i} className="result-item">
              <div className="score">相似度: {(r.score * 100).toFixed(1)}%</div>
              <div className="content">{r.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 最佳实践

### 1. 文档分块策略

```python
# 分块大小建议
chunk_sizes = {
    "代码": 500,      # 代码块较小
    "技术文档": 1000,  # 标准文档
    "文章": 1500,      # 长文章
    "对话": 500        # 对话记录
}

# 重叠设置
overlap_ratio = 0.2  # 20% 重叠
```

### 2. 嵌入模型选择

| 模型 | 维度 | 特点 |
|------|------|------|
| text-embedding-3-small | 1536 | 便宜、够用 |
| text-embedding-3-large | 3072 | 更准确 |
| BGE-M3 | 1024 | 开源、多语言 |

### 3. 性能优化

```python
# 1. 批量插入
vectorstore.add_documents(documents, batch_size=100)

# 2. 使用缓存
from langchain.cache import SQLiteCache
import langchain
langchain.llm_cache = SQLiteCache(database_path=".langchain.db")

# 3. 异步操作
import asyncio

async def async_search(query: str):
    return await vectorstore.asimilarity_search(query)
```
