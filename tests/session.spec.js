const { test, expect } = require('../fixtures/testFixtures');

const BASE_URL = 'https://www.saucedemo.com';
const STANDARD_USER = 'standard_user';
const PASSWORD = 'secret_sauce';

test.describe('Session Management', () => {

    test('TC_SESSION_001 - Verify direct URL access to Inventory page without login redirects to Login page', async ({ page }) => {
        await page.goto(`${BASE_URL}/inventory.html`);
        await expect(page).toHaveURL(`${BASE_URL}/`);
    });

    test('TC_SESSION_002 - Verify direct URL access to Cart page without login redirects to Login page', async ({ page }) => {
        await page.goto(`${BASE_URL}/cart.html`);
        await expect(page).toHaveURL(`${BASE_URL}/`);
    });

    test('TC_SESSION_003 - Verify direct URL access to Checkout Step One without login redirects to Login page', async ({ page }) => {
        await page.goto(`${BASE_URL}/checkout-step-one.html`);
        await expect(page).toHaveURL(`${BASE_URL}/`);
    });

    test('TC_SESSION_004 - Verify direct URL access to Inventory page after logout redirects to Login page', async ({ page, loginPage, menuPage }) => {
        await page.goto(BASE_URL);
        await loginPage.login(STANDARD_USER, PASSWORD);

        await menuPage.openMenu();
        await menuPage.clickMenuItem('Logout');
        await expect(page).toHaveURL(`${BASE_URL}/`);

        await page.goto(`${BASE_URL}/inventory.html`);
        await expect(page).toHaveURL(`${BASE_URL}/`);
    });

    test('TC_SESSION_005 - Verify browser back button after logout does not restore authenticated view', async ({ page, loginPage, menuPage }) => {
        await page.goto(BASE_URL);
        await loginPage.login(STANDARD_USER, PASSWORD);
        await expect(page).toHaveURL(/inventory\.html/);

        await menuPage.openMenu();
        await menuPage.clickMenuItem('Logout');
        await expect(page).toHaveURL(`${BASE_URL}/`);

        await page.goBack();

        // Inventory view should not be restored from cache/history
        await expect(page.locator('.inventory_list')).not.toBeVisible();
    });

});