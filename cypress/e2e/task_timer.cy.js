describe('task timer', () => {
  beforeEach(() => {
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My First Task{enter}')
  })

  it('starts a task timer and creates log', () => {
    // Arrange
    cy.get('button').contains('Activity Log').click()

    // Act
    cy.get('button > svg.fa-play').click()

    // Assert
    cy.get('#task-log table').within(() => {
      cy.get('td').contains('Started')
      cy.get('td').contains('Running')
      cy.get('td').contains('Time Spent')
    })
  })

  it('starts a task timer and creates log even after reload', () => {
    // Arrange
    cy.reload()
    cy.get('button').contains('Activity Log').click()

    // Act
    cy.get('button > svg.fa-play').click()

    // Assert
    cy.get('#task-log table').within(() => {
      cy.get('td').contains('Started')
      cy.get('td').contains('Running')
      cy.get('td').contains('Time Spent')
    })
  })

  it('stops a task timer and updates log', () => {
    // Arrange
    cy.get('button > svg.fa-play').click()
    cy.get('button').contains('Activity Log').click()

    // Act
    cy.get('button > svg.fa-pause').click()

    // Assert
    cy.get('#task-log table').within(() => {
      cy.get('td').contains('Started')
      cy.get('td').contains('Stopped')
      cy.get('td').contains('Time Spent')
    })
  })

  it('stops then starts again, creating 2 separate logs', () => {
    // Arrange
    cy.get('button > svg.fa-play').click()
    cy.get('button').contains('Activity Log').click()

    // Act
    cy.get('button > svg.fa-pause').click()
    cy.get('button > svg.fa-play').click()

    // Assert
    cy.get('#task-log table').within(() => {
      cy.get('tr').first().within(() => {
        cy.get('td').contains('Started')
        cy.get('td').contains('Running')
        cy.get('td').contains('Time Spent')
      })
      cy.get('tr').last().within(() => {
        cy.get('td').contains('Started')
        cy.get('td').contains('Stopped')
        cy.get('td').contains('Time Spent')
      })
    })
  })

  it('starts then switches to another task, timer continues', () => {
    // Arrange
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My Second Task{enter}')
    cy.get('button').contains('Activity Log').click()
    cy.get('button > svg.fa-play').click()

    // Act
    cy.get('#incomplete-task-list').contains('My First Task').click()
    cy.get('button[title="Continue Timer Here"] > svg.fa-play').click()

    // Assert
    cy.get('#task-log table').within(() => {
      cy.get('td').contains('Started')
      cy.get('td').contains('Running')
      cy.get('td').contains('Time Spent')
    })
  })

  it('starts then switches to another task, log on previous task stops', () => {
    // Arrange
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My Second Task{enter}')
    cy.get('button').contains('Activity Log').click()
    cy.get('button > svg.fa-play').click()

    // Act
    cy.get('#incomplete-task-list').contains('My First Task').click()
    cy.get('button[title="Continue Timer Here"] > svg.fa-play').click()

    // Assert
    cy.get('#incomplete-task-list').contains('My Second Task').click()
    cy.get('#task-log table').within(() => {
      cy.get('td').contains('Started')
      cy.get('td').contains('Stopped')
      cy.get('td').contains('Time Spent')
    })
  })

  it('sets timer to 3 seconds then starts timer, should count all the way down', () => {
    // Arrange
    cy.get('div').contains('25:00').click()
    cy.get('#countdown-container input[type="number"]:visible').clear().type('0.05{enter}')

    // Act
    cy.get('button > svg.fa-play').click()

    // Assert
    cy.get('button > svg.fa-pause')
    cy.get('#countdown-container').contains('0:03')
    cy.get('#countdown-container').contains('0:02')
    cy.get('#countdown-container').contains('0:01')

    cy.get('#countdown-container').contains('5:00')
    cy.get('button > svg.fa-play')
  })

  it('break timer to 3 seconds then starts timer, should count all the way down', () => {
    // Arrange
    cy.get('button > svg.fa-times').click()
    cy.get('div').contains('5:00').click()
    cy.get('#countdown-container input[type="number"]:visible').clear().type('0.05{enter}')

    // Act
    cy.get('button > svg.fa-play').click()

    // Assert
    cy.get('button > svg.fa-pause')
    cy.get('#countdown-container').contains('0:03')
    cy.get('#countdown-container').contains('0:02')
    cy.get('#countdown-container').contains('0:01')

    cy.get('#countdown-container').contains('5:00')
    cy.get('button > svg.fa-play')
  })

  it('should continue timer when selected', () => {
    // Arrange
    cy.get('div').contains('25:00').click()
    cy.get('#countdown-container input[type="number"]:visible').clear().type('0.05{enter}')
    cy.get('button > svg.fa-cog').click()
    cy.get('.form-check').contains('Continue Timer when Interval Complete').click()

    // Act
    cy.get('button > svg.fa-play').click()

    // Assert
    cy.get('#countdown-container').contains('0:03')
    cy.get('#countdown-container').contains('0:02')
    cy.get('#countdown-container').contains('0:01')
    cy.get('#countdown-container').contains('+0:00')
    cy.get('#countdown-container').contains('+0:01')
    cy.get('#countdown-container').contains('+0:02')
    cy.get('#countdown-container').contains('+0:03')
  })

  it('on refresh, task interval should be stopped', () => {
    // Arrange
    cy.get('div').contains('25:00').click()
    cy.get('#countdown-container input[type="number"]:visible').clear().type('0.1{enter}')
    cy.get('button > svg.fa-cog').click()
    cy.get('.form-check').contains('Continue Timer when Interval Complete').click()
    cy.get('button > svg.fa-play').click()
    cy.get('#countdown-container').contains('0:06')
    cy.get('#countdown-container').contains('0:05')
    cy.get('#countdown-container').contains('0:04')
    cy.get('#countdown-container').contains('0:03')

    // Act
    cy.reload()

    // Assert
    cy.get('button').contains('Activity Log').click()
    cy.get('tr').last().within(() => {
      cy.get('td').contains('Stopped')
    })
  })

  it('should stop timer when task completed', () => {
    // Arrange
    cy.get('div').contains('25:00').click()
    cy.get('#countdown-container input[type="number"]:visible').clear().type('0.05{enter}')
    cy.get('button > svg.fa-cog').click()
    cy.get('.form-check').contains('Continue Timer when Interval Complete').click()
    cy.get('button').contains('Activity Log').click()
    cy.get('button > svg.fa-play').click()
    cy.get('#countdown-container').contains('0:03')
    cy.get('#countdown-container').contains('0:02')

    // Act
    cy.get('#incomplete-task-list input[type="checkbox"][title="Mark task complete"]').click()

    // Assert
    cy.get('tr').last().within(() => {
      cy.get('td').contains('Stopped')
    })
  })

  it('should stop timer when task completed and not continue next task', () => {
    // Arrange
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My Second Task{enter}')
    cy.get('div').contains('25:00').click()
    cy.get('#countdown-container input[type="number"]:visible').clear().type('0.05{enter}')
    cy.get('button > svg.fa-cog').click()
    cy.get('.form-check').contains('Continue Timer when Interval Complete').click()
    cy.get('button').contains('Activity Log').click()
    cy.get('button > svg.fa-play').click()
    cy.get('#countdown-container').contains('0:03')
    cy.get('#countdown-container').contains('0:02')

    // Act
    cy.get('#incomplete-task-list input[type="checkbox"][title="Mark task complete"]').last().click()

    // Assert
    cy.get('#incomplete-task-list .task').click()
    cy.get('button#active-task-container').should('not.exist')
    cy.get('#timer-display').scrollIntoView()
    cy.get('#countdown-container').contains('0:02').should('be.visible')
    cy.wait(2000)
    cy.get('button > svg.fa-play').should('be.visible')
    cy.get('#countdown-container').contains('0:02').should('be.visible')
  })

  it('should reset timer when task completed during overtime', () => {
    // Arrange
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My Second Task{enter}')
    cy.get('div').contains('25:00').click()
    cy.get('#countdown-container input[type="number"]:visible').clear().type('0.05{enter}')
    cy.get('button > svg.fa-cog').click()
    cy.get('.form-check').contains('Continue Timer when Interval Complete').click()
    cy.get('button').contains('Activity Log').click()
    cy.get('button > svg.fa-play').click()
    cy.get('#countdown-container').contains('0:03')
    cy.get('#countdown-container').contains('0:02')
    cy.get('#countdown-container').contains('0:01')
    cy.get('#countdown-container').contains('+0:00')
    cy.get('#countdown-container').contains('+0:01')

    // Act
    cy.get('#incomplete-task-list input[type="checkbox"][title="Mark task complete"]').last().click()

    // Assert
    cy.get('#incomplete-task-list .task').click()
    cy.get('button#active-task-container').should('not.exist')
    cy.get('#timer-display').scrollIntoView()
    cy.get('#countdown-container').contains('5:00').should('be.visible')
    cy.get('button > svg.fa-play').should('be.visible')
  })
  
  it('should order All Activity log in chronological order', () => {
    // Arrange
    cy.get('input[placeholder="enter new task"]')
      .click()
      .type('My Second Task{enter}')
    cy.get('#incomplete-task-list .task').first().click()
    cy.get('div').contains('25:00').click()
    cy.get('#countdown-container input[type="number"]:visible').clear().type('0.05{enter}')

    // Act
    cy.get('button > svg.fa-play').click()
    cy.get('#countdown-container').contains('0:03')
    cy.get('#countdown-container').contains('0:02')
    cy.get('#incomplete-task-list input[type="checkbox"][title="Mark task complete"]').first().click()
    cy.get('#incomplete-task-list .task').first().click()
    cy.get('button > svg.fa-play').click()
    cy.get('#countdown-container').contains('0:02')
    cy.get('#countdown-container').contains('0:01')
    cy.get('#incomplete-task-list input[type="checkbox"][title="Mark task complete"]').first().click()
    
    // Assert
    cy.get('.navbar-nav').get('a.nav-link').contains('All Activity').click()
    cy.get('#allActivityModal').within(() => {
      cy.get('button').contains('Activity Log').click()
      cy.get('tr').eq(0).contains('My Second Task')
      cy.get('tr').eq(0).contains('Completed')
      cy.get('tr').eq(1).contains('My Second Task')
      cy.get('tr').eq(1).contains('Started')
      cy.get('tr').eq(2).contains('My First Task')
      cy.get('tr').eq(2).contains('Completed')
      cy.get('tr').eq(3).contains('My First Task')
      cy.get('tr').eq(3).contains('Started')
    })
  })
  
  it('skips timer goes to break', () => {
    // Arrange
    cy.get('#timer-display').contains('25:00')
    
    // Act
    cy.get('button[title="Skip current interval"] > svg.fa-times').click()
    
    // Assert
    cy.get('#timer-display').contains('5:00')
  })
  
  it('skips timer twice, goes to back to active timer', () => {
    // Arrange
    cy.get('#timer-display').contains('25:00')
    
    // Act
    cy.get('button[title="Skip current interval"] > svg.fa-times').click()
    cy.get('button[title="Skip current interval"] > svg.fa-times').click()
    
    // Assert
    cy.get('#timer-display').contains('25:00')
  })
  
  it('skips timer during interval, should stop log', () => {
    // Arrange
    cy.get('button').contains('Activity Log').click()
    cy.get('div').contains('25:00').click()
    cy.get('#countdown-container input[type="number"]:visible').clear().type('0.1{enter}')
    cy.get('button > svg.fa-play').click()
    cy.get('#countdown-container').contains('0:05')
    cy.get('#countdown-container').contains('0:04')
    cy.get('#countdown-container').contains('0:03')
    
    // Act
    cy.get('button[title="Skip current interval"] > svg.fa-times').click()
    
    // Assert
    cy.get('#timer-display').contains('5:00')
    cy.get('#task-log table').within(() => {
      cy.get('td').contains('Stopped')
    })
  })
})
