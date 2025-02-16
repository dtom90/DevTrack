describe('edit tags', () => {
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

  it('should show tag in Tags menu', () => {
    // Arrange
    // (No specific arrangement needed for this test)

    // Act
    cy.get('.navbar-nav').get('a.nav-link').contains('Tags').click()

    // Assert
    cy.contains('.modal-dialog', 'Tags').within(() => {
      cy.get('.tag-button').contains(firstTagName)
    })
    cy.get('.btn-group > button.tag-name').contains(firstTagName)
  })

  it('should show tag in Tags menu even if removed from task', () => {
    // Arrange
    cy.get('#taskTags div.tag.btn-group button > svg.fa-times').click()

    // Act
    cy.get('.navbar-nav').get('a.nav-link').contains('Tags').click()

    // Assert
    cy.contains('.modal-dialog', 'Tags').within(() => {
      cy.get('.tag-button').contains(firstTagName)
    })
  })

  it('should show tag in Tags menu even if removed from task after refresh', () => {
    // Arrange
    cy.get('#taskTags div.tag.btn-group button > svg.fa-times').click()

    // Act
    cy.reload()

    // Assert
    cy.get('.navbar-nav').get('a.nav-link').contains('Tags').click()
    cy.contains('.modal-dialog', 'Tags').within(() => {
      cy.get('.tag-button').contains(firstTagName)
    })
  })

  it('should edit the tag name', () => {
    // Arrange
    cy.get('.navbar-nav').get('a.nav-link').contains('Tags').click()

    // Act
    cy.contains('.modal-dialog', 'Tags').within(() => {
      cy.get('.tag-button').contains(firstTagName).click()
      cy.get('#tag-menu input[title="Rename tag"]').type(' updated' + '{enter}')
    })

    // Assert
    cy.get('.btn-group > button.tag-name').contains(firstTagName + ' updated')
  })

  it('should reorder tags', () => {
    // Arrange
    cy.get('input[placeholder="add new tag"]')
      .should('have.focus').type(secondTagName + '{enter}')
    cy.get('.navbar-nav').get('a.nav-link').contains('Tags').click()

    // Act
    cy.contains('.modal-dialog', 'Tags').within(() => {
      // const firstElement = cy.get('.tag-button').contains(firstTagName).parents('.tag').find('.move-btn')
      cy.get('.tag-button').contains(secondTagName).parents('.tag').find('.move-btn')
        .drag('.move-btn', { destination: '.tag' })
    })
    
    // Assert
    cy.get('.btn-group > button.tag-name').first().contains(secondTagName)
    cy.get('.btn-group > button.tag-name').last().contains(firstTagName)
  })

  it('should reorder tags on task', () => {
    // Arrange
    cy.get('input[placeholder="add new tag"]')
      .should('have.focus').type(secondTagName + '{enter}')
    cy.get('.navbar-nav').get('a.nav-link').contains('Tags').click()

    // Act
    cy.contains('.modal-dialog', 'Tags').within(() => {
      // const firstElement = cy.get('.tag-button').contains(firstTagName).parents('.tag').find('.move-btn')
      cy.get('.tag-button').contains(secondTagName).parents('.tag').find('.move-btn')
        .drag('.move-btn', { destination: '.tag' })
      cy.get('button').contains('OK').click()
    })
    
    // Assert
    cy.get('#selected-task-container .btn-group > button.tag-name').first().contains(secondTagName)
    cy.get('#selected-task-container .btn-group > button.tag-name').last().contains(firstTagName)
  })
  
  it('should reorder 3 tags', () => {
    // Arrange
    const thirdTagName = 'my third tag'
    cy.get('input[placeholder="add new tag"]').should('have.focus').type(secondTagName + '{enter}')
    cy.get('input[placeholder="add new tag"]').should('have.focus').type(thirdTagName + '{enter}')
    cy.get('.navbar-nav').get('a.nav-link').contains('Tags').click()
    
    // Act
    cy.contains('.modal-dialog', 'Tags').within(() => {
      // const firstElement = cy.get('.tag-button').contains(firstTagName).parents('.tag').find('.move-btn')
      cy.get('.tag-button').contains(secondTagName).parents('.tag').find('.move-btn')
        .drag('.move-btn', { destination: '.tag' })
      
      // Assert
      cy.get('.tag').should('have.length', 3)
      cy.get('.tag').first().contains(secondTagName)
      cy.get('.tag').last().contains(thirdTagName)
    })
  })
  
  it('should reorder 3 tags after closing and re-opening', () => {
    // Arrange
    const thirdTagName = 'my third tag'
    cy.get('input[placeholder="add new tag"]').should('have.focus').type(secondTagName + '{enter}')
    cy.get('input[placeholder="add new tag"]').should('have.focus').type(thirdTagName + '{enter}')
    cy.get('.navbar-nav').get('a.nav-link').contains('Tags').click()
    cy.contains('.modal-dialog', 'Tags').get('button').contains('OK').click()
    cy.get('.navbar-nav').get('a.nav-link').contains('Tags').click()
    
    // Act
    cy.contains('.modal-dialog', 'Tags').within(() => {
      cy.get('.tag-button').contains(secondTagName).parents('.tag').find('.move-btn')
        .drag('.move-btn', { destination: '.tag' })
      
      // Assert
      cy.get('.tag').should('have.length', 3)
      cy.get('.tag').first().contains(secondTagName)
      cy.get('.tag').last().contains(thirdTagName)
    })
  })
})
