import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** Gitee Pages 项目站路径：https://{user}.gitee.io/ryan-toolbox/ */
const base = process.env.VITE_BASE || '/ryan-toolbox/'

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
