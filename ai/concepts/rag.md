# RAG 技术（检索增强生成）

## 什么是 RAG

RAG（Retrieval-Augmented Generation，检索增强生成）是一种将检索系统与大语言模型结合的技术，让 AI 能够基于外部知识库回答问题。

### 核心思想

```
传统 LLM：问题 → 模型 → 回答（可能有幻觉）

RAG：问题 → 检索相关文档 → 文档 + 问题 → 模型 → 回答（基于事实）
```

---

## RAG 架构

```
┌─────────────────────────────────────────────────────────┐
│                    RAG 系统架构                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              离线索引阶段                         │   │
│  │                                                  │   │
│  │  文档 → 分块 → 向量化 → 存入向量数据库            │   │
│  │                                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              在线查询阶段                         │   │
│  │                                                  │   │
│  │  用户问题 → 向量化 → 检索相似文档 → 构建 Prompt    │   │
│  │       ↓                                         │   │
│  │  LLM 生成回答 ← 检索结果 + 用户问题              │   │
│  │                                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 完整实现示例

### 1. 文档处理与索引

```python
# rag_indexer.py
from langchain.document_loaders import PyPDFLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
import os

class RAGIndexer:
    """RAG 文档索引器"""
    
    def __init__(self, persist_directory: str = "./chroma_db"):
        self.embeddings = OpenAIEmbeddings()
        self.persist_directory = persist_directory
        self.vectorstore = None
    
    def load_document(self, file_path: str) -> list:
        """加载文档"""
        ext = os.path.splitext(file_path)[1].lower()
        
        if ext == '.pdf':
            loader = PyPDFLoader(file_path)
        elif ext == '.txt':
            loader = TextLoader(file_path)
        else:
            raise ValueError(f"不支持的文件格式: {ext}")
        
        return loader.load()
    
    def split_documents(self, documents: list, chunk_size: int = 1000) -> list:
        """分割文档"""
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=200,
            length_function=len,
            separators=["\n\n", "\n", "。", "！", "？", ".", "!", "?"]
        )
        
        return text_splitter.split_documents(documents)
    
    def index_documents(self, file_paths: list):
        """索引多个文档"""
        all_chunks = []
        
        for file_path in file_paths:
            print(f"处理文件: {file_path}")
            documents = self.load_document(file_path)
            chunks = self.split_documents(documents)
            all_chunks.extend(chunks)
            print(f"  分割为 {len(chunks)} 个块")
        
        # 创建向量存储
        self.vectorstore = Chroma.from_documents(
            documents=all_chunks,
            embedding=self.embeddings,
            persist_directory=self.persist_directory
        )
        
        print(f"索引完成，共 {len(all_chunks)} 个文档块")
    
    def add_document(self, file_path: str):
        """添加单个文档"""
        documents = self.load_document(file_path)
        chunks = self.split_documents(documents)
        
        if self.vectorstore is None:
            self.vectorstore = Chroma.from_documents(
                documents=chunks,
                embedding=self.embeddings,
                persist_directory=self.persist_directory
            )
        else:
            self.vectorstore.add_documents(chunks)
        
        print(f"添加完成，新增 {len(chunks)} 个文档块")
    
    def search(self, query: str, k: int = 5) -> list:
        """搜索相关文档"""
        if self.vectorstore is None:
            return []
        
        return self.vectorstore.similarity_search(query, k=k)

# 使用示例
indexer = RAGIndexer()

# 索引文档
indexer.index_documents([
    "docs/product_guide.pdf",
    "docs/faq.txt",
    "docs/api_reference.md"
])

# 搜索
results = indexer.search("如何配置 API 密钥？")
for doc in results:
    print(f"[来源: {doc.metadata.get('source', '未知')}]")
    print(doc.page_content[:200])
    print("---")
```

### 2. RAG 查询系统

```python
# rag_query.py
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

class RAGQuerySystem:
    """RAG 查询系统"""
    
    def __init__(self, vectorstore):
        self.vectorstore = vectorstore
        self.llm = ChatOpenAI(model="gpt-4", temperature=0)
        
        # 定义 Prompt 模板
        self.prompt_template = PromptTemplate(
            template="""你是一个专业的技术文档助手。请根据以下上下文回答用户的问题。

上下文：
{context}

问题：{question}

要求：
1. 只根据提供的上下文回答
2. 如果上下文中没有相关信息，请明确说明
3. 回答要准确、简洁
4. 在回答末尾标注信息来源

回答：""",
            input_variables=["context", "question"]
        )
        
        # 创建 QA 链
        self.qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.vectorstore.as_retriever(
                search_kwargs={"k": 3}
            ),
            return_source_documents=True,
            chain_type_kwargs={"prompt": self.prompt_template}
        )
    
    def query(self, question: str) -> dict:
        """查询并返回结果"""
        result = self.qa_chain({"query": question})
        
        return {
            "answer": result["result"],
            "sources": [
                {
                    "content": doc.page_content[:200],
                    "source": doc.metadata.get("source", "未知"),
                    "page": doc.metadata.get("page", "未知")
                }
                for doc in result["source_documents"]
            ]
        }
    
    def query_with_sources(self, question: str) -> str:
        """查询并格式化输出"""
        result = self.query(question)
        
        output = f"问题：{question}\n\n"
        output += f"回答：{result['answer']}\n\n"
        output += "参考来源：\n"
        
        for i, source in enumerate(result["sources"], 1):
            output += f"{i}. [{source['source']}]\n"
            output += f"   {source['content']}...\n\n"
        
        return output

# 使用示例
rag = RAGQuerySystem(indexer.vectorstore)

# 简单查询
result = rag.query("产品的主要功能是什么？")
print(result["answer"])

# 带来源的查询
output = rag.query_with_sources("如何安装这个软件？")
print(output)
```

### 3. 高级 RAG 技巧

```python
# advanced_rag.py

class AdvancedRAG:
    """高级 RAG 技术"""
    
    def __init__(self, vectorstore):
        self.vectorstore = vectorstore
        self.llm = ChatOpenAI(model="gpt-4")
    
    def query_with_hyde(self, question: str) -> str:
        """
        HyDE (Hypothetical Document Embeddings)
        先让 LLM 生成假设性答案，再用答案去检索
        """
        # 生成假设性答案
        hyde_prompt = f"""请根据你的知识，简要回答以下问题。
        这个答案将用于检索相关文档，所以请尽可能详细。
        
        问题：{question}
        
        假设性答案："""
        
        hypothetical_answer = self.llm.predict(hyde_prompt)
        
        # 用假设性答案检索
        docs = self.vectorstore.similarity_search(hypothetical_answer, k=3)
        
        # 用检索结果生成最终答案
        context = "\n".join([doc.page_content for doc in docs])
        
        final_prompt = f"""基于以下上下文，回答用户的问题。
        如果上下文中没有相关信息，请说明。
        
        上下文：
        {context}
        
        问题：{question}
        
        回答："""
        
        return self.llm.predict(final_prompt)
    
    def query_with_rerank(self, question: str) -> str:
        """
        重排序检索结果
        先检索更多候选，再用模型重排序
        """
        # 检索更多候选
        candidate_docs = self.vectorstore.similarity_search(question, k=10)
        
        # 重排序（简化版：基于关键词匹配）
        def score_doc(doc):
            content = doc.page_content.lower()
            keywords = question.lower().split()
            return sum(1 for kw in keywords if kw in content)
        
        # 排序
        ranked_docs = sorted(candidate_docs, key=score_doc, reverse=True)[:3]
        
        # 生成答案
        context = "\n".join([doc.page_content for doc in ranked_docs])
        
        prompt = f"""基于以下上下文回答问题：
        
        上下文：{context}
        
        问题：{question}
        
        回答："""
        
        return self.llm.predict(prompt)
    
    def query_with_multi_query(self, question: str) -> str:
        """
        多查询 RAG
        生成多个查询变体，合并检索结果
        """
        # 生成多个查询
        query_prompt = f"""请将以下问题改写成3个不同的查询，每个查询一行：
        
        原问题：{question}
        
        改写后的查询："""
        
        queries_text = self.llm.predict(query_prompt)
        queries = [q.strip() for q in queries_text.split('\n') if q.strip()]
        queries.append(question)  # 加入原始查询
        
        # 多查询检索
        all_docs = []
        for q in queries:
            docs = self.vectorstore.similarity_search(q, k=2)
            all_docs.extend(docs)
        
        # 去重
        seen = set()
        unique_docs = []
        for doc in all_docs:
            content_hash = hash(doc.page_content)
            if content_hash not in seen:
                seen.add(content_hash)
                unique_docs.append(doc)
        
        # 取前3个
        top_docs = unique_docs[:3]
        
        # 生成答案
        context = "\n".join([doc.page_content for doc in top_docs])
        
        prompt = f"""基于以下上下文回答问题：
        
        上下文：{context}
        
        问题：{question}
        
        回答："""
        
        return self.llm.predict(prompt)
```

---

## 前端集成

### React + RAG

```typescript
// components/RAGChat.tsx
'use client';

import { useState } from 'react';
import { useChat } from 'ai/react';

export function RAGChat() {
  const [sources, setSources] = useState<any[]>([]);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/rag-chat',
    onResponse: (response) => {
      // 解析来源信息
      const sourcesHeader = response.headers.get('X-Sources');
      if (sourcesHeader) {
        setSources(JSON.parse(sourcesHeader));
      }
    }
  });
  
  return (
    <div className="rag-chat">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <div className="content">{msg.content}</div>
            {msg.role === 'assistant' && sources.length > 0 && i === messages.length - 1 && (
              <div className="sources">
                <h4>参考来源：</h4>
                {sources.map((src, j) => (
                  <div key={j} className="source-item">
                    <span className="source-name">{src.source}</span>
                    <p>{src.content}...</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button disabled={isLoading}>发送</button>
      </form>
    </div>
  );
}
```

### API Route

```typescript
// app/api/rag-chat/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  // 获取用户最后一条消息
  const userMessage = messages[messages.length - 1].content;
  
  // 检索相关文档（这里简化，实际应该调用向量数据库）
  const sources = await searchDocuments(userMessage);
  
  // 构建带上下文的 Prompt
  const context = sources.map(s => s.content).join('\n\n');
  
  const systemPrompt = `你是一个技术文档助手。请基于以下上下文回答用户问题。

上下文：
${context}

要求：
1. 只基于提供的上下文回答
2. 如果上下文中没有相关信息，请说明
3. 在回答末尾标注来源`;
  
  const result = streamText({
    model: openai('gpt-4'),
    system: systemPrompt,
    messages
  });
  
  // 在响应头中添加来源信息
  const response = result.toDataStreamResponse();
  response.headers.set('X-Sources', JSON.stringify(sources));
  
  return response;
}

async function searchDocuments(query: string) {
  // 实际项目中调用向量数据库
  // 这里返回模拟数据
  return [
    { source: 'product_guide.pdf', content: '...' },
    { source: 'faq.txt', content: '...' }
  ];
}
```

---

## 为什么使用 RAG？

| 优势 | 说明 |
|------|------|
| **减少幻觉** | 基于检索到的事实回答 |
| **知识可更新** | 更新文档即可，无需重新训练 |
| **可追溯来源** | 可以标注信息来源 |
| **成本效益** | 比微调模型便宜 |
| **领域适配** | 快速适配特定领域知识 |
