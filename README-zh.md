# 学习 OpenClaw

**全栈 AI 助手实战营** — 4 周从部署到自动化，全面掌握 OpenClaw。

## 概览

Learn OpenClaw 是一个面向 [OpenClaw](https://github.com/claw0/openclaw) 个人 AI 助手平台的交互式学习网站。通过 17 节实践课程，系统覆盖 OpenClaw 完整使用链路：

- **第 1 周**：部署与配置
- **第 2 周**：渠道与路由
- **第 3 周**：智能与记忆
- **第 4 周**：自动化与进阶

## 特性

- **双语并行**：完整的中英文内容
- **深度交互**：配置编辑器、渠道路由、灵魂工坊、技能实验室、Prompt 堆叠、记忆演示、自动化库
- **步骤模拟器**：场景驱动的引导式学习
- **SVG 可视化**：每课配有动画架构图
- **Gateway 连接**：连接本地 OpenClaw Gateway 启用实时功能
- **暗色模式**：跟随系统设置，支持手动切换
- **静态导出**：无服务器依赖，部署到任意平台

## 快速开始

```bash
cd web
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 项目结构

```
learn-openclaw/
├── lessons/              # Markdown 教学内容（中/英）
├── samples/              # 配置预设、工作空间模板、技能示例、自动化模板
├── web/                  # Next.js 交互学习平台
│   ├── scripts/          # 内容提取管道
│   └── src/
│       ├── app/          # App Router 页面
│       ├── components/   # React 组件
│       ├── gateway/      # WebSocket 客户端层
│       ├── hooks/        # 自定义 React Hooks
│       ├── i18n/         # 国际化
│       └── lib/          # 工具库和常量
└── .github/workflows/    # CI/CD
```

## 构建

```bash
cd web
npm run build
```

静态文件生成在 `web/out/` 目录。

## 课程列表

| # | 标题 | 周次 | 时长 |
|---|------|------|------|
| 01 | 安装部署 | 1 | 45分钟 |
| 02 | 配置详解 | 1 | 60分钟 |
| 03 | 工作空间 | 1 | 50分钟 |
| 04 | 初次对话 | 1 | 35分钟 |
| 05 | 渠道接入 | 2 | 55分钟 |
| 06 | 多渠道协同 | 2 | 50分钟 |
| 07 | 路由规则 | 2 | 60分钟 |
| 08 | 多 Agent | 2 | 55分钟 |
| 09 | Prompt 工程 | 3 | 65分钟 |
| 10 | 记忆系统 | 3 | 55分钟 |
| 11 | 技能安装 | 3 | 50分钟 |
| 12 | 自定义技能 | 3 | 65分钟 |
| 13 | 定时任务 | 4 | 50分钟 |
| 14 | Webhook | 4 | 50分钟 |
| 15 | Canvas & A2UI | 4 | 55分钟 |
| 16 | 语音与节点 | 4 | 40分钟 |
| 17 | Capstone: 24/7 AI 助手 | 4 | 90分钟 |

## 技术栈

- [Next.js](https://nextjs.org/) 16（App Router，静态导出）
- [React](https://react.dev/) 19
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Framer Motion](https://www.framer.com/motion/) 12
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Zustand](https://zustand.docs.pmnd.rs/) 5
- [unified](https://github.com/unifiedjs/unified)（Markdown 渲染）

## 许可证

MIT
