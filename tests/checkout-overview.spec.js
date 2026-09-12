const { test, expect } = require("../fixtures/testFixtures");

const PRODUCT_NAME = 'Sauce Labs Backpack';
const PRODUCT_QUANTITY = '1';
const PRODUCT_PRICE = '$29.99';

test.beforeEach(async ({page,loginPage,productPage,cartPage,checkoutInfoPage}) => {

    const firstName = 'Harshitha';
    const lastName = 'Veeravalli';
    const postalCode = '530001';

    // Login
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    // Add product
    await productPage.addProductToCart(PRODUCT_NAME);

    // Open Cart
    await productPage.openCartPage();

    // Checkout
    await cartPage.checkout();

    // Enter customer information
    await checkoutInfoPage.fillCheckoutInfo(
        firstName,
        lastName,
        postalCode
    );

    // Verify Checkout Overview page
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
});


test('TC_CHECKOUT_OVERVIEW_001 - Verify products and quantities are displayed correctly in the order summary', async ({ checkoutOverviewPage }) => {
    // Verify product name
    await expect(checkoutOverviewPage.getProductByName(PRODUCT_NAME)).toBeVisible();

    // Verify product quantity
    await expect(checkoutOverviewPage.getProductQuantity(PRODUCT_NAME)).toHaveText(PRODUCT_QUANTITY);

    // Verify product price
    await expect(checkoutOverviewPage.getProductPrice(PRODUCT_NAME)).toHaveText(PRODUCT_PRICE);
});


test('TC_CHECKOUT_OVERVIEW_002 - Verify item total is calculated correctly', async ({ checkoutOverviewPage }) => {
    const productPrices = await checkoutOverviewPage.productPrices.allTextContents();
    const cleanedPrices = productPrices.map(price => Number(price.replace('$', '')));
    const productSum = cleanedPrices.reduce((sum, price) => sum + price, 0);

    await expect(checkoutOverviewPage.itemTotal).toContainText(`$${productSum.toFixed(2)}`);
});


test('TC_CHECKOUT_OVERVIEW_003 - Verify tax is displayed correctly', async ({ checkoutOverviewPage }) => {
    const taxAmount = '2.40';

    await expect(checkoutOverviewPage.taxInfo).toContainText(taxAmount);
});

test('TC_CHECKOUT_OVERVIEW_004 - Verify total amount is calculated correctly', async ({ checkoutOverviewPage }) => {
    const totalDetails = await checkoutOverviewPage.getTotalDetails();
    const totalPrice = totalDetails.itemTotal + totalDetails.taxAmount;

    await expect(checkoutOverviewPage.totalPrice).toContainText(`$${totalPrice.toFixed(2)}`);
});


test('TC_CHECKOUT_OVERVIEW_005 - Verify user can complete checkout successfully', async ({ page, checkoutOverviewPage }) => {
    await checkoutOverviewPage.finishButton.click();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
});


test('TC_CHECKOUT_OVERVIEW_006 - Verify Cancel button returns user to the Product page', async ({ page, checkoutOverviewPage }) => {
    await checkoutOverviewPage.cancelButton.click();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});