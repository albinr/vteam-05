const pool = require('../db/db.js');

async function getUserInfo(user_id) {
    const sql = `SELECT user_id, Balance AS balance, Email AS email FROM User WHERE user_id = ?`;
    const [res] = await pool.query(sql, [user_id]);

    if (res.length === 0) {
        throw new Error(`No user found with ID ${user_id}`);
    }

    return res[0];
}

async function addUser(email, balance) {
    try {
        const sql = `INSERT INTO User (Balance, Email) VALUES (?, ?)`;
        const [result] = await pool.query(sql, [balance, email]);
        return result;
    } catch (error) {
        console.error("Fel vid skapande av användare:", error);
        throw error;
    }
}

async function updateUser(userId, updatedData) {
    try {
        const data = [];
        const params = [];

        if (updatedData.email !== undefined) {
            data.push("email = ?");
            params.push(updatedData.email);
        }

        if (updatedData.balance !== undefined) {
            data.push("balance = ?");
            params.push(updatedData.balance);
        }

        params.push(userId);

        const sql = `UPDATE User SET ${data.join(", ")} WHERE user_id = ?`;

        const [result] = await pool.query(sql, params);

        if (result.affectedRows === 0) {
            throw new Error(`Ingen användare med ID ${userId} hittades.`);
        }

        return { message: "Användare uppdaterad", affectedRows: result.affectedRows };
    } catch (error) {
        console.error("Error vid uppdatering av användare:", error.message);
        throw error;
    }
}

async function deleteUsers(simulatedOnly) {
    const inputRemove = simulatedOnly ? 1 : 0;
    const [result] = await pool.query(`CALL RemoveUsers(?)`, [inputRemove]);
    return result;
}

module.exports = {
    getUserInfo,
    addUser,
    updateUser,
    deleteUsers
};
