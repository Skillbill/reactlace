/* eslint-env node */
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:storybook/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['@typescript-eslint'],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react/prop-types': 'off', // Using TypeScript
    'react/display-name': 'off', // Allow anonymous components
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    '@typescript-eslint/no-explicit-any': 'off', // Allow any type
    '@typescript-eslint/no-namespace': 'off', // Allow namespaces for JSX augmentation
    'no-undef': 'off', // TypeScript handles this
    'no-console': 'warn', // Warn on console statements
    'storybook/no-renderer-packages': 'off' // Allow direct Storybook imports
  },
  ignorePatterns: ['src/components/examples/', 'dist/', 'node_modules/', 'src/stories/']
}
