describe('create tags', () => {
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

  it('adds a tag to the first task', () => {
    // Arrange
    // (No specific arrangement needed for this test)

    // Act
    // (No specific action needed for this test)

    // Assert
    cy.get('#selected-task-container').within(() => {
      cy.get('div.tag > button.tag-name').contains(firstTagName).should('be.visible')
    })
  })

  it('adds a tag to the first task after reload', () => {
    // Arrange
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My Second Task{enter}')
    cy.reload()

    // Act
    cy.get('button > svg.fa-plus').click()
    cy.get('input[placeholder="add new tag"]')
      .should('have.focus').type(secondTagName + '{enter}')

    // Assert
    cy.get('#selected-task-container').within(() => {
      cy.get('div.tag > button.tag-name').contains(secondTagName).should('be.visible')
    })
  })

  it('selects previous tag to the second task', () => {
    // Arrange
    // (No specific arrangement needed for this test)

    // Act
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My Second Task{enter}')
    cy.get('button > svg.fa-plus').click()
    cy.get('#tagDropdownMenu > button').contains(firstTagName).click()

    // Assert
    cy.get('#selected-task-container').within(() => {
      cy.get('#tagDropdownMenu > button').should('not.exist')
      cy.get('div.tag > button.tag-name').contains(firstTagName).should('be.visible')
    })
  })

  it('adds a second tag to the first task', () => {
    // Arrange
    // (No specific arrangement needed for this test)

    // Act
    cy.get('input[placeholder="add new tag"]')
      .should('have.focus').type(secondTagName + '{enter}')

    // Assert
    cy.get('#selected-task-container').within(() => {
      cy.get('div.tag > button.tag-name').contains(firstTagName)
      cy.get('div.tag > button.tag-name').contains(secondTagName)
    })
  })

  it('clicks the Tags button to show the Tags Modal', () => {
    // Arrange
    cy.get('input[placeholder="add new tag"]')
      .should('have.focus').type(secondTagName + '{enter}')

    // Act
    cy.get('nav.navbar').get('a.nav-link').contains('Tags').click()

    // Assert
    cy.get('div.modal-dialog').contains('Tags')
    cy.get('div.modal-dialog').within(() => {
      cy.get('div.tag.btn-toolbar').eq(0).contains(firstTagName)
      cy.get('div.tag.btn-toolbar').eq(1).contains(secondTagName)
    })
  })

  it('clicks the Tag button to show the Tag Activity Modal', () => {
    // Act
    cy.get('#selected-task-container').within(() => {
      cy.get('div.tag > button.tag-name').contains(firstTagName).click()
    })

    // Assert
    cy.get('#activityModal').contains(firstTagName).should('be.visible')
  })

  it('drags one task above the other in the Tags Modal', () => {
    // Arrange
    cy.get('input[placeholder="add new tag"]').should('have.focus').type(secondTagName + '{enter}')
    cy.get('nav.navbar').get('a.nav-link').contains('Tags').click()

    // Act
    cy.get('div.modal-dialog').within(() => {
      cy.get('div.tag.btn-toolbar').contains(secondTagName)
        .closest('.btn-toolbar').drag('button.move-btn')
    })

    // Assert
    cy.get('div.tag.btn-toolbar').eq(0).contains(secondTagName)
    cy.get('div.tag.btn-toolbar').eq(1).contains(firstTagName)
  })

  it('creates a second task then filters on tag', () => {
    // Arrange
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My Second Task{enter}')

    // Act
    cy.get('button > svg.fa-filter').click()
    cy.get('.dropdown-menu').contains(firstTagName).click()

    // Assert
    cy.get('#incomplete-task-list').contains('My First Task')
    cy.get('#incomplete-task-list').should('not.contain', 'My Second Task')
  })

  it('adds tag to new task when filtering on tag', () => {
    // Arrange
    cy.get('button > svg.fa-filter').click()
    cy.get('.dropdown-menu').contains(firstTagName).click()

    // Act
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My Second Task{enter}')

    // Assert
    cy.get('#incomplete-task-list').contains('My Second Task')
    cy.get('#selected-task-container').within(() => {
      cy.get('div.tag > button.tag-name').contains(firstTagName).should('be.visible')
    })
  })

  it('removes then adds tag again, should have only one tag after reload', () => {
    // Arrange
    cy.get('button > svg.fa-filter').click()
    cy.get('.dropdown-menu').contains(firstTagName).click()
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My Second Task{enter}')

    // Act
    cy.get('#taskTags div.tag.btn-group button > svg.fa-times').click()
    cy.get('button > svg.fa-plus').click()
    cy.get('#tagDropdownMenu > button').contains(firstTagName).click()
    cy.reload()

    // Assert
    cy.get('#incomplete-task-list').contains('My Second Task')
    cy.get('#selected-task-container').within(() => {
      cy.get('div.tag > button.tag-name').contains(firstTagName).should('be.visible')
    })
  })

  it('adds then removes tag from filter, new task should not have tag', () => {
    // Arrange
    cy.get('button > svg.fa-filter').click()
    cy.get('.dropdown-menu').contains(firstTagName).click()
    cy.get('.dropdown-menu div.tag.btn-group button > svg.fa-times').click()

    // Act
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My Second Task{enter}')

    // Assert
    cy.get('#selected-task-container').within(() => {
      cy.get('#task-name').contains('My Second Task')
      cy.get('div.tag > button.tag-name').should('not.exist')
    })
  })
})
