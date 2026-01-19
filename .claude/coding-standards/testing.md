# 测试规范

> 编写测试代码时必须遵循的规范。

## 测试金字塔

**规则**: 遵循测试金字塔，平衡不同类型的测试。

```
        /\
       /  \      E2E 测试 (10%)
      /____\
     /      \    集成测试 (30%)
    /________\
   /          \  单元测试 (60%)
  /____________\
```

| 测试类型 | 占比 | 特点 | 示例 |
|---------|------|------|------|
| **单元测试** | 60% | 快速、独立、测试函数/类 | 测试计算折扣函数 |
| **集成测试** | 30% | 测试模块间交互 | 测试 API + 数据库 |
| **E2E 测试** | 10% | 测试完整用户流程 | 测试用户注册流程 |

---

## AAA 模式

**规则**: 单元测试遵循 AAA 模式（Arrange-Act-Assert）。

```javascript
describe('折扣计算器', () => {
  test('银卡用户应享受 10% 折扣', () => {
    // Arrange - 准备测试数据
    const price = 100;
    const level = 'silver';

    // Act - 执行被测试函数
    const result = calculateDiscount(price, level);

    // Assert - 验证结果
    expect(result).toBe(90);
  });
});
```

---

## 测试命名规范

| 格式 | 示例 | 说明 |
|------|------|------|
| **应该...** | `should return 404 when user not found` | 描述期望行为 |
| **当...时...** | `when price is negative, should throw error` | 描述条件和结果 |
| **中文描述** | `应返回 404 当用户不存在时` | 团队约定 |

```javascript
test('should return user when user exists', () => {});
test('should return 404 when user not found', () => {});
test('当用户存在时应返回用户数据', () => {});
```

---

## Mock 使用原则

| 使用场景 | 使用 Mock | 理由 |
|---------|----------|------|
| **外部 API** | ✅ | 避免真实调用，提高速度 |
| **数据库** | ⚠️ | 集成测试用真实数据库 |
| **文件系统** | ⚠️ | 集成测试用真实文件 |
| **时间** | ✅ | 使用假时间保证测试稳定 |
| **随机数** | ✅ | 固定随机值保证可重复 |

```javascript
jest.mock('axios');
const axios = require('axios');

test('should fetch user from API', async () => {
  axios.get.mockResolvedValue({ data: { id: 1, name: '张三' } });

  const user = await fetchUser(1);
  expect(user.name).toBe('张三');
});
```

---

## 测试覆盖率要求

| 指标 | 最低要求 | 推荐值 |
|------|---------|--------|
| **语句覆盖率** | 70% | 80% |
| **分支覆盖率** | 60% | 70% |
| **函数覆盖率** | 80% | 90% |
| **行覆盖率** | 70% | 80% |

```json
{
  "collectCoverageFrom": [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 70,
      "functions": 80,
      "lines": 70,
      "statements": 70
    }
  }
}
```

---

## 异步测试规范

**规则**: 正确处理异步测试，避免虚假通过。

```javascript
// ✅ 正确 - 使用 async/await
test('should fetch user', async () => {
  const user = await fetchUser(1);
  expect(user.name).toBe('张三');
});

// ✅ 正确 - 返回 Promise
test('should fetch user', () => {
  return fetchUser(1).then(user => {
    expect(user.name).toBe('张三');
  });
});

// ❌ 错误 - 测试会虚假通过
test('should fetch user', () => {
  fetchUser(1).then(user => {
    expect(user.name).toBe('张三');
  });
});
```

---

## 测试隔离

| 规则 | 说明 |
|------|------|
| **独立运行** | 每个测试可以单独运行 |
| **顺序无关** | 测试顺序不影响结果 |
| **清理状态** | 每个测试后清理状态 |
| **不共享数据** | 测试之间不共享数据 |

```javascript
beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  cleanup();
});
```

---

## TDD 最佳实践

**红-绿-重构循环**:

1. **Red**: 编写失败的测试
2. **Green**: 编写最少代码使测试通过
3. **Refactor**: 重构代码，保持测试通过

---

## 测试检查清单

- [ ] 单元测试覆盖率达标（≥70%）
- [ ] 测试命名清晰
- [ ] 遵循 AAA 模式
- [ ] Mock 使用合理
- [ ] 异步测试正确处理
- [ ] 测试之间相互独立
- [ ] 集成测试覆盖关键场景
