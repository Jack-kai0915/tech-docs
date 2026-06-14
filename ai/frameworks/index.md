# 前端框架 AI 集成指南

## 前端 AI 应用分类

| 类型 | 描述 | 技术栈 |
|------|------|--------|
| **AI 聊天界面** | 对话式交互 | React + Streaming |
| **AI 写作助手** | 内容生成 | Textarea + AI API |
| **AI 代码编辑器** | 代码生成 | Monaco + AI |
| **AI 图片编辑** | 图片处理 | Canvas + AI |
| **AI 数据可视化** | 智能图表 | D3 + AI |
| **AI 表单助手** | 智能填写 | Form + AI |
| **AI 搜索增强** | 语义搜索 | Embeddings + Vector DB |

---

## React + AI 集成

### Vercel AI SDK（推荐）

```typescript
// 1. 安装
// npm install ai @ai-sdk/openai

// 2. API Route (app/api/chat/route.ts)
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const result = streamText({
    model: openai('gpt-4'),
    messages,
    system: `你是一个专业的前端开发助手。
    帮助用户解决 React、Vue、TypeScript 等问题。
    回答要简洁、准确，并提供代码示例。`
  });
  
  return result.toDataStreamResponse();
}

// 3. 前端组件 (app/chat/page.tsx)
'use client';

import { useChat } from 'ai/react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat'
  });
  
  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.role}`}
          >
            <div className="role">
              {message.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="content">{message.content}</div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="input-form">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="输入你的问题..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? '生成中...' : '发送'}
        </button>
      </form>
    </div>
  );
}
```

### 自定义 Hook

```typescript
// hooks/useAI.ts
import { useState, useCallback } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UseAIOptions {
  apiUrl?: string;
  systemPrompt?: string;
  model?: string;
}

export function useAI(options: UseAIOptions = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const sendMessage = useCallback(async (content: string) => {
    setIsLoading(true);
    setError(null);
    
    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const response = await fetch(options.apiUrl || '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          system: options.systemPrompt,
          model: options.model
        })
      });
      
      if (!response.ok) {
        throw new Error('AI 响应失败');
      }
      
      // 流式读取
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        assistantMessage += chunk;
        
        setMessages(prev => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: assistantMessage }
        ]);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('未知错误'));
    } finally {
      setIsLoading(false);
    }
  }, [messages, options]);
  
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);
  
  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages
  };
}
```

---

## Vue + AI 集成

### Composable 实现

```typescript
// composables/useAI.ts
import { ref, computed } from 'vue';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UseAIOptions {
  apiUrl?: string;
  systemPrompt?: string;
}

export function useAI(options: UseAIOptions = {}) {
  const messages = ref<Message[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  const sendMessage = async (content: string) => {
    if (isLoading.value) return;
    
    isLoading.value = true;
    error.value = null;
    
    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    messages.value.push(userMessage);
    
    try {
      const response = await fetch(options.apiUrl || '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.value.map(m => ({
            role: m.role,
            content: m.content
          })),
          system: options.systemPrompt
        })
      });
      
      if (!response.ok) {
        throw new Error('请求失败');
      }
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };
      
      messages.value.push(assistantMessage);
      
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        assistantContent += chunk;
        assistantMessage.content = assistantContent;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '未知错误';
    } finally {
      isLoading.value = false;
    }
  };
  
  const clearMessages = () => {
    messages.value = [];
    error.value = null;
  };
  
  const messageCount = computed(() => messages.value.length);
  
  return {
    messages,
    isLoading,
    error,
    messageCount,
    sendMessage,
    clearMessages
  };
}
```

---

## 最佳实践

### 1. 性能优化

```typescript
// 1. 使用流式响应，减少等待时间
// 2. 实现请求取消
// 3. 缓存常见请求结果
// 4. 限制并发请求数

// 示例：请求取消
const controller = new AbortController();

const response = await fetch('/api/chat', {
  signal: controller.signal,
  // ...
});

// 组件卸载时取消
useEffect(() => {
  return () => controller.abort();
}, []);
```

### 2. 错误处理

```typescript
// 完善的错误处理
try {
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ messages })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '请求失败');
  }
  
  // 处理响应...
} catch (error) {
  if (error.name === 'AbortError') {
    // 请求被取消
    return;
  }
  
  // 显示错误信息
  setError(error.message);
  
  // 重试机制
  if (retryCount < maxRetries) {
    setTimeout(() => {
      sendMessage(content, retryCount + 1);
    }, 1000 * retryCount);
  }
}
```

### 3. 用户体验

```typescript
// 1. 加载状态指示
// 2. 打字机效果
// 3. 消息气泡动画
// 4. 键盘快捷键

// 示例：打字机效果
const [displayedContent, setDisplayedContent] = useState('');

useEffect(() => {
  if (aiContent) {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedContent(aiContent.slice(0, index));
      index++;
      if (index > aiContent.length) {
        clearInterval(interval);
      }
    }, 20);
    
    return () => clearInterval(interval);
  }
}, [aiContent]);
```
