module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: "airbnb",
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-restricted-exports": 0,
    quotes: 0,
    "no-unused-vars": 0,
    "default-param-last": 0,
    "import/newline-after-import": 0,
    "comma-dangle": 0,
    "import/no-extraneous-dependencies": 0,
    "object-curly-newline": 0,
    "max-len": 0,
    "operator-linebreak": 0,
    "react/prop-types": 0,
    "react/no-array-index-key": 0,
    "react/jsx-wrap-multilines": 0,
    "consistent-return": 0,
    "implicit-arrow-linebreak": 0,
    "react/jsx-curly-newline": 0,
    camelcase: 0,
  },
};
