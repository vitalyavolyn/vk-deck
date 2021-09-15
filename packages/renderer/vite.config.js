/* eslint-env node */

import { builtinModules } from 'module'
import reactRefresh from '@vitejs/plugin-react-refresh'

const PACKAGE_ROOT = __dirname

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  plugins: [reactRefresh()],
  base: '',
  server: {
    fs: {
      strict: true
    }
  },
  build: {
    sourcemap: true,
    target: 'chrome93',
    outDir: 'dist',
    assetsDir: '.',
    terserOptions: {
      ecma: 2020,
      compress: {
        passes: 2
      },
      safari10: false
    },
    rollupOptions: {
      external: [
        ...builtinModules
      ]
    },
    emptyOutDir: true,
    brotliSize: false
  }
}

export default config
