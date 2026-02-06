/**
 * Calculate membership expiry date based on plan
 * @param {string} membershipPlan - The membership plan type
 * @param {Date} startDate - The start date (default: current date)
 * @returns {Date} The expiry date
 */
const calculateExpiryDate = (membershipPlan, startDate = new Date()) => {
    const expiryDate = new Date(startDate);
    
    switch (membershipPlan) {
        case 'Monthly':
            expiryDate.setMonth(expiryDate.getMonth() + 1);
            break;
        case 'Quarterly':
            expiryDate.setMonth(expiryDate.getMonth() + 3);
            break;
        case '6 Months':
            expiryDate.setMonth(expiryDate.getMonth() + 6);
            break;
        case 'Yearly':
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
            break;
        default:
            expiryDate.setMonth(expiryDate.getMonth() + 1);
    }
    
    return expiryDate;
};

/**
 * Determine payment status based on paid and plan amounts
 * @param {number} paidAmount - Amount paid
 * @param {number} planAmount - Total plan amount
 * @returns {string} Payment status: 'Paid', 'Partial', or 'Pending'
 */
const determinePaymentStatus = (paidAmount, planAmount) => {
    if (paidAmount >= planAmount) {
        return 'Paid';
    } else if (paidAmount > 0) {
        return 'Partial';
    } else {
        return 'Pending';
    }
};

/**
 * Generate a unique member code
 * @param {string} name - Member name
 * @param {string} phone - Member phone
 * @returns {string} Generated member code
 */
const generateMemberCode = (name, phone) => {
    const namePrefix = name.substring(0, 3).toUpperCase();
    const phoneLastFour = phone.slice(-4);
    const timestamp = Date.now().toString().slice(-4);
    
    return `${namePrefix}${phoneLastFour}${timestamp}`;
};

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency symbol (default: '₹')
 * @returns {string} Formatted currency string
 */
const formatCurrency = (amount, currency = '₹') => {
    return `${currency}${amount.toLocaleString('en-IN')}`;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate Indian phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid Indian phone number
 */
const isValidIndianPhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
};

module.exports = {
    calculateExpiryDate,
    determinePaymentStatus,
    generateMemberCode,
    formatCurrency,
    isValidEmail,
    isValidIndianPhone
};