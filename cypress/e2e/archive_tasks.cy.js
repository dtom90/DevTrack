describe('create tasks', () => {
  beforeEach(() => {
    // Arrange
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My First Task{enter}')
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My Second Task{enter}')
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My Incomplete Task{enter}')
    cy.get('#incomplete-task-list input[type="checkbox"][title="Mark task complete"]').first().click()
    cy.get('#incomplete-task-list input[type="checkbox"][title="Mark task complete"]').first().click()
  })

  it('archives a single task', () => {
    // Act
    cy.get('button > svg.fa-ellipsis-v').click()
    cy.get('button').contains('Archive').click()

    // Assert
    cy.get('#completed-task-list').contains('My Second Task').should('not.exist')
    cy.get('#main-section').contains('Archived')
  })

  it('unarchives a single task', () => {
    // Act
    cy.get('button > svg.fa-ellipsis-v').click()
    cy.get('button').contains('Archive').click()
    cy.get('button').contains('Unarchive').click()

    // Assert
    cy.get('#completed-task-list').contains('My Second Task').should('exist')
    cy.get('#main-section').contains('Archived').should('not.exist')
  })

  it('archives the completed tasks, hiding them from the list', () => {
    // Act
    cy.get('button > svg.fa-caret-down').click()
    cy.get('button').contains('Archive All').click()
    cy.on('window:confirm', (str) => {
      expect(str).to.equal('Are you sure that you want to archive all 2 completed tasks?')
      return true
    })

    // Assert
    cy.reload()
    cy.get('#completed-task-list .task').should('not.exist')
  })
  
  it('archives only visible completed tasks when filtering', () => {
    // Arrange
    cy.get('button > svg.fa-plus').click()
    cy.get('input[placeholder="add new tag"]')
      .should('have.focus').type('my tag' + '{enter}')
    cy.get('button > svg.fa-filter').click()
    cy.contains('.dropdown-menu', 'Filter on:').within(() => {
      cy.contains('button', 'my tag').click()
    })
    
    // Act
    cy.get('button > svg.fa-caret-down').click()
    cy.get('button').contains('Archive All').click()
    
    // Assert
    cy.get('button > svg.fa-filter').click()
    cy.contains('.dropdown-menu', 'Filtering on tasks with:').within(() => {
      cy.get('button > svg.fa-times').click()
    })
    cy.get('#completed-task-list .task').should('have.length', 1)
  })

  it('hides an incomplete archived task from the list', () => {
    // Act
    cy.get('#incomplete-task-list').contains('My Incomplete Task').click()
    cy.get('button > svg.fa-ellipsis-v').click()
    cy.get('button').contains('Archive').click()

    // Assert
    cy.get('#incomplete-task-list').contains('My Incomplete Task').should('not.exist')
    cy.get('#main-section').contains('Archived')
  })

  it('shows archived tasks on checking filter', () => {
    // Act
    cy.get('button > svg.fa-ellipsis-v').click()
    cy.get('button').contains('Archive').click()
    cy.get('button > svg.fa-caret-down').click()
    cy.get('button').contains('Archive All').click()
    cy.on('window:confirm', (str) => {
      expect(str).to.equal('Are you sure that you want to archive all 2 completed tasks?')
      return true
    })

    // Assert
    cy.contains('label', 'Show archived').click()
    cy.get('#incomplete-task-list').contains('My Incomplete Task').should('exist')
    cy.get('#completed-task-list').contains('My First Task').should('exist')
    cy.get('#completed-task-list').contains('My Second Task').should('exist')
  })
})
