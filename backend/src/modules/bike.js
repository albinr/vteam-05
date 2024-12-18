const { v4: uuidv4 } = require("uuid");
const pool = require('../db/db.js');

async function showBikes() {
    try {
        const [rows] = await pool.query(`
            SELECT
                bike_id,
                status,
                battery_level,
                ST_X(position) AS longitude,
                ST_Y(position) AS latitude
            FROM Bike
        `);
        return rows;
    } catch (error) {
        console.error("Error att hämta cyklar:", error);
        throw error;
    }
}

async function addBike(bikeId, batteryLevel, longitude, latitude, isSimulated = 0) {
    try {
        const id = bikeId || uuidv4();
        const location = `POINT(${longitude} ${latitude})`;
        const sql = `
            INSERT INTO Bike (bike_id, battery_level, position, simulation)
            VALUES (?, ?, ST_PointFromText(?), ?)
        `;

        const [result] = await pool.query(sql, [id, batteryLevel, location, isSimulated]);
        return id;
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error(`Cykel med ID ${bikeId} finns redan.`);
        }
        console.error("Error att lägga till ny cykel:", error);
        throw error;
    }
}

async function updateBike(bikeId, updatedData) {
    try {
        const data = [];
        const params = [];

        if (updatedData.status) {
            data.push("status = ?");
            params.push(updatedData.status);
        }

        if (updatedData.battery_level !== undefined) {
            data.push("battery_level = ?");
            params.push(updatedData.battery_level);
        }

        if (updatedData.longitude !== undefined && updatedData.latitude !== undefined) {
            const location = `POINT(${updatedData.longitude} ${updatedData.latitude})`;
            data.push("position = ST_PointFromText(?)");
            params.push(location);
        }

        if (updatedData.simulation !== undefined) {
            data.push("simulation = ?");
            params.push(updatedData.simulation);
        }

        params.push(bikeId);

        const sql = `UPDATE Bike SET ${data.join(", ")} WHERE bike_id = ?`;

        const [result] = await pool.query(sql, params);

        if (result.affectedRows === 0) {
            throw new Error(`Ingen cykel med ID ${bikeId} hittades.`);
        }

        return { message: "Cykel uppdaterad", affectedRows: result.affectedRows };
    } catch (error) {
        console.error("Error vid uppdatering av cykel:", error.message);
        throw error;
    }
}

async function deleteBike(bikeId) {
    try {
        const sql = `DELETE FROM Bike WHERE bike_id = ?`;
        const [result] = await pool.query(sql, [bikeId]);
        return result;
    } catch (error) {
        console.error("Error att ta bort cykel:", error);
        throw error;
    }
}

async function deleteBikes(simulatedOnly) {
    const inputRemove = simulatedOnly ? 1 : 0;
    const [result] = await pool.query(`CALL RemoveBikes(?)`, [inputRemove]);
    return result;
}

module.exports = {
    showBikes,
    addBike,
    updateBike,
    deleteBike,
    deleteBikes,
};
