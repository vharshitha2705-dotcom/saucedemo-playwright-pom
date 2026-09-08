const {expect} = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');

async function loginAsStandardUser(page) {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/.*inventory/);
}

module.exports = { loginAsStandardUser };