# Learn OpenClaw

**Full-Stack AI Assistant Bootcamp** — Master OpenClaw from deployment to automation in 4 weeks.

## Overview

Learn OpenClaw is an interactive learning platform for building personal AI assistants with [OpenClaw](https://github.com/claw0/openclaw). It covers the complete OpenClaw platform through 17 hands-on lessons organized into 4 weeks:

- **Week 1**: Deployment & Configuration
- **Week 2**: Channels & Routing
- **Week 3**: Intelligence & Memory
- **Week 4**: Automation & Advanced

## Features

- **Bilingual**: Full content in English and Chinese
- **Interactive Components**: Config editor, channel flow visualizer, soul workshop, skill playground, prompt stack, memory demo, automation library
- **Step-by-step Simulations**: Scenario-driven learning with guided steps
- **SVG Visualizations**: Animated architecture diagrams for each lesson
- **Gateway Integration**: Connect to a local OpenClaw Gateway for live features
- **Dark Mode**: System-aware with manual toggle
- **Static Export**: No server dependencies, deploy anywhere

## Quick Start

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
learn-openclaw/
├── lessons/              # Markdown content (en/zh)
├── samples/              # Configs, templates, skills, automations
├── web/                  # Next.js interactive platform
│   ├── scripts/          # Content extraction pipeline
│   └── src/
│       ├── app/          # App Router pages
│       ├── components/   # React components
│       ├── gateway/      # WebSocket client layer
│       ├── hooks/        # Custom React hooks
│       ├── i18n/         # Internationalization
│       └── lib/          # Utilities and constants
└── .github/workflows/    # CI/CD
```

## Build

```bash
cd web
npm run build
```

Output is generated in `web/out/` for static deployment.

## Lessons

| # | Title | Week | Duration |
|---|-------|------|----------|
| 01 | Installation & Deployment | 1 | 45min |
| 02 | Configuration Deep Dive | 1 | 60min |
| 03 | Workspace & Personality | 1 | 50min |
| 04 | Your First Conversation | 1 | 35min |
| 05 | Channel Setup | 2 | 55min |
| 06 | Multi-Channel Coordination | 2 | 50min |
| 07 | Routing Rules | 2 | 60min |
| 08 | Multi-Agent Setup | 2 | 55min |
| 09 | Prompt Engineering | 3 | 65min |
| 10 | Memory System | 3 | 55min |
| 11 | Skill Installation | 3 | 50min |
| 12 | Custom Skills | 3 | 65min |
| 13 | Scheduled Tasks | 4 | 50min |
| 14 | Webhooks | 4 | 50min |
| 15 | Canvas & A2UI | 4 | 55min |
| 16 | Voice & Nodes | 4 | 40min |
| 17 | Capstone: 24/7 AI Assistant | 4 | 90min |

## Tech Stack

- [Next.js](https://nextjs.org/) 16 (App Router, Static Export)
- [React](https://react.dev/) 19
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Framer Motion](https://www.framer.com/motion/) 12
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Zustand](https://zustand.docs.pmnd.rs/) 5
- [unified](https://github.com/unifiedjs/unified) (Markdown rendering)

## License

MIT
