/* eslint-env node */

import { builtinModules } from 'module'
import reactRefresh from '@vitejs/plugin-react-refresh'
import yaml from '@rollup/plugin-yaml'

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: __dirname,
  plugins: [reactRefresh(), yaml()],
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
