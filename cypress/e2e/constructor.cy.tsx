/**тут должны быть тесты 

 * Создание заказа:
Созданы моковые данные ответа на запрос данных пользователя.
Созданы моковые данные ответа на запрос создания заказа.
Подставляются моковые токены авторизации.
Собирается бургер.
Вызывается клик по кнопке «Оформить заказ».
Проверяется, что модальное окно открылось и номер заказа верный.
Закрывается модальное окно и проверяется успешность закрытия.
Проверяется, что конструктор пуст.
 * **/

//пример
describe('проверяем доступность приложения', function() {
  it('сервис должен быть доступен по адресу localhost:5173', function() {
      cy.visit('http://localhost:4000'); 
  });
});

beforeEach(() => {
  cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' })
  cy.visit('http://localhost:4000');
});

after(() => {
  cy.clearCookie('accessToken')
  cy.window().then((win) => {
    win.localStorage.removeItem('refreshToken')
  })
})

describe('проверяем работу модальных окон', () =>{
  it('открытие модального окна ингредиента', () => {  
    cy.modalIngredientOpen();

  });

  it('закрытие по клику на крестик', () => {
    cy.modalIngredientOpen();
    cy.get(`[data-cy='modalCloseBtn']`).click();
    cy.get('#modals').should('not.be.visible');
  });

  it('закрытие по клику на оверлей', () => {
    cy.modalIngredientOpen();
    cy.get(`[data-cy='modal-overlay']`).click({force: true})
    cy.get('#modals').should('not.be.visible');
  });
});

describe('проверяем добавление ингредиента из списка в конструктор', () =>{
  it('добавление булок и 2 ингридиентов в конструктор', () => {
       cy.addBunInConstructor();
       cy.addMainInConstructor();
  });
});

describe('проверяем создание заказа', () =>{
  it('создаем заказ', () => {
    cy.login()
    cy.addBunInConstructor();
    cy.addMainInConstructor();
    cy.get('button:contains("Оформить заказ")').click();
    cy.openOrderModal();
    cy.get(`[data-cy='modalCloseBtn']`).click();
    cy.get('#modals').should('not.be.visible');
    cy.get(`[data-cy='bun-constructor-container-top']`).should('not.be.exist');
    cy.get(`[data-cy='bun-constructor-container-bottom']`).should('not.be.exist');
    cy.get(`[data-cy='main-constructor-container']`).contains('Выберите начинку');
  });
});
