const { test, expect } = require("../fixtures/testFixtures");
const checkoutValidationData = require('../test-data/checkoutValidationData');

const PRODUCT = 'Sauce Labs Backpack';

test.beforeEach(async ({ loginPage, productPage, cartPage }) => {

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    await productPage.addProductToCart(PRODUCT);
    await productPage.openCartPage();

    await expect(cartPage.getCartItemByName(PRODUCT)).toHaveCount(1);

    await cartPage.checkout();
});

test('TC_CHECKOUT_INFO_001 - Verify user can navigate to the Checkout Information page', async ({ page }) => {

    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
});

test('TC_CHECKOUT_INFO_002 - Verify Checkout Information page displays required fields and controls', async ({ checkoutInfoPage }) => {

    await expect(checkoutInfoPage.firstName).toBeVisible();
    await expect(checkoutInfoPage.lastName).toBeVisible();
    await expect(checkoutInfoPage.postalCode).toBeVisible();
    await expect(checkoutInfoPage.continueButton).toBeVisible();
    await expect(checkoutInfoPage.cancelButton).toBeVisible();
});

test('TC_CHECKOUT_INFO_003 - Verify user can enter valid customer information', async ({ page, checkoutInfoPage }) => {

    await checkoutInfoPage.fillCheckoutInfo('Harshitha', 'Veeravalli', '530001');

    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
});

for (const data of checkoutValidationData) {

    test(data.testName, async ({ checkoutInfoPage }) => {

        await checkoutInfoPage.fillCheckoutInfo(
            data.firstName,
            data.lastName,
            data.postalCode
        );

        await expect(checkoutInfoPage.errorMessage).toHaveText(data.errorMessage);
    });
}


test('TC_CHECKOUT_INFO_007 - Verify Cancel button returns user to the Cart page', async ({ page, checkoutInfoPage }) => {

    await checkoutInfoPage.cancelButton.click();

    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
});