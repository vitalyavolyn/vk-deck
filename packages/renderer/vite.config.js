/* eslint-env node */

import { builtinModules } from 'module'
import path from 'path'
import yaml from '@rollup/plugin-yaml'
import reactRefresh from '@vitejs/plugin-react-refresh'

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
      strict: true,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  esbuild: {
    jsxInject: "import React from 'react'",
  },
  build: {
    sourcemap: true,
    target: 'chrome93',
    outDir: 'dist',
    assetsDir: '.',
    terserOptions: {
      ecma: 2020,
      compress: {
        passes: 2,
      },
      safari10: false,
    },
    rollupOptions: {
      external: [...builtinModules],
      input: {
        main: path.resolve(__dirname, 'index.html'),
        viewer: path.resolve(__dirname, 'viewer.html'),
      },
    },
    emptyOutDir: true,
    brotliSize: false,
  },
}

export default config
