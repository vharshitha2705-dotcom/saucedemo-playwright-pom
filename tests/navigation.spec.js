const { test, expect } = require('../fixtures/testFixtures');

const BASE_URL = 'https://www.saucedemo.com';
const STANDARD_USER = 'standard_user';
const PASSWORD = 'secret_sauce';

test.describe('Navigation Integrity', () => {

    test.beforeEach(async ({ page, loginPage }) => {
        await page.goto(BASE_URL);
        await loginPage.login(STANDARD_USER, PASSWORD);
    });

    test('TC_NAV_001 - Verify direct URL access to Checkout Step Two without completing Step One shows no valid order data', async ({ page }) => {
        await page.goto(`${BASE_URL}/checkout-step-two.html`);
        await expect(page.locator('.cart_item')).toHaveCount(0);
    });

    test('TC_NAV_002 - Verify cart badge count persists correctly across navigation', async ({ page, productPage, productDetailPage, cartPage }) => {
        await productPage.addProductToCart('Sauce Labs Backpack');

        let badgeCount = await productPage.getCartBadgeCount();
        expect(badgeCount).toBe(1); 

        await productPage.openProductDetails('Sauce Labs Bike Light');
        await productDetailPage.addProductToCart();

        badgeCount = await productPage.getCartBadgeCount();
        expect(badgeCount).toBe(2);

        await page.goto(`${BASE_URL}/cart.html`);
        badgeCount = await productPage.getCartBadgeCount();
        expect(badgeCount).toBe(2);

        await page.goBack();
        badgeCount = await productPage.getCartBadgeCount();
        expect(badgeCount).toBe(2);
    });

});