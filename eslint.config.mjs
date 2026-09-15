import { defaultConfig } from "@caido/eslint-config";

const packagePrimevue = () => {
  return [{
    files: ["packages/primevue/src/**/*.ts"],
    rules: {
      "@typescript-eslint/strict-boolean-expressions": "off",
    },
  }]
}

const packageDesignSystem = () => {
  return [
    {
      files: ["packages/design-system/.vitepress/**/*.mts"],
      languageOptions: {
        parserOptions: {
          projectService: true,
        },
      },
    },
    {
      files: ["packages/design-system/.vitepress/**/*.vue"],
      rules: {
        "compat/compat": "off",
        "vue/require-default-prop": "off",
      },
    },
  ]
}

/** @type {import('eslint').Linter.Config } */
export default [
  ...defaultConfig(),
  ...packagePrimevue(),
  ...packageDesignSystem(),
]
