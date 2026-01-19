# 模型配置策略

本文档描述了 Claude Code Template 中各 Agent 和 Skill 的模型分配策略。

## 设计原则

**主控代理使用最强模型，子代理根据并发负载动态降级**

| 组件 | 默认模型 | model 参数 | 说明 |
|------|---------|-----------|------|
| **Orchestrator** | GLM-4.7 | (继承默认) | 主控代理，负责任务分解和调度 |
| **子代理** | GLM-4.6 | `"glm-4.6"` | 执行具体任务 |
| **高并发场景** | GLM-4.5-Air | `"glm-4.5-Air"` | 当并发子代理数 > 4 时自动降级 |

## 各 Agent 模型配置

### 主控代理

| Agent | 模型 | 用途 |
|-------|------|------|
| orchestrator | GLM-4.7 | 任务分解、代理调度、结果整合 |

### 子代理

| Agent | 模型 | 专长 |
|--------|------|------|
| spec-writer | GLM-4.6 | 编写项目规范和测试用例 |
| code-writer | GLM-4.6 | 实现高质量代码 |
| test-writer | GLM-4.6 | 编写测试代码 |
| code-reviewer | GLM-4.6 | 代码审查 |
| debugger | GLM-4.6 | Bug 诊断和修复 |
| refactor-agent | GLM-4.6 | 代码重构 |

### 内置 Agent（由系统管理）

| Agent | 模型 | 专长 |
|--------|------|------|
| Explore | GLM-4.6 | 代码探索和搜索 |
| Plan | GLM-4.6 | 架构设计和技术选型 |

## 并发负载降级策略

```
当前并发子代理数 → Task model 参数 → 实际使用模型
─────────────────┼─────────────────┼──────────────
      ≤ 4        →   "glm-4.6"    →   GLM-4.6
      > 4        →   "glm-4.5-Air" →   GLM-4.5-Air
```

### 实现逻辑

1. Orchestrator 跟踪当前运行的子代理数量
2. 调用新子代理前检查并发数
3. 通过 Task tool 的 `model` 参数指定：
   - 并发 ≤ 4: `model: "glm-4.6"`
   - 并发 > 4: `model: "glm-4.5-Air"`
4. 优先级高的任务可强制使用 `model: "glm-4.6"`

### 示例场景

**场景 1：串行执行**
```
Plan (model: "glm-4.6") → code-writer (model: "glm-4.6") → test-writer (model: "glm-4.6")
并发数始终为 1，所有子代理使用 GLM-4.6
```

**场景 2：并行执行**
```
code-writer (model: "glm-4.6") + test-writer (model: "glm-4.6") + code-reviewer (model: "glm-4.6")
并发数 = 3，所有子代理使用 GLM-4.6
```

**场景 3：高并发**
```
spec-writer (model: "glm-4.6") + code-writer (model: "glm-4.6") + test-writer (model: "glm-4.6") +
code-reviewer (model: "glm-4.6") + debugger (model: "glm-4.5-Air")
并发数 = 5，第 5 个起使用 GLM-4.5-Air
```

## 模型选择依据

| model 参数 | 实际模型 | 适用场景 | 特点 |
|-----------|---------|---------|------|
| (不指定) | GLM-4.7 | 任务规划、复杂推理 | 最强推理能力，用于主控决策 |
| "glm-4.6" | GLM-4.6 | 代码编写、测试、审查 | 平衡性能和质量，适合大多数任务 |
| "glm-4.5" | GLM-4.5 | 中等复杂度任务 | 性能优化，适合常规任务 |
| "glm-4.5-Air" | GLM-4.5-Air | 高并发场景 | 成本优化，适合简单任务或批量处理 |

## 配置方式

### Agent Frontmatter（声明性）

每个 Agent 的 frontmatter 中声明默认模型：

```yaml
---
name: code-writer
description: 根据设计实现高质量代码
version: 1.1
model: glm-4.6
---
```

### 动态调用（实际使用）

Orchestrator 通过 Task tool 的 `model` 参数动态指定：

```python
# 使用 GLM-4.6
Task(
    subagent_type="code-writer",
    prompt="实现用户登录功能",
    model: "glm-4.6"
)

# 使用 GLM-4.5-Air - 高并发场景
Task(
    subagent_type="test-writer",
    prompt="编写简单测试",
    model: "glm-4.5-Air"
)
```

## 可用 model 参数值

直接使用完整模型名：

| 参数值 | 说明 |
|-------|------|
| `"glm-4.7"` | 最强模型，用于主控代理 |
| `"glm-4.6"` | 高级模型，用于子代理 |
| `"glm-4.5"` | 中等模型 |
| `"glm-4.5-Air"` | 快速模型，用于高并发场景 |
| (不指定) | 使用默认模型 GLM-4.7 |

## 注意事项

1. **Orchestrator 始终使用 GLM-4.7**：主控代理需要最强的推理能力来处理任务分解和错误处理
2. **子代理默认使用 GLM-4.6**：平衡质量和性能
3. **自动降级**：并发 > 4 时自动使用 GLM-4.5-Air
4. **可覆盖**：对于关键任务，可强制指定更高模型（如 `model: "glm-4.6"`）
5. **参数格式**：直接使用完整模型名，如 `"glm-4.6"`、`"glm-4.5-Air"` 等

## 相关文件

- `.claude/agents/orchestrator.md` - 主控代理配置
- `.claude/agents/` - 各子代理配置
- `.claude/docs/` - 其他文档
