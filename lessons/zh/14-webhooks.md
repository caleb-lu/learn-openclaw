# Webhook

Webhook 是一种事件驱动机制，允许外部系统通过 HTTP 请求触发 OpenClaw 的任务执行。与定时任务的时间驱动不同，Webhook 是由外部事件触发的——当某个事件发生时，第三方系统会向 OpenClaw 发送 HTTP 请求，从而触发相应的处理逻辑。

## 学习目标

- 理解 Webhook 的工作原理与适用场景
- 学会在 OpenClaw 中配置 Webhook 端点
- 掌握 Webhook 请求的处理流程
- 了解安全认证机制
- 能够构建事件驱动的自动化工作流

## 前置知识

- 已完成 OpenClaw 安装与配置（第 01-02 节）
- 了解 HTTP 协议基础（GET、POST、Header）
- 理解 JSON 数据格式

## Webhook 工作原理

```
外部事件（GitHub push、服务器告警、表单提交等）
    │
    ▼
HTTP POST 请求 ──→ OpenClaw Gateway ──→ 路由匹配 ──→ Agent 处理 ──→ 返回响应
                    (localhost:3000)
```

## 基础 Webhook 配置

```json5
{
  "webhooks": [
    // GitHub 事件 Webhook
    {
      "name": "github-push",
      "path": "/webhook/github",
      "method": "POST",
      "agent": "coder",
      "secret": "${GITHUB_WEBHOOK_SECRET}",      // HMAC 签名验证
      "extract": {
        "message": "payload.commits[0].message",
        "author": "payload.commits[0].author.name",
        "repo": "payload.repository.full_name"
      },
      "prompt": "GitHub 仓库 {{repo}} 收到了新的提交。提交信息：{{message}}，作者：{{author}}。请简要分析这次提交的内容。"
    },

    // 服务器告警 Webhook
    {
      "name": "server-alert",
      "path": "/webhook/alert",
      "method": "POST",
      "agent": "system",
      "secret": "${ALERT_WEBHOOK_SECRET}",
      "prompt": "收到服务器告警，请分析以下内容并给出处理建议：\n\n{{rawBody}}"
    },

    // 自定义表单 Webhook
    {
      "name": "contact-form",
      "path": "/webhook/contact",
      "method": "POST",
      "agent": "general",
      "prompt": "收到新的联系表单提交：\n姓名：{{body.name}}\n邮箱：{{body.email}}\n内容：{{body.message}}\n\n请生成回复草稿。"
    }
  ]
}
```

## Webhook 安全认证

### HMAC 签名验证

OpenClaw 支持 HMAC-SHA256 签名验证，确保请求来自可信来源：

```json5
{
  "webhooks": [
    {
      "name": "secure-webhook",
      "path": "/webhook/secure",
      "auth": {
        "type": "hmac",
        "header": "X-Signature",
        "algorithm": "sha256",
        "secret": "${WEBHOOK_SECRET}"
      }
    }
  ]
}
```

### Bearer Token 认证

```json5
{
  "webhooks": [
    {
      "name": "api-webhook",
      "path": "/webhook/api",
      "auth": {
        "type": "bearer",
        "token": "${API_BEARER_TOKEN}"
      }
    }
  ]
}
```

### IP 白名单

```json5
{
  "webhooks": [
    {
      "name": "internal-webhook",
      "path": "/webhook/internal",
      "auth": {
        "type": "ip-whitelist",
        "allowedIps": ["192.168.1.0/24", "10.0.0.0/8"]
      }
    }
  ]
}
```

## 请求处理流程

当 OpenClaw 收到 Webhook 请求时：

```
1. 接收 HTTP 请求
2. 验证认证信息（签名/Token/IP）
3. 路径匹配，找到对应的 Webhook 配置
4. 提取请求体数据
5. 使用模板引擎渲染 Prompt
6. 分发给指定的 Agent 处理
7. 调用 LLM 生成回复
8. 返回 HTTP 响应
```

## 高级功能：条件处理

根据请求内容执行不同的处理逻辑：

```json5
{
  "webhooks": [
    {
      "name": "github-event",
      "path": "/webhook/github",
      "method": "POST",
      "agent": "coder",
      "conditions": [
        {
          "match": "payload.action == 'opened'",
          "prompt": "收到新的 Pull Request，请审查代码变更：\n\n{{rawBody}}"
        },
        {
          "match": "payload.action == 'closed' && payload.pull_request.merged == true",
          "prompt": "Pull Request 已合并：\n- 仓库：{{payload.repository.full_name}}\n- 标题：{{payload.pull_request.title}}\n\n请记录到项目日志中。"
        },
        {
          "match": "payload.ref_type == 'tag'",
          "prompt": "新版本发布：{{payload.ref}}\n\n请准备发布说明。"
        }
      ],
      "defaultPrompt": "收到 GitHub 事件：{{rawBody}}"
    }
  ]
}
```

## Webhook 管理 CLI

```bash
# 列出所有 Webhook
openclaw webhook list

# 测试 Webhook 端点
openclaw webhook test github-push \
  --data '{"commits": [{"message": "feat: add login page", "author": {"name": "张三"}}], "repository": {"full_name": "my/project"}}'

# 查看 Webhook 请求日志
openclaw webhook logs --follow

# 获取 Webhook URL（用于配置第三方服务）
openclaw webhook url github-push
# 输出：https://your-domain.com/webhook/github

# 临时禁用 Webhook
openclaw webhook disable github-push
openclaw webhook enable github-push
```

## 典型应用场景

1. **GitHub 集成**：自动审查 PR、生成 changelog、通知代码变更
2. **监控告警**：接收服务器告警，AI 分析并给出处理建议
3. **表单处理**：自动回复联系表单、生成工单
4. **CI/CD 通知**：构建成功/失败时发送智能通知
5. **数据同步**：外部数据更新时触发 AI 分析

## 小结

本节课介绍了 OpenClaw 的 Webhook 事件驱动机制。通过配置 Webhook 端点，你可以将外部系统的 HTTP 事件直接连接到 AI 助手，实现事件驱动的自动化工作流。HMAC 签名验证和条件处理机制确保了安全性和灵活性。下一节课我们将学习 Canvas 与 A2UI 可视化内容推送。
