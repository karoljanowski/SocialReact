import react from '@vitejs/plugin-react'
import {
  defineConfig,
  loadEnv
} from 'vite'

export default defineConfig(({
  mode
}) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    define: {
      plugins: [react()],
      'process.env': env
    },
  }
})