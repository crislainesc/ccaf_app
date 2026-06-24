import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// VITE_BASE_PATH is set by the CI workflow to match the GitHub repo name.
// Falls back to "/" for local development.
const base = process.env.VITE_BASE_PATH ?? '/'

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
