class CheckoutInfoPage  {

    constructor(page) {

        this.page = page;

        this.title = page.locator(".title");
        this.firstName = page.getByPlaceholder('First Name');
        this.lastName = page.getByPlaceholder("Last Name");
        this.postalCode = page.getByPlaceholder("Zip/Postal Code");
        this.cancelButton = page.getByRole("button", {name : "Cancel"});
        this.continueButton = page.getByRole("button" , {name : "Continue"});
        this.errorMessage = page.locator('[data-test="error"]');

    }

    async fillCheckoutInfo(firstName,lastName,postalCode){

        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        await this.postalCode.fill(postalCode);
        await this.continueButton.click();
    }

}

module.exports = CheckoutInfoPage;