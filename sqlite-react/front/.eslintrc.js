module.exports = {
  env: {
    node: true,
  },
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": "error",
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
};