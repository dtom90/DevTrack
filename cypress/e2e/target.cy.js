describe('target', () => {
  beforeEach(() => {
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My First Task{enter}')
  })

  it('sets a daily target for all activity', () => {
    // Arrange
    cy.get('.navbar-nav').get('a.nav-link').contains('All Activity').click()
    cy.get('button').contains('Set Target').click()

    // Act
    cy.get('#allActivity .dropdown-menu').within(() => {
      cy.get('label').contains('Daily Target:').should('be.visible')
      cy.get('input').type('1')
    })

    // Assert
    cy.get('#allActivityModal button.close').click()
    cy.get('.navbar-nav').get('a.nav-link').contains('All Activity').click()
    cy.get('button').contains('Set Target').click()
    cy.get('#allActivity .dropdown-menu').within(() => {
      cy.get('input').should('have.value', '1')
    })
  })

  it('preserves daily target after page reload', () => {
    // Arrange
    cy.get('.navbar-nav').get('a.nav-link').contains('All Activity').click()
    cy.get('button').contains('Set Target').click()
    cy.get('#allActivity .dropdown-menu').within(() => {
      cy.get('label').contains('Daily Target:').should('be.visible')
      cy.get('input').type('1')
    })

    // Act
    cy.reload()

    // Assert
    cy.get('.navbar-nav').get('a.nav-link').contains('All Activity').click()
    cy.get('button').contains('Set Target').click()
    cy.get('#allActivity .dropdown-menu').within(() => {
      cy.get('input').should('have.value', '1')
    })
  })

  it('preserves tag target after page reload', () => {
    // Arrange
    cy.get('button > svg.fa-plus').click()
    cy.get('input[placeholder="add new tag"]')
      .should('have.focus').type('My Tag Name{enter}')
    cy.get('#taskTags .tag.btn-group button').contains('My Tag Name').click()
    cy.get('button').contains('Set Target').click()
    cy.get('#tagActivity .dropdown-menu').within(() => {
      cy.get('label').contains('Daily Target:').should('be.visible')
      cy.get('input').type('1')
    })

    // Act
    cy.reload()

    // Assert
    cy.get('#taskTags .tag.btn-group button').contains('My Tag Name').click()
    cy.get('button').contains('Set Target').click()
    cy.get('#tagActivity .dropdown-menu').within(() => {
      cy.get('input').should('have.value', '1')
    })
  })
})
