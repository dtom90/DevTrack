describe('interval updates', () => {
  beforeEach(() => {
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My First Task{enter}')
  })
  
  it('should display start and end times in manual interval panel', () => {
    // Arrange
    cy.get('button').contains('Activity Log').click()

    // Act
    cy.get('.activity-view button > svg.fa-plus').click()

    // Assert
    cy.get('#add-interval-dropdown .dropdown-menu').within(() => {
      cy.get('fieldset').contains('Started:')
      cy.get('fieldset').contains('Duration:')
      cy.get('fieldset').contains('Stopped:')
    })
  })

  it('should manually add an interval', () => {
    // Arrange
    cy.get('button').contains('Activity Log').click()

    // Act
    cy.get('.activity-view button > svg.fa-plus').click()
    cy.get('.activity-view button').contains('Add Interval').click()

    // Assert
    cy.get('tr').last().within(() => {
      cy.get('td').contains('Time Spent: 25 minutes')
    })
  })

  it('should not alter timer after adding interval', () => {
    // Arrange
    cy.get('button').contains('Activity Log').click()

    // Act
    cy.get('.activity-view button > svg.fa-plus').click()
    cy.get('.activity-view button').contains('Add Interval').click()

    // Assert
    cy.get('#countdown-container button > svg.fa-play').should('exist')
  })

  it('should keep running interval at top when manually adding during running interval', () => {
    // Arrange
    cy.get('#countdown-container button > svg.fa-play').click()
    cy.get('button').contains('Activity Log').click()
    
    // Act
    cy.get('.activity-view button > svg.fa-plus').click()
    cy.get('.activity-view button').contains('Add Interval').click()
    
    // Assert
    cy.get('.activity-view tr').first().within(() => {
      cy.get('td').contains('Running')
    })
    cy.get('.activity-view tr').last().within(() => {
      cy.get('td').contains('Stopped')
    })
  })

  it('should manually delete an interval', () => {
    // Arrange
    cy.get('button').contains('Activity Log').click()
    cy.get('.activity-view button > svg.fa-plus').click()
    cy.get('.activity-view button').contains('Add Interval').click()

    // Act
    cy.get('tr').last().within(() => {
      cy.get('button > svg.fa-ellipsis-v').click()
      cy.get('button').contains('Delete Interval').click()
    })

    // Assert
    cy.get('.activity-view tr').should('not.exist')
  })

  it('should manually delete an interval after page reload', () => {
    // Arrange
    cy.get('button').contains('Activity Log').click()
    cy.get('.activity-view button > svg.fa-plus').click()
    cy.get('.activity-view button').contains('Add Interval').click()
    cy.reload()
    cy.get('button').contains('Activity Log').click()

    // Act
    cy.get('tr').last().within(() => {
      cy.get('button > svg.fa-ellipsis-v').click()
      cy.get('button').contains('Delete Interval').click()
    })

    // Assert
    cy.get('.activity-view tr').should('not.exist')
  })
})
