const pool = require('../db/db.js');

async function showAllTrips() {
    try {
        const [rows] = await pool.query(`
            SELECT
                trip_id,
                bike_id,
                start_time,
                end_time,
                CONCAT(ST_X(start_position), ' ', ST_Y(start_position)) AS start_position,
                CONCAT(ST_X(end_position), ' ', ST_Y(end_position)) AS end_position,
                CONCAT(cost, 'kr') AS price,
                speed
            FROM Trip
        `);
        return rows;
    } catch (error) {
        console.error("Error att hämta Trip:", error);
        throw error;
    }
}

async function showTripsByUser(userId) {
    try {
        const [rows] = await pool.query(`
            SELECT
                trip_id,
                bike_id,
                start_time,
                end_time,
                CONCAT(ST_X(start_position), ' ', ST_Y(start_position)) AS start_position,
                CONCAT(ST_X(end_position), ' ', ST_Y(end_position)) AS end_position,
                CONCAT(cost, 'kr') AS price,
                speed
            FROM Trip
            WHERE user_id = ?
        `, [userId]);
        return rows;
    } catch (error) {
        console.error("Error att hämta resor för användare:", error);
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

async function deleteTripById(tripId) {
    try {
        const [result] = await pool.query('DELETE FROM Trip WHERE trip_id = ?', [tripId]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error("Error att radera resan:", error);
        throw error;
    }
}

module.exports = {
    showAllTrips,
    startTrip,
    endTrip,
    deleteTrips,
    showTripsByUser,
    deleteTripById
};
