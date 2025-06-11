import { defaultConfig } from "@caido/eslint-config";

const packagePrimevue = () => {
  return [{
    files: ["packages/primevue/src/**/*.ts"],
    rules: {
      "@typescript-eslint/strict-boolean-expressions": "off",
    },
  }]
}

/** @type {import('eslint').Linter.Config } */
export default [
  ...defaultConfig(),
  ...packagePrimevue(),
]
