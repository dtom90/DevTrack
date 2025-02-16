// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

Cypress.on('window:before:load', (win) => {
  cy.stub(win.console, 'error').callsFake((...args) => {
    // Log the error to the Cypress console
    // eslint-disable-next-line no-console
    console.error(...args)
    
    // Fail the test if a console error occurs
    throw new Error(`Console error: ${args.join(' ')}`)
  })
})

beforeEach(() => {
  const hostname = Cypress.env('DEVTRACK_HOSTNAME') || 'localhost'
  cy.visit(`http://${hostname}:8080`)
  cy.contains('DevTrack')
  indexedDB.databases().then((databases) => {
    databases.forEach((db) => {
      indexedDB.deleteDatabase(db.name)
    })
  })
})
