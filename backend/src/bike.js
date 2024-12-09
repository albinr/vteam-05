const mysql = require('mysql2/promise');
const config = require("../data/vteam.json");
// const pool = mysql.createPool(config);
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    multipleStatements: true,
    queueLimit: 0
});

process.on("exit", () => {
    pool.end();
});

async function showBikes() {
    try {
        const [rows] = await pool.query(`
            SELECT
                bike_id,
                status,
                battery_level,
                ST_X(position),
                ST_Y(position)
            FROM Bike
        `);

        return rows;
    } catch (error) {
        console.error("Error att hämta Cyklar:", error);
        throw error;
    }
}

async function showTrip() {
    try {
        const [rows] = await pool.query(`
            SELECT
                trip_id,
                bike_id,
                start_time,
                end_time,
                CONCAT (ST_X(start_position), ' ', ST_Y(start_position)) AS start_position,
                CONCAT (ST_X(end_position), ' ', ST_Y(end_position)) AS end_position,
                CONCAT (price, 'kr') AS price,
                speed
            FROM Trip;
        `);

        return rows;
    } catch (error) {
        console.error("Error att hämta Trip:", error);
        throw error;
    }
}

async function showTripsByBikeId(bike_id) {
    let sql = `SELECT 
                trip_id,
                bike_id,
                start_time,
                end_time,
                CONCAT (ST_X(start_position), ' ', ST_Y(start_position)) AS start_position,
                CONCAT (ST_X(end_position), ' ', ST_Y(end_position)) AS end_position,
                speed
                FROM Trip
                WHERE bike_id = ?`;

    let res = await pool.query(sql, [bike_id]);

    return res;
}

async function startTrip(bikeId) {
    try {
        const [result] = await pool.query('CALL StartTrip(?)', [bikeId]);
        return result;
    } catch (error) {
        console.error("Error starting trip:", error);
        throw error;
    }
}

async function endTrip(bikeId, longitude, latitude) {
    try {
        const sql = `CALL EndTrip(?, ST_PointFromText(?))`;
        const point = `POINT(${longitude} ${latitude})`;
        
        const [result] = await pool.query(sql, [bikeId, point]);
        return result;
    } catch (error) {
        console.error("Error att avsluta resan:", error);
        throw error;
    }
}

module.exports = {
    "showTrip": showTrip,
    "showBikes": showBikes,
    "showTripsByBikeId": showTripsByBikeId,
    "startTrip": startTrip,
    "endTrip": endTrip
};
