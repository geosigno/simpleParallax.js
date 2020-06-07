module.exports = {
    env: {
        browser: true,
        es6: true
    },
    extends: ['airbnb-base', 'plugin:prettier/recommended'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    rules: {
        indent: ['error', 4],
        'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
        'max-len': ['error', { code: 150 }],
        'no-prototype-builtins': 0
    }
};
