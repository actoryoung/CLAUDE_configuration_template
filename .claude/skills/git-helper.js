/**
 * Git Helper Skill
 *
 * Git 操作辅助技能，提供常用 Git 命令和工作流。
 *
 * 遵循规范:
 * - .claude/coding-standards/general.md
 * - .claude/coding-standards/code-review.md
 */

/**
 * Git 工作流类型
 */
const WORKFLOWS = {
  FEATURE: 'feature',
  BUGFIX: 'bugfix',
  HOTFIX: 'hotfix',
  REFACTOR: 'refactor'
};

/**
 * Conventional Commits 规范
 */
const COMMIT_TYPES = {
  FEAT: 'feat',      // 新功能
  FIX: 'fix',        // Bug 修复
  DOCS: 'docs',      // 文档更新
  STYLE: 'style',    // 代码格式（不影响功能）
  REFACTOR: 'refactor', // 重构
  PERF: 'perf',      // 性能优化
  TEST: 'test',      // 测试相关
  CHORE: 'chore',    // 构建/工具链相关
  CI: 'ci',          // CI 配置
  REVERT: 'revert'   // 回退提交
};

/**
 * 生成符合规范的分支名
 * @param {string} type - 分支类型 (feature|bugfix|hotfix|refactor)
 * @param {string} description - 简短描述
 * @param {string} ticketId - 关联的工单 ID（可选）
 * @returns {string} 分支名
 */
function generateBranchName(type, description, ticketId = '') {
  const normalizedDescription = description
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const prefix = `${type}/${ticketId ? ticketId + '-' : ''}`;
  return `${prefix}${normalizedDescription}`;
}

/**
 * 生成符合 Conventional Commits 的提交信息
 * @param {string} type - 提交类型
 * @param {string} scope - 影响范围
 * @param {string} subject - 简短描述
 * @param {string} body - 详细描述（可选）
 * @param {string} footer - 关联 Issue（可选）
 * @returns {string} 完整提交信息
 */
function generateCommitMessage(type, scope, subject, body = '', footer = '') {
  let message = '';

  // Header: type(scope): subject
  if (scope) {
    message += `${type}(${scope}): ${subject}`;
  } else {
    message += `${type}: ${subject}`;
  }

  // Body
  if (body) {
    message += `\n\n${body}`;
  }

  // Footer
  if (footer) {
    message += `\n\n${footer}`;
  }

  return message;
}

/**
 * Git 操作检查清单
 * 遵循代码审查规范
 */
const GIT_CHECKLIST = {
  beforeCommit: [
    '代码是否通过所有测试？',
    '是否添加了必要的文档？',
    '提交信息是否符合规范？',
    '是否有敏感信息被提交？',
    '文件是否使用 UTF-8 编码保存？',
    '是否遵守了编码规范？'
  ],
  beforePush: [
    '是否拉取了最新代码？',
    '是否有冲突需要解决？',
    '是否通过了本地构建？',
    '测试覆盖率是否达标？'
  ],
  beforeMerge: [
    '是否完成了代码审查？',
    'CI 检查是否通过？',
    '是否有未完成的 TODO？',
    'PR 大小是否合理（< 1000 行）？'
  ]
};

/**
 * PR 模板
 * 遵循代码审查规范
 */
const PR_TEMPLATE = `
## 描述
简要描述此 PR 的目的和内容。

## 类型
- [ ] 新功能
- [ ] Bug 修复
- [ ] 重构
- [ ] 文档更新
- [ ] 性能优化
- [ ] 其他：______

## 变更内容
- [ ] 变更点 1
- [ ] 变更点 2
- [ ] 变更点 3

## 测试
- [ ] 单元测试已添加/更新
- [ ] 集成测试已通过
- [ ] 手动测试已完成

## 检查清单
- [ ] 代码符合编码规范
- [ ] 代码已自审
- [ ] 注释清晰必要
- [ ] 文档已更新
- [ ] 无调试代码
- [ ] 无敏感信息
- [ ] 文件使用 UTF-8 编码
- [ ] 遵循 API 设计规范（如适用）
- [ ] 遵循测试规范（如适用）

## 关联 Issue
Closes #123, #456

## 截图/演示
（如果是 UI 变更，提供截图或演示）

## 备注
其他需要说明的信息
`;

/**
 * 获取 Git 工作流命令序列
 * @param {string} workflow - 工作流类型
 * @param {string} branchName - 分支名称
 * @returns {string[]} Git 命令序列
 */
function getWorkflowCommands(workflow, branchName) {
  const commands = {
    [WORKFLOWS.FEATURE]: [
      `git checkout develop`,
      `git pull origin develop`,
      `git checkout -b ${branchName}`,
      '# 开发完成后:',
      `git add .`,
      `git commit -m "feat: description"`,
      `git push origin ${branchName}`,
      '# 创建 PR 进行代码审查'
    ],
    [WORKFLOWS.BUGFIX]: [
      `git checkout develop`,
      `git pull origin develop`,
      `git checkout -b ${branchName}`,
      '# 修复完成后:',
      `git add .`,
      `git commit -m "fix: description"`,
      `git push origin ${branchName}`,
      '# 创建 PR 进行代码审查'
    ],
    [WORKFLOWS.HOTFIX]: [
      `git checkout main`,
      `git pull origin main`,
      `git checkout -b ${branchName}`,
      '# 修复完成后:',
      `git add .`,
      `git commit -m "fix: description"`,
      `git push origin ${branchName}`,
      '# 创建紧急修复 PR',
      '# 合并到 main 和 develop'
    ],
    [WORKFLOWS.REFACTOR]: [
      `git checkout -b ${branchName}`,
      '# 重构完成后:',
      `git add .`,
      `git commit -m "refactor: description"`,
      `git push origin ${branchName}`,
      '# 创建 PR 进行代码审查'
    ]
  };

  return commands[workflow] || [];
}

/**
 * 生成 PR 标题
 * 遵循 Conventional Commits 规范
 * @param {string} type - 提交类型
 * @param {string} description - 描述
 * @returns {string} PR 标题
 */
function generatePRTitle(type, description) {
  return `${type}: ${description}`;
}

/**
 * 审查质量指标
 */
const REVIEW_METRICS = {
  maxPRSize: 1000,
  idealPRSize: 400,
  maxResponseTime: 24, // 小时
  maxMergeTime: 48, // 小时
  minCodeCoverage: 70, // 百分比
  minReviewers: 1
};

module.exports = {
  WORKFLOWS,
  COMMIT_TYPES,
  generateBranchName,
  generateCommitMessage,
  generatePRTitle,
  GIT_CHECKLIST,
  PR_TEMPLATE,
  getWorkflowCommands,
  REVIEW_METRICS
};
