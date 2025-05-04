module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: require('path').resolve(__dirname, './tsconfig.json')
  },
  plugins: [
    '@typescript-eslint',
    'import'
  ],
  rules: {
    'indent': ['error', 2, { 'SwitchCase': 1 }], // Case statements align with switch
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      ignoreRestSiblings: true
    }],
    // Return type rules
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/explicit-function-return-type': ['error', {
      allowExpressions: true,
      allowHigherOrderFunctions: true,
      allowTypedFunctionExpressions: true,
      allowDirectConstAssertionInArrowFunctions: true
    }],
    '@typescript-eslint/no-confusing-void-expression': ['error', {
      ignoreArrowShorthand: true,
      ignoreVoidOperator: true
    }],
    '@typescript-eslint/return-await': ['error', 'in-try-catch'],
    // Import rules
    'import/order': ['error', {
      'groups': [
        ['builtin', 'external'],
        'internal',
        ['parent', 'sibling', 'index']
      ],
      'newlines-between': 'always',
      'alphabetize': { order: 'asc' }
    }]
  },
  overrides: [
    // Exclude ESLint config file from TypeScript processing
    {
      files: [".eslintrc.cjs"],
      parserOptions: {
        project: null // Disable TypeScript project for this file
      }
    },
    // Base renderer file exemption
    {
      files: ['**/BaseRenderer.ts'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off'
      }
    },
    // Types files exemption
    {
      files: ['**/types/**/*.ts'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        'no-unused-vars': 'off'
      }
    },
    // Strict rules for abstract classes
    {
      files: ['**/generators/BaseTerrainGenerator.ts', '**/effects/BaseEffect.ts'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/explicit-member-accessibility': ['error', {
          accessibility: 'explicit'
        }]
      }
    }
  ]
};
