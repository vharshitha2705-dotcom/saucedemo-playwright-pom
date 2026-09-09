const { test, expect } = require('../fixtures/testFixtures');

test.beforeEach(async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
});

test('TC_PRODUCT_DETAILS_004 - Verify user can add a product to the cart from the Product Details page', async ({ productPage, productDetailPage }) => {
  const expectedProduct = 'Sauce Labs Fleece Jacket'; // or Backpack, per your decision

  const cartCountBefore = await productPage.cartBadge.isVisible()
    ? Number(await productPage.cartBadge.textContent())
    : 0;

  await productPage.openProductDetails(expectedProduct);
  await productDetailPage.addProductToCart();

  const cartCountAfter = Number(await productPage.cartBadge.textContent());

  expect(cartCountAfter).toBe(cartCountBefore + 1);
  await expect(productDetailPage.removeButton).toBeVisible();
});

test('TC_PRODUCT_DETAILS_005 - Verify user can remove a product from the cart from the Product Details page', async ({ productPage, productDetailPage }) => {
  const expectedProduct = 'Sauce Labs Fleece Jacket';

  await productPage.openProductDetails(expectedProduct);
  await productDetailPage.addProductToCart();

  const cartCountBefore = Number(await productPage.cartBadge.textContent());

  await productDetailPage.removeProductFromCart();

  const cartCountAfter = await productPage.cartBadge.isVisible()
    ? Number(await productPage.cartBadge.textContent())
    : 0;

  expect(cartCountAfter).toBe(cartCountBefore - 1);
  await expect(productDetailPage.addToCartButton).toBeVisible();
});

test('TC_PRODUCT_DETAILS_007 - Verify navigation back to Product Listing page from Product Details page', async ({ productPage, productDetailPage, page }) => {
  const expectedProduct = 'Sauce Labs Fleece Jacket';

  await productPage.openProductDetails(expectedProduct);
  await productDetailPage.backToProducts();

  await expect(page.locator('.title')).toHaveText('Products');
});