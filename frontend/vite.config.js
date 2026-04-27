import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/media': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  // ADD THIS SECTION BELOW
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'], // 'lcov' is what SonarCloud needs
      reportsDirectory: './coverage' 
    },
  },
})