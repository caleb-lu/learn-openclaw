---
name: github-notifier
version: 1.0.0
description: Monitor GitHub repositories and notify about new PRs, issues, and releases
triggers:
  - pattern: "check (prs|pull requests) for {repo}"
    parameters:
      repo: string
  - webhook: github
---

# GitHub Notifier Skill

Monitors GitHub activity and provides notifications.

## Features
- New pull request notifications
- Issue tracking
- Release notifications
- PR review summaries

## Configuration
Set GITHUB_TOKEN environment variable for API access.
