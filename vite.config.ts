import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/app-react/', // GitHub Pages deployment path
  esbuild: {
    jsxInject: `import React from 'react'`
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    // Ensure TS files are properly processed
    rollupOptions: {
      input: {
        main: './index.html',
      },
    }
  }
})
