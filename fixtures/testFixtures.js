const { test } = require('@playwright/test');

const LoginPage = require('../pages/LoginPage');
const ProductPage = require('../pages/ProductPage');
const ProductDetailPage = require('../pages/ProductDetailPage');


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
});

exports.expect = require('@playwright/test').expect;