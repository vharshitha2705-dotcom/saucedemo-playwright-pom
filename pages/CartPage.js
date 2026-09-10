class CartPage {

    constructor(page) {

        this.page = page;

        // Page Elements
        this.pageHeading = page.locator(".title");
        this.continueShoppingButton = page.getByRole("button", { name: "Continue Shopping" });
        this.checkoutButton = page.getByRole("button", { name: "Checkout" });

        // Cart Elements
        this.cartItems = page.locator(".cart_item");
        this.itemName = page.locator(".inventory_item_name");
        this.itemDesc = page.locator(".inventory_item_desc");
        this.itemPrice = page.locator(".inventory_item_price");
        this.itemQuantity = page.locator(".cart_quantity");

    }

    //========================
    // Getters
    //========================

    getCartItemByName(productName) {
        return this.cartItems.filter({ hasText: productName });
    }

    async getCartItemCount() {
        return await this.cartItems.count();
    }

    async getCartProductNames() {
        const names = await this.itemName.allTextContents();
        return names.map(n => n.trim());
    }

    async getCartProductPrices() {
        const prices = await this.itemPrice.allTextContents();
        return prices.map(p => p.trim());
    }

    async getCartProductDescriptions() {
        const descriptions = await this.itemDesc.allTextContents();
        return descriptions.map(d => d.trim());
    }

    async getCartProductQuantities() {
        const quantities = await this.itemQuantity.allTextContents();
        return quantities.map(q => q.trim());
    }

    async getCartProducts() {

        const products = [];
        const count = await this.getCartItemCount();

        for (let i = 0; i < count; i++) {

            const item = this.cartItems.nth(i);

            products.push({
                name: (await item.locator(".inventory_item_name").textContent())?.trim(),
                description: (await item.locator(".inventory_item_desc").textContent())?.trim(),
                price: (await item.locator(".inventory_item_price").textContent())?.trim(),
                quantity: (await item.locator(".cart_quantity").textContent())?.trim()
            });

        }

        return products;

    }

    //========================
    // Actions
    //========================

    async removeProduct(productName) {
        await this.getCartItemByName(productName)
            .getByRole("button", { name: "Remove" })
            .click();
    }

    async removeProducts(productNames) {
        for (const product of productNames) {
            await this.removeProduct(product);
        }
    }

    async removeAllProducts() {
        const removeButtons = this.page.getByRole("button", { name: "Remove" });
        const count = await removeButtons.count();
        for (let i = 0; i < count; i++) {
            await removeButtons.first().click();
        }
    }

    async continueShopping() {
        await this.continueShoppingButton.click();
    }

    async checkout() {
        await this.checkoutButton.click();
    }

}

module.exports = CartPage;