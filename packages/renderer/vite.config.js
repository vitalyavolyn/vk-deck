/* eslint-env node */

import { builtinModules } from 'module'
import path from 'path'
import yaml from '@rollup/plugin-yaml'
import svgr from '@svgr/rollup'
import react from '@vitejs/plugin-react'

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: __dirname,
  plugins: [react(), yaml(), svgr()],
  base: '',
  server: {
    fs: {
      strict: true,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './assets'),
    },
  },
  // esbuild: {
  //   jsxInject: "import React from 'react'",
  // },
  build: {
    sourcemap: true,
    target: 'chrome93',
    outDir: 'dist',
    assetsDir: '.',
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
