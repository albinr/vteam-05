const pool = require('../db/db.js');

async function showTrip() {
    try {
        const [rows] = await pool.query(`
            SELECT
                trip_id,
                bike_id,
                start_time,
                end_time,
                CONCAT(ST_X(start_position), ' ', ST_Y(start_position)) AS start_position,
                CONCAT(ST_X(end_position), ' ', ST_Y(end_position)) AS end_position,
                CONCAT(price, 'kr') AS price,
                speed
            FROM Trip
        `);
        return rows;
    } catch (error) {
        console.error("Error att hämta Trip:", error);
        throw error;
    }
}

async function startTrip(bikeId, userId) {
    try {
        const [result] = await pool.query('CALL StartTrip(?, ?)', [bikeId, userId]);
        return result;
    } catch (error) {
        console.error("Error att starta resan:", error);
        throw error;
    }
}

async function endTrip(bikeId) {
    try {
        const sql = `CALL EndTrip(?)`;
        await pool.query(sql, [bikeId]);
    } catch (error) {
        console.error("Error att avsluta resan:", error);
        throw error;
    }
}

async function deleteTrips(simulatedOnly) {
    const inputRemove = simulatedOnly ? 1 : 0;
    const [result] = await pool.query(`CALL RemoveTrips(?)`, [inputRemove]);
    return result;
}

module.exports = {
    showTrip,
    startTrip,
    endTrip,
    deleteTrips
};
