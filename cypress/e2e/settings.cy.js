describe('24-hour clock', () => {
  it('displays non-24-hour clock by default', () => {
    // Assert
    cy.get('.navbar #time-container').contains(/ [AP]M/).should('be.visible')
  })

  it('toggles to 24-hour clock', () => {
    // Act
    cy.get('nav.navbar').get('a.nav-link').contains('Options').click()
    cy.get('nav.navbar').get('.dropdown-menu label').contains('Use 24-hour Clock').click()

    // Assert
    cy.get('.navbar #time-container').contains(/ [AP]M/).should('not.exist')
  })
})

describe('notifications', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      cy.stub(win.Notification, 'requestPermission').resolves('granted').as('RequestPermissionStub')
      cy.stub(win, 'Notification').as('NotificationStub')
      win.Notification.permission = 'granted'
    })
  })
  
  // it('should request for notification permission by default', () => {
  //   // Act
  //   cy.get('input[placeholder="enter new task"]')
  //     .click()
  //     .type('My First Task{enter}')
  //
  //   // Assert
  //   cy.get('@RequestPermissionStub').should('be.called')
  // })
  
  it('show notification on timer complete', () => {
    // Arrange
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My First Task{enter}')
    cy.get('div').contains('25:00').click()
    cy.get('#countdown-container input[type="number"]:visible').clear().type('0.05{enter}')

    // Act
    cy.get('button > svg.fa-play').click()

    // Assert
    cy.get('@NotificationStub').should('be.calledWith', 'Finished Working, Take a Break!')
  })

  it('toggles off notifications', () => {
    // Arrange
    cy.get('nav.navbar').get('a.nav-link').contains('Options').click()
    cy.get('nav.navbar').get('.dropdown-menu label').contains('Enable Notifications').click()
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My First Task{enter}')
    cy.get('div').contains('25:00').click()
    cy.get('#countdown-container input[type="number"]:visible').clear().type('0.05{enter}')

    // Act
    cy.get('button > svg.fa-play').click()
    cy.wait(4000)

    // Assert
    cy.get('@NotificationStub').should('not.be.called')
  })
})
