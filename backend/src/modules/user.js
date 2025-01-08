const pool = require('../db/db.js');

async function getUserInfo(user_id) {
    const sql = `SELECT * FROM User WHERE user_id = ?`;
    const [res] = await pool.query(sql, [user_id]);

    if (res.length === 0) {
        throw new Error(`No user found with ID ${user_id}`);
    }

    return res[0];
}

async function getAllUsers() {
    const sql = `SELECT * FROM User`;
    const [res] = await pool.query(sql);

    return res;
}

async function addUser(user_id, email, balance, isSimulated = 0) {
    try {
        const sql = `INSERT INTO User (user_id, balance, Email, simulation_user) VALUES (?, ?, ?, ?)`;
        const [result] = await pool.query(sql, [user_id, balance, email, isSimulated]);
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

async function giveAdmin(userId) {
    const sql = `UPDATE User SET admin = 1 WHERE user_id = ?`;

    try {
        const [result] = await pool.query(sql, [userId]);

        return result;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

async function deleteUsers(simulatedOnly) {
    try {
        const inputRemove = simulatedOnly ? 1 : 0;
        const [result] = await pool.query(`CALL RemoveUsers(?)`, [inputRemove]);
    return result;
    } catch (error) {
        console.error("Error att ta bort användare:", error);
        throw error;
    }
}

async function deleteUser(userId) {
    try {
        const [result] = await pool.query(`DELETE FROM User WHERE user_id = ?`, [userId]);
        
        return result;
    } catch (error) {
        console.error("Error att ta bort användare:", error);
        throw error;
    }
}


async function findOrCreateUser(oauthUser) {
    try {
        const user_id = oauthUser.id;
        const email = oauthUser.emails[0].value;
        const name = oauthUser.displayName;
        const photo = oauthUser.photos[0].value;

        const sqlFindUser = `SELECT user_id, balance, email FROM User WHERE user_id = ?`;
        const [existingUser] = await pool.query(sqlFindUser, [user_id]);

        if (existingUser.length > 0) {
            return existingUser[0];
        }

        const initialBalance = 0;
        const sqlAddUser = `
            INSERT INTO User (user_id, balance, email, simulation_user)
            VALUES (?, ?, ?, ?)
        `;
        await pool.query(sqlAddUser, [user_id, initialBalance, email, 0]);

        return { user_id, email, balance: initialBalance };
    } catch (error) {
        console.error("Error vid hantering av Google-inloggning:", error);
        throw error;
    }
}

module.exports = {
    getUserInfo,
    addUser,
    updateUser,
    deleteUsers,
    getAllUsers,
    deleteUser,
    findOrCreateUser,
    giveAdmin
};
