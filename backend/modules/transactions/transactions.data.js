/* ===== Imports ===== */

const authData = require('../auth/auth.data');

const Transaction =
    require('../../models/transaction.model');

const {
    isValidAmount,
    isValidReason,
    normalizeReason
} = require('../../utils/validation');

const {
    createHttpError
} = require('../../utils/errors');


/* =========================================================
   Build Transaction Response
========================================================= */

async function buildTransactionForUser(
    transaction,
    userId
) {

    const currentUserId =
        userId.toString();

    const senderId =
        transaction.senderId.toString();

    const recipientId =
        transaction.recipientId.toString();

    /* ===== Check transaction direction ===== */

    const isSender =
        senderId === currentUserId;

    /* ===== Get counterparty ===== */

    const counterpartyId =
        isSender
            ? recipientId
            : senderId;

    const counterparty =
        await authData.getUserById(counterpartyId);

    /* ===== Build response ===== */

    return {

        id:
            transaction._id,

        counterpartyEmail:
            counterparty.email,

        amount:
            isSender
                ? -transaction.amount
                : transaction.amount,

        reason:
            transaction.reason,

        date:
            transaction.date
    };
}


/* =========================================================
   Get Transactions By User
========================================================= */

async function getTransactionsByUser(
    userId,
    page,
    limit,
    counterparty
) {

    /* ===== Get related transactions from MongoDB ===== */

    const relatedTransactions =
        await Transaction.find({

            $or: [

                { senderId: userId },

                { recipientId: userId }
            ]
        });

    /* ===== Format transactions ===== */

    const formattedTransactions =
        await Promise.all(

            relatedTransactions.map(transaction =>

                buildTransactionForUser(
                    transaction,
                    userId
                )
            )
        );

    /* ===== Sort newest to oldest ===== */

    formattedTransactions.sort((a, b) =>

        new Date(b.date) -
        new Date(a.date)
    );

    /* ===== Filter by counterparty ===== */

    let filteredTransactions =
        formattedTransactions;

    if (counterparty) {

        filteredTransactions =
            formattedTransactions.filter(transaction =>

                transaction.counterpartyEmail ===
                counterparty
            );
    }

    /* ===== Calculate pagination ===== */

    const startIndex =
        (page - 1) * limit;

    const endIndex =
        startIndex + limit;

    const paginatedTransactions =
        filteredTransactions.slice(
            startIndex,
            endIndex
        );

    /* ===== Build pagination metadata ===== */

    const total =
        filteredTransactions.length;

    const totalPages =
        Math.ceil(total / limit);

    /* ===== Return response ===== */

    return {

        transactions:
            paginatedTransactions,

        pagination: {

            page: page,

            limit: limit,

            total: total,

            totalPages: totalPages
        }
    };
}


/* =========================================================
   Create Transaction
========================================================= */

async function createTransaction(
    senderId,
    recipientEmail,
    amount,
    reason
) {

    /* ===== Find sender ===== */

    const sender =
        await authData.getUserById(senderId);

    /* ===== Find recipient ===== */

    const recipient =
        await authData.getUserByEmail(
            recipientEmail
        );

    /* ===== Validate sender ===== */

    if (!sender) {

        throw createHttpError(
            'Sender not found',
            404
        );
    }

    /* ===== Validate recipient ===== */

    if (!recipient) {

        throw createHttpError(
            'Recipient not found',
            404
        );
    }

    /* ===== Prevent self transfer ===== */

    if (
        sender._id.toString() ===
        recipient._id.toString()
    ) {

        throw createHttpError(
            'Cannot transfer to yourself',
            409
        );
    }

    /* ===== Validate amount ===== */

    if (!isValidAmount(amount)) {

        throw createHttpError(
            'Invalid amount',
            400
        );
    }

    const numericAmount =
        Number(amount);

    /* ===== Validate reason ===== */

    if (!isValidReason(reason)) {

        throw createHttpError(
            'Invalid reason',
            400
        );
    }

    const cleanReason =
        normalizeReason(reason);

    /* ===== Validate sender balance ===== */

    if (sender.balance < numericAmount) {

        throw createHttpError(
            'Insufficient balance',
            409
        );
    }

    /* ===== Update sender balance ===== */

    const updatedSender =
        await authData.updateUserBalance(

            sender,

            sender.balance - numericAmount
        );

    /* ===== Update recipient balance ===== */

    await authData.updateUserBalance(

        recipient,

        recipient.balance + numericAmount
    );

    /* ===== Create transaction in MongoDB ===== */

    const transaction =
        await Transaction.create({

            senderId:
                sender._id,

            recipientId:
                recipient._id,

            amount:
                numericAmount,

            reason:
                cleanReason
        });

    /* ===== Return response ===== */

    return {

        transaction:
            await buildTransactionForUser(
                transaction,
                sender._id
            ),

        newBalance:
            updatedSender.balance
    };
}


/* ===== Exports ===== */

module.exports = {
    getTransactionsByUser,
    createTransaction
};