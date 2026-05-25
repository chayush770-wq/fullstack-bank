const accountsData = require('./accounts.data');


/* ===== GET CURRENT ACCOUNT ===== */

async function getCurrentAccount(req, res) {
    try {
        const userId = req.user.userId;

        const account =
            await accountsData.getAccountByUserId(userId);

        if (!account) {
            return res.status(404).json({
                message: 'Account not found'
            });
        }

        return res.status(200).json(account);
    }

    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}


/* ===== EXPORTS ===== */

module.exports = {
    getCurrentAccount
};