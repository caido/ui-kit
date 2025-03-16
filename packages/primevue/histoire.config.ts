import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
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