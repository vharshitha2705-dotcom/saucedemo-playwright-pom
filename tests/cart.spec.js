const { test, expect } = require('../fixtures/testFixtures');

test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
});

test('TC_CART_001 - Cart badge displays correct count for added products', async ({ productPage }) => {
    await productPage.addProducts(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
    await expect(async () => {
        expect(await productPage.getCartBadgeCount()).toBe(2);
    });
});

test('TC_CART_002 - Selected products are displayed in the cart', async ({ productPage, cartPage }) => {
    const products = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];
    await productPage.addProducts(products);
    await productPage.openCartPage();

    for (const name of products) {
        await expect(cartPage.getCartItemByName(name)).toHaveCount(1);
    }
});

test('TC_CART_003 - Product details in cart are correct', async ({ productPage, cartPage }) => {
    const productName = 'Sauce Labs Backpack';
    const expectedData = await productPage.getProductData(productName);

    await productPage.addProductToCart(productName);
    await productPage.openCartPage();

    const cartProducts = await cartPage.getCartProducts();
    const cartProduct = cartProducts.find(p => p.name === productName);

    expect(cartProduct.name).toBe(expectedData.name);
    expect(cartProduct.description).toBe(expectedData.description);
    expect(cartProduct.price).toBe(expectedData.price);
    expect(cartProduct.quantity).toBe('1');
});

test('TC_CART_004 - User can remove a product from the cart', async ({ productPage, cartPage }) => {
    const productName = 'Sauce Labs Backpack';
    await productPage.addProductToCart(productName);
    await productPage.openCartPage();

    await cartPage.removeProduct(productName);
    await expect(cartPage.getCartItemByName(productName)).toHaveCount(0);
});

test('TC_CART_005 - User can remove multiple products from the cart', async ({ productPage, cartPage }) => {
    const products = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];
    await productPage.addProducts(products);
    await productPage.openCartPage();

    await cartPage.removeProducts(products);
    await expect(cartPage.cartItems).toHaveCount(0);
});

test('TC_CART_006 - Cart badge count decreases by 1 after removing a product', async ({ productPage, cartPage }) => {
    const products = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];
    await productPage.addProducts(products);

    const countBefore = await productPage.getCartBadgeCount();
    await productPage.openCartPage();
    await cartPage.removeProduct(products[0]);

    const countAfter = await productPage.getCartBadgeCount();
    expect(countAfter).toBe(countBefore - 1);
});

test('TC_CART_007 - Cart badge count updates correctly after removing multiple products', async ({ productPage, cartPage }) => {
    const products = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];
    await productPage.addProducts(products);

    const countBefore = await productPage.getCartBadgeCount();
    await productPage.openCartPage();
    await cartPage.removeProducts(products);

    const countAfter = await productPage.getCartBadgeCount();
    expect(countAfter).toBe(countBefore - products.length);
});

test('TC_CART_008 - Verify Continue Shopping button navigates back to inventory page', async ({ page, productPage, cartPage }) => {
    await productPage.openCartPage();
    await cartPage.continueShopping();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});

test('TC_CART_009 - Verify Checkout button navigates to checkout information page', async ({ page, productPage, cartPage }) => {
    await productPage.addProductToCart('Sauce Labs Backpack');
    await productPage.openCartPage();
    await cartPage.checkout();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
});