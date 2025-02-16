describe('create tasks', () => {
  beforeEach(() => {
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My First Task{enter}')
  })

  it('creates a task', () => {
    // Arrange
    // (No specific arrangement needed for this test)

    // Act
    // (No specific action needed for this test)

    // Assert
    cy.contains('#incomplete-task-list .task', 'My First Task').should('have.length', 1)
    cy.get('#main-section').contains('My First Task')
    cy.get('#main-section').contains('Tags:')
    cy.get('#main-section').contains('Notes:')
    cy.get('#main-section').contains('25:00')
  })

  it('completes the task by checking middle section', () => {
    // Arrange
    // (No specific arrangement needed for this test)

    // Act
    cy.get('#selected-task-container input[type="checkbox"][title="Mark task complete"]').click()

    // Assert
    cy.get('#completed-task-list').contains('My First Task')
  })

  it('completes the task by checking incomplete list', () => {
    // Arrange
    // (No specific arrangement needed for this test)

    // Act
    cy.get('#incomplete-task-list input[type="checkbox"][title="Mark task complete"]').click()

    // Assert
    cy.get('#completed-task-list').contains('My First Task')
  })

  it('adds a second task to the bottom of the list', () => {
    // Arrange
    // (No specific arrangement needed for this test)

    // Act
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My Second Task{enter}')

    // Assert
    cy.get('#incomplete-task-list .task').first().contains('My First Task')
    cy.get('#incomplete-task-list .task').last().contains('My Second Task')
  })

  it('adds a second task to the top of the list when toggling insert order', () => {
    // Arrange
    // (No specific arrangement needed for this test)

    // Act
    cy.get('button[title="Adding tasks to bottom of list"]').click()
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My Second Task{enter}')

    // Assert
    cy.get('#incomplete-task-list .task').first().contains('My Second Task')
    cy.get('#incomplete-task-list .task').last().contains('My First Task')
  })

  it('completes both tasks', () => {
    // Arrange
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My Second Task{enter}')

    // Act
    cy.get('#incomplete-task-list input[type="checkbox"][title="Mark task complete"]').first().click()
    cy.get('#incomplete-task-list input[type="checkbox"][title="Mark task complete"]').first().click()

    // Assert
    cy.get('#completed-task-list .task').first().contains('My Second Task')
    cy.get('#completed-task-list .task').last().contains('My First Task')
  })

  it('swaps order of completed tasks', () => {
    // Arrange
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My Second Task{enter}')
    cy.get('#incomplete-task-list input[type="checkbox"][title="Mark task complete"]').first().click()
    cy.get('#incomplete-task-list input[type="checkbox"][title="Mark task complete"]').first().click()

    // Act
    cy.get('button > svg.fa-caret-down').click()
    cy.get('select').select('Oldest')

    // Assert
    cy.get('#completed-task-list .task').first().contains('My First Task')
    cy.get('#completed-task-list .task').last().contains('My Second Task')
  })
})
