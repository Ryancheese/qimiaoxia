import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** 生产构建通过 VITE_BASE 指定子路径；本地 dev 默认 `/` */
const base = process.env.VITE_BASE || '/'

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
    strictPort: true,
  },
})
