const { test, expect } = require('@playwright/test');
const loginValidationData = require("../test-data/loginValidationData");
const LoginPage = require("../pages/LoginPage");
const allure = require('allure-js-commons');

test.beforeEach(async () => {
    await allure.epic('SauceDemo Web App');
    await allure.feature('Login');
    await allure.owner('Harshitha');
});

for (const data of loginValidationData) {

    test(`${data.id} - ${data.testName}`, async ({ page }) => {

        const loginPage = new LoginPage(page);

        await loginPage.goto();
        await loginPage.login(data.usernameInput, data.passwordInput);

        if (data.loginStatus === "SUCCESS") {

            // Verify successful login
            await expect(page).toHaveURL(/inventory/);
            
        } else {

            // Verify login failure
            await expect(loginPage.errorMessage).toHaveText(data.expectedError);
            await expect(page).toHaveURL(/saucedemo\.com/);

        }

    });

}