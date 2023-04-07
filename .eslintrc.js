/*
 * @Author: kaan
 * @Date: 2021-11-05 13:52:50
 * @LastEditors: kaan
 * @LastEditTime: 2021-11-08 15:42:18
 * @Version: 
 * @Description: 
 */
module.exports = {
  root: false,
  env: {
    node: false
  },
  "globals": {
    "process": true
    },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
