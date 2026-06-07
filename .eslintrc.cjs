/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'vue/multi-word-component-names': 'off'
  },
  overrides: [
    {
      files: ['src/app/**/*'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@entities/*/*', '@features/*/*', '@widgets/*/*'],
                message: 'App may compose modules, but cross-module imports must use public index.ts exports.'
              }
            ]
          }
        ]
      }
    },
    {
      files: ['src/pages/**/*'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@app/*', '@entities/*/*', '@features/*/*', '@widgets/*/*', '@pages/*/*'],
                message: 'Pages compose public modules only; avoid app imports and deep module imports.'
              }
            ]
          }
        ]
      }
    },
    {
      files: ['src/widgets/**/*'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@app/*', '@pages/*', '@entities/*/*', '@features/*/*', '@widgets/*/*'],
                message:
                  'Widgets can compose features/entities/shared, but cannot import app/pages or deep module internals.'
              }
            ]
          }
        ]
      }
    },
    {
      files: ['src/features/**/*'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@app/*', '@pages/*', '@widgets/*', '@entities/*/*', '@features/*/*'],
                message:
                  'Features can use entities/shared, but cannot import app/pages/widgets or deep module internals.'
              }
            ]
          }
        ]
      }
    },
    {
      files: ['src/entities/**/*'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@app/*', '@pages/*', '@widgets/*', '@features/*', '@entities/*/*'],
                message:
                  'Entities can use shared only and must not import feature/widget/page/app or another entity internals.'
              }
            ]
          }
        ]
      }
    },
    {
      files: ['src/shared/**/*'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@app/*', '@pages/*', '@widgets/*', '@features/*', '@entities/*'],
                message: 'Shared cannot import business layers.'
              }
            ]
          }
        ]
      }
    }
  ]
};
