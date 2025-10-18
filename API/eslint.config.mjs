import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importHelpers from 'eslint-plugin-import-helpers';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.node,
            },
        },
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    prettier, // Configuração do Prettier
    {
        plugins: {
            'import-helpers': importHelpers,
        },
        rules: {
            '@typescript-eslint/unbound-method': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
            // Regras do import-helpers
            'import-helpers/order-imports': [
                'warn',
                {
                    newlinesBetween: 'always',
                    groups: [
                        ['/^node:/'], // Módulos Node.js
                        ['module'], // Módulos externos
                        ['/^@//'], // Módulos internos (ajuste para seu alias)
                        ['parent', 'sibling', 'index'], // Módulos relativos
                    ],
                    alphabetize: {
                        order: 'asc',
                        ignoreCase: true,
                    },
                },
            ],

            // Suas regras personalizadas adicionais
            'no-console': 'warn',
            'consistent-return': 'error',
        },
    },
]);
