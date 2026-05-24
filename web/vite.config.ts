import { defineConfig , loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

/** @type {import('vite').UserConfig} */

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react() , tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: env.PORT ? Number(env.PORT) : 5173,
      allowedHosts: [process.env.VITE_API_HOST ?? "localhost"],
    },
  }
})
