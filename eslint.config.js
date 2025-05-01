import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

// Base config without TypeScript checks
const baseConfig = {
  files: ['**/*.js', '**/*.mjs', 'eslint.config.js'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    // Add this to make browser globals available
    globals: {
      window: 'readonly',
      document: 'readonly',
      console: 'readonly',
      requestAnimationFrame: 'readonly',
      cancelAnimationFrame: 'readonly',
      setTimeout: 'readonly',
      clearTimeout: 'readonly',
      setInterval: 'readonly',
      clearInterval: 'readonly',
      HTMLElement: 'readonly',
      HTMLCanvasElement: 'readonly',
      CanvasRenderingContext2D: 'readonly',
      MouseEvent: 'readonly',
      WheelEvent: 'readonly'
    }
  },
  plugins: {
    import: importPlugin
  },
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    // Adding import rules
    'import/order': ['error', {
      'groups': [
        ['builtin', 'external'],
        'internal',
        ['parent', 'sibling', 'index']
      ],
      'newlines-between': 'always',
      'alphabetize': { order: 'asc' }
    }]
  }
};

// TypeScript specific config
const tsConfig = {
  files: ['**/*.ts'],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: './tsconfig.json',
    },
    // Add the same globals for TypeScript files
    globals: {
      window: 'readonly',
      document: 'readonly',
      console: 'readonly',
      requestAnimationFrame: 'readonly',
      cancelAnimationFrame: 'readonly',
      setTimeout: 'readonly',
      clearTimeout: 'readonly',
      setInterval: 'readonly',
      clearInterval: 'readonly',
      HTMLElement: 'readonly',
      HTMLCanvasElement: 'readonly',
      CanvasRenderingContext2D: 'readonly',
      MouseEvent: 'readonly',
      WheelEvent: 'readonly'
    }
  },
  plugins: {
    '@typescript-eslint': tseslint.plugin,
    import: importPlugin
  },
  rules: {
    ...tseslint.configs.recommended[0].rules,
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      // This is important - it prevents errors for interface parameters
      ignoreRestSiblings: true
    }],
    // Disable the no-unused-vars rule for interface definitions
    'no-unused-vars': 'off',
    // Add the import rules
    'import/order': ['error', {
      'groups': [
        ['builtin', 'external'],
        'internal',
        ['parent', 'sibling', 'index']
      ],
      'newlines-between': 'always',
      'alphabetize': { order: 'asc' }
    }]
  }
};

// Fix for unused vars in BaseRenderer.ts
const baseRendererConfig = {
  files: ['**/BaseRenderer.ts'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'off'
  }
};

// Fix for unused vars in types file
const typesConfig = {
  files: ['**/types/**/*.ts'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    'no-unused-vars': 'off'
  }
};

export default [
  eslint.configs.recommended,
  baseConfig,
  tsConfig,
  baseRendererConfig,
  typesConfig,
  {
    ignores: ['dist/**', 'node_modules/**', '**/*.config.js', '**/*.config.ts', '**/*.config.cjs']
  }
];