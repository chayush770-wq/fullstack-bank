/* ===== Email Validation ===== */

function isValidEmail(email) {

    if (typeof email !== 'string') {
        return false;
    }

    return email.includes('@');
}


/* ===== Phone Validation ===== */

function isValidPhone(phone) {

    if (typeof phone !== 'string') {
        return false;
    }

    return phone.length >= 10;
}


/* ===== Pagination Validation ===== */

function isValidPagination(page, limit) {

    return (
        Number.isInteger(page) &&
        Number.isInteger(limit) &&
        page >= 1 &&
        limit >= 1 &&
        limit <= 50
    );
}


/* ===== Amount Validation ===== */

function isValidAmount(amount) {

    const numericAmount = Number(amount);

    return (
        !Number.isNaN(numericAmount) &&
        numericAmount > 0
    );
}


/* ===== Reason Validation ===== */

function normalizeReason(reason) {

    if (reason === undefined) {
        return null;
    }

    if (typeof reason !== 'string') {
        return null;
    }

    const cleanReason = reason.trim();

    if (cleanReason.length === 0) {
        return null;
    }

    return cleanReason;
}


function isValidReason(reason) {

    if (reason === undefined) {
        return true;
    }

    if (typeof reason !== 'string') {
        return false;
    }

    return reason.trim().length <= 200;
}


/* ===== Exports ===== */

module.exports = {
    isValidEmail,
    isValidPhone,
    isValidPagination,
    isValidAmount,
    isValidReason,
    normalizeReason
};