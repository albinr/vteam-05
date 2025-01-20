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
                ST_Y(position) AS latitude,
                simulation
            FROM Bike
        `);
        return rows;
    } catch (error) {
        console.error("Error att hämta cyklar:", error);
        throw error;
    }
}

async function getAvailableBikes() {
    try {
        const [rows] = await pool.query(`CALL GetAvailableBikes()`);
        return rows[0];
    } catch (error) {
        console.error("Error vid anrop av proceduren GetAvailableBikes:", error);
        throw error;
    }
}

async function getCityBikes(city) {
    try {
        const [rows] = await pool.query(`CALL GetAvailableBikes(?)`,[city]);
        return rows[0];
    } catch (error) {
        console.error("Error vid anrop av proceduren GetAvailableBikes:", error);
        throw error;
    }
}

async function showBike(bikeId) {
    
    const [rows] = await pool.query(`
        SELECT
            bike_id,
            status,
            battery_level,
            ST_X(position) AS longitude,
            ST_Y(position) AS latitude
        FROM Bike
        WHERE bike_id = ?
    `, [bikeId]);

    if (rows.length === 0) {
        throw new Error(`Error att hämta cykel: Cykel med ID ${bikeId} finns inte`);
    }
    
    return rows;
    
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

async function updateBike(bikeId, updateData) {
    try {
        const newPosition = updateData.longitude !== undefined && updateData.latitude !== undefined 
            ? `POINT(${updateData.longitude} ${updateData.latitude})` 
            : null;

        const result = await pool.query(
            `CALL UpdateBike(?, ?, ?, ?)`,
            [
                bikeId,
                newPosition,
                updateData.battery_level,
                updateData.status
            ]
        );

        console.log(`Cykel med ${bikeId} har uppdaterats`);
    } catch (error) {
        console.error('Error updating bike details:', error);
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
    showBike,
    addBike,
    updateBike,
    deleteBike,
    deleteBikes,
    getAvailableBikes,
    getCityBikes
};
