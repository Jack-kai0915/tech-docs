# AI Agent 深度教程

## 目录

- [什么是 AI Agent](#什么是-ai-agent)
- [Agent 核心架构](#agent-核心架构)
- [Agent 工作原理](#agent-工作原理)
- [从零创建 Agent](#从零创建-agent)
- [主流 Agent 框架](#主流-agent-框架)
- [Agent 应用场景](#agent-应用场景)
- [Agent 实战项目](#agent-实战项目)
- [Agent 最佳实践](#agent-最佳实践)
- [Agent 未来趋势](#agent-未来趋势)

---

## 什么是 AI Agent

### 定义

AI Agent（智能体）是一个能够**自主感知环境、做出决策、执行行动**的智能系统。它不只是回答问题，而是能够**主动完成任务**。

### Agent vs 传统 LLM

| 特性 | 传统 LLM | AI Agent |
|------|----------|----------|
| **交互模式** | 单轮对话 | 多步骤自主执行 |
| **能力范围** | 生成文本 | 使用工具、执行代码、访问 API |
| **记忆能力** | 上下文窗口 | 短期+长期记忆 |
| **任务处理** | 被动响应 | 主动规划和执行 |
| **错误处理** | 无法自我纠正 | 可以反思和重试 |

### Agent 的核心能力

```
┌─────────────────────────────────────────────────────────┐
│                   AI Agent 核心能力                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🧠 推理能力                                            │
│  ├── 理解复杂任务                                        │
│  ├── 分解子任务                                         │
│  └── 逻辑推理和规划                                     │
│                                                         │
│  🔧 工具使用                                            │
│  ├── 调用 API                                          │
│  ├── 执行代码                                           │
│  ├── 读写文件                                           │
│  └── 搜索信息                                           │
│                                                         │
│  💾 记忆系统                                            │
│  ├── 短期记忆（对话历史）                               │
│  ├── 长期记忆（知识库）                                 │
│  └── 工作记忆（当前任务）                               │
│                                                         │
│  🔄 反思能力                                            │
│  ├── 评估执行结果                                       │
│  ├── 识别错误                                           │
│  └── 调整策略                                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Agent 核心架构

### 经典架构

```
┌─────────────────────────────────────────────────────────┐
│                    AI Agent 架构                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    ┌─────────────┐                      │
│                    │   用户输入   │                      │
│                    └──────┬──────┘                      │
│                           ↓                             │
│  ┌─────────────────────────────────────────────────┐   │
│  │                 大脑（LLM）                      │   │
│  │  ┌─────────────┐  ┌─────────────┐              │   │
│  │  │  理解任务    │  │  制定计划    │              │   │
│  │  └─────────────┘  └─────────────┘              │   │
│  │  ┌─────────────┐  ┌─────────────┐              │   │
│  │  │  生成行动    │  │  评估结果    │              │   │
│  │  └─────────────┘  └─────────────┘              │   │
│  └─────────────────────────────────────────────────┘   │
│                           │                             │
│         ┌─────────────────┼─────────────────┐          │
│         ↓                 ↓                 ↓          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │   记忆系统   │  │   工具系统   │  │   规划系统   │   │
│  │             │  │             │  │             │   │
│  │ • 短期记忆  │  │ • API 调用  │  │ • 任务分解  │   │
│  │ • 长期记忆  │  │ • 代码执行  │  │ • 优先级    │   │
│  │ • 工作记忆  │  │ • 文件操作  │  │ • 反思调整  │   │
│  └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 核心组件详解

| 组件 | 功能 | 实现方式 |
|------|------|----------|
| **大脑** | 理解、推理、决策 | GPT-4、Claude、开源 LLM |
| **记忆** | 存储和检索信息 | 向量数据库、对话历史 |
| **工具** | 与外部世界交互 | API、代码执行器、文件系统 |
| **规划** | 任务分解和调度 | ReAct、Plan-and-Execute |
| **反思** | 评估和改进 | 自我评估、错误纠正 |

---

## Agent 工作原理

### ReAct 模式（推理+行动）

```
┌─────────────────────────────────────────────────────────┐
│                    ReAct 工作流                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  用户问题                                                │
│      ↓                                                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Thought（思考）                                  │   │
│  │ "我需要查找关于 XX 的信息..."                    │   │
│  └─────────────────────────────────────────────────┘   │
│      ↓                                                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Action（行动）                                   │   │
│  │ 调用搜索工具：search("XX 相关信息")              │   │
│  └─────────────────────────────────────────────────┘   │
│      ↓                                                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Observation（观察）                              │   │
│  │ "搜索结果：..."                                  │   │
│  └─────────────────────────────────────────────────┘   │
│      ↓                                                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Thought（再次思考）                              │   │
│  │ "根据搜索结果，我需要进一步分析..."              │   │
│  └─────────────────────────────────────────────────┘   │
│      ↓                                                  │
│  ... 循环直到任务完成 ...                               │
│      ↓                                                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Final Answer（最终答案）                         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Plan-and-Execute 模式

```
┌─────────────────────────────────────────────────────────┐
│                  Plan-and-Execute 模式                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  任务：写一篇关于 React 19 的技术博客                    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 阶段一：规划（Planning）                         │   │
│  │                                                  │   │
│  │ Step 1: 搜索 React 19 新特性                     │   │
│  │ Step 2: 整理关键特性列表                          │   │
│  │ Step 3: 撰写博客大纲                             │   │
│  │ Step 4: 撰写完整文章                             │   │
│  │ Step 5: 审核和优化                               │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 阶段二：执行（Execution）                        │   │
│  │                                                  │   │
│  │ 执行 Step 1 → 执行 Step 2 → ... → 执行 Step 5   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 从零创建 Agent

### 基础 Agent 实现

```python
"""
从零创建一个 AI Agent
"""
import openai
from typing import List, Dict, Callable, Optional
from dataclasses import dataclass
from enum import Enum

# ========== 工具定义 ==========

@dataclass
class Tool:
    """工具定义"""
    name: str
    description: str
    function: Callable
    parameters: Dict = None

# ========== Agent 核心类 ==========

class Agent:
    """AI Agent 核心类"""
    
    def __init__(
        self,
        name: str,
        system_prompt: str,
        model: str = "gpt-4",
        api_key: Optional[str] = None
    ):
        self.name = name
        self.system_prompt = system_prompt
        self.model = model
        self.client = openai.OpenAI(api_key=api_key)
        self.tools: Dict[str, Tool] = {}
        self.memory: List[Dict] = []
        self.max_iterations = 10
    
    def register_tool(self, tool: Tool):
        """注册工具"""
        self.tools[tool.name] = tool
    
    def get_tools_description(self) -> str:
        """获取工具描述"""
        if not self.tools:
            return "没有可用工具"
        
        descriptions = []
        for name, tool in self.tools.items():
            descriptions.append(f"- {name}: {tool.description}")
        return "\n".join(descriptions)
    
    def chat(self, user_input: str) -> str:
        """与 Agent 对话"""
        # 添加用户消息
        self.memory.append({"role": "user", "content": user_input})
        
        # 构建系统提示
        system_content = f"""你是 {self.name}，一个智能助手。

{self.system_prompt}

可用工具：
{self.get_tools_description()}

当需要使用工具时，使用以下 JSON 格式：
```json
{{
    "action": "工具名称",
    "input": "输入参数"
}}
```

当任务完成时，直接输出最终答案。"""
        
        messages = [{"role": "system", "content": system_content}] + self.memory
        
        # 迭代执行
        for iteration in range(self.max_iterations):
            # 调用 LLM
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages
            )
            
            assistant_message = response.choices[0].message.content
            messages.append({"role": "assistant", "content": assistant_message})
            
            # 检查是否需要执行工具
            if self._needs_tool(assistant_message):
                tool_result = self._execute_tool(assistant_message)
                messages.append({"role": "user", "content": f"工具执行结果:\n{tool_result}"})
            else:
                # 任务完成
                self.memory.append({"role": "assistant", "content": assistant_message})
                return assistant_message
        
        return "达到最大迭代次数，任务未完成"
    
    def _needs_tool(self, message: str) -> bool:
        """检查是否需要使用工具"""
        return '"action"' in message and '"input"' in message
    
    def _execute_tool(self, message: str) -> str:
        """执行工具"""
        import json
        import re
        
        # 提取 JSON
        json_match = re.search(r'\{[^}]+\}', message)
        if not json_match:
            return "无法解析工具调用"
        
        try:
            tool_call = json.loads(json_match.group())
            action = tool_call.get("action")
            input_data = tool_call.get("input", "")
            
            if action in self.tools:
                result = self.tools[action].function(input_data)
                return f"工具 {action} 执行结果: {result}"
            else:
                return f"工具 {action} 不存在"
        except Exception as e:
            return f"工具执行错误: {str(e)}"


# ========== 使用示例 ==========

# 定义工具
def search_tool(query: str) -> str:
    """搜索工具"""
    return f"搜索 '{query}' 的结果：找到了相关信息..."

def calculator_tool(expression: str) -> str:
    """计算器工具"""
    try:
        result = eval(expression)
        return f"计算结果: {result}"
    except Exception as e:
        return f"计算错误: {str(e)}"

def read_file_tool(filepath: str) -> str:
    """文件读取工具"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            return f"文件内容:\n{content[:500]}"
    except Exception as e:
        return f"读取错误: {str(e)}"

# 创建 Agent
agent = Agent(
    name="通用助手",
    system_prompt="你是一个能够使用工具完成任务的智能助手。",
    model="gpt-4"
)

# 注册工具
agent.register_tool(Tool(
    name="search",
    description="搜索互联网获取信息",
    function=search_tool
))

agent.register_tool(Tool(
    name="calculator",
    description="计算数学表达式",
    function=calculator_tool
))

agent.register_tool(Tool(
    name="read_file",
    description="读取本地文件内容",
    function=read_file_tool
))

# 使用 Agent
response = agent.chat("帮我计算 (15 + 27) * 3 的结果")
print(response)
```

---

## 主流 Agent 框架

### 1. LangChain Agent

```python
"""
LangChain Agent 实战
"""
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI

# 定义工具
@tool
def search(query: str) -> str:
    """搜索互联网获取信息"""
    return f"搜索结果：关于 '{query}' 的最新信息..."

@tool
def calculate(expression: str) -> str:
    """计算数学表达式"""
    try:
        result = eval(expression)
        return f"计算结果: {result}"
    except Exception as e:
        return f"错误: {str(e)}"

# 创建 LLM
llm = ChatOpenAI(model="gpt-4", temperature=0)

# 创建 Prompt
prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一个有用的助手，可以使用工具完成任务。"),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad"),
])

# 创建 Agent
tools = [search, calculate]
agent = create_tool_calling_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# 使用
result = agent_executor.invoke({
    "input": "搜索 React 19 的新特性，然后计算 2 的 10 次方",
    "chat_history": []
})
print(result["output"])
```

### 2. CrewAI 多 Agent 协作

```python
"""
CrewAI - 多 Agent 协作框架
"""
from crewai import Agent, Task, Crew, Process
from langchain_openai import ChatOpenAI

# 定义 Agent
researcher = Agent(
    role="技术研究员",
    goal="深入研究技术主题，收集准确信息",
    backstory="""你是一位资深技术研究员，擅长从各种来源
    收集和整理技术信息。你善于辨别信息的可靠性。""",
    verbose=True,
    llm=ChatOpenAI(model="gpt-4")
)

writer = Agent(
    role="技术作家",
    goal="撰写清晰、易懂的技术文章",
    backstory="""你是一位经验丰富的技术作家，擅长将复杂
    的技术概念转化为通俗易懂的文章。""",
    verbose=True,
    llm=ChatOpenAI(model="gpt-4")
)

reviewer = Agent(
    role="技术审核员",
    goal="确保文章质量和准确性",
    backstory="""你是一位严格的技术审核员，善于发现文章
    中的错误和不准确之处。""",
    verbose=True,
    llm=ChatOpenAI(model="gpt-4")
)

# 定义任务
research_task = Task(
    description="""研究 TypeScript 5.0 的主要新特性，
    包括：装饰器、const 类型参数、satisfies 操作符等。
    提供每个特性的详细说明和使用示例。""",
    expected_output="一份包含 TypeScript 5.0 新特性的详细报告",
    agent=researcher
)

writing_task = Task(
    description="""基于研究报告，撰写一篇技术博客文章。
    文章应该：
    1. 有清晰的结构
    2. 包含代码示例
    3. 适合中级开发者阅读""",
    expected_output="一篇完整的 Markdown 格式技术博客",
    agent=writer
)

review_task = Task(
    description="""审核技术博客文章，检查：
    1. 技术准确性
    2. 代码示例正确性
    3. 表达清晰度
    提供修改建议。""",
    expected_output="审核报告和修改建议",
    agent=reviewer
)

# 创建 Crew
crew = Crew(
    agents=[researcher, writer, reviewer],
    tasks=[research_task, writing_task, review_task],
    verbose=True,
    process=Process.sequential  # 顺序执行
)

# 执行
result = crew.kickoff()
print(result)
```

### 3. AutoGen 多 Agent 对话

```python
"""
AutoGen - 微软多 Agent 对话框架
"""
from autogen import AssistantAgent, UserProxyAgent, config_list_from_json

# 加载配置
config_list = config_list_from_json("OAI_CONFIG_LIST")

# 创建助手 Agent
assistant = AssistantAgent(
    name="assistant",
    system_message="""你是一个有帮助的 AI 助手。
    你可以帮助用户完成各种任务，包括：
    - 回答问题
    - 编写代码
    - 分析数据
    当代码需要执行时，使用 Python 代码块。""",
    llm_config={"config_list": config_list}
)

# 创建用户代理
user_proxy = UserProxyAgent(
    name="user_proxy",
    human_input_mode="NEVER",  # 不需要人工输入
    max_consecutive_auto_reply=10,
    is_termination_msg=lambda x: x.get("content", "").rstrip().endswith("TERMINATE"),
    code_execution_config={
        "work_dir": "workspace",
        "use_docker": False  # 不使用 Docker
    }
)

# 开始对话
user_proxy.initiate_chat(
    assistant,
    message="""请帮我完成以下任务：
    1. 创建一个 Python 函数，计算斐波那契数列
    2. 写一个测试用例
    3. 运行测试并报告结果"""
)
```

### 框架对比

| 框架 | 特点 | 适用场景 | 学习曲线 |
|------|------|----------|----------|
| **LangChain** | 功能全面、生态丰富 | 复杂 Agent 应用 | ⭐⭐⭐ |
| **CrewAI** | 多 Agent 协作、角色扮演 | 团队协作任务 | ⭐⭐ |
| **AutoGen** | 微软出品、对话驱动 | 研究和实验 | ⭐⭐⭐ |
| **LlamaIndex** | 数据增强、RAG 优先 | 数据密集型任务 | ⭐⭐ |

---

## Agent 应用场景

### 1. 智能客服 Agent

```python
class CustomerServiceAgent:
    """智能客服 Agent"""
    
    def __init__(self):
        self.tools = {
            "search_faq": self.search_faq,
            "create_ticket": self.create_ticket,
            "check_order": self.check_order
        }
        self.conversation_history = []
    
    def handle_message(self, message: str) -> str:
        """处理用户消息"""
        # 1. 理解意图
        intent = self.classify_intent(message)
        
        # 2. 根据意图执行操作
        if intent == "question":
            return self.answer_question(message)
        elif intent == "complaint":
            return self.handle_complaint(message)
        elif intent == "order_status":
            return self.check_order_status(message)
        else:
            return self.general_response(message)
    
    def search_faq(self, query: str) -> str:
        """搜索 FAQ"""
        # 实际实现会查询知识库
        return f"找到相关 FAQ: {query}"
    
    def create_ticket(self, info: str) -> str:
        """创建工单"""
        return f"已创建工单: {info}"
    
    def check_order(self, order_id: str) -> str:
        """查询订单"""
        return f"订单 {order_id} 状态: 已发货"
```

### 2. 代码开发 Agent

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
    
    def develop_feature(self, requirement: str) -> str:
        """开发功能的完整流程"""
        # 1. 分析需求
        print("📋 分析需求...")
        design = self.analyze_requirement(requirement)
        
        # 2. 编写代码
        print("💻 编写代码...")
        code = self.write_code(design)
        
        # 3. 运行测试
        print("🧪 运行测试...")
        test_result = self.run_tests(code)
        
        # 4. 如果测试失败，调试
        if not test_result["passed"]:
            print("🐛 调试代码...")
            code = self.debug_code(code, test_result["error"])
        
        # 5. 重构优化
        print("🔧 重构优化...")
        final_code = self.refactor_code(code)
        
        return final_code
    
    def write_code(self, design: str) -> str:
        """编写代码"""
        # 实际实现会调用 LLM 生成代码
        return f"# 根据设计生成的代码\n{design}"
    
    def run_tests(self, code: str) -> dict:
        """运行测试"""
        return {"passed": True, "coverage": 85}
    
    def debug_code(self, code: str, error: str) -> str:
        """调试代码"""
        return f"# 修复后的代码\n{code}"
    
    def refactor_code(self, code: str) -> str:
        """重构代码"""
        return f"# 重构后的代码\n{code}"
```

### 3. 数据分析 Agent

```python
class DataAnalysisAgent:
    """数据分析 Agent"""
    
    def __init__(self):
        self.tools = {
            "load_data": self.load_data,
            "analyze": self.analyze,
            "visualize": self.visualize,
            "generate_report": self.generate_report
        }
    
    def analyze_data(self, data_source: str, question: str) -> str:
        """分析数据并回答问题"""
        # 1. 加载数据
        print("📊 加载数据...")
        data = self.load_data(data_source)
        
        # 2. 探索性分析
        print("🔍 探索性分析...")
        summary = self.exploratory_analysis(data)
        
        # 3. 针对问题分析
        print("📈 针对性分析...")
        analysis = self.targeted_analysis(data, question)
        
        # 4. 生成可视化
        print("📊 生成可视化...")
        charts = self.visualize(analysis)
        
        # 5. 生成报告
        print("📝 生成报告...")
        report = self.generate_report(summary, analysis, charts)
        
        return report
    
    def load_data(self, source: str) -> dict:
        """加载数据"""
        return {"data": [], "columns": []}
    
    def analyze(self, data: dict) -> dict:
        """分析数据"""
        return {"mean": 0, "std": 0}
    
    def visualize(self, analysis: dict) -> str:
        """生成可视化"""
        return "chart.png"
    
    def generate_report(self, summary, analysis, charts) -> str:
        """生成报告"""
        return "# 数据分析报告\n\n..."
```

### 4. 研究助手 Agent

```python
class ResearchAgent:
    """研究助手 Agent"""
    
    def __init__(self):
        self.tools = {
            "search_papers": self.search_papers,
            "read_paper": self.read_paper,
            "summarize": self.summarize,
            "compare": self.compare
        }
    
    def research_topic(self, topic: str) -> str:
        """研究一个主题"""
        # 1. 搜索相关论文
        print("📚 搜索相关论文...")
        papers = self.search_papers(topic)
        
        # 2. 阅读重要论文
        print("📖 阅读论文...")
        summaries = []
        for paper in papers[:5]:
            summary = self.read_paper(paper)
            summaries.append(summary)
        
        # 3. 综合分析
        print("🔍 综合分析...")
        analysis = self.compare(summaries)
        
        # 4. 生成研究报告
        print("📝 生成报告...")
        report = self.summarize(topic, analysis)
        
        return report
    
    def search_papers(self, query: str) -> list:
        """搜索论文"""
        return [{"title": "Paper 1", "url": "..."}]
    
    def read_paper(self, paper: dict) -> str:
        """阅读论文"""
        return f"摘要: {paper['title']}..."
    
    def summarize(self, topic: str, analysis: str) -> str:
        """生成总结"""
        return f"# {topic} 研究报告\n\n{analysis}"
```

---

## Agent 实战项目

### 项目：智能文档助手

```python
"""
智能文档助手 Agent
功能：读取文档、回答问题、生成摘要、提取关键信息
"""
import openai
from typing import List, Dict, Optional
from dataclasses import dataclass
import json

@dataclass
class Document:
    """文档结构"""
    content: str
    metadata: Dict = None

class DocumentAssistantAgent:
    """智能文档助手"""
    
    def __init__(self, api_key: str):
        self.client = openai.OpenAI(api_key=api_key)
        self.documents: List[Document] = []
        self.conversation_history: List[Dict] = []
    
    def load_document(self, content: str, metadata: Dict = None):
        """加载文档"""
        doc = Document(content=content, metadata=metadata or {})
        self.documents.append(doc)
        print(f"✅ 已加载文档，共 {len(self.documents)} 个文档")
    
    def ask(self, question: str) -> str:
        """向文档助手提问"""
        # 构建上下文
        context = self._build_context()
        
        # 构建消息
        messages = [
            {"role": "system", "content": f"""你是一个智能文档助手。

文档内容：
{context}

请基于文档内容回答问题。如果文档中没有相关信息，请说明。"""},
            *self.conversation_history,
            {"role": "user", "content": question}
        ]
        
        # 调用 LLM
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=messages
        )
        
        answer = response.choices[0].message.content
        
        # 更新对话历史
        self.conversation_history.append({"role": "user", "content": question})
        self.conversation_history.append({"role": "assistant", "content": answer})
        
        return answer
    
    def summarize(self) -> str:
        """生成文档摘要"""
        context = self._build_context()
        
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "你是一个专业的文档摘要助手。"},
                {"role": "user", "content": f"请为以下文档生成简洁的摘要：\n\n{context}"}
            ]
        )
        
        return response.choices[0].message.content
    
    def extract_key_info(self) -> str:
        """提取关键信息"""
        context = self._build_context()
        
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "你是一个信息提取助手。请从文档中提取关键信息。"},
                {"role": "user", "content": f"请从以下文档中提取关键信息（要点列表）：\n\n{context}"}
            ]
        )
        
        return response.choices[0].message.content
    
    def _build_context(self) -> str:
        """构建文档上下文"""
        context_parts = []
        for i, doc in enumerate(self.documents):
            context_parts.append(f"文档 {i+1}:\n{doc.content[:2000]}")
        return "\n\n".join(context_parts)


# 使用示例
if __name__ == "__main__":
    # 创建助手
    assistant = DocumentAssistantAgent(api_key="your-api-key")
    
    # 加载文档
    assistant.load_document("""
    TypeScript 5.0 引入了多项新特性：
    1. 装饰器（Decorators）正式支持
    2. const 类型参数
    3. satisfies 操作符
    4. 更好的推断
    """)
    
    # 提问
    answer = assistant.ask("TypeScript 5.0 有哪些新特性？")
    print(answer)
    
    # 生成摘要
    summary = assistant.summarize()
    print(summary)
```

---

## Agent 最佳实践

### 设计原则

```
1. 明确职责
   └── 每个 Agent 专注于一个特定领域

2. 工具粒度
   └── 工具功能单一、接口清晰

3. 错误处理
   └── 处理工具调用失败、LLM 响应异常

4. 记忆管理
   └── 控制上下文长度，避免信息过载

5. 安全性
   └── 验证工具输入，限制危险操作
```

### 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| Agent 陷入循环 | 工具调用失败但继续重试 | 设置最大迭代次数 |
| 上下文过长 | 对话历史太长 | 使用滑动窗口或摘要 |
| 工具调用错误 | LLM 输出格式错误 | 使用结构化输出（如 OpenAI Function Calling） |
| 幻觉问题 | LLM 编造工具调用结果 | 验证工具返回值 |

### 安全建议

```python
# 1. 输入验证
def safe_execute(code: str) -> str:
    """安全执行代码"""
    # 禁止危险操作
    dangerous_patterns = ["import os", "subprocess", "eval("]
    for pattern in dangerous_patterns:
        if pattern in code:
            return "错误：禁止执行危险操作"
    return exec(code)

# 2. 权限控制
class AgentWithPermissions:
    def __init__(self):
        self.permissions = {
            "read": True,
            "write": False,
            "execute": False
        }
    
    def check_permission(self, action: str) -> bool:
        return self.permissions.get(action, False)

# 3. 审计日志
def log_agent_action(action: str, result: str):
    """记录 Agent 行为"""
    with open("agent_audit.log", "a") as f:
        f.write(f"[{datetime.now()}] {action}: {result}\n")
```

---

## Agent 未来趋势

### 2024-2025 发展方向

```
┌─────────────────────────────────────────────────────────┐
│                   Agent 发展趋势                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🔮 多模态 Agent                                        │
│  ├── 视觉理解                                           │
│  ├── 语音交互                                           │
│  └── 视频分析                                           │
│                                                         │
│  🤝 多 Agent 协作                                       │
│  ├── 角色分工                                           │
│  ├── 任务协调                                           │
│  └── 知识共享                                           │
│                                                         │
│  🧠 自主学习                                            │
│  ├── 从经验中学习                                       │
│  ├── 策略优化                                           │
│  └── 知识积累                                           │
│                                                         │
│  🏢 企业级 Agent                                        │
│  ├── 安全合规                                           │
│  ├── 可解释性                                           │
│  └── 可控性                                             │
│                                                         │
│  🛠️ 开发工具                                            │
│  ├── Agent IDE                                          │
│  ├── 调试工具                                           │
│  └── 评估框架                                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 学习建议

1. **打好基础**：先掌握 LLM 和 Prompt Engineering
2. **实践为主**：从简单 Agent 开始，逐步增加复杂度
3. **关注框架**：学习 LangChain、CrewAI 等主流框架
4. **安全意识**：始终考虑 Agent 的安全性问题
5. **持续学习**：关注最新研究和开源项目

---

## 总结

| 概念 | 说明 |
|------|------|
| **Agent 定义** | 能自主感知、决策、行动的智能系统 |
| **核心组件** | 大脑（LLM）、记忆、工具、规划、反思 |
| **工作模式** | ReAct、Plan-and-Execute、多 Agent 协作 |
| **主流框架** | LangChain、CrewAI、AutoGen |
| **应用场景** | 客服、开发、数据分析、研究 |
| **最佳实践** | 明确职责、错误处理、安全控制 |
