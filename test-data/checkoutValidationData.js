module.exports = [

    {
        testName: 'TC_CHECKOUT_INFO_004 - Verify validation when First Name is blank',
        firstName: '',
        lastName: 'Veeravalli',
        postalCode: '530001',
        errorMessage: 'Error: First Name is required'
    },

    {
        testName: 'TC_CHECKOUT_INFO_005 - Verify validation when Last Name is blank',
        firstName: 'Harshitha',
        lastName: '',
        postalCode: '530001',
        errorMessage: 'Error: Last Name is required'
    },

    {
        testName: 'TC_CHECKOUT_INFO_006 - Verify validation when Postal Code is blank',
        firstName: 'Harshitha',
        lastName: 'Veeravalli',
        postalCode: '',
        errorMessage: 'Error: Postal Code is required'
    }

];
