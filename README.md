# Claude Code 模板仓库

> 标准化的 `.claude` 配置模板，适用于各类软件项目。

## 简介

这个模板提供了一套开箱即用的 Claude Code 配置，包括通用命令、Agent、技能、工作流和代码片段。复制到你的项目中，根据需要进行特化即可。

## 目录结构

```
.claude/
├── commands/           # 通用命令（如 /commit, /review, /spec）
├── agents/             # Agent 配置（如 code-reviewer, spec-writer）
├── skills/             # 技能脚本（如 tdd-helper）
├── workflows/          # 工作流定义（如 spec-driven-tdd）
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
│   ├── specs/          # SPEC 规范模板（function/api/feature）
│   └── git/            # PR/Issue 模板
├── tools/              # 工具脚本（如 Spec-Kit 安装脚本）
├── specs/              # 规范文档存储（function/api/feature）
├── context/            # 项目上下文缓存
├── hooks/              # 事件钩子
├── docs/               # 元文档（如 spec-kit-guide.md）
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
| `/spec` | 创建和管理项目规范（SPEC） |

### Spec-Driven Development（规格驱动开发）

本模板集成了 **SPEC 优先 + TDD 驱动**的开发模式：

```
规范（SPEC）→ 测试（Tests）→ 实现（Implementation）
```

**核心特性**：
- `/spec` 命令：创建和管理规范文档
- `spec-writer` Agent：专门的规范编写代理
- 规范模板：function、API、feature 三种规范模板
- Spec-Kit 集成：可选的官方规格驱动开发工具

**工作流**：[`.claude/workflows/spec-driven-tdd.md`](.claude/workflows/spec-driven-tdd.md)
**使用指南**：[`.claude/docs/spec-kit-guide.md`](.claude/docs/spec-kit-guide.md)

---

## Spec-Driven Development 使用指南

### 快速开始

#### 1. 创建规范

使用 `/spec` 命令创建功能规范：

```
用户: /spec action=create type=function name=calculate_discount
```

Claude 会引导你完成：
1. 选择规范类型（function/api/feature）
2. 填写规范内容（输入/输出/业务规则/边界条件）
3. 保存到 `.claude/specs/` 目录

#### 2. 生成测试

基于规范生成测试用例：

```
用户: /spec action=generate-tests name=calculate_discount
```

#### 3. 实现功能

编写实现代码，运行测试验证：

```
用户: /test
```

### 使用方式

#### 方式一：使用 /spec 命令

| Action | 说明 | 示例 |
|--------|------|------|
| `create` | 创建新规范 | `/spec action=create type=function name=login` |
| `view` | 查看规范 | `/spec action=view name=login` |
| `update` | 更新规范 | `/spec action=update name=login` |
| `list` | 列出所有规范 | `/spec action=list` |
| `generate-tests` | 基于规范生成测试 | `/spec action=generate-tests name=login` |

#### 方式二：使用 spec-writer Agent

```
用户: "帮我为用户登录功能编写规范"

Claude 自动：
1. 调用 spec-writer Agent
2. 使用模板创建规范文档
3. 保存到 .claude/specs/
```

#### 方式三：使用 Spec-Kit（可选）

安装 Spec-Kit：

```bash
# Linux/macOS
bash .claude/tools/spec-kit-init.sh

# Windows PowerShell
.\.claude\tools\spec-kit-init.ps1
```

使用 Spec-Kit CLI：

```bash
# 初始化项目
specify init

# 创建规范
specify create

# 生成实现
specify implement
```

### 规范类型

| 类型 | 说明 | 模板 |
|------|------|------|
| **function** | 函数/方法规范 | `.claude/templates/specs/function-spec.md` |
| **api** | API 端点规范 | `.claude/templates/specs/api-spec.md` |
| **feature** | 功能模块规范 | `.claude/templates/specs/feature-spec.md` |
| **module** | 模块/子系统规范 | 基于 feature 模板 |

### 完整工作流示例

```
┌─────────────────────────────────────────────────────────────┐
│  1. 创建规范                                                  │
│     /spec action=create type=function name=calculate_discount │
├─────────────────────────────────────────────────────────────┤
│  2. 查看规范                                                  │
│     /spec action=view name=calculate_discount               │
├─────────────────────────────────────────────────────────────┤
│  3. 生成测试                                                  │
│     /spec action=generate-tests name=calculate_discount     │
├─────────────────────────────────────────────────────────────┤
│  4. 运行测试 (RED - 失败)                                     │
│     /test                                                   │
├─────────────────────────────────────────────────────────────┤
│  5. 编写实现代码                                             │
│     [编写满足规范的代码]                                      │
├─────────────────────────────────────────────────────────────┤
│  6. 运行测试 (GREEN - 通过)                                   │
│     /test                                                   │
├─────────────────────────────────────────────────────────────┤
│  7. 代码审查与重构                                           │
│     /refactor                                               │
└─────────────────────────────────────────────────────────────┘
```

### 规范存储

规范文件存储在 `.claude/specs/` 目录：

```
.claude/specs/
├── function/         # 函数规范
│   ├── calculate_discount.md
│   └── user_login.md
├── api/             # API 规范
│   ├── users_list.md
│   └── orders_create.md
└── feature/         # 功能规范
    └── user_auth.md
```

### 最佳实践

1. **规范优先**：在编写代码之前先创建规范
2. **明确性**：使用精确的语言描述需求和边界条件
3. **可测试性**：确保每个规则都可以被测试验证
4. **版本控制**：规范文件应纳入 Git 版本控制
5. **持续更新**：需求变化时及时更新规范

### Agents（代理）

本模板采用 **主控 + 子代理** 模式：

#### 主控代理

| Agent | 功能 |
|-------|------|
| `orchestrator` | 主控代理，负责任务分解、子代理调度和结果整合 |

#### 子代理

| Agent | 功能 |
|-------|------|
| `code-reviewer` | 代码审查 |
| `test-writer` | 编写测试 |
| `debugger` | Bug 诊断 |
| `refactor-agent` | 代码重构 |
| `spec-writer` | 编写规范文档 |
| `code-writer` | 编写实现代码 |
| `orchestrator` | 主控代理（任务分解和调度） |

#### 内置子代理（Claude Code 原生）

| Agent | 功能 |
|-------|------|
| `Explore` | 代码探索和结构分析 |
| `Plan` | 架构设计和实现方案 |
| `general-purpose` | 通用多步骤任务 |

### Workflows（工作流）

| 工作流 | 功能 |
|--------|------|
| `spec-driven-tdd` | 规格驱动 TDD 开发流程 |
| `feature-development` | 新功能开发全流程 |
| `bug-fix-flow` | Bug 修复流程 |
| `refactor-flow` | 代码重构流程 |
| `code-review-flow` | 代码审查流程 |

每个工作流都由 `orchestrator` 主控代理协调，自动调用合适的子代理完成任务。

### 主控 + 子代理模式

本模板的核心架构是 **主控 + 子代理** 模式：

```
用户任务
    ↓
┌─────────────────────────────┐
│   Orchestrator (主控代理)     │
│                             │
│  1. 任务分析                 │
│  2. 任务分解                 │
│  3. 代理调度                 │
│  4. 结果整合                 │
└─────────────────────────────┘
    ↓
    ├─→ spec-writer (编写规范)
    ├─→ test-writer (生成测试)
    ├─→ code-writer (实现代码)
    ├─→ code-reviewer (代码审查)
    ├─→ debugger (Bug 诊断)
    ├─→ Explore (代码探索)
    ├─→ Plan (架构设计)
    └─→ /commit, /test, /spec (Skills)
    ↓
整合结果返回用户
```

**优势**：
- **专业化**：每个子代理专注自己的领域
- **并行化**：独立任务可并行执行
- **可扩展**：容易添加新的子代理
- **智能化**：主控根据任务类型自动选择最佳执行路径
- **规范驱动**：支持 SPEC 优先的开发模式

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

### Q: Spec-Kit 必须安装吗？

A: 不是必须的。本模板提供了独立的规范系统：
- ✅ 使用 `/spec` 命令和 `spec-writer` Agent（无需 Spec-Kit）
- ✅ 可选安装 Spec-Kit 获得额外功能

安装 Spec-Kit：
```bash
# Linux/macOS
bash .claude/tools/spec-kit-init.sh

# Windows PowerShell
.\.claude\tools\spec-kit-init.ps1
```

### Q: 如何使用规格驱动开发？

A: 参考 [`.claude/workflows/spec-driven-tdd.md`](.claude/workflows/spec-driven-tdd.md) 和 [`.claude/docs/spec-kit-guide.md`](.claude/docs/spec-kit-guide.md)。

基本流程：
1. 使用 `/spec` 命令创建规范
2. 基于规范生成测试
3. 实现功能代码
4. 运行测试验证

## 许可证

MIT

## 贡献

欢迎贡献！请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解详情。
