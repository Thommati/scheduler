describe('Appointments', () => {
  beforeEach(() => {
    // api server command to reset db
    cy.request('get', '/api/debug/reset');

    cy.visit('/');
    cy.contains('Monday');
  });

  it('should book an interview', () => {
    cy.get('[alt=Add]').first().click();

    cy.get('[data-testid=student-name-input]').type('Lydia Miller-Jones');

    cy.get('[alt="Sylvia Palmer"]').click();

    cy.contains('Save').click();

    cy.contains('.appointment__card--show', 'Lydia Miller-Jones');
    cy.contains('.appointment__card--show', 'Sylvia Palmer');
  });
});