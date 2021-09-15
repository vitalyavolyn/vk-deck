if (process.env.VITE_APP_VERSION === undefined) {
  const semver = require('semver')
  const { version } = require('./package.json')
  process.env.VITE_APP_VERSION = semver.inc(version, 'prerelease')
}

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  directories: {
    output: 'dist',
    buildResources: 'buildResources'
  },
  files: [
    'packages/**/dist/**'
  ],
  extraMetadata: {
    version: process.env.VITE_APP_VERSION
  }
}

module.exports = config
