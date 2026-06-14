# Node.js 学习手册

## 什么是 Node.js

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时环境，让 JavaScript 可以在服务器端运行。

## 核心优势

- **事件驱动、非阻塞 I/O**：高效处理并发连接
- **单线程、高并发**：适合 I/O 密集型应用
- **npm 生态**：超过 100 万个开源包
- **全栈 JavaScript**：前后端使用同一种语言

## Node.js 能做什么？

### 🌐 Web 服务器与 API
构建 RESTful API、GraphQL API、实时通信服务
- 框架：Express、Koa、Fastify、NestJS
- 案例：电商平台后端、博客系统 API

### 🔧 命令行工具 (CLI)
开发自动化脚本、构建工具、代码生成器
- 工具：Commander.js、Inquirer.js
- 案例：项目脚手架、自动化部署脚本

### 📡 实时应用
聊天应用、实时协作、在线游戏
- 技术：Socket.IO、WebSocket
- 案例：在线聊天室、实时协作文档

### 🔗 微服务架构
构建分布式系统、服务网格
- 框架：NestJS、gRPC
- 案例：订单系统、用户认证服务

### 📦 API 网关与中间件
请求路由、认证授权、日志记录
- 框架：Express、Koa
- 案例：API 网关、权限管理系统

### 🔄 消息队列与任务调度
异步任务处理、定时任务、队列消费
- 工具：Bull、Agenda、RabbitMQ
- 案例：邮件发送队列、数据处理管道

### 📊 监控与日志系统
应用性能监控、日志收集分析
- 工具：Winston、Pino、PM2
- 案例：服务器监控面板、日志分析系统

### 🤖 物件与嵌入式
控制硬件设备、IoT 应用开发
- 工具：Johnny-Five、Pi GPIO
- 案例：智能家居控制、传感器数据采集

### 📱 移动端与桌面端
跨平台应用开发
- 工具：Electron、NW.js
- 案例：VS Code、Slack 桌面版

### 🎮 游戏服务器
多人在线游戏后端
- 框架：Socket.IO、Colyseus
- 案例：多人游戏服务器、游戏匹配系统

## 学习路线

### 📚 基础语法
环境搭建、模块系统、文件操作、网络编程

### ⚡ 异步编程
回调函数、Promise、async/await

### 🌐 Web 框架
Express、Koa、NestJS

### 🚀 实战项目
REST API、实时应用、微服务

## 框架对比

| 特性 | Express | Koa | NestJS |
|------|---------|-----|--------|
| 定位 | 轻量级框架 | 下一代框架 | 企业级框架 |
| 架构 | 中间件模式 | 中间件模式 | 依赖注入 |
| 学习曲线 | 简单 | 简单 | 中等 |
| TypeScript | 支持 | 支持 | 原生支持 |
| 适用场景 | 快速开发 | 现代应用 | 大型项目 |
