const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents (on, config) {
      // implement node event listeners here
      on('task', {
        log (message) {
          // eslint-disable-next-line no-console
          console.log(message)
          return null
        }
      })
    }
  }
})
