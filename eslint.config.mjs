module.exports = {
    env: {
        node: true, // Node.js environment
        es2022: true // ECMAScript 2022
    },
    extends: ["eslint:recommended"],
    rules: {
        "no-unused-vars": "warn",
        "no-console": "off",
        "no-undef": "error"
    }
};
