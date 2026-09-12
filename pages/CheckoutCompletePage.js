class CheckoutCompletePage {

    constructor(page) {
        this.page = page;

        this.title = page.locator(".title");
        this.cartItem = page.locator(".cart_item");
        this.completeHeader = page.locator("[data-test='complete-header']");
        this.completeText = page.locator("[data-test='complete-text']");
        this.backButton = page.getByRole("button", { name: 'Back Home' });
    }

    async getCompleteHeaderText() {
        const text = await this.completeHeader.textContent();
        return text.trim();
    }

    async getCompleteText() {
        const text = await this.completeText.textContent();
        return text.trim();
    }
}

module.exports = CheckoutCompletePage;