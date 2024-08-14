import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { fixupConfigRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
  },
  {
    ignores: ['**/dist', '**/.eslintrc.cjs'],
  },
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:storybook/recommended',
      'plugin:react-hooks/recommended',
    ),
  ),
  {
    plugins: {
      prettier,
      'simple-import-sort': simpleImportSort,
      'react-refresh': reactRefresh,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: tsParser,
    },

    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: false,
        },
      ],

      'simple-import-sort/imports': 'error',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
          caughtErrors: 'all',
        },
      ],
    },
  },
]
