import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      // 👇 ИСПРАВИЛИ ПУТЬ: теперь Vite знает, что pages лежит внутри components 👇
      '@pages': path.resolve(__dirname, './src/components/pages')
    },
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']
  },
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true
    }
  }
})



