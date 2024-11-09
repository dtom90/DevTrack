require('dotenv').config()
const { notarize } = require('@electron/notarize')

exports.default = async function notarizing (context) {
  const { electronPlatformName, appOutDir } = context
  if (electronPlatformName !== 'darwin') {
    return
  }
  
  const appName = context.packager.appInfo.productFilename
  
  await notarize({
    appBundleId: 'app.devtrack',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLEID,
    appleIdPassword: process.env.APPLEIDPASS
  })
}
