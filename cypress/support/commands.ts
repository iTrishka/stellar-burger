/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }


// Cypress.Commands.add('login', (username, password) => {
//   cy.visit('/login');
//   cy.get('#username').type(username);
//   cy.get('#password').type(password);
//   cy.get('#login-button').click();
// });


Cypress.Commands.add('modalIngredientOpen', () => {
  const cardIngredient = cy.get(`[data-cy='ingredient1']`);
  cardIngredient.click();
  cy.get('#modals').should('contain', 'Детали ингредиента'); 
})

Cypress.Commands.add('addBunInConstructor', () => {
  const bunIngredientAddBtn = cy.get('li:contains("Краторная булка N-200i")').first().find('button').contains("Добавить");
  bunIngredientAddBtn.click();
  cy.get(`[data-cy='bun-constructor-container-top']`).should('be.visible').contains('Краторная булка N-200i')
  cy.get(`[data-cy='bun-constructor-container-bottom']`).should('be.visible').contains('Краторная булка N-200i')
})

Cypress.Commands.add('addMainInConstructor', () => {
  const mainIngredientAddBtn = cy.get('li:contains("Филе Люминесцентного тетраодонтимформа")').first().find('button').contains("Добавить");
  mainIngredientAddBtn.click();
  cy.get(`[data-cy='main-constructor-container']`).should('be.visible').contains('Филе Люминесцентного тетраодонтимформа')
})

Cypress.Commands.add('login', () => {
  cy.intercept('POST', 'https://norma.nomoreparties.space/api/auth/login', { fixture: 'user.json' })
  cy.visit('http://localhost:4000/login');
  cy.get('input[name="email"]').type('test@yandex.ru'); 
  cy.get('input[name="password"]').type('1111'); 
  cy.get('button[type="submit"]').click(); 
})

Cypress.Commands.add('openOrderModal', () => {
  cy.intercept('POST', 'https://norma.nomoreparties.space/api/orders', { fixture: 'order.json' })
  cy.get('#modals').should('contain', 'идентификатор заказа'); 
  cy.get('#modals').should('contain', '2222'); 
})



