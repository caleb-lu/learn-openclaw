# 技能安装

技能（Skill）是 OpenClaw 的扩展机制，类似于插件。通过安装技能，你可以快速为 AI 助手添加新的能力，如代码审查、新闻摘要、日程管理等。ClawHub 是官方的技能市场，本节课将带你了解技能体系并学会安装和管理技能。

## 学习目标

- 理解 OpenClaw 技能系统的设计理念
- 了解 ClawHub 技能市场的使用方法
- 掌握技能的安装、更新和卸载操作
- 理解 SKILL.md 技能描述文件的作用
- 学会查看已安装技能的状态与详情

## 前置知识

- 已完成 OpenClaw 安装与配置（第 01-02 节）
- 了解 CLI 基本操作
- 熟悉 Markdown 和 YAML 基础

## 技能系统概览

```
┌─────────────┐     安装      ┌──────────────────┐
│  ClawHub     │ ──────────→  │  本地技能目录     │
│  (技能市场)  │              │  skills/          │
└─────────────┘              │  ├── code-review/ │
                             │  ├── news/        │
┌─────────────┐     注册      │  └── weather/    │
│  自定义技能  │ ──────────→  └──────────────────┘
└─────────────┘                    │
                                   ▼
                          ┌──────────────────┐
                          │  Gateway 加载     │
                          │  技能注入 Prompt  │
                          └──────────────────┘
```

## ClawHub 技能市场

ClawHub 是 OpenClaw 的官方技能市场，提供经过审核的社区技能。

```bash
# 搜索技能
openclaw skill search "code review"
# 输出：
# ★ code-review     代码审查助手      v1.2.0  1.2k installs
# ★ code-explain    代码解释器        v0.8.0  890 installs
#   code-format     代码格式化        v1.0.0  456 installs

# 查看技能详情
openclaw skill info code-review
# 名称：code-review
# 版本：1.2.0
# 作者：openclaw-team
# 描述：自动审查代码，检查风格、bug 和安全问题
# 依赖：无
# 工具：code_exec

# 安装技能
openclaw skill install code-review

# 指定版本安装
openclaw skill install code-review@1.1.0

# 安装多个技能
openclaw skill install code-review news-summary weather

# 从 Git 仓库安装
openclaw skill install https://github.com/user/my-skill
```

## SKILL.md 格式

每个技能的核心是一个 `SKILL.md` 文件，描述了技能的元信息和行为指令：

```markdown
---
name: code-review
version: 1.2.0
author: openclaw-team
description: 自动审查代码，检查风格、bug 和安全问题
category: development
tools:
  - code_exec
triggers:
  - pattern: "(审查|review)\\s+`?([\\s\\S]+?)`?"
    captureGroup: 2
tags:
  - code
  - review
  - quality
---

# 代码审查技能

## 行为指令
当用户请求代码审查时，请按以下步骤执行：

### 1. 静态分析
- 检查命名规范（变量、函数、类）
- 检查代码风格一致性
- 检查潜在的语法问题

### 2. 逻辑审查
- 分析控制流是否正确
- 检查边界条件和异常处理
- 识别潜在的 bug

### 3. 安全审查
- 检查输入验证
- 检查 SQL 注入 / XSS 风险
- 检查敏感信息泄露

### 4. 性能审查
- 识别性能瓶颈
- 检查不必要的计算
- 评估算法复杂度

## 输出格式
请使用以下格式输出审查结果：

### ✅ 优点
- ...

### ⚠️ 建议改进
- ...

### 🐛 潜在问题
- ...

### 🔒 安全问题
- ...

## 示例
用户：帮我审查这段代码
```python
def get_user(id):
    return db.query(f"SELECT * FROM users WHERE id = {id}")
```

你应该指出 SQL 注入风险，并建议使用参数化查询。
```

## 技能管理

```bash
# 列出已安装技能
openclaw skill list
# 输出：
# code-review    v1.2.0  ✅ 已启用
# news-summary   v1.0.0  ✅ 已启用
# weather        v0.9.0  ⏸️ 已禁用

# 启用/禁用技能
openclaw skill enable code-review
openclaw skill disable weather

# 更新技能
openclaw skill update code-review

# 更新所有技能
openclaw skill update --all

# 卸载技能
openclaw skill uninstall weather

# 查看技能的 SKILL.md 内容
openclaw skill show code-review
```

## 技能目录结构

安装的技能存放在以下目录：

```
skills/
├── code-review/
│   ├── SKILL.md           # 技能描述文件
│   ├── templates/          # 输出模板
│   │   └── report.md
│   └── tests/             # 测试用例
│       └── basic.test.js
├── news-summary/
│   ├── SKILL.md
│   └── sources/           # 数据源配置
│       └── rss-feeds.json
└── weather/
    ├── SKILL.md
    └── api/
        └── weather-api.js
```

## 技能触发机制

技能可以通过多种方式被触发：

1. **显式命令**：用户输入 `/code-review` 命令
2. **正则匹配**：消息内容匹配 SKILL.md 中的 triggers 规则
3. **自动激活**：路由规则将消息转发到指定技能的 Agent
4. **手动调用**：通过 `openclaw skill run` 命令

```bash
# 手动运行技能
openclaw skill run code-review --input "def foo(x): return x*2"

# 查看技能的触发规则
openclaw skill triggers code-review
```

## 小结

本节课介绍了 OpenClaw 的技能系统和 ClawHub 技能市场。通过简单的 CLI 命令，你可以快速安装和启用各种社区技能。SKILL.md 文件是技能的核心，定义了技能的元信息、触发条件和行为指令。下一节课我们将学习如何编写自定义技能。
