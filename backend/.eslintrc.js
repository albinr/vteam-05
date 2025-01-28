// .eslintrc.js
module.exports = {
  "env": {
    "browser": true,
    "node": true,
    "commonjs": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "airbnb-base"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "commonjs"
  },
  "rules": {
    "semi": ["error", "always"],
    "quotes": ["error", "single"],
    "no-console": "warn",
    "global-require": "off",
    "no-void": "off",
    "indent": "off",
    "quotes": "off",
    "import/extensions": "off",
    "no-undef": "off",
    "no-console": "off",
    "camelcase": "off",
    "no-unused-vars": "off",
    "comma-dangle": "off",
    "quote-props": "off",
    "array-bracket-spacing": "off",
    "prefer-destructuring": "off",
    "object-curly-newline": "off",
    "prefer-const": "off",
    "strict": "off",
    "lines-around-directive": "off",
    "consistent-return": "off",
    "object-shorthand": "off"
  },
  "ignorePatterns": ["node_modules/", "build/", "tist.js", "test/", "app.js", "src/first.js", ".eslintrc.js",
    "jest.config.js"
  ]
};
