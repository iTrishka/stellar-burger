namespace Cypress {
  interface Chainable {
    modalIngredientOpen(): Chainable<void>;
    addBunInConstructor(): Chainable<void>;
    addMainInConstructor(): Chainable<void>;
    login(): Chainable<void>;
    openOrderModal(): Chainable<void>;
  }
}
