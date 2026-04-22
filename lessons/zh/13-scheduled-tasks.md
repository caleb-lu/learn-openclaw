# 定时任务

OpenClaw 支持为 AI 助手配置定时任务，实现自动化工作流。你可以让助手在指定时间自动执行任务，如每天早上发送天气播报、每周五生成工作周报、每小时检查邮件等。本节课将详解定时任务的语法与配置。

## 学习目标

- 掌握 OpenClaw 三种定时语法：at、every、cron
- 学会在配置文件中定义定时任务
- 理解定时任务的执行与日志机制
- 学会使用 CLI 管理定时任务
- 能够创建复杂的周期性自动化任务

## 前置知识

- 已完成 OpenClaw 安装与配置（第 01-02 节）
- 了解基本的日期时间概念
- 熟悉 CLI 操作

## 三种定时语法

OpenClaw 提供三种灵活的定时语法：

| 语法 | 说明 | 适用场景 |
|------|------|----------|
| `at` | 在指定时间点执行一次 | 一次性提醒、延迟任务 |
| `every` | 按固定间隔重复执行 | 定期检查、轮询任务 |
| `cron` | 使用 cron 表达式 | 复杂周期性任务 |

## at 语法：一次性定时

在指定的绝对时间点执行任务：

```json5
{
  "schedules": [
    {
      "name": "afternoon-reminder",
      "trigger": "at",
      "time": "2025-01-20T14:00:00+08:00",
      "agent": "general",
      "message": "下午两点了，记得喝水休息一下！",
      "channel": "telegram"
    },
    {
      "name": "project-deadline",
      "trigger": "at",
      "time": "2025-02-01T09:00:00+08:00",
      "agent": "work",
      "message": "项目截止日期到了，请检查提交状态。"
    }
  ]
}
```

## every 语法：固定间隔

按固定时间间隔重复执行：

```json5
{
  "schedules": [
    {
      "name": "hourly-news",
      "trigger": "every",
      "interval": "1h",
      "agent": "general",
      "message": "请获取最新的科技新闻，并用 3 个要点总结。",
      "channel": "telegram"
    },
    {
      "name": "email-check",
      "trigger": "every",
      "interval": "30m",
      "agent": "work",
      "message": "检查新邮件，如果有重要邮件请摘要通知。"
    },
    {
      "name": "health-reminder",
      "trigger": "every",
      "interval": "2h",
      "agent": "life",
      "message": "提醒用户站起来活动一下。",
      "channel": "slack"
    }
  ]
}
```

支持的间隔单位：

| 单位 | 说明 | 示例 |
|------|------|------|
| `s` | 秒 | `"30s"` |
| `m` | 分钟 | `"15m"` |
| `h` | 小时 | `"2h"` |
| `d` | 天 | `"1d"` |
| `w` | 周 | `"1w"` |

## cron 语法：标准 Cron 表达式

使用标准的 5 段 cron 表达式定义复杂周期：

```
┌────────── 分钟 (0-59)
│ ┌──────── 小时 (0-23)
│ │ ┌────── 日期 (1-31)
│ │ │ ┌──── 月份 (1-12)
│ │ │ │ ┌── 星期 (0-6, 0=周日)
│ │ │ │ │
* * * * *
```

```json5
{
  "schedules": [
    // 每天早上 8:00 发送天气播报
    {
      "name": "morning-weather",
      "trigger": "cron",
      "expression": "0 8 * * *",
      "timezone": "Asia/Shanghai",
      "agent": "general",
      "message": "请查询今天北京的天气，并给出穿衣建议。",
      "channel": "telegram"
    },

    // 每周一早上 9:00 生成周报
    {
      "name": "weekly-report",
      "trigger": "cron",
      "expression": "0 9 * * 1",
      "timezone": "Asia/Shanghai",
      "agent": "work",
      "message": "请根据过去一周的对话记录，生成一份工作周报摘要。",
      "channel": "slack"
    },

    // 每月 1 号整理记忆
    {
      "name": "monthly-memory-cleanup",
      "trigger": "cron",
      "expression": "0 0 1 * *",
      "timezone": "Asia/Shanghai",
      "agent": "system",
      "message": "清理 90 天以前的记忆条目，并生成月度总结。"
    },

    // 工作日每天下午 6:00 下班提醒
    {
      "name": "off-work-reminder",
      "trigger": "cron",
      "expression": "0 18 * * 1-5",
      "timezone": "Asia/Shanghai",
      "agent": "life",
      "message": "下班时间到了！今天完成了什么，有什么未完成的事项？",
      "channel": "telegram"
    },

    // 每 15 分钟检查系统状态
    {
      "name": "system-health-check",
      "trigger": "cron",
      "expression": "*/15 * * * *",
      "agent": "system",
      "message": "检查所有渠道和服务状态，如有异常立即通知。"
    }
  ]
}
```

## CLI 管理定时任务

```bash
# 列出所有定时任务
openclaw schedule list
# 输出：
# morning-weather   cron (0 8 * * *)     ✅ active  next: 2025-01-16 08:00
# weekly-report     cron (0 9 * * 1)     ✅ active  next: 2025-01-20 09:00
# hourly-news       every (1h)           ✅ active  next: 2025-01-15 15:00
# afternoon-reminder at (2025-01-20T14:00) ⏸️ scheduled

# 查看任务详情
openclaw schedule show morning-weather

# 手动触发任务（立即执行一次）
openclaw schedule run morning-weather

# 暂停/恢复任务
openclaw schedule pause morning-weather
openclaw schedule resume morning-weather

# 删除任务
openclaw schedule delete afternoon-reminder

# 查看任务执行历史
openclaw schedule history morning-weather --last 10

# 添加新任务（通过 CLI）
openclaw schedule add \
  --name "daily-joke" \
  --trigger every \
  --interval "12h" \
  --agent life \
  --message "讲一个轻松的笑话"
```

## 任务执行与日志

```bash
# 查看定时任务的执行日志
openclaw schedule logs --follow

# 查看特定任务的日志
openclaw schedule logs morning-weather --last 5

# 配置任务失败重试
openclaw config set schedules.retry.maxAttempts 3
openclaw config set schedules.retry.backoffMs 5000
```

## 注意事项

1. **时区设置**：务必为 cron 任务设置正确的 `timezone`，否则可能在你意料之外的时间执行
2. **执行频率**：避免设置过于频繁的任务（如每分钟），会增加 LLM API 调用成本
3. **错误处理**：为关键任务配置重试策略，确保不遗漏
4. **并发控制**：避免多个长时间任务同时执行，合理规划时间间隔
5. **成本监控**：定期检查定时任务的 API 调用量和费用

## 小结

本节课介绍了 OpenClaw 定时任务的三种语法：at（一次性）、every（固定间隔）和 cron（标准表达式）。通过合理配置定时任务，你可以让 AI 助手自动完成日常的重复性工作，如天气播报、新闻摘要、邮件检查等。下一节课我们将学习 Webhook 事件驱动机制。
