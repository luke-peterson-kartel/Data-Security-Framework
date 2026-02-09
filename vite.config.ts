import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dataSecurity: resolve(__dirname, 'data-security.html'),
        framework: resolve(__dirname, 'framework.html'),
        creative: resolve(__dirname, 'creative-engine.html'),
      },
    },
  },
})
