describe('delete tags', () => {
  const firstTagName = 'my first tag'
  const secondTagName = 'my second tag'

  beforeEach(() => {
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My First Task{enter}')
    cy.get('button > svg.fa-plus').click()
    cy.get('input[placeholder="add new tag"]')
      .should('have.focus').type(firstTagName + '{enter}')
  })

  it('removes the first tag', () => {
    // Arrange
    // (No specific arrangement needed for this test)

    // Act
    cy.get('#taskTags div.tag.btn-group button > svg.fa-times').click()

    // Assert
    cy.get('#taskTags').contains(firstTagName).should('not.exist')
  })

  it('removes the first tag of 2 tags, second remains', () => {
    // Arrange
    cy.get('input[placeholder="add new tag"]')
      .should('have.focus').type(secondTagName + '{enter}')

    // Act
    cy.get('#taskTags div.tag.btn-group button > svg.fa-times').first().click()

    // Assert
    cy.get('#taskTags').contains(firstTagName).should('not.exist')
    cy.get('#taskTags').contains(secondTagName).should('exist')
  })

  it('should keep tag removed on page reload', () => {
    // Arrange
    cy.get('#taskTags div.tag.btn-group button > svg.fa-times').click()

    // Act
    cy.reload()

    // Assert
    cy.get('#taskTags').contains(firstTagName).should('not.exist')
  })
  
  it('deletes tag from all tasks', () => {
    // Arrange
    cy.get('.navbar-nav').get('a.nav-link').contains('Tags').click()
    cy.contains('.modal-dialog', 'Tags').within(() => {
      cy.get('.tag-button').contains(firstTagName).click()
      
      // Act
      cy.get('button > svg.fa-trash-alt').click()
      
      // Assert
      cy.get('.tag-button').should('not.exist')
    })
    cy.get('#taskTags').contains(firstTagName).should('not.exist')
  })
})
