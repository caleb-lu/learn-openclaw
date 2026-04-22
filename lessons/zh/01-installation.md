# 安装部署

OpenClaw 是一个开源的个人 AI 助手框架，支持多种部署方式。本节课将带你从零开始完成 OpenClaw 的安装与初始化，包括 Docker 容器化部署、npm 全局安装以及 Gateway 守护进程的配置。

## 学习目标

- 了解 OpenClaw 的系统要求和依赖项
- 掌握通过 Docker 一键部署 OpenClaw 的方法
- 学会使用 npm 安装并启动 OpenClaw CLI
- 理解 Gateway 守护进程的作用与运行机制
- 完成首次安装并验证系统正常运行

## 前置知识

- 基本的命令行操作能力（bash / PowerShell）
- 了解 Docker 基本概念（镜像、容器、卷）
- 拥有 Node.js 18+ 运行环境（npm 方式安装时需要）

## 系统要求

OpenClaw 需要以下最低环境：

- **操作系统**：Linux / macOS / Windows 10+（WSL2 推荐）
- **Node.js**：>= 18.0（仅 npm 安装方式需要）
- **Docker**：>= 20.10（仅 Docker 安装方式需要）
- **内存**：建议 >= 2GB
- **网络**：需要访问 LLM API（OpenAI / Anthropic / 本地模型等）

## 方式一：Docker 部署

Docker 是推荐的部署方式，隔离性好、升级简单。

```bash
# 拉取最新镜像
docker pull openclaw/openclaw:latest

# 启动容器（挂载工作空间目录）
docker run -d \
  --name openclaw \
  -v ~/.openclaw:/root/.openclaw \
  -p 3000:3000 \
  openclaw/openclaw:latest
```

你也可以使用 Docker Compose 进行管理：

```yaml
# docker-compose.yml
version: "3.8"
services:
  openclaw:
    image: openclaw/openclaw:latest
    container_name: openclaw
    ports:
      - "3000:3000"
    volumes:
      - ~/.openclaw:/root/.openclaw
    restart: unless-stopped
    environment:
      - OPENCLAW_LOG_LEVEL=info
```

```bash
# 使用 Docker Compose 启动
docker compose up -d
```

## 方式二：npm 全局安装

如果你更喜欢直接在系统上运行：

```bash
# 全局安装 OpenClaw CLI
npm install -g @openclaw/cli

# 验证安装
openclaw --version

# 初始化工作空间
openclaw init my-assistant

# 进入项目目录
cd my-assistant

# 启动 Gateway 守护进程
openclaw start
```

## Gateway 守护进程

Gateway 是 OpenClaw 的核心守护进程，负责：

- 管理所有渠道连接（Telegram、Discord、Slack 等）
- 调度消息路由与 Agent 分发
- 执行定时任务与 Webhook
- 持久化会话与记忆数据

```bash
# 启动 Gateway（前台运行）
openclaw start

# 后台守护运行
openclaw start --daemon

# 查看运行状态
openclaw status

# 查看实时日志
openclaw logs --follow

# 停止 Gateway
openclaw stop
```

## CLI 常用命令速览

安装完成后，你可以使用以下命令进行日常操作：

```bash
openclaw init <name>       # 初始化新工作空间
openclaw start             # 启动 Gateway
openclaw stop              # 停止 Gateway
openclaw restart           # 重启 Gateway
openclaw status            # 查看状态
openclaw chat              # 进入交互式聊天
openclaw config edit       # 编辑配置文件
openclaw skill install <n> # 安装技能
openclaw update            # 更新到最新版本
```

## 安装验证

完成安装后，运行以下命令确认一切正常：

```bash
# 检查版本
openclaw --version

# 检查 Gateway 状态
openclaw status

# 发送测试消息
openclaw chat --message "你好，OpenClaw！"
```

如果看到正确的版本号和回复消息，说明安装成功。

## 小结

本节课介绍了 OpenClaw 的两种主要安装方式：Docker 容器化部署和 npm 全局安装。Docker 方式适合生产环境和快速体验，npm 方式适合开发者进行定制化开发。Gateway 守护进程是 OpenClaw 的运行核心，理解它的启停和管理是后续学习的基础。下一节课我们将深入配置文件的详解。
