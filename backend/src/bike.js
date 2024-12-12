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

//för att testa utan docker
// const pool = mysql.createPool({
//     host: config.host,  // Från config-filen
//     user: config.user,  // Från config-filen
//     password: config.password,  // Från config-filen
//     database: config.database,  // Från config-filen
//     multipleStatements: config.multipleStatements, // Från config-filen
//     connectionLimit: config.connectionLimit, // Från config-filen
//     waitForConnections: true,
//     queueLimit: 0
// });

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

async function addBike(batteryLevel, longitude, latitude, isSimulated = 0) {
    try {
        const sql = `
            INSERT INTO Bike (battery_level, position, simulation)
            VALUES (?, ST_PointFromText(?), ?)
        `;
        const location = `POINT(${longitude} ${latitude})`;

        const [result] = await pool.query(sql, [batteryLevel, location, isSimulated]);
        return result.insertId;
    } catch (error) {
        console.error("Error att lägga till ny cykel:", error);
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

async function deleteTrips() {
    const [result] = await pool.query(`CALL RemoveTrips()`);

    if (result && result.affectedRows) {
        return { message: `Alla resor har raderats` };
    } else {
        return { message: "Inga resor är raderade" };
    }
}

async function addUser(username, email, balance) {
    try {
        const sql = `INSERT INTO User (Username, Balance, Email) VALUES (?, ?, ?)`;
        
        const [result] = await pool.query(sql, [username, balance, email]);
        return result;
    } catch (error) {
        console.error("Fel vid skapande av användare:", error);
        throw error;
    }
}

module.exports = {
    "showTrip": showTrip,
    "showBikes": showBikes,
    "showTripsByBikeId": showTripsByBikeId,
    "startTrip": startTrip,
    "endTrip": endTrip,
    "addBike": addBike,
    "deleteBike": deleteBike,
    "deleteBikes": deleteBikes,
    "deleteTrips": deleteTrips,
    "addUser": addUser
};
