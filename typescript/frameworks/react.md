# React + TypeScript

## 项目创建

```bash
# 使用 Create React App
npx create-react-app my-app --template typescript

# 使用 Vite（推荐）
npm create vite@latest my-app -- --template react-ts

# 安装依赖
cd my-app
npm install
npm run dev
```

## 函数组件基础

```tsx
// 基本组件
function App(): JSX.Element {
  return <h1>Hello React + TypeScript</h1>
}

// 带 Props 的组件
interface GreetingProps {
  name: string
  age?: number
}

function Greeting({ name, age }: GreetingProps): JSX.Element {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      {age && <p>Age: {age}</p>}
    </div>
  )
}

// 使用
function App() {
  return <Greeting name="Alice" age={25} />
}
```

## State 类型

```tsx
import { useState } from 'react'

function Counter(): JSX.Element {
  // 类型推断
  const [count, setCount] = useState(0)
  
  // 显式指定类型
  const [user, setUser] = useState<{ name: string; age: number } | null>(null)
  
  // 复杂状态
  interface Todo {
    id: number
    text: string
    completed: boolean
  }
  
  const [todos, setTodos] = useState<Todo[]>([])
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

## 事件处理

```tsx
function EventExample(): JSX.Element {
  // 点击事件
  function handleClick(e: React.MouseEvent<HTMLButtonElement>): void {
    console.log('Button clicked', e.target)
  }
  
  // 表单提交
  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    console.log('Form submitted')
  }
  
  // 输入框变化
  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    console.log('Input changed', e.target.value)
  }
  
  // 键盘事件
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter') {
      console.log('Enter pressed')
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} onKeyDown={handleKeyDown} />
      <button onClick={handleClick}>Submit</button>
    </form>
  )
}
```

## Hook 类型

```tsx
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

// useState
function useCounter(initialValue: number = 0) {
  const [count, setCount] = useState(initialValue)
  
  const increment = useCallback(() => setCount(c => c + 1), [])
  const decrement = useCallback(() => setCount(c => c - 1), [])
  const reset = useCallback(() => setCount(initialValue), [initialValue])
  
  return { count, increment, decrement, reset }
}

// useEffect
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    let cancelled = false
    
    async function fetchData() {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json()
        
        if (!cancelled) {
          setData(result)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error(String(e)))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    
    fetchData()
    
    return () => {
      cancelled = true
    }
  }, [url])
  
  return { data, loading, error }
}

// useRef
function TextInputWithFocusButton(): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)
  
  function handleClick(): void {
    inputRef.current?.focus()
  }
  
  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={handleClick}>Focus Input</button>
    </>
  )
}

// useMemo
function ExpensiveComponent({ items }: { items: number[] }): JSX.Element {
  const sortedItems = useMemo(() => {
    console.log('Sorting items...')
    return [...items].sort((a, b) => a - b)
  }, [items])
  
  return (
    <ul>
      {sortedItems.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}
```

## Context 类型

```tsx
import { createContext, useContext, useState } from 'react'

// 定义 Context 类型
interface AuthContextType {
  user: { name: string; email: string } | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

// 创建 Context
const AuthContext = createContext<AuthContextType | null>(null)

// Provider 组件
function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  
  async function login(email: string, password: string): Promise<void> {
    // 模拟登录
    setUser({ name: 'Alice', email })
  }
  
  function logout(): void {
    setUser(null)
  }
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook 使用 Context
function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// 使用
function LoginForm(): JSX.Element {
  const { login } = useAuth()
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await login('alice@example.com', 'password')
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Login</button>
    </form>
  )
}
```

## 自定义 Hook 类型

```tsx
// useLocalStorage
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })
  
  const setValue = (value: T): void => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(error)
    }
  }
  
  return [storedValue, setValue]
}

// 使用
function App(): JSX.Element {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light')
  
  return (
    <div className={theme}>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </div>
  )
}

// useDebounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => clearTimeout(handler)
  }, [value, delay])
  
  return debouncedValue
}

// 使用
function SearchInput(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      // 执行搜索
      console.log('Searching for:', debouncedSearchTerm)
    }
  }, [debouncedSearchTerm])
  
  return (
    <input
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  )
}
```

## 完整示例：Todo 应用

```tsx
// types.ts
interface Todo {
  id: number
  text: string
  completed: boolean
}

// TodoItem.tsx
interface TodoItemProps {
  todo: Todo
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

function TodoItem({ todo, onToggle, onDelete }: TodoItemProps): JSX.Element {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  )
}

// TodoList.tsx
interface TodoListProps {
  todos: Todo[]
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

function TodoList({ todos, onToggle, onDelete }: TodoListProps): JSX.Element {
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}

// App.tsx
function App(): JSX.Element {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  let nextId = 1
  
  const incompleteTodos = useMemo(() =>
    todos.filter(todo => !todo.completed),
    [todos]
  )
  
  function addTodo(): void {
    if (newTodo.trim()) {
      setTodos([...todos, { id: nextId++, text: newTodo.trim(), completed: false }])
      setNewTodo('')
    }
  }
  
  function toggleTodo(id: number): void {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }
  
  function deleteTodo(id: number): void {
    setTodos(todos.filter(todo => todo.id !== id))
  }
  
  return (
    <div>
      <h1>Todo App</h1>
      
      <form onSubmit={e => { e.preventDefault(); addTodo() }}>
        <input
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="Add todo..."
        />
        <button type="submit">Add</button>
      </form>
      
      <TodoList
        todos={todos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
      
      <p>{incompleteTodos.length} items left</p>
    </div>
  )
}

export default App
```
