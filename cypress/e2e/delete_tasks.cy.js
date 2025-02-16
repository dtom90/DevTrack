describe('delete tasks', () => {
  beforeEach(() => {
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My First Task{enter}')
  })
  
  it('does not contain a delete button', () => {
    // Act
    cy.get('button > svg.fa-ellipsis-v').click()
    
    // Assert
    cy.get('button').contains('Delete').should('not.exist')
  })
  
  // it('deletes an incomplete task', async () => {
  //   // Arrange
  //   let confirmDialogTriggered = false
  //   cy.on('window:confirm', (str) => {
  //     confirmDialogTriggered = true
  //     expect(str).to.equal('Are you sure you want to delete task My First Task? the task is not yet complete!')
  //     return true
  //   })
  //
  //   // Act
  //   cy.get('button > svg.fa-ellipsis-v').click()
  //   await Cypress.Promise.resolve(cy.get('button').contains('Delete').click())
  //
  //   // Assert
  //   expect(confirmDialogTriggered).to.be.true
  //   cy.get('#incomplete-task-list').contains('My First Task').should('not.exist')
  // })
  //
  // it('completes a task then deletes it', async () => {
  //   // Arrange
  //   let confirmDialogTriggered = false
  //   cy.on('window:confirm', () => {
  //     confirmDialogTriggered = true
  //   })
  //   cy.get('#selected-task-container input[type="checkbox"][title="Mark task complete"]').click()
  //
  //   // Act
  //   cy.get('button > svg.fa-ellipsis-v').click()
  //   await Cypress.Promise.resolve(cy.get('button').contains('Delete').click())
  //
  //   // Assert
  //   expect(confirmDialogTriggered).to.be.false
  //   cy.get('#completed-task-list').contains('My First Task').should('not.exist')
  // })
  //
  // it('deletes multiple tasks', async () => {
  //   // Arrange
  //   let confirmDialogTriggered = false
  //   cy.on('window:confirm', (str) => {
  //     confirmDialogTriggered = true
  //     expect(str).to.equal('Are you sure that you want to delete all 2 completed tasks?')
  //     return true
  //   })
  //   cy.get('#selected-task-container input[type="checkbox"][title="Mark task complete"]').click()
  //   cy.get('input[placeholder="enter new task"]')
  //     .click()
  //     .type('My Second Task{enter}')
  //   cy.get('#selected-task-container input[type="checkbox"][title="Mark task complete"]').click()
  //
  //   // Act
  //   cy.get('button > svg.fa-caret-down').click()
  //   await Cypress.Promise.resolve(cy.get('button').contains('Delete All').click())
  //
  //   // Assert
  //   expect(confirmDialogTriggered).to.be.true
  //   cy.get('#completed-task-list').contains('My First Task').should('not.exist')
  //   cy.get('#completed-task-list').contains('My Second Task').should('not.exist')
  // })
})
