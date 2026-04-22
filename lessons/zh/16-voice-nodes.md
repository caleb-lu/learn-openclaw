# 语音与节点

OpenClaw 支持语音交互和分布式节点部署。通过语音唤醒功能，你可以在移动设备上通过语音与 AI 助手对话；通过节点机制，你可以在多台设备上部署 OpenClaw，实现分布式运行。本节课将介绍语音接入和节点管理的配置方法。

## 学习目标

- 了解 OpenClaw 语音功能的工作原理
- 学会配置语音输入（STT）和语音输出（TTS）
- 理解节点（Node）的概念与分布式架构
- 掌握移动设备节点的部署方法
- 能够搭建多节点的 OpenClaw 集群

## 前置知识

- 已完成 OpenClaw 安装与配置（第 01-02 节）
- 了解 WebSocket 协议基础
- 了解基本的网络概念

## 语音功能架构

```
移动设备 / 浏览器
    │
    ▼
语音输入 ──→ STT（语音转文字）──→ OpenClaw Gateway ──→ Agent ──→ LLM
                                                      │
                                                      ▼
语音输出 ←── TTS（文字转语音）←── Agent 回复 ←─────────┘
```

## 语音输入配置（STT）

OpenClaw 支持多种语音识别引擎：

```json5
{
  "voice": {
    "stt": {
      "enabled": true,
      "provider": "openai",              // openai | google | azure | whisper-local
      "model": "whisper-1",
      "language": "zh-CN",
      "apiKey": "${OPENAI_API_KEY}",
      "timeout": 10000                   // 语音识别超时（毫秒）
    },
    "tts": {
      "enabled": true,
      "provider": "openai",              // openai | google | azure | edge-tts
      "model": "tts-1",
      "voice": "alloy",                  // 语音角色
      "speed": 1.0,                      // 语速
      "apiKey": "${OPENAI_API_KEY}"
    }
  }
}
```

### 支持的 TTS 语音角色

| Provider | 可用语音 |
|----------|----------|
| OpenAI | alloy, echo, fable, onyx, nova, shimmer |
| Edge TTS | zh-CN-XiaoxiaoNeural, zh-CN-YunxiNeural 等 |
| Google | 多语言标准语音和 WaveNet 语音 |

```json5
// 使用 Edge TTS（免费）
{
  "voice": {
    "tts": {
      "enabled": true,
      "provider": "edge-tts",
      "voice": "zh-CN-XiaoxiaoNeural",
      "speed": 1.0
    }
  }
}
```

## 语音唤醒

在支持的设备上，可以配置语音唤醒词：

```json5
{
  "voice": {
    "wakeWord": {
      "enabled": true,
      "word": "小爪",                    // 自定义唤醒词
      "sensitivity": 0.7,               // 灵敏度 0.0-1.0
      "cooldown": 2000                  // 冷却时间（毫秒）
    }
  }
}
```

## WebChat 语音功能

OpenClaw 的 WebChat 界面内置了语音支持：

```bash
# 确保 Gateway 已启动并启用了语音配置
openclaw start

# 访问 WebChat
openclaw webchat

# 在 WebChat 界面中，点击麦克风按钮即可进行语音对话
```

WebChat 语音功能特性：

- 点击麦克风按钮录音
- 实时语音转文字（STT）
- AI 回复自动朗读（TTS）
- 支持手动开关语音输出
- 支持调整语速和音量

## 节点（Node）架构

节点是 OpenClaw 的分布式部署单元。每个节点运行一个独立的 Gateway 实例，节点之间通过消息队列协调工作。

```
┌─────────────────┐     ┌─────────────────┐
│  主节点 (Main)   │     │  移动节点 (Mobile)│
│  - 路由决策      │◄───►│  - 语音交互      │
│  - Agent 管理    │     │  - 传感器数据    │
│  - 记忆存储      │     │  - 推送通知      │
└────────┬────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐
│  工作节点 (Worker)│
│  - 定时任务      │
│  - Webhook 处理  │
│  - 数据处理      │
└─────────────────┘
```

## 节点配置

### 主节点

```json5
// 主节点配置
{
  "node": {
    "role": "main",                     // main | worker | mobile
    "id": "node-main-01",
    "cluster": {
      "enabled": true,
      "secret": "${CLUSTER_SECRET}",
      "discovery": {
        "type": "static",               // static | mdns | consul
        "peers": [
          "node-worker-01:3001",
          "node-mobile-01:3002"
        ]
      }
    }
  }
}
```

### 工作节点

```json5
// 工作节点配置
{
  "node": {
    "role": "worker",
    "id": "node-worker-01",
    "cluster": {
      "enabled": true,
      "secret": "${CLUSTER_SECRET}",
      "discovery": {
        "type": "static",
        "peers": ["node-main-01:3000"]
      }
    },
    "workloads": ["schedules", "webhooks", "data-processing"]
  }
}
```

### 移动设备节点

```bash
# 在移动设备（如树莓派）上安装 OpenClaw
npm install -g @openclaw/cli

# 初始化为移动节点
openclaw init --role mobile --cluster-node node-mobile-01

# 配置移动节点
openclaw config edit
```

```json5
// 移动节点配置
{
  "node": {
    "role": "mobile",
    "id": "node-mobile-01",
    "cluster": {
      "enabled": true,
      "secret": "${CLUSTER_SECRET}",
      "discovery": {
        "type": "static",
        "peers": ["node-main-01:3000"]
      }
    },
    "voice": {
      "stt": { "enabled": true, "provider": "openai" },
      "tts": { "enabled": true, "provider": "edge-tts" },
      "wakeWord": { "enabled": true, "word": "小爪" }
    },
    "sensors": {
      "enabled": true,
      "devices": ["temperature", "humidity", "camera"]
    }
  }
}
```

## 节点管理 CLI

```bash
# 查看集群状态
openclaw node list
# 输出：
# node-main-01     main    ✅ online  192.168.1.100:3000
# node-worker-01   worker  ✅ online  192.168.1.101:3001
# node-mobile-01   mobile  ✅ online  192.168.1.102:3002

# 查看节点详情
openclaw node show node-main-01

# 健康检查
openclaw node health-check

# 向特定节点发送消息
openclaw node send node-mobile-01 --message "测试消息"
```

## 小结

本节课介绍了 OpenClaw 的语音功能和节点系统。语音功能通过 STT 和 TTS 引擎实现语音交互，支持唤醒词和多种语音角色。节点系统支持分布式部署，主节点负责决策、工作节点处理任务、移动节点提供语音和传感器接入。这套架构让 OpenClaw 可以在各种设备上灵活运行。下一节课我们将通过 Capstone 项目综合运用所有知识。
