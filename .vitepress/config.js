import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '技术学习手册',
  description: 'Python、TypeScript、Node.js 和 AI 完整学习指南',
  lang: 'zh-CN',
  base: '/tech-docs/',
  
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: '技术学习手册',
    
    nav: [
      { text: '首页', link: '/' },
      {
        text: 'Python',
        items: [
          { text: '基础语法', link: '/python/basics/' },
          { text: '数据结构', link: '/python/data-structures/' },
          { text: '函数与模块', link: '/python/functions/' },
          { text: '面向对象', link: '/python/oop/' },
          { text: '常用库', link: '/python/libraries/' },
          { text: '实战项目', link: '/python/projects/' }
        ]
      },
      {
        text: 'TypeScript',
        items: [
          { text: '基础语法', link: '/typescript/basics/' },
          { text: '类型系统', link: '/typescript/types/' },
          { text: '面向对象', link: '/typescript/classes/' },
          { text: '异步编程', link: '/typescript/async/' },
          { text: '模块系统', link: '/typescript/modules/' },
          { text: '框架实战', link: '/typescript/frameworks/' },
          { text: '进阶内容', link: '/typescript/advanced/' }
        ]
      },
      {
        text: 'Node.js',
        items: [
          { text: '能做什么', link: '/nodejs/what-can-do' },
          { text: '基础语法', link: '/nodejs/basics/' },
          { text: '模块系统', link: '/nodejs/modules/' },
          { text: '异步编程', link: '/nodejs/async/' },
          { text: 'Express', link: '/nodejs/express/' },
          { text: 'Koa', link: '/nodejs/koa/' },
          { text: 'NestJS', link: '/nodejs/nest/' },
          { text: '实战项目', link: '/nodejs/projects/' }
        ]
      },
      {
        text: 'Vue3 vs React',
        items: [
          { text: '认识框架', link: '/vue-react/chapter1' },
          { text: '组件基础', link: '/vue-react/chapter2' },
          { text: '状态管理', link: '/vue-react/chapter3' },
          { text: '生命周期', link: '/vue-react/chapter4' },
          { text: '路由', link: '/vue-react/chapter5' },
          { text: '避坑指南', link: '/vue-react/chapter8' }
        ]
      },
      {
        text: 'HTML & CSS',
        items: [
          { text: 'CSS 基础', link: '/html-css/css/' },
          { text: 'Flexbox 布局', link: '/html-css/layouts/flexbox' },
          { text: 'Grid 布局', link: '/html-css/layouts/grid' },
          { text: '响应式设计', link: '/html-css/layouts/responsive' },
          { text: '过渡动画', link: '/html-css/animations/transitions' },
          { text: '关键帧动画', link: '/html-css/animations/keyframes' },
          { text: '3D 变换', link: '/html-css/animations/3d' },
          { text: 'CSS 特效', link: '/html-css/effects/' }
        ]
      },
      {
        text: '运维 & DevOps',
        items: [
          { text: '运维基础', link: '/devops/chapter1' },
          { text: '网络运维', link: '/devops/chapter2' },
          { text: 'Docker 容器化', link: '/devops/chapter3' },
          { text: 'Nginx 反向代理', link: '/devops/chapter4' },
          { text: '错误调试分析', link: '/devops/chapter8' }
        ]
      },
      {
        text: 'AI 人工智能',
        items: [
          { text: '发展简史', link: '/ai/history' },
          { text: '核心概念', link: '/ai/concepts/' },
          { text: '机器学习', link: '/ai/concepts/ml' },
          { text: '深度学习', link: '/ai/concepts/dl' },
          { text: '大语言模型', link: '/ai/concepts/llm' },
          { text: 'RAG 技术', link: '/ai/concepts/rag' },
          { text: '向量数据库', link: '/ai/concepts/vector-db' },
          { text: '提示工程', link: '/ai/concepts/prompt' },
          { text: 'AI Agent', link: '/ai/concepts/agent' },
          { text: '工具架构', link: '/ai/tools/' },
          { text: '前端框架集成', link: '/ai/frameworks/' },
          { text: '对程序员的影响', link: '/ai/impact/' },
          { text: '学习路径', link: '/ai/learning/path' }
        ]
      }
    ],

    sidebar: {
      '/python/': [
        {
          text: 'Python 基础语法',
          collapsed: false,
          items: [
            { text: '环境搭建', link: '/python/basics/setup' },
            { text: '变量与数据类型', link: '/python/basics/variables' },
            { text: '运算符', link: '/python/basics/operators' },
            { text: '字符串操作', link: '/python/basics/strings' },
            { text: '输入输出', link: '/python/basics/io' },
            { text: '条件语句', link: '/python/basics/conditions' },
            { text: '循环语句', link: '/python/basics/loops' }
          ]
        },
        {
          text: '数据结构',
          collapsed: false,
          items: [
            { text: '列表 List', link: '/python/data-structures/list' },
            { text: '元组 Tuple', link: '/python/data-structures/tuple' },
            { text: '字典 Dict', link: '/python/data-structures/dict' },
            { text: '集合 Set', link: '/python/data-structures/set' },
            { text: 'NumPy 数组', link: '/python/data-structures/numpy' },
            { text: 'Pandas 数据框', link: '/python/data-structures/pandas' }
          ]
        },
        {
          text: '函数与模块',
          collapsed: false,
          items: [
            { text: '函数定义', link: '/python/functions/definition' },
            { text: '参数与返回值', link: '/python/functions/parameters' },
            { text: 'Lambda 表达式', link: '/python/functions/lambda' },
            { text: '装饰器', link: '/python/functions/decorators' },
            { text: '模块与包', link: '/python/functions/modules' },
            { text: '文件操作', link: '/python/functions/file' }
          ]
        },
        {
          text: '面向对象编程',
          collapsed: false,
          items: [
            { text: '类与对象', link: '/python/oop/class' },
            { text: '继承与多态', link: '/python/oop/inheritance' },
            { text: '封装与抽象', link: '/python/oop/encapsulation' },
            { text: '魔术方法', link: '/python/oop/magic' }
          ]
        },
        {
          text: '常用库',
          collapsed: false,
          items: [
            { text: 'NumPy 数值计算', link: '/python/libraries/numpy' },
            { text: 'Pandas 数据分析', link: '/python/libraries/pandas' },
            { text: 'Matplotlib 可视化', link: '/python/libraries/matplotlib' },
            { text: 'Requests 网络请求', link: '/python/libraries/requests' },
            { text: 'Flask Web框架', link: '/python/libraries/flask' },
            { text: 'SQLAlchemy 数据库', link: '/python/libraries/sqlalchemy' },
            { text: 'OpenCV 图像处理', link: '/python/libraries/opencv' },
            { text: 'Scikit-learn 机器学习', link: '/python/libraries/sklearn' }
          ]
        },
        {
          text: '实战项目',
          collapsed: false,
          items: [
            { text: '数据分析项目', link: '/python/projects/data-analysis' },
            { text: 'Web API 开发', link: '/python/projects/web-api' },
            { text: '自动化脚本', link: '/python/projects/automation' },
            { text: '机器学习入门', link: '/python/projects/ml-intro' }
          ]
        }
      ],
      '/typescript/': [
        {
          text: 'TypeScript 基础语法',
          collapsed: false,
          items: [
            { text: '环境搭建', link: '/typescript/basics/setup' },
            { text: '变量与数据类型', link: '/typescript/basics/variables' },
            { text: '运算符', link: '/typescript/basics/operators' },
            { text: '字符串操作', link: '/typescript/basics/strings' },
            { text: '函数', link: '/typescript/basics/functions' },
            { text: '条件语句', link: '/typescript/basics/conditions' },
            { text: '循环语句', link: '/typescript/basics/loops' }
          ]
        },
        {
          text: '类型系统',
          collapsed: false,
          items: [
            { text: '基本类型', link: '/typescript/types/primitives' },
            { text: '接口', link: '/typescript/types/interfaces' },
            { text: '泛型', link: '/typescript/types/generics' },
            { text: '枚举', link: '/typescript/types/enums' },
            { text: '类型别名', link: '/typescript/types/aliases' }
          ]
        },
        {
          text: '面向对象编程',
          collapsed: false,
          items: [
            { text: '类基础', link: '/typescript/classes/basics' },
            { text: '继承', link: '/typescript/classes/inheritance' },
            { text: '访问修饰符', link: '/typescript/classes/access' },
            { text: '抽象类', link: '/typescript/classes/abstract' },
            { text: '装饰器', link: '/typescript/classes/decorators' }
          ]
        },
        {
          text: '异步编程',
          collapsed: false,
          items: [
            { text: 'Promise', link: '/typescript/async/promises' },
            { text: 'async/await', link: '/typescript/async/async-await' }
          ]
        },
        {
          text: '模块系统',
          collapsed: false,
          items: [
            { text: 'ES 模块', link: '/typescript/modules/esm' },
            { text: '命名空间', link: '/typescript/modules/namespaces' }
          ]
        },
        {
          text: '框架实战',
          collapsed: false,
          items: [
            { text: 'Vue3 + TypeScript', link: '/typescript/frameworks/vue3' },
            { text: 'React + TypeScript', link: '/typescript/frameworks/react' }
          ]
        },
        {
          text: '进阶内容',
          collapsed: false,
          items: [
            { text: '高级类型', link: '/typescript/advanced/types' },
            { text: '设计模式', link: '/typescript/advanced/patterns' }
          ]
        }
      ],
      '/nodejs/': [
        {
          text: '概览',
          collapsed: false,
          items: [
            { text: 'Node.js 能做什么', link: '/nodejs/what-can-do' }
          ]
        },
        {
          text: 'Node.js 基础语法',
          collapsed: false,
          items: [
            { text: '环境搭建', link: '/nodejs/basics/setup' },
            { text: '内置模块', link: '/nodejs/basics/built-in' },
            { text: '文件操作', link: '/nodejs/basics/files' },
            { text: '网络编程', link: '/nodejs/basics/network' },
            { text: '进程管理', link: '/nodejs/basics/process' }
          ]
        },
        {
          text: '模块系统',
          collapsed: false,
          items: [
            { text: 'ES Modules & CommonJS', link: '/nodejs/modules/' }
          ]
        },
        {
          text: '异步编程',
          collapsed: false,
          items: [
            { text: '异步编程详解', link: '/nodejs/async/' }
          ]
        },
        {
          text: 'Web 框架',
          collapsed: false,
          items: [
            { text: 'Express 框架', link: '/nodejs/express/' },
            { text: 'Koa 框架', link: '/nodejs/koa/' },
            { text: 'NestJS 框架', link: '/nodejs/nest/' }
          ]
        },
        {
          text: '实战项目',
          collapsed: false,
          items: [
            { text: '电商平台 API', link: '/nodejs/projects/ecommerce' },
            { text: '实时聊天应用', link: '/nodejs/projects/chat' },
            { text: '博客系统', link: '/nodejs/projects/blog' }
          ]
        }
      ],
      '/devops/': [
        {
          text: '运维与 DevOps',
          collapsed: false,
          items: [
            { text: '运维基础与工具链', link: '/devops/chapter1' },
            { text: '网络运维与故障排查', link: '/devops/chapter2' },
            { text: 'Docker 容器化运维', link: '/devops/chapter3' },
            { text: 'Nginx 反向代理', link: '/devops/chapter4' },
            { text: '错误调试分析', link: '/devops/chapter8' }
          ]
        }
      ],
      '/vue-react/': [
        {
          text: 'Vue3 vs React 对比教学',
          collapsed: false,
          items: [
            { text: '认识框架', link: '/vue-react/chapter1' },
            { text: '组件基础', link: '/vue-react/chapter2' },
            { text: '状态管理', link: '/vue-react/chapter3' },
            { text: '生命周期', link: '/vue-react/chapter4' },
            { text: '路由', link: '/vue-react/chapter5' },
            { text: '避坑指南', link: '/vue-react/chapter8' }
          ]
        }
      ],
      '/html-css/': [
        {
          text: 'CSS 基础',
          collapsed: false,
          items: [
            { text: 'CSS 基础语法', link: '/html-css/css/' }
          ]
        },
        {
          text: '布局系统',
          collapsed: false,
          items: [
            { text: 'Flexbox 布局', link: '/html-css/layouts/flexbox' },
            { text: 'Grid 布局', link: '/html-css/layouts/grid' },
            { text: '响应式设计', link: '/html-css/layouts/responsive' }
          ]
        },
        {
          text: '动画效果',
          collapsed: false,
          items: [
            { text: '过渡动画', link: '/html-css/animations/transitions' },
            { text: '关键帧动画', link: '/html-css/animations/keyframes' },
            { text: '3D 变换', link: '/html-css/animations/3d' }
          ]
        },
        {
          text: 'CSS 特效',
          collapsed: false,
          items: [
            { text: '特效实现', link: '/html-css/effects/' }
          ]
        }
      ],
      '/ai/': [
        {
          text: '概览',
          collapsed: false,
          items: [
            { text: 'AI 发展简史', link: '/ai/history' },
            { text: '核心概念总览', link: '/ai/concepts/' }
          ]
        },
        {
          text: '核心概念',
          collapsed: false,
          items: [
            { text: '机器学习', link: '/ai/concepts/ml' },
            { text: '深度学习', link: '/ai/concepts/dl' },
            { text: '大语言模型', link: '/ai/concepts/llm' },
            { text: 'RAG 技术', link: '/ai/concepts/rag' },
            { text: '向量数据库', link: '/ai/concepts/vector-db' },
            { text: '提示工程', link: '/ai/concepts/prompt' },
            { text: 'AI Agent', link: '/ai/concepts/agent' }
          ]
        },
        {
          text: '架构与工具',
          collapsed: false,
          items: [
            { text: 'AI 工具架构详解', link: '/ai/tools/' },
            { text: '前端框架集成', link: '/ai/frameworks/' }
          ]
        },
        {
          text: '影响与发展',
          collapsed: false,
          items: [
            { text: '对程序员的冲击与机遇', link: '/ai/impact/' }
          ]
        },
        {
          text: '学习路径',
          collapsed: false,
          items: [
            { text: '前端开发者专属路径', link: '/ai/learning/path' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-repo' }
    ],

    footer: {
      message: '技术学习手册 - Python & TypeScript & Node.js & AI',
      copyright: '© 2024 Tech Docs'
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索'
          },
          modal: {
            displayDetails: '显示详情',
            resetButtonTitle: '清除查询条件',
            backButtonTitle: '返回',
            noResultsText: '无法找到相关结果',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },

    outline: {
      label: '页面导航'
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    }
  }
})
