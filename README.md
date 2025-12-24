# Claude Code 模板仓库

> 标准化的 `.claude` 配置模板，适用于各类软件项目。

## 简介

这个模板提供了一套开箱即用的 Claude Code 配置，包括通用命令、Agent、技能、工作流和代码片段。复制到你的项目中，根据需要进行特化即可。

## 目录结构

```
.claude/
├── commands/           # 通用命令（如 /commit, /review）
├── agents/             # Agent 配置（如 code-reviewer）
├── skills/             # 技能脚本（如 tdd-helper）
├── workflows/          # 工作流定义（如 bug-fix-flow）
├── prompts/            # 系统提示词
│   ├── system/         # 默认和严格模式提示词
│   ├── modes/          # 探索模式等
│   └── agents/         # Agent 专用提示词
├── snippets/           # 代码片段
│   ├── frontend/       # 前端片段（React 等）
│   ├── backend/        # 后端片段（API 等）
│   └── devops/         # 运维片段（Docker 等）
├── templates/          # 文件模板
│   ├── docs/           # CLAUDE.md 模板
│   ├── code/           # README 等代码模板
│   └── git/            # PR/Issue 模板
├── context/            # 项目上下文缓存
├── hooks/              # 事件钩子
├── docs/               # 元文档
└── tests/              # 配置测试
```

## 快速开始

### 方式一：直接复制

```bash
# 在你的项目目录下
cp -r /path/to/claude-template/.claude .

# 或使用 Git
git clone --depth 1 https://github.com/your-username/claude-template.git temp
cp -r temp/.claude .
rm -rf temp
```

### 方式二：Git Submodule（推荐）

```bash
# 添加为 submodule
git submodule add https://github.com/your-username/claude-template.git .claude-template

# 创建软链接到项目
ln -s ../.claude-template/.claude .claude
```

### 方式三：初始化脚本

```bash
# 下载并运行初始化脚本
curl -sSL https://raw.githubusercontent.com/your-username/claude-template/main/init.sh | bash
```

## 使用指南

### 1. 复制模板到项目

```bash
cd your-project
cp -r /path/to/claude-template/.claude .
```

### 2. 根据项目特化

#### 删除不需要的内容

```bash
# 前端项目可以删除
rm -rf .claude/snippets/backend/

# 简单项目可以删除
rm -rf .claude/workflows/
```

#### 修改配置以适配项目

1. **更新 CLAUDE.md**
   ```bash
   cp .claude/templates/docs/CLAUDE_template.md ./CLAUDE.md
   # 编辑 CLAUDE.md，填写项目信息
   ```

2. **配置权限**
   编辑 `.claude/settings.local.json`：
   ```json
   {
     "permissions": {
       "allow": ["WebSearch", "Bash(echo:*)", "Read", "Write", "Edit"],
       "deny": [],
       "ask": []
     }
   }
   ```

3. **添加项目特定内容**
   - 项目特定的 commands
   - 项目特定的 snippets
   - 项目特定的 context

### 3. 验证配置

```bash
# 启动 Claude Code
claude

# 测试命令
/commit
```

## 核心功能

### Commands（命令）

| 命令 | 功能 |
|------|------|
| `/commit` | 创建符合规范的 Git 提交 |
| `/review-pr` | 审查 Pull Request |
| `/test` | 运行测试并处理失败 |
| `/refactor` | 重构代码 |

### Agents（代理）

| Agent | 功能 |
|-------|------|
| `code-reviewer` | 代码审查 |
| `test-writer` | 编写测试 |
| `debugger` | Bug 诊断 |
| `refactor-agent` | 代码重构 |

### Workflows（工作流）

| 工作流 | 功能 |
|--------|------|
| `feature-development` | 新功能开发全流程 |
| `bug-fix-flow` | Bug 修复流程 |
| `refactor-flow` | 代码重构流程 |
| `code-review-flow` | 代码审查流程 |

### Skills（技能）

- **tdd-helper**: TDD 开发辅助
- **code-generator**: 代码生成模板
- **git-helper**: Git 操作辅助

## 模板版本管理

### 版本策略

模板使用语义化版本：`v主版本.次版本.修订号`

- **主版本**：破坏性变更
- **次版本**：新增功能
- **修订号**：Bug 修复

### 使用特定版本

```bash
# 克隆指定版本
git clone --branch v1.2.0 https://github.com/your-username/claude-template.git .claude

# 查看当前版本
cat .claude/VERSION
```

### 更新模板

```bash
# 如果使用 submodule
git submodule update --remote .claude-template

# 手动更新
cd .claude
git pull origin main
```

## 项目特化建议

### 前端项目

保留：
- `commands/` 全部
- `snippets/frontend/`
- `skills/code-generator.js`

删除：
- `snippets/backend/`
- `workflows/` 中非必要的

### 后端项目

保留：
- `commands/` 全部
- `snippets/backend/`
- `workflows/bug-fix-flow.yaml`

删除：
- `snippets/frontend/`

### 全栈项目

保留全部内容，根据技术栈微调 snippets。

### ML/AI 项目

添加：
- `snippets/ml/` - 模型训练片段
- `workflows/experiment-flow.yaml` - 实验工作流

## 自定义扩展

### 添加自定义 Command

创建 `.claude/commands/my-command.md`：

```markdown
# /my-command

## 描述
命令的简短描述

## 使用场景
什么时候使用这个命令

## 参数
- param1: 参数说明

## 执行流程
1. 步骤一
2. 步骤二
```

### 添加自定义 Snippet

创建 `.claude/snippets/custom/mysnippet.js`：

```javascript
// 我的代码片段
function myFunction() {
  // ...
}
```

## 常见问题

### Q: 模板更新后如何同步到已有项目？

A: 模板设计为"复制即独立"模式，不提供自动同步。建议：
1. 定期查看模板仓库更新
2. 手动采纳需要的改进
3. 或使用 Git submodule + cherry-pick

### Q: 某些功能在当前项目不适用怎么办？

A: 直接删除不需要的文件/目录即可。模板是起点，不是束缚。

### Q: 如何贡献改进？

A: 提交 PR 到模板仓库，描述改进内容和适用场景。

## 许可证

MIT

## 贡献

欢迎贡献！请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解详情。
