# 通用编码规范

> 适用于所有代码的基础规范，所有 Agent 和 Skills 都必须遵守。

## 核心原则

1. **安全性优先** - 避免引入安全漏洞和系统风险
2. **跨平台兼容** - 代码必须在不同操作系统上正常运行
3. **可维护性** - 代码清晰、易读、易维护

---

## 跨平台兼容性

### 禁止使用 `nul` 文件

**规则**: 严禁在 Windows 平台使用 `nul` 作为文件路径进行写入操作。

**原因**:
- `nul` 是 Windows 的空设备保留名称，类似于 Linux 的 `/dev/null`
- 直接写入 `nul` 会创建实际的文件而非重定向到空设备
- 这会导致文件系统中出现无用的 `nul` 文件，占用空间且难以删除

**正确做法**:

```bash
# 错误示例 - 会创建 nul 文件
echo "test" > nul
some_command > nul

# 正确示例 - 使用空设备
echo "test" > $null  # PowerShell
some_command 2>&1 | Out-Null  # PowerShell

# 代码中
# Python
import os
os.devnull  # '/dev/null' on Unix, 'nul' on Windows

# Node.js
const { spawn } = require('child_process');
// 使用 { stdio: 'ignore' } 而非重定向到文件
```

### 文件路径规范

**规则**: 使用跨平台兼容的路径处理方式。

| 做法 | 说明 |
|------|------|
| ✅ 使用 `path.join()` 或 `path.resolve()` | 自动处理路径分隔符 |
| ✅ 使用 `__dirname` / `__filename` | 获取相对路径 |
| ❌ 硬编码 `\` 或 `/` | 导致跨平台问题 |
| ❌ 使用保留名称 | `nul`, `con`, `prn`, `aux` 等 |

```javascript
// 正确示例
const path = require('path');
const filePath = path.join(__dirname, 'output.txt');

// 错误示例
const filePath = __dirname + '\\output.txt';
```

### 命令执行规范

**规则**: 执行系统命令时考虑平台差异。

```javascript
// 正确示例 - 使用跨平台方式
const { execSync } = require('child_process');
const isWindows = process.platform === 'win32';

const output = isWindows
  ? execSync('type file.txt', { encoding: 'utf-8' })
  : execSync('cat file.txt', { encoding: 'utf-8' });

// 更好的方式 - 使用 Node.js API
const fs = require('fs');
const content = fs.readFileSync('file.txt', 'utf-8');
```

---

## 字符编码

### UTF-8 编码要求

**规则**: 所有文件必须使用 UTF-8 编码保存和处理。

**文件编码声明**:

```python
# Python
# -*- coding: utf-8 -*-
```

```html
<!-- HTML -->
<meta charset="UTF-8">
```

**文件读写显式指定编码**:

| 语言 | 正确做法 | 错误做法 |
|------|---------|---------|
| Python | `open('file.txt', 'r', encoding='utf-8')` | `open('file.txt', 'r')` |
| Node.js | `fs.readFileSync('file.txt', 'utf8')` | `fs.readFileSync('file.txt')` |
| Java | `new FileReader(file, StandardCharsets.UTF_8)` | `new FileReader(file)` |

**Git 配置**:

```bash
git config --global core.quotepath false
git config --global i18n.commitencoding utf-8
git config --global i18n.logoutputencoding utf-8
```

**IDE 配置 (VS Code)**:

```json
{
  "files.encoding": "utf8",
  "files.autoGuessEncoding": false,
  "terminal.integrated.encoding": "utf8"
}
```

---

## 错误处理

| 原则 | 要求 |
|------|------|
| **必须处理错误** | 所有异步操作必须捕获错误 |
| **清晰错误信息** | 错误消息应包含上下文信息 |
| **适当降级** | 错误时提供备用方案 |

```javascript
// 正确示例
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.error('操作失败:', error.message);
  return defaultValue;
}

// 错误示例
const result = await riskyOperation(); // 未处理错误
```

---

## 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 变量/函数 | camelCase | `getUserData`, `isLoading` |
| 类/组件 | PascalCase | `UserService`, `Button` |
| 常量 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 私有成员 | 前缀下划线 | `_internalMethod` |

---

## 代码组织

| 原则 | 说明 |
|------|------|
| **单一职责** | 每个函数只做一件事 |
| **DRY** | 不重复代码，提取公共逻辑 |
| **清晰命名** | 名称应自解释，避免缩写 |
| **适当注释** | 复杂逻辑需要注释，简单代码不需要 |

---

## 类型安全

| 原则 | 要求 |
|------|------|
| **使用类型系统** | 避免使用 `any` 类型 |
| **定义接口** | 公共 API 必须定义类型 |
| **类型注释** | 无类型语言使用 JSDoc/Docstring |

```typescript
// 正确示例
interface User {
  id: number;
  name: string;
  email: string;
}

function getUser(id: number): User {
  // ...
}

// 错误示例
function getUser(id: any): any {
  // ...
}
```

---

## 文件操作安全

| 规则 | 说明 |
|------|------|
| ✅ 使用绝对路径 | 避免路径混淆 |
| ✅ 检查目录存在性 | 创建前确保目录存在 |
| ✅ 处理文件冲突 | 避免覆盖重要文件 |
| ❌ 写入系统目录 | 避免写入系统敏感位置 |
| ❌ 使用保留名称 | `nul`, `con`, `prn`, `aux` 等 |

```javascript
function safeWriteFile(filePath, content) {
  const fs = require('fs');
  const path = require('path');

  const fullPath = path.resolve(filePath);
  const dir = path.dirname(fullPath);

  // 确保目录存在
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 检查保留名称
  const basename = path.basename(fullPath);
  const reservedNames = ['nul', 'con', 'prn', 'aux'];
  if (reservedNames.includes(basename.toLowerCase())) {
    throw new Error(`保留名称不能用作文件名: ${basename}`);
  }

  fs.writeFileSync(fullPath, content, 'utf8');
}
```

---

## 安全意识

| 原则 | 要求 |
|------|------|
| **不泄露敏感信息** | 密码、token、API key 不写入代码 |
| **输入验证** | 所有外部输入必须验证 |
| **使用环境变量** | 敏感配置通过环境变量传递 |

```javascript
// 正确示例
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error('API_KEY 未配置');
}

// 错误示例
const apiKey = 'sk-1234567890'; // 硬编码敏感信息
```

---

## 通用检查清单

提交代码前，确认以下检查项：

- [ ] 未使用 `nul` 作为文件路径
- [ ] 路径处理使用跨平台方式
- [ ] 错误已正确处理
- [ ] 命名符合规范
- [ ] 代码结构清晰
- [ ] 必要时添加了注释
- [ ] 文件使用 UTF-8 编码保存
- [ ] 文件读写显式指定 UTF-8
- [ ] 类型定义完整
- [ ] 无敏感信息泄露
