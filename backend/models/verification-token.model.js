/* ===== Imports ===== */

const mongoose = require('mongoose');

const verificationTokenSchema =
    require('./schemas/verification-token.schema');


/* ===== Verification Token Model ===== */

const VerificationToken = 
    mongoose.model(
            'VerificationToken',
            verificationTokenSchema
    );


/* ===== Exports ===== */

module.exports = VerificationToken;