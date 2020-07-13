module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ['plugin:vue/essential', 'eslint:recommended'],
    /*
     * 0 表示忽略问题，等同于"off";
     * 1 表示给出警告，等同于"warn";
     * 2 表示直接报错，等同于"error"
     *
     */
    rules: {
        'no-unsafe-negation': 'off',
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': 0,
        'no-alert': 2 //禁止使用alert confirm prompt
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}
