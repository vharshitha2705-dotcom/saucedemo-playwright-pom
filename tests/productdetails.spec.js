const { test, expect } = require('../fixtures/testFixtures');

test.beforeEach(async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
});

test('TC_PRODUCT_DETAILS_004 - Verify user can add a product to the cart from the Product Details page', async ({ productPage, productDetailPage }) => {
  const expectedProduct = 'Sauce Labs Fleece Jacket'; // or Backpack, per your decision

  const cartCountBefore = await productPage.getCartBadgeCount();
  await productPage.openProductDetails(expectedProduct);
  await productDetailPage.addProductToCart();
  const cartCountAfter = await productPage.getCartBadgeCount();

  expect(cartCountAfter).toBe(cartCountBefore + 1);
  await expect(productDetailPage.removeButton).toBeVisible();
});

test('TC_PRODUCT_DETAILS_005 - Verify user can remove a product from the cart from the Product Details page', async ({ productPage, productDetailPage }) => {
  const expectedProduct = 'Sauce Labs Fleece Jacket';

  await productPage.openProductDetails(expectedProduct);
  await productDetailPage.addProductToCart();

  const cartCountBefore = await productPage.getCartBadgeCount();
  await productDetailPage.removeProductFromCart();
  const cartCountAfter = await productPage.getCartBadgeCount();

  expect(cartCountAfter).toBe(cartCountBefore - 1);
  await expect(productDetailPage.addToCartButton).toBeVisible();
});

test('TC_PRODUCT_DETAILS_006 - Verify Cart button navigates to the Cart page from the Product Details page', async ({ page, productPage, productDetailPage }) => {
  await productPage.openProductDetails('Sauce Labs Fleece Jacket');
  await productDetailPage.openCartPage();
  await expect(page).toHaveURL(/.*cart\.html/);
});

test('TC_PRODUCT_DETAILS_007 - Verify navigation back to Product Listing page from Product Details page', async ({ productPage, productDetailPage, page }) => {
  const expectedProduct = 'Sauce Labs Fleece Jacket';

  await productPage.openProductDetails(expectedProduct);
  await productDetailPage.backToProducts();

  await expect(page.locator('.title')).toHaveText('Products');
});