class ProductPage {

    constructor(page) {
        this.page = page;

        // Page Elements
        this.pageHeading = page.locator("span.title");
        this.menuButton = page.getByRole("button", { name: 'Open Menu' });
        this.sortingFilter = page.locator(".product_sort_container");
        this.cartLink = page.locator(".shopping_cart_link");
        this.cartBadge = page.locator(".shopping_cart_badge");

        // Product Elements
        this.inventoryContainer = page.locator(".inventory_container");
        this.itemCard = page.locator(".inventory_item");
        this.itemImage = page.locator("img.inventory_item_img");
        this.itemName = page.locator(".inventory_item_name");
        this.itemDesc = page.locator(".inventory_item_desc");
        this.itemPrice = page.locator(".inventory_item_price");
    }

    getProduct(productName) {
        return this.itemCard.filter({ hasText: productName });
    }

    async getProductCount() {
        return await this.itemCard.count();
    }

    async getCartBadgeCount() {
        return await this.cartBadge.isVisible()
            ? Number(await this.cartBadge.textContent())
            : 0;
    }

    //========================
    // Product Methods
    //========================

    async addProductToCart(productName) {
        await this.getProduct(productName)
            .getByRole("button", { name: "Add to cart" })
            .click();
    }

    async removeProductFromCart(productName) {
        await this.getProduct(productName)
            .getByRole("button", { name: "Remove" })
            .click();
    }

    async addProducts(productNames) {
        for (const product of productNames) {
            await this.addProductToCart(product);
        }
    }

    async removeProducts(productNames) {
        for (const product of productNames) {
            await this.removeProductFromCart(product);
        }
    }

    //========================
    // Navigation
    //========================

    async openCartPage() {
        await this.cartLink.click();
    }

    async openProductDetails(productName) {
        await this.getProduct(productName)
            .locator(".inventory_item_name")
            .click();
    }

    async openProductDetailsByImage(productName) {
        await this.getProduct(productName)
            .getByRole('link')
            .first()
            .click();
    }

    //========================
    // Sorting
    //========================

    async selectSortOption(value) {
        await this.sortingFilter.selectOption(value);
    }

    getSelectedSortOption() {
        return this.sortingFilter;
    }

    //========================
    // Data Retrieval
    //========================

    async getProductData(productName) {
        const product = this.getProduct(productName);
        return {
            name: (await product.locator(".inventory_item_name").textContent())?.trim(),
            description: (await product.locator(".inventory_item_desc").textContent())?.trim(),
            price: (await product.locator(".inventory_item_price").textContent())?.trim()
        };
    }

    async getAllProductNames() {
        return await this.itemName.allTextContents();
    }

    async getAllProductDescriptions() {
        return await this.itemDesc.allTextContents();
    }

    async getAllProductPrices() {
        return await this.itemPrice.allTextContents();
    }

    async getAllProductData() {
        const products = [];
        const count = await this.getProductCount();
        for (let i = 0; i < count; i++) {
            const product = this.itemCard.nth(i);
            products.push({
                name: (await product.locator(".inventory_item_name").textContent())?.trim(),
                description: (await product.locator(".inventory_item_desc").textContent())?.trim(),
                price: (await product.locator(".inventory_item_price").textContent())?.trim()
            });
        }

        return products;
    }

    //========================
    // Product State
    //========================

    async isProductSelected(productName) {
        return await this.getProduct(productName)
            .getByRole("button", { name: "Remove" })
            .isVisible();
    }

    getRemoveButton(productName) {
        return this.getProduct(productName).getByRole('button', {
            name: 'Remove'
        });
    }

    getAddToCartButton(productName) {
        return this.getProduct(productName).getByRole('button', {
            name: 'Add to cart'
        });
    }
}

module.exports = ProductPage;