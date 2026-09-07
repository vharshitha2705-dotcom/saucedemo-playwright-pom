module.exports = [

    {
        id: "TC_LOGIN_001",
        testName: "Verify successful login with standard user",
        usernameInput: "standard_user",
        passwordInput: "secret_sauce",
        loginStatus: "SUCCESS",
        expectedError: "",
    },

    {
        id: "TC_LOGIN_002",
        testName: "Verify successful login with performance glitch user",
        usernameInput: "performance_glitch_user",
        passwordInput: "secret_sauce",
        loginStatus: "SUCCESS",
        expectedError: "",
    },

    {
        id: "TC_LOGIN_003",
        testName: "Verify successful login with problem user",
        usernameInput: "problem_user",
        passwordInput: "secret_sauce",
        loginStatus: "SUCCESS",
        expectedError: "",
    },

    {
        id: "TC_LOGIN_004",
        testName: "Verify successful login with error user",
        usernameInput: "error_user",
        passwordInput: "secret_sauce",
        loginStatus: "SUCCESS",
        expectedError: "",
    },

    {
        id: "TC_LOGIN_005",
        testName: "Verify successful login with visual user",
        usernameInput: "visual_user",
        passwordInput: "secret_sauce",
        loginStatus: "SUCCESS",
        expectedError: "",
    },

    {
        id: "TC_LOGIN_006",
        testName: "Verify login with invalid username",
        usernameInput: "invalid_user",
        passwordInput: "secret_sauce",
        loginStatus: "FAILURE",
        expectedError: "Epic sadface: Username and password do not match any user in this service",
    },

    {
        id: "TC_LOGIN_007",
        testName: "Verify login with invalid password",
        usernameInput: "standard_user",
        passwordInput: "wrong_password",
        loginStatus: "FAILURE",
        expectedError: "Epic sadface: Username and password do not match any user in this service",
    },

    {
        id: "TC_LOGIN_008",
        testName: "Verify login with invalid username and password",
        usernameInput: "invalid_user",
        passwordInput: "invalid_password",
        loginStatus: "FAILURE",
        expectedError: "Epic sadface: Username and password do not match any user in this service",
    },

    {
        id: "TC_LOGIN_009",
        testName: "Verify login with blank username",
        usernameInput: "",
        passwordInput: "secret_sauce",
        loginStatus: "FAILURE",
        expectedError: "Epic sadface: Username is required",
    },

    {
        id: "TC_LOGIN_010",
        testName: "Verify login with blank password",
        usernameInput: "standard_user",
        passwordInput: "",
        loginStatus: "FAILURE",
        expectedError: "Epic sadface: Password is required",
    },

    {
        id: "TC_LOGIN_011",
        testName: "Verify login with blank username and password",
        usernameInput: "",
        passwordInput: "",
        loginStatus: "FAILURE",
        expectedError: "Epic sadface: Username is required",
    },

    {
        id: "TC_LOGIN_012",
        testName: "Verify login with locked out user",
        usernameInput: "locked_out_user",
        passwordInput: "secret_sauce",
        loginStatus: "FAILURE",
        expectedError: "Epic sadface: Sorry, this user has been locked out.",
    },

];