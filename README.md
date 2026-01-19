# Claude Code 模板仓库

> 标准化的 `.claude` 配置模板，支持主控代理协调、规范驱动开发、智能模型分配。

## 简介

这个模板提供了一套开箱即用的 Claude Code 配置，核心特性：

- **主控 + 子代理模式**：Orchestrator 主控代理自动协调多个专业子代理
- **规范驱动开发**：SPEC 优先 + TDD 驱动的开发流程
- **智能模型分配**：根据并发负载动态分配模型（GLM-4.7/4.6/4.5-Air）
- **模块化编码规范**：分域管理编码标准，优化 token 消耗
- **开箱即用**：复制到项目即可使用，根据需要特化

## 目录结构

```
.claude/
├── commands/           # 通用命令（/commit, /review-pr, /test, /refactor, /spec）
├── agents/             # Agent 配置
│   ├── orchestrator.md     # 主控代理（GLM-4.7）
│   ├── spec-writer.md      # 规范编写代理（GLM-4.6）
│   ├── code-writer.md      # 代码实现代理（GLM-4.6）
│   ├── test-writer.md      # 测试编写代理（GLM-4.6）
│   ├── code-reviewer.md    # 代码审查代理（GLM-4.6）
│   ├── debugger.md         # Bug 诊断代理（GLM-4.6）
│   └── refactor-agent.md   # 代码重构代理（GLM-4.6）
├── skills/             # 技能脚本（tdd-helper, code-generator, git-helper）
├── workflows/          # 工作流定义（spec-driven-tdd, feature-development, bug-fix-flow）
├── prompts/            # 系统提示词
│   ├── system/         # 默认和严格模式提示词
│   ├── modes/          # 探索模式等
│   └── agents/         # Agent 专用提示词
├── snippets/           # 代码片段（frontend, backend, devops）
├── templates/          # 文件模板
│   ├── docs/           # CLAUDE.md 模板
│   ├── code/           # README 等代码模板
│   ├── specs/          # SPEC 规范模板（function/api/feature）
│   └── git/            # PR/Issue 模板
├── tools/              # 工具脚本（Spec-Kit 安装脚本）
├── specs/              # 规范文档存储（function/api/feature）
├── coding-standards/   # 编码规范（模块化设计）
│   ├── README.md           # 规范索引和使用指南
│   ├── general.md          # 通用编码规范（跨平台、UTF-8、错误处理）
│   ├── api-design.md       # API 设计规范（RESTful、版本控制、响应格式）
│   ├── testing.md          # 测试规范（TDD、覆盖率、AAA 模式）
│   └── code-review.md      # 代码审查规范（PR 模板、审查清单）
├── docs/               # 元文档
│   ├── spec-kit-guide.md       # Spec-Kit 使用指南
│   └── model-configuration.md   # 模型配置策略
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
| `/commit` | 创建符合 Conventional Commits 的 Git 提交 |
| `/review-pr` | 审查 Pull Request |
| `/test` | 运行测试并处理失败 |
| `/refactor` | 重构代码 |
| `/spec` | 创建和管理项目规范（SPEC） |

### 主控 + 子代理模式

本模板的核心架构是 **主控 + 子代理** 模式：

```
用户任务
    ↓
┌─────────────────────────────┐
│   Orchestrator (主控代理)     │
│   模型: GLM-4.7               │
│                             │
│  1. 任务分析                 │
│  2. 任务分解                 │
│  3. 代理调度 + 模型分配       │
│  4. 结果整合                 │
└─────────────────────────────┘
    ↓
    ├─→ spec-writer (GLM-4.6)
    ├─→ test-writer (GLM-4.6)
    ├─→ code-writer (GLM-4.6)
    ├─→ code-reviewer (GLM-4.6)
    ├─→ debugger (GLM-4.6)
    ├─→ refactor-agent (GLM-4.6)
    ├─→ Explore (GLM-4.6)
    ├─→ Plan (GLM-4.6)
    └─→ 高并发时自动降级到 GLM-4.5-Air
    ↓
整合结果返回用户
```

**优势**：
- **专业化**：每个子代理专注自己的领域
- **并行化**：独立任务可并行执行
- **可扩展**：容易添加新的子代理
- **智能化**：主控根据任务类型自动选择最佳执行路径
- **动态模型**：根据并发负载自动分配模型

#### 代理列表

**主控代理**

| Agent | 模型 | 功能 |
|-------|------|------|
| orchestrator | GLM-4.7 | 任务分解、代理调度、结果整合 |

**子代理**

| Agent | 模型 | 功能 |
|--------|------|------|
| spec-writer | GLM-4.6 | 编写项目规范和测试用例 |
| code-writer | GLM-4.6 | 实现高质量代码 |
| test-writer | GLM-4.6 | 编写测试代码 |
| code-reviewer | GLM-4.6 | 代码审查 |
| debugger | GLM-4.6 | Bug 诊断和修复 |
| refactor-agent | GLM-4.6 | 代码重构 |

**内置子代理（Claude Code 原生）**

| Agent | 模型 | 功能 |
|--------|------|------|
| Explore | GLM-4.6 | 代码探索和结构分析 |
| Plan | GLM-4.6 | 架构设计和实现方案 |

### 智能模型分配

根据并发负载动态分配模型：

| 并发数 | 模型分配 | 说明 |
|-------|---------|------|
| ≤ 4 子代理 | GLM-4.6 | 平衡性能和质量 |
| > 4 子代理 | GLM-4.5-Air | 高并发时自动降级 |

**详细配置**：[`.claude/docs/model-configuration.md`](.claude/docs/model-configuration.md)

### Spec-Driven Development（规范驱动开发）

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

#### 快速开始

**1. 创建规范**

```
用户: /spec action=create type=function name=calculate_discount
```

**2. 生成测试**

```
用户: /spec action=generate-tests name=calculate_discount
```

**3. 实现功能**

```
用户: 编写实现代码
用户: /test
```

#### 规范类型

| 类型 | 说明 | 模板 |
|------|------|------|
| **function** | 函数/方法规范 | `.claude/templates/specs/function-spec.md` |
| **api** | API 端点规范 | `.claude/templates/specs/api-spec.md` |
| **feature** | 功能模块规范 | `.claude/templates/specs/feature-spec.md` |

### 编码规范（模块化设计）

本模板采用**分域管理**的编码规范架构，有效降低 token 消耗：

```
.claude/coding-standards/
├── README.md           # 规范索引和使用指南
├── general.md          # 通用编码规范（跨平台、UTF-8、错误处理）
├── api-design.md       # API 设计规范
├── testing.md          # 测试规范
└── code-review.md      # 代码审查规范
```

**Token 优化效果**：

| Agent | 传统方式 | 模块化方式 | 节省 |
|-------|---------|-----------|------|
| code-writer | ~8000 tokens | ~3300 tokens | 58% |
| test-writer | ~8000 tokens | ~2600 tokens | 68% |
| code-reviewer | ~8000 tokens | ~3600 tokens | 55% |

**详细说明**：[`.claude/coding-standards/README.md`](.claude/coding-standards/README.md)

### Workflows（工作流）

| 工作流 | 功能 |
|--------|------|
| `spec-driven-tdd` | 规格驱动 TDD 开发流程 |
| `feature-development` | 新功能开发全流程 |
| `bug-fix-flow` | Bug 修复流程 |
| `refactor-flow` | 代码重构流程 |
| `code-review-flow` | 代码审查流程 |

每个工作流都由 `orchestrator` 主控代理协调，自动调用合适的子代理完成任务。

### Skills（技能）

| 技能 | 功能 | 相关规范 |
|------|------|---------|
| tdd-helper | TDD 开发辅助 | testing.md |
| code-generator | 代码生成模板 | general.md, api-design.md |
| git-helper | Git 操作辅助 | general.md, code-review.md |

## 使用示例

### 示例 1：自动开发新功能

```
用户: "帮我开发用户登录功能"

Orchestrator 自动执行：
├─→ Plan Agent: 设计登录架构
├─→ spec-writer: 编写登录功能规范
├─→ code-writer: 实现登录 API
├─→ test-writer: 生成测试用例
├─→ code-reviewer: 审查代码质量
└─→ 返回完整功能代码 + 测试 + 审查报告
```

### 示例 2：规范驱动开发

```
用户: /spec action=create type=api name=user_login

# 填写规范后
用户: /spec action=generate-tests name=user_login

# 实现代码
用户: [编写登录代码]

# 运行测试
用户: /test
```

### 示例 3：Bug 修复

```
用户: "登录时出现 500 错误"

Orchestrator 自动执行：
├─→ Explore: 定位错误代码
├─→ debugger: 分析根因
├─→ code-writer: 修复代码
├─→ test-writer: 添加回归测试
└─→ 验证修复
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

### Q: 模型配置如何修改？

A: 编辑 `.claude/docs/model-configuration.md` 和各 Agent 的 frontmatter。默认配置：
- Orchestrator: GLM-4.7
- 子代理: GLM-4.6
- 高并发（>4）: GLM-4.5-Air

### Q: 编码规范如何定制？

A: 编辑 `.claude/coding-standards/` 下的相应文件。每个 Agent 只引用需要的规范，修改后自动生效。

## 技术架构

### Token 优化策略

1. **模块化规范**：按领域分离编码规范，Agent 只加载需要的规范文件
2. **模型分级**：根据任务复杂度和并发度动态分配模型
3. **按需加载**：Skills 和 Commands 只在调用时加载

### 扩展性

1. **添加新 Agent**：在 `.claude/agents/` 创建配置文件
2. **添加新 Command**：在 `.claude/commands/` 创建命令文件
3. **添加新 Workflow**：在 `.claude/workflows/` 创建工作流文件
4. **添加新规范**：在 `.claude/coding-standards/` 创建规范文件

## 相关文档

- [`.claude/coding-standards/README.md`](.claude/coding-standards/README.md) - 编码规范索引
- [`.claude/docs/model-configuration.md`](.claude/docs/model-configuration.md) - 模型配置策略
- [`.claude/docs/spec-kit-guide.md`](.claude/docs/spec-kit-guide.md) - Spec-Kit 使用指南
- [`.claude/agents/orchestrator.md`](.claude/agents/orchestrator.md) - 主控代理配置

## 许可证

MIT

## 贡献

欢迎贡献！请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解详情。
