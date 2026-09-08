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

