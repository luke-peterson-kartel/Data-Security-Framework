import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/Data-Security-Framework/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        framework: resolve(__dirname, 'framework.html'),
      },
    },
  },
})
