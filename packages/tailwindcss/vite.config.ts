import { defineConfig } from "vite"
import { resolve } from "path"
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ["es"]
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'src/tokens.css',
          dest: '.'
        }
      ]
    })
  ],
})

