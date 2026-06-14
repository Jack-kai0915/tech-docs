# AI Agent（智能体）

## 什么是 AI Agent

AI Agent 是能够自主感知环境、做出决策并执行行动的智能系统。不同于简单的聊天机器人，Agent 具有自主性和工具使用能力。

### 核心特征

```
传统 LLM：输入 → 输出（单次交互）
AI Agent：目标 → 规划 → 执行 → 反馈 → 调整（循环）
```

### Agent 架构

```
┌─────────────────────────────────────────┐
│              AI Agent                    │
├─────────────────────────────────────────┤
│  大脑（LLM）                            │
│  ├── 理解任务                           │
│  ├── 制定计划                           │
│  └── 生成行动                           │
├─────────────────────────────────────────┤
│  记忆（Memory）                         │
│  ├── 短期记忆（对话历史）              │
│  └── 长期记忆（知识库）                │
├─────────────────────────────────────────┤
│  工具（Tools）                          │
│  ├── 代码执行                           │
│  ├── API 调用                           │
│  ├── 文件操作                           │
│  └── 搜索查询                           │
├─────────────────────────────────────────┤
│  规划（Planning）                       │
│  ├── 任务分解                           │
│  ├── 优先级排序                         │
│  └── 反思调整                           │
└─────────────────────────────────────────┘
```

---

## Agent 实现示例

### 简单 Agent 框架

```python
import openai
import json
from typing import List, Dict, Callable

class AIAgent:
    """简单的 AI Agent 实现"""
    
    def __init__(self, api_key: str, model: str = "gpt-4"):
        self.client = openai.OpenAI(api_key=api_key)
        self.model = model
        self.tools: Dict[str, Callable] = {}
        self.memory: List[Dict] = []
    
    def register_tool(self, name: str, func: Callable, description: str):
        """注册工具"""
        self.tools[name] = {
            "function": func,
            "description": description
        }
    
    def get_tool_descriptions(self) -> str:
        """获取所有工具描述"""
        descriptions = []
        for name, tool in self.tools.items():
            descriptions.append(f"- {name}: {tool['description']}")
        return "\n".join(descriptions)
    
    def chat(self, user_input: str) -> str:
        """与 Agent 对话"""
        # 添加用户消息到记忆
        self.memory.append({"role": "user", "content": user_input})
        
        # 构建系统提示
        system_prompt = f"""你是一个智能助手，可以使用以下工具完成任务：

{self.get_tool_descriptions()}

当需要使用工具时，请按以下格式输出：
ACTION: 工具名称
INPUT: 输入参数

当任务完成时，直接输出最终回答。
"""
        
        messages = [{"role": "system", "content": system_prompt}] + self.memory
        
        # 调用 LLM
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages
        )
        
        assistant_message = response.choices[0].message.content
        
        # 检查是否需要执行工具
        if "ACTION:" in assistant_message:
            return self.execute_tool(assistant_message)
        
        # 添加到记忆
        self.memory.append({"role": "assistant", "content": assistant_message})
        
        return assistant_message
    
    def execute_tool(self, message: str) -> str:
        """执行工具"""
        lines = message.split("\n")
        action = None
        tool_input = None
        
        for line in lines:
            if line.startswith("ACTION:"):
                action = line.split("ACTION:")[1].strip()
            elif line.startswith("INPUT:"):
                tool_input = line.split("INPUT:")[1].strip()
        
        if action and action in self.tools:
            # 执行工具
            result = self.tools[action]["function"](tool_input)
            
            # 将结果添加到记忆
            self.memory.append({"role": "assistant", "content": message})
            self.memory.append({"role": "user", "content": f"工具执行结果: {result}"})
            
            # 让 LLM 继续处理
            return self.chat(f"工具执行完成，结果是: {result}")
        
        return "无法执行该工具"


# 使用示例
def search_web(query: str) -> str:
    """模拟网络搜索"""
    return f"搜索结果: 关于 '{query}' 的相关信息..."

def calculate(expression: str) -> str:
    """计算表达式"""
    try:
        result = eval(expression)
        return f"计算结果: {result}"
    except Exception as e:
        return f"计算错误: {str(e)}"

def read_file(filepath: str) -> str:
    """读取文件"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        return f"读取错误: {str(e)}"


# 创建 Agent
agent = AIAgent(api_key="your-api-key")

# 注册工具
agent.register_tool("search", search_web, "搜索互联网获取信息")
agent.register_tool("calculate", calculate, "计算数学表达式")
agent.register_tool("read_file", read_file, "读取本地文件内容")

# 使用 Agent
response = agent.chat("帮我计算 (15 + 27) * 3 的结果")
print(response)
```

---

## 主流 Agent 框架

### 1. LangChain

```python
from langchain.agents import initialize_agent, Tool
from langchain.llms import OpenAI

# 定义工具
def search_tool(query):
    return f"搜索结果: {query}"

tools = [
    Tool(
        name="Search",
        func=search_tool,
        description="用于搜索互联网信息"
    )
]

# 创建 Agent
llm = OpenAI(temperature=0)
agent = initialize_agent(tools, llm, agent="zero-shot-react-description")

# 运行
result = agent.run("搜索最新的 React 19 新特性")
print(result)
```

### 2. CrewAI

```python
from crewai import Agent, Task, Crew

# 定义 Agent
researcher = Agent(
    role="研究员",
    goal="收集和分析相关信息",
    backstory="你是一位经验丰富的技术研究员"
)

writer = Agent(
    role="技术作家",
    goal="撰写高质量的技术文章",
    backstory="你是一位专业的技术博客作家"
)

# 定义任务
research_task = Task(
    description="研究 TypeScript 5.0 的新特性",
    agent=researcher
)

writing_task = Task(
    description="根据研究结果撰写技术博客",
    agent=writer
)

# 创建 Crew
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task]
)

# 执行
result = crew.kickoff()
```

### 3. AutoGen

```python
from autogen import AssistantAgent, UserProxyAgent

# 创建 Agent
assistant = AssistantAgent(
    name="assistant",
    llm_config={"model": "gpt-4"}
)

user_proxy = UserProxyAgent(
    name="user_proxy",
    human_input_mode="NEVER",
    code_execution_config={"work_dir": "coding"}
)

# 开始对话
user_proxy.initiate_chat(
    assistant,
    message="用 Python 写一个简单的 REST API"
)
```

---

## Agent 应用场景

### 1. 代码开发 Agent

```python
class CodeDeveloperAgent:
    """代码开发 Agent"""
    
    def __init__(self):
        self.tools = {
            "write_code": self.write_code,
            "run_tests": self.run_tests,
            "debug": self.debug_code,
            "refactor": self.refactor_code
        }
    
    def develop_feature(self, requirement: str):
        """开发功能的完整流程"""
        # 1. 分析需求
        design = self.analyze_requirement(requirement)
        
        # 2. 编写代码
        code = self.write_code(design)
        
        # 3. 运行测试
        test_result = self.run_tests(code)
        
        # 4. 如果测试失败，调试
        if not test_result["passed"]:
            code = self.debug_code(code, test_result["error"])
        
        # 5. 重构优化
        final_code = self.refactor_code(code)
        
        return final_code
```

### 2. 数据分析 Agent

```python
class DataAnalysisAgent:
    """数据分析 Agent"""
    
    def analyze(self, data_source: str, question: str):
        """分析数据并回答问题"""
        # 1. 加载数据
        data = self.load_data(data_source)
        
        # 2. 探索性分析
        summary = self.exploratory_analysis(data)
        
        # 3. 针对问题分析
        analysis = self.targeted_analysis(data, question)
        
        # 4. 生成可视化
        charts = self.create_visualizations(analysis)
        
        # 5. 生成报告
        report = self.generate_report(summary, analysis, charts)
        
        return report
```

### 3. 客服 Agent

```python
class CustomerServiceAgent:
    """客服 Agent"""
    
    def handle_inquiry(self, customer_message: str, context: dict):
        """处理客户咨询"""
        # 1. 理解意图
        intent = self.classify_intent(customer_message)
        
        # 2. 查询知识库
        knowledge = self.search_knowledge_base(customer_message)
        
        # 3. 生成回答
        if intent == "technical_issue":
            response = self.technical_support(customer_message, knowledge)
        elif intent == "billing":
            response = self.billing_support(customer_message, context)
        else:
            response = self.general_response(customer_message, knowledge)
        
        # 4. 记录对话
        self.log_conversation(customer_message, response)
        
        return response
```

---

## 为什么学习 AI Agent？

1. **自动化程度更高**：从对话到行动
2. **复杂任务处理**：多步骤、多工具协作
3. **实际应用价值**：直接解决业务问题
4. **未来趋势**：AI 发展的主要方向
5. **创业机会**：构建 AI 原生产品
