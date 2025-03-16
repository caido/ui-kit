import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  theme: {
    title: "Caido UI Kit",
    defaultColorScheme: "dark",
  },
  setupFile: './src/stories/setup/index.ts',
  outDir: "./dist-ui",
  storyMatch: [
    "./src/stories/**/*.story.vue",
  ],
  plugins: [
    HstVue(),
  ],
  vite: {
    plugins: [
      Vue(),
    ],
    server: {
      fs: {
        allow: ['../../node_modules'],
      },
    },
  },
})