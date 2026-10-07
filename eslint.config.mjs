import { defaultConfig, designPlugin, designRules } from "@caido/eslint-config";

const packagePrimevue = () => {
  return [
    {
      files: ["packages/primevue/src/**/*.ts"],
      rules: {
        "@typescript-eslint/strict-boolean-expressions": "off",
      },
    },
    {
      files: ["packages/primevue/src/classic/**/*.ts"],
      rules: {
        eqeqeq: "off",
      },
    },
    {
      files: ["packages/primevue/src/stories/**/*.{ts,vue}"],
      rules: {
        "no-console": "off",
        "vue/define-props-destructuring": "off",
      },
    },
  ]
}

const packageDesignSystem = () => {
  return [
    {
      files: ["packages/design-system/.vitepress/**/*.{ts,vue}"],
      plugins: { design: designPlugin },
      rules: designRules,
    },
  ]
}

/** @type {import('eslint').Linter.Config } */
export default [
  {
    ignores: [
      "packages/tokens/src/__generated__/**",
      "packages/design-system/.vitepress/cache/**",
      "packages/design-system/.vitepress/dist/**",
      "packages/design-system/.vitepress/theme/searchBox.js",
    ],
  },
  ...defaultConfig(),
  ...packagePrimevue(),
  ...packageDesignSystem(),
]
