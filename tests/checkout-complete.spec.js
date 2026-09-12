const { test, expect } = require("../fixtures/testFixtures");

test.beforeEach(async ({page,loginPage,productPage,cartPage,checkoutInfoPage,checkoutOverviewPage}) => {

    const expectedProduct = 'Sauce Labs Backpack';
    const firstName = 'Harshitha';
    const lastName = 'Veeravalli';
    const postalCode = "530001";

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    await productPage.addProductToCart(expectedProduct);
    await productPage.openCartPage();
    await cartPage.checkout();
    await checkoutInfoPage.fillCheckoutInfo(firstName, lastName, postalCode);

    await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-two.html");

    await checkoutOverviewPage.finishButton.click();

});

test('TC_CHECKOUT_COMPLETION_001 - Verify order confirmation page and successful order completion message are displayed ', async ({ checkoutCompletePage }) => {
    await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
    await expect(checkoutCompletePage.completeText).toHaveText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
});


test('TC_CHECKOUT_COMPLETION_002 - Verify user can return to Products page after order completion', async ({ page,checkoutCompletePage }) => {
    await checkoutCompletePage.backButton.click();
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
});

