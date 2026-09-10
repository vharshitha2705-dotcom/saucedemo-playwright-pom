const { test, expect } = require("../fixtures/testFixtures");
const { loginAsStandardUser } = require("../utils/auth");
const {
    isAscending,
    isDescending,
    isAscendingStrings,
    isDescendingStrings,
} = require("../utils/sortingHelper");

test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
});

test("TC_PRODUCT_001 - Verify the title of the Product Listing page", async ({ productPage }) => {
    await expect(productPage.pageHeading).toHaveText("Products");
});

test("TC_PRODUCT_002 - Verify menu button and cart icon are displayed on the Product Listing page", async ({ productPage }) => {
    await expect(productPage.menuButton).toBeVisible();
    await expect(productPage.cartLink).toBeVisible();
});

test("TC_PRODUCT_003 - Verify product inventory section is displayed on the Product Listing page", async ({ productPage }) => {
    await expect(productPage.inventoryContainer).toBeVisible();

    const firstProductCard = productPage.itemCard.first();
    await expect(firstProductCard).toBeVisible();
});

test("TC_PRODUCT_004 - Verify each product card displays product image, name, description, and price", async ({ productPage }) => {
    const products = await productPage.getAllProductData();

    expect(products.length).toBeGreaterThan(0);

    for (const product of products) {
        expect(product.name).not.toBe("");
        expect(product.description).not.toBe("");
        expect(product.price).not.toBe("");
    }

    const imageCount = await productPage.itemImage.count();

    for (let i = 0; i < imageCount; i++) {
        await expect(productPage.itemImage.nth(i)).toHaveAttribute("src", /.+/);
    }
});

test("TC_PRODUCT_005 - Verify all product names are unique", async ({ productPage }) => {
    const productNames = await productPage.getAllProductNames();

    expect(new Set(productNames).size).toBe(productNames.length);
});

test("TC_PRODUCT_006 - Verify all product prices are greater than zero", async ({ productPage }) => {
    const prices = await productPage.getAllProductPrices();

    for (const price of prices) {
        expect(parseFloat(price.replace("$", ""))).toBeGreaterThan(0);
    }
});

test("TC_PRODUCT_007 - Verify product images are displayed and loaded successfully", async ({ productPage }) => {
    const imageCount = await productPage.itemImage.count();

    expect(imageCount).toBe(6);

    for (let i = 0; i < imageCount; i++) {
        await expect(productPage.itemImage.nth(i)).toBeVisible();
        await expect(productPage.itemImage.nth(i)).toHaveAttribute("src", /.+/);
    }
});

test("TC_PRODUCT_008 - Verify products are sorted by Name (A-Z) by default", async ({ productPage }) => {
    const productNames = await productPage.getAllProductNames();

    expect(isAscendingStrings(productNames)).toBe(true);

    await expect(productPage.getSelectedSortOption()).toHaveValue("az");
});

test("TC_PRODUCT_009 - Verify product sorting by Name (Z-A)", async ({ productPage }) => {
    await productPage.selectSortOption("za");

    const sortedProductNames = await productPage.getAllProductNames();

    expect(isDescendingStrings(sortedProductNames)).toBe(true);
});

test("TC_PRODUCT_010 - Verify product sorting by Price (Low to High)", async ({ productPage }) => {
    await productPage.selectSortOption("lohi");

    const prices = await productPage.getAllProductPrices();
    const numericPrices = prices.map((price) => parseFloat(price.replace("$", "")));

    expect(isAscending(numericPrices)).toBe(true);
});

test("TC_PRODUCT_011 - Verify product sorting by Price (High to Low)", async ({ productPage }) => {
    await productPage.selectSortOption("hilo");

    const prices = await productPage.getAllProductPrices();
    const numericPrices = prices.map((price) => parseFloat(price.replace("$", "")));

    expect(isDescending(numericPrices)).toBe(true);
});

test("TC_PRODUCT_012 - Verify selected sorting option is displayed correctly after applying sorting", async ({ productPage }) => {
    const sortingMethod = "hilo";

    await productPage.selectSortOption(sortingMethod);

    await expect(productPage.getSelectedSortOption()).toHaveValue(sortingMethod);
});

test("TC_PRODUCT_013 - Verify sorting works correctly after adding a product to the cart", async ({ productPage }) => {
    const sortingMethod = "hilo";
    const newSortingMethod = "za";
    const productName = "Sauce Labs Backpack";

    await productPage.selectSortOption(sortingMethod);

    const highToLowPrices = await productPage.getAllProductPrices();
    const numericPrices = highToLowPrices.map((price) => parseFloat(price.replace("$", "")));

    expect(isDescending(numericPrices)).toBe(true);

    await productPage.addProductToCart(productName);

    expect(await productPage.getCartBadgeCount()).toBe(1);

    await productPage.selectSortOption(newSortingMethod);

    const sortedProductNames = await productPage.getAllProductNames();

    expect(isDescendingStrings(sortedProductNames)).toBe(true);
});

test("TC_PRODUCT_014 - Verify sorting does not affect cart badge count", async ({ productPage }) => {
    const productName = "Sauce Labs Backpack";
    const sortingMethod = "za";

    await productPage.addProductToCart(productName);

    const cartCountBeforeSorting = await productPage.getCartBadgeCount();

    await productPage.selectSortOption(sortingMethod);

    const sortedProductNames = await productPage.getAllProductNames();

    expect(isDescendingStrings(sortedProductNames)).toBe(true);

    const cartCountAfterSorting = await productPage.getCartBadgeCount();

    expect(cartCountBeforeSorting).toBe(cartCountAfterSorting);
});

test('TC_PRODUCT_015 - Verify clicking product name navigates to Product Details page', async ({ page, productPage, productDetailPage }) => {
    const expectedProduct = 'Sauce Labs Fleece Jacket';

    await productPage.openProductDetails(expectedProduct);

    await expect(productPage.page).toHaveURL(/inventory-item/);

    await expect(productDetailPage.itemName)
        .toHaveText(expectedProduct);
});

test("TC_PRODUCT_016 - Verify product details match the selected product", async ({ productPage, productDetailPage }) => {
    const expectedProduct = "Sauce Labs Fleece Jacket";

    const expectedDetails = await productPage.getProductData(expectedProduct);
    await productPage.openProductDetails(expectedProduct);

    await expect(productDetailPage.itemName)
        .toHaveText(expectedProduct);

    const actualDetails = await productDetailPage.getProductDetails();

    expect(actualDetails).toEqual(expectedDetails);
});

test('TC_PRODUCT_017 - Verify user is redirected to Cart page by clicking cart icon', async ({ productPage, cartPage }) => {
    await productPage.openCartPage();

    await expect(cartPage.page).toHaveURL(/cart.html/);
    await expect(cartPage.pageHeading).toHaveText("Your Cart");
});

test('TC_PRODUCT_018 - Verify user can add a single product to cart', async ({ productPage, productDetailPage, cartPage }) => {
    const expectedProduct = "Sauce Labs Fleece Jacket";

    // Get initial cart badge count
    const badgeBefore = await productPage.getCartBadgeCount();

    // Add product from Product Listing page
    await productPage.addProductToCart(expectedProduct);

    // Verify cart badge count increased by 1
    const badgeAfter = await productPage.getCartBadgeCount();
    expect(badgeAfter).toBe(badgeBefore + 1);

    // Verify Remove button is displayed on Product Listing page
    await expect(
        productPage.getRemoveButton(expectedProduct)
    ).toBeVisible();

    // Verify Add to Cart button is no longer displayed
    await expect(
        productPage.getAddToCartButton(expectedProduct)
    ).toHaveCount(0);

    // Open Product Details page
    await productPage.openProductDetails(expectedProduct);

    // Verify Remove button is displayed on Product Details page
    await expect(
        productDetailPage.getRemoveButton(expectedProduct)
    ).toBeVisible();

    // Verify Add to Cart button is no longer displayed
    await expect(
        productDetailPage.getAddToCartButton(expectedProduct)
    ).toHaveCount(0);

    // Navigate to Cart page
    await productPage.openCartPage();

    // Verify exactly one product is present in cart
    expect(
        await cartPage.getCartItemCount()
    ).toBe(1);

    // Verify expected product is present in cart
    await expect(
        cartPage.getCartItemByName(expectedProduct)
    ).toHaveCount(1);
});

test('TC_PRODUCT_019 - Verify user can add multiple products to cart', async ({ productPage, cartPage }) => {
    const products = [
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light',
        'Sauce Labs Fleece Jacket'
    ];

    // Add multiple products
    await productPage.addProducts(products);

    // Verify cart badge count
    expect(
        await productPage.getCartBadgeCount()
    ).toBe(products.length);

    // Verify each product state on Product Listing page
    for (const product of products) {

        // Remove button should be displayed
        await expect(
            productPage.getRemoveButton(product)
        ).toBeVisible();

        // Add to Cart button should no longer be displayed
        await expect(
            productPage.getAddToCartButton(product)
        ).toHaveCount(0);
    }

    // Navigate to Cart page
    await productPage.openCartPage();

    // Verify cart item count
    expect(
        await cartPage.getCartItemCount()
    ).toBe(products.length);

    // Verify all selected products are present in cart
    for (const product of products) {

        await expect(
            cartPage.getCartItemByName(product)
        ).toHaveCount(1);
    }
});

test('TC_PRODUCT_020 - Verify user can remove a single product from cart', async ({ productPage, cartPage }) => {
    const expectedProduct = "Sauce Labs Fleece Jacket";

    // Add product first
    await productPage.addProductToCart(expectedProduct);

    const badgeBefore = await productPage.getCartBadgeCount();

    // Navigate to Cart page
    await productPage.openCartPage();

    // Remove product from Cart
    await cartPage.removeProduct(expectedProduct);

    // Verify cart badge count decreased by 1
    const badgeAfter = await productPage.getCartBadgeCount();

    expect(badgeAfter).toBe(badgeBefore - 1);

    // Verify product is removed from Cart
    await expect(
        cartPage.getCartItemByName(expectedProduct)
    ).toHaveCount(0);

    // Verify Cart is empty
    expect(
        await cartPage.getCartItemCount()
    ).toBe(0);

    // Return to Product Listing page
    await cartPage.continueShopping();

    // Verify Add to Cart button is displayed again
    await expect(
        productPage.getAddToCartButton(expectedProduct)
    ).toBeVisible();

    // Verify Remove button is no longer displayed
    await expect(
        productPage.getRemoveButton(expectedProduct)
    ).toHaveCount(0);
});

test('TC_PRODUCT_021 - Verify user can remove multiple products from cart', async ({ productPage, cartPage }) => {
    const products = [
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light',
        'Sauce Labs Fleece Jacket'
    ];

    // Add multiple products first
    await productPage.addProducts(products);

    const badgeBefore = await productPage.getCartBadgeCount();

    // Navigate to Cart page
    await productPage.openCartPage();

    // Remove multiple products
    await cartPage.removeProducts(products);

    // Verify cart badge count decreased correctly
    const badgeAfter = await productPage.getCartBadgeCount();

    expect(badgeAfter).toBe(
        badgeBefore - products.length
    );

    // Verify all products are removed from Cart
    for (const product of products) {

        await expect(
            cartPage.getCartItemByName(product)
        ).toHaveCount(0);
    }

    // Verify Cart is empty
    expect(
        await cartPage.getCartItemCount()
    ).toBe(0);

    // Return to Product Listing page
    await cartPage.continueShopping();

    // Verify product state is reset for every removed product
    for (const product of products) {

        // Add to Cart should be displayed again
        await expect(
            productPage.getAddToCartButton(product)
        ).toBeVisible();

        // Remove should no longer be displayed
        await expect(
            productPage.getRemoveButton(product)
        ).toHaveCount(0);
    }
});

test('TC_PRODUCT_022 - Verify added products persist after refreshing the page', async ({
    page,
    productPage
}) => {

    const products = [
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light',
        'Sauce Labs Fleece Jacket'
    ];

    // Add multiple products
    await productPage.addProducts(products);

    // Refresh Product Listing page
    await page.reload();

    // Verify cart badge count persists
    expect(
        await productPage.getCartBadgeCount()
    ).toBe(products.length);

    // Verify each product remains selected
    for (const product of products) {

        await expect(
            productPage.getRemoveButton(product)
        ).toBeVisible();

        await expect(
            productPage.getAddToCartButton(product)
        ).toHaveCount(0);
    }
});

test('TC_PRODUCT_023 - Verify added products persist after navigating between Product Listing and Cart pages', async ({ productPage, cartPage }) => {
    const products = [
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light',
        'Sauce Labs Fleece Jacket'
    ];

    // Add multiple products
    await productPage.addProducts(products);

    // Navigate to Cart page
    await productPage.openCartPage();

    // Verify products are present in Cart
    expect(
        await cartPage.getCartItemCount()
    ).toBe(products.length);

    for (const product of products) {

        await expect(
            cartPage.getCartItemByName(product)
        ).toHaveCount(1);
    }

    // Return to Product Listing page
    await cartPage.continueShopping();

    // Verify cart badge count persists
    expect(
        await productPage.getCartBadgeCount()
    ).toBe(products.length);

    // Verify each product remains selected
    for (const product of products) {

        await expect(
            productPage.getRemoveButton(product)
        ).toBeVisible();

        await expect(
            productPage.getAddToCartButton(product)
        ).toHaveCount(0);
    }
});
