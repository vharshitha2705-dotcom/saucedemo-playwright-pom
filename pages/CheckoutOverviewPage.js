class CheckoutOverviewPage {

    constructor(page) {
        this.page = page;

        this.title = page.locator(".title");
        this.cartItem = page.locator(".cart_item");
        this.cartQuantity = page.locator(".cart_quantity");
        this.itemName = page.locator(".inventory_item_name");
        this.itemDesc = page.locator(".inventory_item_desc");
        this.productPrices = page.locator('.inventory_item_price');
        this.paymentInfo = page.locator("[data-test='payment-info-value']");
        this.shippingInfo = page.locator("[data-test='shipping-info-value']");
        this.itemTotal = page.locator("[data-test='subtotal-label']");
        this.taxInfo = page.locator("[data-test='tax-label']");
        this.totalPrice = page.locator("[data-test='total-label']");
        this.cancelButton = page.getByRole("button", { name: 'Cancel' });
        this.finishButton = page.getByRole("button", { name: 'Finish' });
        
    }

    getProductByName(productName) {
        return this.page
            .locator('.cart_item')
            .filter({
                has: this.page.getByText(productName, { exact: true })
            });
    }

    getProductQuantity(productName) {
        return this.getProductByName(productName)
            .locator('.cart_quantity');
    }

    getProductPrice(productName) {
        return this.getProductByName(productName)
            .locator('.inventory_item_price');
    }

    async getItemCount() {
        return await this.cartItem.count();
    }

    async getItemNames() {
        const names = await this.itemName.allTextContents();
        return names.map(name => name.trim());
    }

    async getItemPrices() {
        const prices = await this.itemPrice.allTextContents();
        return prices.map(price => parseFloat(price.replace('$', '').trim()));
    }

    async getItemQuantities() {
        const quantities = await this.cartQuantity.allTextContents();
        return quantities.map(qty => parseInt(qty.trim(), 10));
    }

    async getPaymentInfoText() {
        const text = await this.paymentInfo.textContent();
        return text.trim();
    }

    async getShippingInfoText() {
        const text = await this.shippingInfo.textContent();
        return text.trim();
    }

    async getTotalDetails() {

        const itemTotalText = await this.itemTotal.textContent();
        const taxText = await this.taxInfo.textContent();
        const totalText = await this.totalPrice.textContent();

        const itemTotal = parseFloat(itemTotalText.replace('Item total: $', '').trim());
        const taxAmount = parseFloat(taxText.replace('Tax: $', '').trim());
        const totalAmount = parseFloat(totalText.replace('Total: $', '').trim());

        return {
            itemTotal,
            taxAmount,
            totalAmount
        };
    }
}

module.exports = CheckoutOverviewPage;