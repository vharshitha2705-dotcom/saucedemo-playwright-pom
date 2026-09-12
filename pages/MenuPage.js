class MenuPage {

    constructor(page) {
        this.page = page;

        // Menu
        this.menuButton = page.getByRole('button', { name: 'Open Menu' });
        this.menuItems = page.locator('.bm-item-list a');

        // Menu Items
        this.allItemsLink = page.locator('#inventory_sidebar_link');
        this.aboutLink = page.locator('#about_sidebar_link');
        this.logoutLink = page.locator('#logout_sidebar_link');
        this.resetAppLink = page.locator('#reset_sidebar_link');

        // Cart
        this.cartBadge = page.locator('.shopping_cart_badge');
        this.closeMenuButton = page.getByRole('button', { name: 'Close Menu' });
    }

    async openMenu() {
        await this.menuButton.click();
    }

    async hoverMenuItem(menuName) {
        const menuItem = this.menuItems.filter({ hasText: menuName });
        await menuItem.hover();
        return menuItem;
    }

    async clickMenuItem(menuName) {
        await this.menuItems.filter({ hasText: menuName }).click();
    }
}

module.exports = MenuPage;
