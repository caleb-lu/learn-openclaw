# 初次对话

完成安装和配置后，就可以与你的 AI 助手进行第一次对话了。OpenClaw 提供了多种对话方式，包括命令行交互聊天、WebChat 网页聊天以及通过渠道接入的外部会话。本节课将带你完成第一次对话体验。

## 学习目标

- 掌握 CLI 交互式聊天的使用方法
- 学会使用 WebChat 网页界面进行对话
- 理解会话创建与管理机制
- 了解对话上下文的传递方式
- 能够进行多轮对话并观察助手人格表现

## 前置知识

- 已完成 OpenClaw 安装（第 01 节）
- 已完成基本配置（第 02 节）
- 已设置工作空间（第 03 节）

## CLI 交互式聊天

最直接的方式是通过命令行与助手对话：

```bash
# 进入交互式聊天模式
openclaw chat

# 你将看到类似如下的提示符
> 你好
小爪：你好！我是小爪，你的个人 AI 助手。有什么我可以帮你的吗？

> 帮我写一个 Python 的快速排序
小爪：当然可以！这是一个经典的快速排序实现：

```python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)
```
```

你也可以用单条消息模式，适合脚本调用：

```bash
# 发送单条消息并获取回复
openclaw chat --message "今天北京天气怎么样？"

# 指定 Agent
openclaw chat --agent coder --message "解释一下 React Hooks"

# 非流式输出（等待完整回复）
openclaw chat --message "你好" --no-stream
```

## WebChat 网页界面

OpenClaw 内置了一个轻量级的 WebChat 界面，适合在浏览器中使用：

```bash
# 确保 Gateway 已启动
openclaw start

# 打开 WebChat（默认端口 3000）
openclaw webchat

# 或直接在浏览器访问
# http://localhost:3000/chat
```

WebChat 界面提供以下功能：

- 实时流式输出（打字机效果）
- 对话历史记录
- Markdown 渲染与代码高亮
- 会话切换与管理
- 文件上传（图片、文档）

## 会话管理

每次对话都会创建一个独立的会话（Session），OpenClaw 会自动管理会话的生命周期：

```bash
# 查看所有会话
openclaw session list

# 查看特定会话的详情
openclaw session show <session-id>

# 继续之前的会话
openclaw chat --session <session-id>

# 导出会话记录
openclaw session export <session-id> --format markdown

# 删除会话
openclaw session delete <session-id>
```

## 会话创建流程

当你发送第一条消息时，OpenClaw 会自动执行以下步骤：

1. **创建会话**：生成唯一的 session ID
2. **加载人格**：读取 SOUL.md 和 IDENTITY.md
3. **组装 Prompt**：按 8 层 Prompt 架构组装完整上下文
4. **路由分发**：根据规则确定处理 Agent
5. **调用 LLM**：将请求发送给配置的大语言模型
6. **流式返回**：实时回传生成内容
7. **记录存储**：保存对话记录到会话历史

```
用户消息 → 会话创建 → 人格加载 → Prompt 组装 → 路由分发 → LLM 调用 → 流式返回
```

## 上下文与记忆

OpenClaw 在对话中会自动维护上下文：

```bash
# 设置上下文窗口大小（对话轮数）
openclaw config set llm.contextWindow 20

# 开启自动记忆召回
openclaw config set memory.autoRecall true

# 手动在对话中引用记忆
> 还记得我们上次讨论的排序算法吗？
# OpenClaw 会自动从记忆中检索相关内容
```

## 调试与日志

如果对话出现异常，可以查看详细日志：

```bash
# 查看实时日志
openclaw logs --follow

# 查看特定会话的调试日志
openclaw logs --session <session-id> --level debug

# 导出完整的请求/响应记录
openclaw session export <session-id> --format json
```

## 小结

本节课介绍了 OpenClaw 的三种对话方式：CLI 交互式聊天、单条消息模式和 WebChat 网页界面。你了解了会话从创建到响应的完整流程，以及上下文管理和调试方法。现在你已经可以和你的 AI 助手流畅对话了。下一节课我们将学习如何接入外部通讯渠道。
