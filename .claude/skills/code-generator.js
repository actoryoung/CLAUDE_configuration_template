/**
 * Code Generator Skill
 *
 * 根据规范生成代码骨架和模板。
 *
 * 遵循规范:
 * - .claude/coding-standards/general.md
 * - .claude/coding-standards/api-design.md
 */

/**
 * 生成 React 组件模板
 * @param {string} componentName - 组件名称
 * @param {boolean} withHooks - 是否使用 Hooks
 * @param {boolean} withTypescript - 是否使用 TypeScript
 * @returns {string} 组件代码
 */
function generateReactComponent(componentName, withHooks = true, withTypescript = true) {
  const ts = withTypescript;
  const hooks = withHooks;

  if (hooks) {
    return ts ? `
import React, { useState, useEffect } from 'react';

/**
 * ${componentName} 组件属性
 */
interface ${componentName}Props {
  /** 组件标题 */
  title?: string;
  /** 操作回调 */
  onAction?: () => void;
}

/**
 * ${componentName} 组件
 */
export const ${componentName}: React.FC<${componentName}Props> = ({
  title,
  onAction
}) => {
  const [state, setState] = useState<string>('');

  useEffect(() => {
    // 副作用逻辑
  }, []);

  const handleClick = () => {
    onAction?.();
  };

  return (
    <div className="${componentName.toLowerCase()}">
      <h2>{title || '${componentName}'}</h2>
      {/* 组件内容 */}
    </div>
  );
};

export default ${componentName};
` : `
import React, { useState, useEffect } from 'react';

/**
 * ${componentName} 组件
 */
export const ${componentName} = ({
  title,
  onAction
}) => {
  const [state, setState] = useState('');

  useEffect(() => {
    // 副作用逻辑
  }, []);

  const handleClick = () => {
    onAction?.();
  };

  return (
    <div className="${componentName.toLowerCase()}">
      <h2>{title || '${componentName}'}</h2>
      {/* 组件内容 */}
    </div>
  );
};

export default ${componentName};
`;
  }

  // Class component template
  return ts ? `
import React, { Component } from 'react';

/**
 * ${componentName} 组件属性
 */
interface ${componentName}Props {
  title?: string;
  onAction?: () => void;
}

/**
 * ${componentName} 组件状态
 */
interface ${componentName}State {
  state: string;
}

/**
 * ${componentName} 组件
 */
export class ${componentName} extends Component<${componentName}Props, ${componentName}State> {
  constructor(props: ${componentName}Props) {
    super(props);
    this.state = {
      state: ''
    };
  }

  componentDidMount() {
    // 副作用逻辑
  }

  handleClick = () => {
    this.props.onAction?.();
  };

  render() {
    return (
      <div className="${componentName.toLowerCase()}">
        <h2>{this.props.title || '${componentName}'}</h2>
        {/* 组件内容 */}
      </div>
    );
  }
}

export default ${componentName};
` : `
import React, { Component } from 'react';

/**
 * ${componentName} 组件
 */
export class ${componentName} extends Component {
  constructor(props) {
    super(props);
    this.state = {
      state: ''
    };
  }

  componentDidMount() {
    // 副作用逻辑
  }

  handleClick = () => {
    this.props.onAction?.();
  };

  render() {
    return (
      <div className="${componentName.toLowerCase()}">
        <h2>{this.props.title || '${componentName}'}</h2>
        {/* 组件内容 */}
      </div>
    );
  }
}

export default ${componentName};
`;
}

/**
 * 生成 API 路由模板 (Express.js)
 * 遵循 RESTful 设计原则和统一响应格式
 * @param {string} routeName - 路由名称
 * @param {string} method - HTTP 方法 (GET|POST|PUT|DELETE)
 * @param {boolean} withTypescript - 是否使用 TypeScript
 * @returns {string} 路由代码
 */
function generateAPIRoute(routeName, method = 'GET', withTypescript = true) {
  const ts = withTypescript;
  const routePath = `/api/v1/${routeName.toLowerCase()}`;

  const methodHandlers = {
    GET: `// 获取资源
    const items = await Model.find();
    res.status(200).json({
      success: true,
      data: { items },
      timestamp: new Date().toISOString()
    });`,

    POST: `// 创建资源
    const item = await Model.create(req.body);
    res.status(201).json({
      success: true,
      data: item,
      message: '创建成功',
      timestamp: new Date().toISOString()
    });`,

    PUT: `// 更新资源（全量）
    const item = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!item) {
      return res.status(404).json({
        success: false,
        error: {
          code: '${routeName.toUpperCase()}_NOT_FOUND',
          message: '${routeName} 不存在'
        },
        timestamp: new Date().toISOString()
      });
    }
    res.status(200).json({
      success: true,
      data: item,
      timestamp: new Date().toISOString()
    });`,

    PATCH: `// 更新资源（部分）
    const item = await Model.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!item) {
      return res.status(404).json({
        success: false,
        error: {
          code: '${routeName.toUpperCase()}_NOT_FOUND',
          message: '${routeName} 不存在'
        },
        timestamp: new Date().toISOString()
      });
    }
    res.status(200).json({
      success: true,
      data: item,
      timestamp: new Date().toISOString()
    });`,

    DELETE: `// 删除资源
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: {
          code: '${routeName.toUpperCase()}_NOT_FOUND',
          message: '${routeName} 不存在'
        },
        timestamp: new Date().toISOString()
      });
    }
    res.status(204).send();`
  };

  return ts ? `
import { Request, Response } from 'express';
import { Model } from '../models/${routeName}';

/**
 * ${method} ${routePath}
 * 遵循 RESTful 设计原则
 */
export const ${method.toLowerCase()}${routeName} = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    ${methodHandlers[method]}

    // 统一错误处理
    if (!items && !item) {
      res.status(404).json({
        success: false,
        error: {
          code: '${routeName.toUpperCase()}_NOT_FOUND',
          message: '${routeName} 不存在',
          details: { id: req.params.id }
        },
        timestamp: new Date().toISOString()
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '服务器内部错误',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      timestamp: new Date().toISOString()
    });
  }
};
` : `
const Model = require('../models/${routeName}');

/**
 * ${method} ${routePath}
 * 遵循 RESTful 设计原则
 */
exports.${method.toLowerCase()}${routeName} = async (req, res) => {
  try {
    ${methodHandlers[method]}

    // 统一错误处理
    if (!items && !item) {
      return res.status(404).json({
        success: false,
        error: {
          code: '${routeName.toUpperCase()}_NOT_FOUND',
          message: '${routeName} 不存在',
          details: { id: req.params.id }
        },
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '服务器内部错误',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      timestamp: new Date().toISOString()
    });
  }
};
`;
}

/**
 * 生成请求验证中间件 (使用 Joi)
 * @param {string} resourceName - 资源名称
 * @param {string} method - HTTP 方法
 * @returns {string} 中间件代码
 */
function generateValidationMiddleware(resourceName, method = 'POST') {
  return `
const Joi = require('joi');

/**
 * ${method} ${resourceName} 验证规则
 */
const ${method.toLowerCase()}${resourceName}Schema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  description: Joi.string().max(500).optional(),
  // 添加其他字段验证
});

/**
 * ${method} ${resourceName} 验证中间件
 */
const validate${method}${resourceName} = (req, res, next) => {
  const { error, value } = ${method.toLowerCase()}${resourceName}Schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: '请求参数验证失败',
        details: error.details.map(d => ({
          field: d.path.join('.'),
          message: d.message
        }))
      },
      timestamp: new Date().toISOString()
    });
  }

  // 使用验证后的值替换原始 body
  req.body = value;
  next();
};

module.exports = { validate${method}${resourceName} };
`;
}

module.exports = {
  generateReactComponent,
  generateAPIRoute,
  generateValidationMiddleware
};
