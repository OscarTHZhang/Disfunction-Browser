// load an offscreen BrowserWindow and take the screenshot of it

const {BrowserWindow} = require('electron')

let offscreenWindow

module.exports = (url, callback) => {
  // create offscreen window
  offscreenWindow = new BrowserWindow({
    width: 500, height: 500,
    show: false,
    webPreferences: {
      offscreen: true,
      nodeIntegration: false
    }
  })

  // load the url
  offscreenWindow.loadURL(url)

  // wait to finish loading
  offscreenWindow.webContents.on('did-finish-load', event => {
    // title
    let title = offscreenWindow.getTitle()

    // screenshot
    offscreenWindow.webContents.capturePage( image => {
      let screenshot = image.toDataURL()

      callback({ title, screenshot, url })

      offscreenWindow.close()
      offscreenWindow = null
    } )
  })
}
