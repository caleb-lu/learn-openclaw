# Canvas & A2UI

Canvas 和 A2UI（Agent-to-UI）是 OpenClaw 的可视化内容推送机制。传统 AI 助手只能输出纯文本，而 Canvas 允许 Agent 推送富媒体内容——图表、卡片、进度条、交互式组件等——让用户获得更直观的信息展示体验。

## 学习目标

- 理解 Canvas 和 A2UI 的设计理念
- 掌握 Canvas 组件的基本使用方法
- 学会使用 A2UI 协议推送可视化内容
- 了解不同渠道对 Canvas 的支持情况
- 能够创建包含图表和交互组件的可视化回复

## 前置知识

- 已完成渠道接入（第 05 节）
- 了解基本的 Web 概念（HTML、JSON）
- 熟悉 Markdown 格式

## Canvas 与 A2UI 概览

```
传统输出：
  AI 助手 → 纯文本 / Markdown → 用户

Canvas 输出：
  AI 助手 → Canvas 组件 → A2UI 渲染 → 用户
              ├── 文本卡片
              ├── 数据图表
              ├── 进度指示
              ├── 交互按钮
              └── 自定义组件
```

**Canvas** 是 OpenClaw 定义的一套可视化组件标准。**A2UI** 是渲染协议，负责将 Canvas 组件在各个渠道中正确展示。

## 基础 Canvas 组件

### 文本卡片

```json5
{
  "type": "canvas",
  "version": "1.0",
  "components": [
    {
      "type": "card",
      "title": "项目进度报告",
      "body": "本周完成了用户认证模块的开发，进度从 40% 提升到 65%。",
      "color": "#4CAF50",
      "icon": "chart-line"
    }
  ]
}
```

### 数据表格

```json5
{
  "type": "canvas",
  "version": "1.0",
  "components": [
    {
      "type": "table",
      "title": "本周任务完成情况",
      "columns": ["任务", "负责人", "状态", "耗时"],
      "rows": [
        ["用户认证模块", "张三", "✅ 完成", "3天"],
        ["API 文档编写", "李四", "🔄 进行中", "2天"],
        ["单元测试", "王五", "⏳ 待开始", "-"],
        ["代码审查", "赵六", "✅ 完成", "1天"]
      ]
    }
  ]
}
```

### 进度条

```json5
{
  "type": "canvas",
  "version": "1.0",
  "components": [
    {
      "type": "progress",
      "title": "Sprint 总进度",
      "percentage": 65,
      "segments": [
        { "label": "已完成", "value": 65, "color": "#4CAF50" },
        { "label": "进行中", "value": 20, "color": "#FFC107" },
        { "label": "未开始", "value": 15, "color": "#E0E0E0" }
      ]
    }
  ]
}
```

## 高级 Canvas 组件

### 数据图表

```json5
{
  "type": "canvas",
  "version": "1.0",
  "components": [
    {
      "type": "chart",
      "chartType": "bar",
      "title": "月度 API 调用量",
      "labels": ["1月", "2月", "3月", "4月", "5月", "6月"],
      "datasets": [
        {
          "label": "调用量",
          "data": [1200, 1900, 3000, 2500, 2200, 3100],
          "color": "#2196F3"
        }
      ]
    },
    {
      "type": "chart",
      "chartType": "line",
      "title": "响应时间趋势",
      "labels": ["周一", "周二", "周三", "周四", "周五"],
      "datasets": [
        {
          "label": "平均响应时间 (ms)",
          "data": [320, 280, 350, 290, 260],
          "color": "#FF5722"
        }
      ]
    },
    {
      "type": "chart",
      "chartType": "pie",
      "title": "渠道消息分布",
      "labels": ["Telegram", "Discord", "Slack", "WebChat"],
      "datasets": [
        {
          "data": [45, 25, 20, 10],
          "colors": ["#2196F3", "#7C4DFF", "#E91E63", "#4CAF50"]
        }
      ]
    }
  ]
}
```

### 交互按钮

```json5
{
  "type": "canvas",
  "version": "1.0",
  "components": [
    {
      "type": "card",
      "title": "选择操作",
      "body": "请选择你需要的操作："
    },
    {
      "type": "actions",
      "buttons": [
        {
          "label": "查看详情",
          "action": "send",
          "value": "/task detail 123"
        },
        {
          "label": "标记完成",
          "action": "send",
          "value": "/task complete 123"
        },
        {
          "label": "延后处理",
          "action": "send",
          "value": "/task postpone 123"
        }
      ]
    }
  ]
}
```

### 分栏布局

```json5
{
  "type": "canvas",
  "version": "1.0",
  "layout": {
    "type": "columns",
    "columns": 2
  },
  "components": [
    {
      "type": "card",
      "title": "系统状态",
      "body": "所有服务正常运行",
      "color": "#4CAF50"
    },
    {
      "type": "card",
      "title": "待处理消息",
      "body": "3 条未回复",
      "color": "#FF9800"
    },
    {
      "type": "progress",
      "title": "CPU 使用率",
      "percentage": 42
    },
    {
      "type": "progress",
      "title": "内存使用率",
      "percentage": 78
    }
  ]
}
```

## 在技能中使用 Canvas

你可以在自定义技能中使用 Canvas 推送可视化内容：

```markdown
<!-- SKILL.md 中的 Canvas 使用说明 -->

## 输出格式
当用户请求系统状态报告时，使用以下 Canvas 格式输出：

```canvas
{
  "type": "canvas",
  "version": "1.0",
  "components": [
    {
      "type": "chart",
      "chartType": "bar",
      "title": "各渠道消息量",
      ...
    }
  ]
}
```
```

## 渠道兼容性

不同渠道对 Canvas 组件的支持程度不同：

| 组件 | Telegram | Discord | Slack | WebChat | CLI |
|------|----------|---------|-------|---------|-----|
| 文本卡片 | 部分 | Embed | Block Kit | 完整 | 文本 |
| 数据表格 | 文本 | 文本 | 文本 | 完整 | 文本 |
| 进度条 | 文本 | 文本 | 文本 | 完整 | 文本 |
| 数据图表 | 图片 | 图片 | 图片 | 交互式 | 文本 |
| 交互按钮 | Inline Keyboard | Buttons | Block Kit | 完整 | 提示 |

```bash
# 查看当前渠道的 Canvas 支持情况
openclaw canvas support --channel telegram
```

## CLI 管理命令

```bash
# 预览 Canvas 渲染效果
openclaw canvas preview <canvas-file.json>

# 发送 Canvas 到指定渠道
openclaw canvas send <canvas-file.json> --channel telegram --chat-id <id>

# 查看 Canvas 组件文档
openclaw canvas docs
```

## 小结

本节课介绍了 OpenClaw 的 Canvas 和 A2UI 可视化内容推送机制。通过标准化的组件格式，AI 助手可以推送富媒体内容到各个渠道，大大提升了信息展示的效果。WebChat 渠道支持最完整的交互体验，而其他渠道会自动降级为兼容格式。下一节课我们将学习语音功能与移动设备节点。
