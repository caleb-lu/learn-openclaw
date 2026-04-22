# 自定义技能

除了从 ClawHub 安装社区技能外，你还可以编写自己的自定义技能。自定义技能可以精确满足你的个人需求，实现自动化的工作流和独特的 AI 行为。本节课将教你如何从零编写一个完整的自定义技能。

## 学习目标

- 掌握 SKILL.md 的完整格式规范
- 学会使用 YAML frontmatter 定义技能元数据
- 理解技能触发条件的编写方法
- 能够编写包含工具调用和行为指令的完整技能
- 学会调试和测试自定义技能

## 前置知识

- 已了解技能系统的基本概念（第 11 节）
- 熟悉 Markdown 和 YAML 语法
- 了解正则表达式基础

## 技能文件结构

一个完整的自定义技能通常包含以下文件：

```
skills/my-custom-skill/
├── SKILL.md              # 必需：技能描述和行为指令
├── prompt.md             # 可选：额外的 Prompt 模板
├── templates/            # 可选：输出模板
│   └── response.md
├── hooks/                # 可选：生命周期钩子
│   └── before.js
└── test/                 # 可选：测试用例
    └── skill.test.js
```

## YAML Frontmatter 详解

SKILL.md 的 YAML frontmatter 定义了技能的元数据：

```yaml
---
# 基本信息
name: meeting-notes          # 技能唯一标识（英文，kebab-case）
version: 1.0.0               # 语义化版本号
author: your-name            # 作者
description: 会议纪要整理助手  # 简短描述

# 分类与标签
category: productivity       # 分类：development | productivity | communication | fun
tags:                        # 标签（用于搜索）
  - meeting
  - notes
  - summary

# 依赖声明
tools:                       # 需要的工具
  - code_exec
dependencies:                # 依赖的其他技能
  - calendar

# 触发条件
triggers:
  - type: command            # 命令触发
    pattern: "/meeting-notes"
  - type: regex              # 正则触发
    pattern: "(会议纪要|meeting notes)[:：]?\\s*([\\s\\S]+)"
    captureGroup: 2

# 权限控制
permissions:
  - read_files               # 读取文件
  - write_files              # 写入文件
  - network                  # 网络访问

# 配置参数
config:
  defaultFormat: markdown
  language: zh-CN
  maxLength: 5000
---
```

## 编写行为指令

frontmatter 之后的内容是技能的行为指令，会被注入到 Prompt 中：

```markdown
# 会议纪要整理技能

## 角色定义
你是一位专业的会议秘书，擅长从杂乱的会议记录中提炼结构化的纪要。

## 工作流程

### 步骤 1：信息提取
从用户提供的会议内容中提取以下信息：
- **会议主题**：本次会议讨论的核心话题
- **参会人员**：参与会议的人员列表
- **时间地点**：会议的时间和地点
- **讨论要点**：每个议题的核心讨论内容
- **决策事项**：达成的决定和结论
- **待办事项**：需要后续跟进的任务（标注负责人和截止日期）

### 步骤 2：结构化整理
按照以下模板整理会议纪要：

## 会议纪要

**主题**：<提取的主题>
**时间**：<时间> | **地点**：<地点>
**参会人**：<人员列表>

### 讨论要点

#### 议题 1：<标题>
- 核心观点：...
- 不同意见：...

### 决策事项
1. ...

### 待办事项
| 任务 | 负责人 | 截止日期 |
|------|--------|----------|
| ...  | ...    | ...      |

### 步骤 3：质量检查
- 确保所有待办事项都有明确的负责人
- 检查是否有遗漏的重要讨论点
- 验证决策事项表述清晰无歧义

## 特殊指令
- 如果会议内容过于简略，主动询问细节
- 对于模糊的待办事项，建议细化为可执行的具体任务
- 如果检测到紧急事项，在纪要开头用 **[紧急]** 标注
```

## 创建自定义技能

### 第一步：创建技能目录

```bash
# 创建技能目录
mkdir -p skills/meeting-notes
```

### 第二步：编写 SKILL.md

在 `skills/meeting-notes/SKILL.md` 中编写完整的技能定义（如上所示）。

### 第三步：注册技能

```bash
# 将技能注册到 OpenClaw
openclaw skill register ./skills/meeting-notes

# 或创建符号链接
openclaw skill link ./skills/meeting-notes
```

### 第四步：测试技能

```bash
# 测试技能触发
openclaw skill test meeting-notes \
  --input "今天开了个产品讨论会，参加人有张三、李四。讨论了新功能的优先级排序，决定先做用户认证模块。张三负责技术方案，下周五前完成。"

# 查看技能在 Prompt 中的注入效果
openclaw skill preview meeting-notes
```

## 进阶：带模板的技能

创建输出模板以保持一致的格式：

```markdown
<!-- skills/meeting-notes/templates/report.md -->

# 📋 会议纪要

## 基本信息
- **主题**：{{topic}}
- **时间**：{{date}} {{time}}
- **地点**：{{location}}
- **参会人**：{{attendees}}

## 讨论要点
{{#each discussions}}
### {{title}}
{{content}}
{{/each}}

## 决策事项
{{#each decisions}}
{{@index}}. {{this}}
{{/each}}

## 待办事项
{{#each actionItems}}
| {{task}} | {{owner}} | {{deadline}} |
{{/each}}
```

## 进阶：带钩子的技能

使用生命周期钩子在技能执行前后执行自定义逻辑：

```javascript
// skills/meeting-notes/hooks/before.js
module.exports = async function(context) {
  // 在技能执行前的预处理
  console.log(`[meeting-notes] 处理消息: ${context.message.substring(0, 50)}...`);

  // 可以修改 context 或返回新数据
  context.metadata = {
    timestamp: new Date().toISOString(),
    skillVersion: '1.0.0'
  };

  return context;
};
```

```javascript
// skills/meeting-notes/hooks/after.js
module.exports = async function(context, response) {
  // 在技能执行后的后处理
  // 例如：自动保存纪要到文件
  if (context.config.saveToFile) {
    const fs = require('fs');
    const filename = `meeting-${Date.now()}.md`;
    fs.writeFileSync(`./meetings/${filename}`, response);
    console.log(`[meeting-notes] 纪要已保存: ${filename}`);
  }

  return response;
};
```

## 技能调试

```bash
# 查看技能的完整配置
openclaw skill show meeting-notes

# 调试技能的触发匹配
openclaw skill debug meeting-notes --message "帮我整理会议纪要"

# 运行技能的测试用例
openclaw skill test meeting-notes --run-tests

# 验证 SKILL.md 语法
openclaw skill validate ./skills/meeting-notes/SKILL.md
```

## 小结

本节课详细讲解了如何编写自定义技能。从 YAML frontmatter 元数据到行为指令，从输出模板到生命周期钩子，你可以构建功能丰富的技能来扩展 AI 助手的能力。良好的技能设计应该包含清晰的工作流程、结构化的输出格式和完善的测试用例。下一节课我们将学习定时任务的配置。
