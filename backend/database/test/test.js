"use strict";

const mysql = require("promise-mysql");
const config = require("./vteam.json");
let db;

async function connect() {
    db = await mysql.createConnection(config);

    process.on("exit", () => {
        db.end();
    });
}

async function Bikes() {
    const sql = "SELECT * FROM Bike WHERE bike_id = 1";
    return await db.query(sql);
}

async function BikeMoving() {
    const sql = `CALL LogBikeMovement(1, POINT(16.1613, 55.5869))`;
    return await db.query(sql)
}


(async function main() {
    await connect();

    const bikess = await BikeMoving();
    const bikes = await Bikes();
    console.log(bikes)
})();