# Capstone: 构建 24/7 个人 AI 助手

恭喜你完成了前面 16 节课程的学习！现在，我们将把所有知识综合运用，从零构建一个 7x24 小时在线的个人 AI 助手系统。这个 Capstone 项目将涵盖安装部署、多渠道接入、多 Agent 协作、记忆系统、技能扩展、定时任务和 Webhook 等全部核心功能。

## 学习目标

- 综合运用前 16 节课的所有知识
- 完成一个完整的 24/7 个人 AI 助手部署
- 实现多渠道、多 Agent、定时任务的协同工作
- 掌握系统监控与运维的基本方法
- 具备独立定制和扩展 AI 助手的能力

## 前置知识

- 已完成第 01-16 节全部课程
- 拥有一台可长期运行的服务器或 VPS
- 拥有 OpenAI / Anthropic API Key
- 拥有 Telegram Bot Token（可选）

## 项目规划

我们要构建的系统架构如下：

```
用户
 ├── Telegram（主要交互渠道）
 ├── Slack（工作相关）
 └── WebChat（网页端）
      │
      ▼
 OpenClaw Gateway（Docker 部署）
      │
      ├── Agent: 总调度（路由分发）
      ├── Agent: 工作助手（邮件、日程、代码）
      ├── Agent: 生活助手（天气、新闻、提醒）
      └── Agent: 系统监控（健康检查）
      │
      ├── 定时任务（早报、周报、健康检查）
      ├── Webhook（GitHub、服务器告警）
      ├── 技能（code-review、meeting-notes）
      └── 记忆系统（跨会话记忆）
```

## 第一步：基础设施搭建

### Docker Compose 部署

```yaml
# docker-compose.yml
version: "3.8"
services:
  openclaw:
    image: openclaw/openclaw:latest
    container_name: my-assistant
    ports:
      - "3000:3000"
    volumes:
      - ./workspace:/root/.openclaw/workspace
      - ./data:/root/.openclaw/data
      - ./logs:/root/.openclaw/logs
    env_file:
      - .env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### 环境变量

```bash
# .env
OPENAI_API_KEY=sk-xxxxxxxxxxxx
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
SLACK_BOT_TOKEN=xoxb-xxxx-xxxx
CLUSTER_SECRET=my-cluster-secret-2025
LOG_LEVEL=info
```

```bash
# 启动系统
docker compose up -d

# 验证运行状态
docker compose ps
docker compose logs -f
```

## 第二步：完整配置文件

```json5
// workspace/openclaw.json5
{
  // ==================== LLM ====================
  "llm": {
    "provider": "openai",
    "model": "gpt-4o",
    "apiKey": "${OPENAI_API_KEY}",
    "temperature": 0.7,
    "maxTokens": 4096
  },

  // ==================== Gateway ====================
  "gateway": {
    "port": 3000,
    "logLevel": "info"
  },

  // ==================== 渠道 ====================
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "${TELEGRAM_BOT_TOKEN}",
      "allowedUsers": ["your_telegram_id"]
    },
    "slack": {
      "enabled": true,
      "botToken": "${SLACK_BOT_TOKEN}",
      "appToken": "${SLACK_APP_TOKEN}"
    },
    "webchat": {
      "enabled": true,
      "auth": { "enabled": true, "token": "${WEBSOCKET_AUTH_TOKEN}" }
    }
  },

  // ==================== Agent ====================
  "agents": {
    "general": {
      "name": "总调度",
      "model": "gpt-4o",
      "delegateTo": ["work", "life", "monitor"],
      "systemPrompt": "你是总调度助手，根据用户需求分发到合适的 Agent。"
    },
    "work": {
      "name": "工作助手",
      "model": "gpt-4o",
      "temperature": 0.3,
      "soulFile": "workspace/agents/work-soul.md",
      "tools": ["email", "calendar", "code_exec"],
      "memory": { "namespace": "work" }
    },
    "life": {
      "name": "生活助手",
      "model": "gpt-4o-mini",
      "temperature": 0.7,
      "soulFile": "workspace/agents/life-soul.md",
      "tools": ["weather", "news", "search"],
      "memory": { "namespace": "life" }
    },
    "monitor": {
      "name": "系统监控",
      "model": "gpt-4o-mini",
      "temperature": 0.1,
      "tools": ["health_check", "log_reader"]
    }
  },

  // ==================== 路由 ====================
  "routing": {
    "defaultAgent": "general",
    "rules": [
      { "type": "exact", "match": "/work", "agent": "work" },
      { "type": "exact", "match": "/life", "agent": "life" },
      { "type": "exact", "match": "/status", "agent": "monitor" },
      { "type": "regex", "match": "(邮件|email|日程|code|代码)", "agent": "work" },
      { "type": "regex", "match": "(天气|新闻|提醒|天气)", "agent": "life" },
      { "type": "channel", "match": "slack", "agent": "work" }
    ]
  },

  // ==================== 记忆 ====================
  "memory": {
    "enabled": true,
    "maxEntries": 500,
    "extraction": { "autoExtract": true },
    "recall": { "autoRecall": true, "maxRecallEntries": 5 },
    "dailySummary": {
      "enabled": true,
      "time": "23:00",
      "timezone": "Asia/Shanghai"
    }
  },

  // ==================== 定时任务 ====================
  "schedules": [
    {
      "name": "morning-briefing",
      "trigger": "cron",
      "expression": "0 8 * * *",
      "timezone": "Asia/Shanghai",
      "agent": "life",
      "message": "请提供今日早报：1）天气预报 2）3条重要新闻 3）今日待办提醒",
      "channel": "telegram"
    },
    {
      "name": "weekly-review",
      "trigger": "cron",
      "expression": "0 18 * * 5",
      "timezone": "Asia/Shanghai",
      "agent": "work",
      "message": "请生成本周工作周报，包括完成的任务和下周计划。",
      "channel": "telegram"
    },
    {
      "name": "health-check",
      "trigger": "every",
      "interval": "1h",
      "agent": "monitor",
      "message": "检查所有服务健康状态，异常时发送告警。"
    }
  ],

  // ==================== Webhook ====================
  "webhooks": [
    {
      "name": "github-events",
      "path": "/webhook/github",
      "method": "POST",
      "agent": "work",
      "secret": "${GITHUB_WEBHOOK_SECRET}",
      "prompt": "收到 GitHub 事件：{{rawBody}}\n\n请简要分析。"
    }
  ],

  // ==================== 技能 ====================
  "skills": {
    "autoInstall": false,
    "registry": "https://clawhub.openclaw.dev"
  }
}
```

## 第三步：人格与身份

```markdown
<!-- workspace/SOUL.md -->
# 人格定义

## 性格
你是一个高效、可靠且友善的个人 AI 助手。你善于理解用户意图，给出精准的回答。

## 行为准则
- 回答简洁，先给结论再展开
- 涉及代码时提供可运行的完整示例
- 不确定时坦诚说明
- 主动发现并提醒潜在问题
```

```markdown
<!-- workspace/IDENTITY.md -->
# 身份信息
- 名称：小爪
- 角色：24/7 个人 AI 助手
- 运行环境：Docker on VPS
- 模型：GPT-4o
```

## 第四步：安装技能

```bash
# 安装常用技能
openclaw skill install code-review
openclaw skill install meeting-notes
openclaw skill install news-summary

# 验证技能状态
openclaw skill list
```

## 第五步：系统验证

完成配置后，运行全面的系统验证：

```bash
# 1. 检查 Gateway 状态
openclaw status

# 2. 检查所有渠道
openclaw channel list

# 3. 检查所有 Agent
openclaw agent list

# 4. 检查定时任务
openclaw schedule list

# 5. 检查技能
openclaw skill list

# 6. 检查记忆
openclaw memory stats

# 7. 检查路由
openclaw routing test "帮我写一个 Python 脚本"
openclaw routing test "今天天气怎么样"
openclaw routing test "查看系统状态"

# 8. 端到端测试
openclaw chat --message "你好，请介绍一下你自己"
openclaw chat --agent work --message "列出今日待办"
openclaw chat --agent life --message "今天北京天气如何"
```

## 第六步：监控与运维

### 日志管理

```bash
# 实时日志
docker compose logs -f openclaw

# 日志轮转（在 docker-compose.yml 中已配置 volumes）
# 建议配合 logrotate 使用
```

### 自动更新

```bash
# 手动更新
docker compose pull
docker compose up -d

# 或设置 cron 自动更新（每周日凌晨 3 点）
# crontab -e
# 0 3 * * 0 cd /path/to/project && docker compose pull && docker compose up -d
```

### 备份策略

```bash
# 备份工作空间和数据
tar -czf backup-$(date +%Y%m%d).tar.gz workspace/ data/

# 设置每日自动备份
# 0 2 * * * tar -czf /backups/openclaw-$(date +\%Y\%m\%d).tar.gz /path/to/workspace/
```

## 课程回顾

恭喜你完成了整个 OpenClaw 课程体系！以下是 17 节课的知识地图：

| 编号 | 课程 | 核心内容 |
|------|------|----------|
| 01 | 安装部署 | Docker、npm、Gateway |
| 02 | 配置详解 | openclaw.json5、JSON5 语法 |
| 03 | 工作空间 | SOUL.md、IDENTITY.md、TOOLS.md |
| 04 | 初次对话 | CLI 聊天、WebChat、会话管理 |
| 05 | 渠道接入 | Telegram、Discord、Slack |
| 06 | 多渠道协同 | 25+ 渠道、并行运行 |
| 07 | 路由规则 | 5 层绑定表、模式匹配 |
| 08 | 多 Agent | 工作助手、生活助手、编程助手 |
| 09 | Prompt 工程 | 8 层 Prompt 架构 |
| 10 | 记忆系统 | MEMORY.md、每日摘要、自动召回 |
| 11 | 技能安装 | ClawHub、SKILL.md 格式 |
| 12 | 自定义技能 | YAML frontmatter、行为指令 |
| 13 | 定时任务 | at、every、cron 语法 |
| 14 | Webhook | HTTP 触发、事件驱动 |
| 15 | Canvas & A2UI | 可视化组件、图表推送 |
| 16 | 语音与节点 | STT/TTS、分布式节点 |
| 17 | Capstone | 24/7 助手完整项目 |

## 后续学习方向

1. **深入定制**：编写更多自定义技能，扩展助手能力
2. **性能优化**：调整 Prompt 长度、Token 使用、缓存策略
3. **安全加固**：启用认证、审计日志、数据加密
4. **社区贡献**：在 ClawHub 上发布你的技能
5. **高级架构**：多节点集群、负载均衡、高可用部署

## 小结

本 Capstone 项目综合运用了全部课程知识，构建了一个完整的 24/7 个人 AI 助手系统。从 Docker 部署到多渠道接入，从多 Agent 协作到自动化任务，你已经掌握了 OpenClaw 的全部核心功能。希望这个课程体系能帮助你在 AI 助手领域持续探索和创新。
