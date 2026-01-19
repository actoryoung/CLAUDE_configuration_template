# 编码规范索引

> 本目录包含项目的所有编码规范，按领域拆分以减少 Token 消耗和提高维护性。

## 规范文件

| 文件 | 说明 | 适用对象 |
|------|------|---------|
| **[general.md](./general.md)** | 通用编码规范（跨平台、编码、命名、错误处理等） | 所有 Agent/Skills |
| **[api-design.md](./api-design.md)** | API 设计规范（RESTful、版本控制、响应格式） | code-writer, backend-writer |
| **[testing.md](./testing.md)** | 测试规范（TDD、覆盖率、AAA 模式） | test-writer, code-writer |
| **[code-review.md](./code-review.md)** | 代码审查规范（PR 模板、审查清单） | code-reviewer |

## 规范使用方式

### Agent 引用规范

每个 Agent 只引用它需要的规范文件：

```markdown
# code-writer.md

## 遵循的规范

本 Agent 遵循以下规范：
- `.claude/coding-standards/general.md` - 通用编码规范
- `.claude/coding-standards/api-design.md` - API 设计规范
```

```markdown
# test-writer.md

## 遵循的规范

本 Agent 遵循以下规范：
- `.claude/coding-standards/general.md` - 通用编码规范
- `.claude/coding-standards/testing.md` - 测试规范
```

```markdown
# code-reviewer.md

## 遵循的规范

本 Agent 遵循以下规范：
- `.claude/coding-standards/general.md` - 通用编码规范
- `.claude/coding-standards/testing.md` - 测试规范
- `.claude/coding-standards/code-review.md` - 代码审查规范
```

### Skill 引用规范

Skills 也按需引用规范：

```javascript
/**
 * API 生成技能
 * 遵循: .claude/coding-standards/api-design.md
 */
```

## Token 优化对比

**重构前**:
```
code-writer: 加载 coding-standards.md (1328 行) → ~8000 tokens
test-writer: 加载 coding-standards.md (1328 行) → ~8000 tokens
code-reviewer: 加载 coding-standards.md (1328 行) → ~8000 tokens
```

**重构后**:
```
code-writer: 加载 general.md (250 行) + api-design.md (200 行) → ~3000 tokens
test-writer: 加载 general.md (250 行) + testing.md (180 行) → ~2800 tokens
code-reviewer: 加载 general.md (250 行) + testing.md (180 行) + code-review.md (150 行) → ~3600 tokens
```

**Token 节省**: 约 50-60%

## 维护指南

### 添加新规范

1. 确定规范是通用还是领域特定
2. 通用规范添加到 `general.md`
3. 领域规范创建新文件（如 `security.md`）
4. 更新 `README.md` 索引
5. 更新相关 Agent 的引用

### 修改现有规范

1. 直接修改对应的规范文件
2. 更新版本号
3. 通知相关维护者

## 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| 2.0 | 2026-01-19 | 重构：拆分规范文件，优化 Token 使用 |
| 1.1 | 2026-01-19 | 添加中文字符编码规范 |
| 1.0 | 2026-01-19 | 初始版本，单文件规范 |
