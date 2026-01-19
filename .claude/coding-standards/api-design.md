# API 设计规范

> 后端 API 开发必须遵循的设计规范。

## RESTful 设计原则

**规则**: API 设计应遵循 RESTful 架构风格。

| 原则 | 说明 | 示例 |
|------|------|------|
| **资源导向** | URL 表示资源而非动作 | `/users` vs `/getUsers` |
| **HTTP 方法语义** | 使用正确的 HTTP 方法 | GET(查询), POST(创建), PUT/PATCH(更新), DELETE(删除) |
| **名词复数** | 资源名使用复数形式 | `/users` 而非 `/user` |
| **层级关系** | 使用路径表达资源关系 | `/users/123/posts` |
| **统一接口** | 保持一致的 API 结构 | 所有资源遵循相同模式 |

**正确的 API 设计**:

```
GET    /api/v1/users              # 获取用户列表
GET    /api/v1/users/123          # 获取特定用户
POST   /api/v1/users              # 创建新用户
PUT    /api/v1/users/123          # 更新用户（全量）
PATCH  /api/v1/users/123          # 更新用户（部分）
DELETE /api/v1/users/123          # 删除用户
GET    /api/v1/users/123/posts    # 获取用户的文章
```

**错误示例**:

```
GET    /getUsers           # ❌ 动词在 URL 中
GET    /user               # ❌ 单数形式
POST   /users/create       # ❌ 动作冗余
GET    /users/123?action=delete  # ❌ 不使用 DELETE 方法
```

---

## API 版本控制

**规则**: 所有 API 必须进行版本控制。

| 版本控制方式 | 推荐度 | 说明 |
|-------------|--------|------|
| **URL 路径** | ✅ 推荐 | `/api/v1/users` |
| **请求头** | ✅ 推荐 | `Accept: application/vnd.api.v1+json` |
| **查询参数** | ⚠️ 不推荐 | `/api/users?version=1` |

```javascript
// URL 路径版本控制（推荐）
const express = require('express');
const v1Router = express.Router();

v1Router.get('/users', getUsersV1);
v1Router.post('/users', createUserV1);

app.use('/api/v1', v1Router);
```

---

## 统一响应格式

**规则**: 所有 API 返回一致的响应结构。

**成功响应**:

```json
{
  "success": true,
  "data": { "id": 123, "name": "张三" },
  "message": "操作成功",
  "timestamp": "2026-01-19T10:30:00Z"
}
```

**错误响应**:

```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "用户不存在",
    "details": { "userId": 123 }
  },
  "timestamp": "2026-01-19T10:30:00Z"
}
```

**列表响应（带分页）**:

```json
{
  "success": true,
  "data": {
    "items": [{ "id": 1, "name": "用户1" }],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5
    }
  },
  "timestamp": "2026-01-19T10:30:00Z"
}
```

---

## HTTP 状态码使用

| 状态码 | 含义 | 使用场景 |
|--------|------|---------|
| **200** | OK | GET/PUT/PATCH 成功 |
| **201** | Created | POST 创建成功 |
| **204** | No Content | DELETE 成功 |
| **400** | Bad Request | 请求参数错误 |
| **401** | Unauthorized | 未认证 |
| **403** | Forbidden | 无权限 |
| **404** | Not Found | 资源不存在 |
| **409** | Conflict | 资源冲突 |
| **422** | Unprocessable Entity | 参数格式正确但语义错误 |
| **429** | Too Many Requests | 请求频率限制 |
| **500** | Internal Server Error | 服务器内部错误 |

```javascript
app.get('/api/v1/users/:id', (req, res) => {
  const user = findUser(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'USER_NOT_FOUND',
        message: '用户不存在'
      },
      timestamp: new Date().toISOString()
    });
  }

  res.status(200).json({
    success: true,
    data: user,
    timestamp: new Date().toISOString()
  });
});
```

---

## 请求验证

**规则**: 所有输入必须进行验证和清理。

| 验证类型 | 说明 | 示例 |
|---------|------|------|
| **类型验证** | 检查数据类型 | 年龄必须是数字 |
| **格式验证** | 检查数据格式 | 邮箱格式、URL 格式 |
| **长度验证** | 检查字符串长度 | 用户名 2-20 字符 |
| **范围验证** | 检查数值范围 | 年龄 0-150 |
| **枚举验证** | 检查允许的值 | 性别只能是 male/female/other |

```javascript
const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string().min(2).max(20).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(0).max(150).required()
});

app.post('/api/v1/users', (req, res) => {
  const { error, value } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: '请求参数验证失败',
        details: error.details
      },
      timestamp: new Date().toISOString()
    });
  }

  createUser(value);
});
```

---

## API 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| **URL 路径** | 小写、连字符分隔 | `/user-profiles` |
| **查询参数** | camelCase | `pageSize`, `pageNumber` |
| **JSON 字段** | camelCase | `firstName`, `lastName` |
| **枚举值** | UPPER_SNAKE_CASE | `ACTIVE`, `INACTIVE` |
| **错误码** | UPPER_SNAKE_CASE | `USER_NOT_FOUND` |

---

## 分页、过滤、排序

**规则**: 列表 API 支持分页、过滤、排序。

```
GET /api/v1/users?page=1&pageSize=20&status=active&sort=name:asc

参数说明:
- page: 页码（默认 1）
- pageSize: 每页数量（默认 20，最大 100）
- status: 过滤条件
- sort: 排序字段和方向（字段:asc 或 字段:desc）
```

---

## 安全性

| 安全措施 | 说明 | 实现 |
|---------|------|------|
| **HTTPS** | 生产环境必须使用 HTTPS | 配置 SSL 证书 |
| **认证授权** | 使用 JWT 或 OAuth2 | 验证每个请求 |
| **速率限制** | 防止 API 滥用 | 限制每分钟请求数 |
| **CORS** | 配置跨域访问 | 仅允许可信域名 |
| **输入清理** | 防止注入攻击 | 验证和清理所有输入 |
| **敏感信息** | 不返回敏感字段 | 密码、token 等不返回 |

```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(helmet()); // 安全头

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter); // 速率限制
```

---

## API 检查清单

- [ ] 遵循 RESTful 设计原则
- [ ] 使用正确的 HTTP 方法和状态码
- [ ] 响应格式统一
- [ ] 所有输入已验证
- [ ] API 文档完整
- [ ] 安全措施已实施
- [ ] 限流与熔断已配置
