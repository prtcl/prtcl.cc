module.exports = {
  root: true,
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  plugins: [
    '@typescript-eslint',
    'react-hooks',
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'prettier',
  ],
  settings: {
    react: { version: 'detect' },
    'import/parsers': {
      '@typescript-eslint/parser': [
        '.ts',
        '.tsx',
      ],
    },
    'import/resolver': {
      alias: {
        map: [
          ['~', './src'],
          ['@ichingio/convex', './convex/_generated'],
          ['@ichingio', './packages'],
        ],
        extensions: ['.ts', '.tsx', '.js', '.json'],
      },
    },
  },
  ignorePatterns: ['dist', 'gen', 'convex'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 12,
    project: './tsconfig.eslint.json',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
      rules: {
        '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^_*' }],
        '@typescript-eslint/no-var-requires': 'error',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-misused-promises': [
          'error',
          { checksVoidReturn: false },
        ],
        '@typescript-eslint/ban-ts-comment': 'warn',
        '@typescript-eslint/ban-types': [
          'error',
          { types: { '{}': false } },
        ],
        '@typescript-eslint/consistent-type-imports': [
          'warn',
          {
            prefer: 'type-imports',
            disallowTypeAnnotations: true,
            fixStyle: 'separate-type-imports',
          },
        ],
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/no-use-before-define': [
          'error',
          {
            functions: false,
            classes: true,
            variables: true,
            allowNamedExports: false,
          },
        ],
      },
    },
  ],
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
    'arrow-body-style': 'off',
    'consistent-return': 'off',
    curly: ['error', 'all'],
    'import/no-cycle': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-console': [
      'warn',
      { allow: ['warn', 'error'] },
    ],
    'no-restricted-exports': 'off',
    'no-underscore-dangle': 'off',
    'no-nested-ternary': 'off',
    'prefer-object-spread': 'off',
    'prefer-destructuring': [
      'error',
      {
        array: false,
        object: true,
      },
      { enforceForRenamedProperties: false },
    ],
    'react-hooks/exhaustive-deps': 'error',
    'react/destructuring-assignment': 'off',
    'react/function-component-definition': 'off',
    'react/jsx-filename-extension': [
      'error',
      { extensions: ['.tsx'] },
    ],
    'react/jsx-no-useless-fragment': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/no-array-index-key': 'off',
    'react/no-unknown-property': ['error', { ignore: ['sx', 'css'] }],
    'react/no-danger': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/require-default-props': 'off',
    'react/state-in-constructor': 'off',
  },
};
