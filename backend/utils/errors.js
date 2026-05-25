/* ===== Create HTTP Error ===== */

function createHttpError(message, status) {

    const error = new Error(message);

    error.status = status;

    return error;
}


/* ===== Exports ===== */

module.exports = {
    createHttpError
};