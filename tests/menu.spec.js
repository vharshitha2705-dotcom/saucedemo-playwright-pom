const { test, expect } = require("../fixtures/testFixtures");
const { loginAsStandardUser } = require('../utils/auth');

test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
});

test('TC_MENU_001 - Verify all side menu items are visible when menu is opened', async ({ menuPage }) => {

    await menuPage.openMenu();

    await expect(menuPage.allItemsLink).toBeVisible();
    await expect(menuPage.aboutLink).toBeVisible();
    await expect(menuPage.logoutLink).toBeVisible();
    await expect(menuPage.resetAppLink).toBeVisible();
});

test('TC_MENU_002 - Verify side menu item hover changes text color', async ({ menuPage }) => {

    const menuItem = 'About';
    await menuPage.openMenu();
    const hoverMenuItem = await menuPage.hoverMenuItem(menuItem);

    await expect(hoverMenuItem).toHaveCSS(
        'color',
        'rgb(61, 220, 145)'
    );
});

test('TC_MENU_003 - Verify All Items navigation redirects user to Inventory page from Cart page', async ({ page,menuPage,productPage }) => {

    const menuItem = 'All Items';

    await productPage.openCartPage();
    await expect(page).toHaveURL(/cart/);

    await menuPage.openMenu();
    await menuPage.clickMenuItem(menuItem);

    await expect(page).toHaveURL(/inventory/);
});

test('TC_MENU_004 - Verify About link redirects user to Sauce Labs external website', async ({ page,menuPage }) => {

    const menuItem = 'About';

    await menuPage.openMenu();
    await menuPage.clickMenuItem(menuItem);

    await expect(page).toHaveURL(/saucelabs/);
});

test('TC_MENU_005 - Verify Logout redirects user to login page and clears session', async ({ page,menuPage }) => {

    const menuItem = 'Logout';
    await menuPage.openMenu();
    await menuPage.clickMenuItem(menuItem);

    await expect(page).toHaveURL(/saucedemo/);
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});

test('TC_MENU_006 - Verify Reset App State clears cart items without logging out', async ({ page, menuPage, productPage, cartPage }) => {

    const menuItem = 'Reset App State';
    const expectedProduct = 'Sauce Labs Fleece Jacket';

    // Add product to cart
    await productPage.addProductToCart(expectedProduct);

    // Reset application state
    await menuPage.openMenu();
    await menuPage.clickMenuItem(menuItem);

    // Reload to verify persisted UI state
    await page.reload();

    // Verify cart badge is cleared
    await expect(menuPage.cartBadge).toBeHidden();

    await page.goto('https://www.saucedemo.com/cart.html');
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(0);

    // Verify user remains logged in
    await expect(menuPage.menuButton).toBeVisible();
});

test('TC_MENU_007 - Verify close menu button closes the side menu', async ({ menuPage }) => {
    await menuPage.openMenu();
    await expect(menuPage.allItemsLink).toBeVisible();
 
    await menuPage.closeMenuButton.click();
 
    await expect(menuPage.allItemsLink).not.toBeVisible();
});
