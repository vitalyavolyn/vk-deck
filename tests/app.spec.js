const { strict: assert } = require('assert')
const { _electron: electron } = require('playwright')

;(async () => {
  const electronApp = await electron.launch({ args: ['.'] })

  /**
   * App main window state
   * @type {{isVisible: boolean; isDevToolsOpened: boolean; isCrashed: boolean}}
   */
  const windowState = await electronApp.evaluate(({ BrowserWindow }) => {
    const mainWindow = BrowserWindow.getAllWindows()[0]

    const getState = () => ({
      isVisible: mainWindow.isVisible(),
      isDevToolsOpened: mainWindow.webContents.isDevToolsOpened(),
      isCrashed: mainWindow.webContents.isCrashed(),
    })

    return new Promise((resolve) => {
      if (mainWindow.isVisible()) {
        resolve(getState())
      } else {
        mainWindow.once('ready-to-show', () => setTimeout(() => resolve(getState()), 0))
      }
    })
  })

  // Check main window state
  assert.ok(windowState.isVisible, 'Main window not visible')
  assert.ok(!windowState.isDevToolsOpened, 'DevTools opened')
  assert.ok(!windowState.isCrashed, 'Window crashed')

  /**
   * Rendered Main window web-page
   * @type {Page}
   */
  const page = await electronApp.firstWindow()

  // Check web-page content
  const element = await page.$('#app', { strict: true })
  assert.notStrictEqual(element, undefined, "Can't find root element")
  const content = await element.innerHTML()
  assert.notStrictEqual(content.trim(), '', 'Window content is empty')

  // Check Preload script
  const renderedExposedApi = await page.evaluate(() => globalThis.electron)
  const realVersions = await electronApp.evaluate(() => process.versions)

  assert.notStrictEqual(
    renderedExposedApi,
    undefined,
    'In renderer `globalThis.electron` is undefined',
  )
  assert.strictEqual(renderedExposedApi?.versions?.electron, realVersions.electron)

  // Close app
  await electronApp.close()
})()
