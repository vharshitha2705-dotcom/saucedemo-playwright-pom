class ProductDetailPage {

    constructor(page) {
        this.page = page;

        this.cartLink = page.locator(".shopping_cart_link");
        this.cartBadge = page.locator(".shopping_cart_badge");
        this.itemCard = page.locator(".inventory_details");
        this.itemImage = page.locator(".inventory_details_img");
        this.itemName = page.locator(".inventory_details_name");
        this.itemDesc = page.locator(".inventory_details_desc");
        this.itemPrice = page.locator(".inventory_details_price");

        this.addToCartButton = page.getByRole("button", {
            name: 'Add to cart'
        });

        this.removeButton = page.getByRole("button", {
            name: 'Remove'
        });

        this.backButton = page.getByRole("button", {
            name: 'Back to products'
        });
    }

    //========================
    // Getters
    //========================

    getRemoveButton() {
        return this.removeButton;
    }

    getAddToCartButton() {
        return this.addToCartButton;
    }

    //========================
    // Actions
    //========================

    async addProductToCart() {
        await this.addToCartButton.click();
    }

    async removeProductFromCart() {
        await this.removeButton.click();
    }

    async backToProducts() {
        await this.backButton.click();
    }

    async getProductDetails() {
        return {
            name: (await this.itemName.textContent())?.trim(),
            description: (await this.itemDesc.textContent())?.trim(),
            price: (await this.itemPrice.textContent())?.trim(),
        };
    }
}

module.exports = ProductDetailPage;