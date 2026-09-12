const { test } = require('@playwright/test');

const LoginPage = require('../pages/LoginPage');
const ProductPage = require('../pages/ProductPage');
const ProductDetailPage = require('../pages/ProductDetailPage');
const CartPage = require('../pages/CartPage');
const CheckoutInfoPage = require('../pages/CheckoutInfoPage');
const CheckoutOverviewPage = require('../pages/CheckoutOverviewPage');
const CheckoutCompletePage = require('../pages/CheckoutCompletePage');
const MenuPage = require('../pages/MenuPage');


exports.test = test.extend({

    loginPage: async ({ page }, use) => {

        await use(new LoginPage(page));

    },

    productPage: async ({ page }, use) => {

        await use(new ProductPage(page));

    },

    productDetailPage: async ({ page }, use) => {

        await use(new ProductDetailPage(page));

    },

    cartPage: async ({ page }, use) => {

        await use(new CartPage(page));

    },

    checkoutInfoPage: async ({ page }, use) => {
        
        await use(new CheckoutInfoPage(page));

    },

    checkoutOverviewPage: async ({ page }, use) => {
        
        await use(new CheckoutOverviewPage(page));

    },

    checkoutCompletePage: async ({ page }, use) => {
        
        await use(new CheckoutCompletePage(page));

    },

    menuPage: async ({ page }, use) => {
        
        await use(new MenuPage(page));

    },

});

exports.expect = require('@playwright/test').expect;