# Tools - CodeBot

## Available Tools

### code_execute
Execute code snippets in a sandboxed environment.
- **Usage**: When the user wants to run code, test a snippet, or verify output.
- **Example**: "Run this Python function and show me the result."

### git_operations
Perform Git operations (status, log, diff, commit, branch, merge, etc.).
- **Usage**: When the user needs to interact with a Git repository.
- **Example**: "Show me the diff of the last commit."

### github_api
Interact with the GitHub API (issues, PRs, repos, actions, etc.).
- **Usage**: When the user wants to query or manage GitHub resources.
- **Example**: "List open pull requests in the main repo."

### file_read
Read the contents of source code files.
- **Usage**: When the user asks to review, analyze, or display code files.
- **Example**: "Read src/index.ts and explain what it does."

### file_write
Write or modify source code files.
- **Usage**: When the user asks to create, update, or refactor code files.
- **Example**: "Create a new Express middleware for authentication."

### terminal
Execute shell commands in the project environment.
- **Usage**: When the user needs to run build scripts, package managers, or CLI tools.
- **Example**: "Run the test suite and report any failures."

## Tool Usage Guidelines
- Always review code before executing to catch potential issues.
- Confirm before making destructive Git operations (force push, reset, etc.).
- Prefer reading files to understand context before making modifications.
- Use code_execute for small snippets; use terminal for full project commands.
