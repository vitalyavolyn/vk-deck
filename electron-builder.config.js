if (!process.env.VITE_APP_VERSION) {
  const semver = require('semver')
  const { version } = require('./package.json')
  process.env.VITE_APP_VERSION = semver.inc(version, 'prerelease')
}

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  productName: 'VK Deck',
  appId: 'me.vitalya.vk-deck',
  directories: {
    output: 'dist',
    buildResources: 'build-resources',
  },
  files: ['packages/**/dist/**'],
  extraMetadata: {
    version: process.env.VITE_APP_VERSION,
  },
  linux: {
    target: 'AppImage',
  },
  mac: {
    target: {
      target: 'default',
      arch: ['x64', 'arm64'],
    },
  },
}

module.exports = config
