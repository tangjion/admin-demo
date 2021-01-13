module.exports = {
  extends: ['@commitlint/config-conventional'], // 扩展的规则集
  rules: {
    // commitmsg 的自定义规则
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'improvement',
        'perf',
        'refactor',
        'revert',
        'style',
        'test'
      ]
    ]
  }
}
